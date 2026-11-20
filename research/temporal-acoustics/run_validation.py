"""v0.3: held-out synthetic rock worlds with paired cavity/no-cavity controls.

No cavity truth enters imaging. World labels are used only for post-hoc scoring.
"""

from dataclasses import replace
from functools import lru_cache
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

from pilot import Grid, _simulate, generate_shots, migrate_cavity
from joint import estimate_speed
from validation import auc_pairwise, interior_peak, leave_one_world_out


def random_rock_field(grid, rng):
    """A known-for-scoring 2D speed field invisible to reconstruction."""
    xx = np.arange(grid.nx)[None, :] * grid.dx
    zz = np.arange(grid.nz)[:, None] * grid.dx
    gradient = float(rng.uniform(-0.10, 0.10))
    lens = float(rng.uniform(-0.09, 0.09))
    lens_x = float(rng.uniform(3.0, 11.0))
    lens_z = float(rng.uniform(3.5, 8.0))
    ripples = float(rng.uniform(-0.025, 0.025))
    speed = grid.c * (
        1.0 + gradient * (zz / (grid.nz * grid.dx) - 0.5)
        + lens * np.exp(-((xx - lens_x)**2 + (zz - lens_z)**2) / 4.0)
        + ripples * np.sin(2 * np.pi * xx / 9.0) * np.sin(np.pi * zz / 10.0)
    )
    return speed, {
        "gradient_fraction": gradient, "lens_fraction": lens,
        "lens_center_m": [lens_x, lens_z], "ripple_fraction": ripples,
        "min_velocity_m_s": float(speed.min()),
        "max_velocity_m_s": float(speed.max()),
    }


def main():
    out = Path(__file__).parent / "output_v03"
    out.mkdir(exist_ok=True)
    grid = Grid(151, 111, 0.1, 2400.0, 2e-5, 750)
    assumed = replace(grid, c=2550.0)
    sources = np.array([2.0, 4.5, 7.0, 9.5, 12.0])
    receivers = np.linspace(1.8, 13.2, 13)
    sensor_depth, freq = 1.8, 900.0
    center = np.array([8.6, 6.5])
    scan_x = np.arange(3.0, 13.1, 0.25)
    scan_z = np.arange(3.0, 9.1, 0.25)
    worlds, draws = 8, 2
    noise_fraction = 0.20
    rock_rng = np.random.default_rng(20261120)
    noise_rng = np.random.default_rng(387)

    empty_reference, void_reference = generate_shots(
        grid, sources, receivers, sensor_depth, tuple(center), 1.0, freq
    )
    sigma = noise_fraction * float(np.max(np.abs(void_reference - empty_reference)))

    @lru_cache(maxsize=64)
    def background_for_speed(model_speed):
        model_grid = replace(grid, c=float(model_speed))
        return np.stack([
            _simulate(model_grid, sx, receivers, sensor_depth, None, freq)
            for sx in sources
        ])

    fixed_background = background_for_speed(assumed.c)
    rows = []
    rock_worlds = []
    saved_fields = []
    for world in range(worlds):
        field, params = random_rock_field(grid, rock_rng)
        rock_worlds.append(params)
        saved_fields.append(field)
        empty, cavity = generate_shots(
            grid, sources, receivers, sensor_depth, tuple(center), 1.0, freq,
            velocity_field=field
        )
        for draw in range(draws):
            for name, base in (("absent", empty), ("present", cavity)):
                # Independent measurement noise across present/absent cases.
                observed = base + noise_rng.normal(0, sigma, base.shape)
                fixed = migrate_cavity(
                    observed - fixed_background, assumed, sources, receivers,
                    sensor_depth, freq, scan_x, scan_z
                )
                calibrated = estimate_speed(observed, grid.dt, sources, receivers, freq)
                # 25 m/s grid quantization caches forward backgrounds; no
                # knowledge of the planted speed is used in selecting a bin.
                model_speed = float(25 * round(calibrated.velocity_m_s / 25))
                if not 1700 <= model_speed <= 3000:
                    raise ValueError(f"Out-of-range arrival estimate {model_speed} m/s")
                model_grid = replace(grid, c=model_speed)
                fitted = migrate_cavity(
                    observed - background_for_speed(model_speed), model_grid,
                    sources, receivers, sensor_depth, freq, scan_x, scan_z
                )
                rows.append({
                    "world": world,
                    "noise_draw": draw,
                    "cavity": name,
                    "estimated_speed_m_s": calibrated.velocity_m_s,
                    "forward_speed_bin_m_s": model_speed,
                    "fixed_global_peak": fixed.strength,
                    "calibrated_global_peak": fitted.strength,
                    "fixed_interior_peak": interior_peak(fixed.image, scan_z),
                    "calibrated_interior_peak": interior_peak(fitted.image, scan_z),
                    "fixed_position_m": list(fixed.position),
                    "calibrated_position_m": list(fitted.position),
                    "fixed_localization_error_m": float(np.linalg.norm(np.asarray(fixed.position) - center)) if name == "present" else None,
                    "calibrated_localization_error_m": float(np.linalg.norm(np.asarray(fitted.position) - center)) if name == "present" else None,
                })
        print(f"Simulated rock world {world + 1}/{worlds}", flush=True)

    methods = (
        "fixed_global_peak", "calibrated_global_peak",
        "fixed_interior_peak", "calibrated_interior_peak"
    )
    detection = {}
    for method in methods:
        positive = [r[method] for r in rows if r["cavity"] == "present"]
        negative = [r[method] for r in rows if r["cavity"] == "absent"]
        ids = [r["world"] for r in rows if r["cavity"] == "present"]
        detection[method] = {
            "auc": auc_pairwise(positive, negative),
            "leave_one_world_out_95pct": leave_one_world_out(
                positive, negative, ids, training_quantile=0.95
            ),
            "median_present": float(np.median(positive)),
            "median_absent": float(np.median(negative)),
        }

    # Deliberately harder *out-of-distribution* negative examples. Instead of
    # an air cavity, introduce a sharp circular 35%-slower *solid* inclusion.
    # The threshold is frozen using the smooth no-cavity examples above.
    impostor_rng = np.random.default_rng(912)
    xx = np.arange(grid.nx)[None, :] * grid.dx
    zz = np.arange(grid.nz)[:, None] * grid.dx
    inclusions = []
    for world, base_field in enumerate(saved_fields):
        cx = float(impostor_rng.uniform(5.5, 10.5))
        cz = float(impostor_rng.uniform(5.0, 8.0))
        radius = 1.0
        mask = ((xx - cx)**2 + (zz - cz)**2) <= radius**2
        impostor_field = base_field.copy()
        impostor_field[mask] *= 0.65
        observed = np.stack([
            _simulate(grid, sx, receivers, sensor_depth, None, freq, impostor_field)
            for sx in sources
        ])
        observed = observed + noise_rng.normal(0, sigma, observed.shape)
        fixed = migrate_cavity(observed - fixed_background, assumed, sources,
                               receivers, sensor_depth, freq, scan_x, scan_z)
        fitted_speed = estimate_speed(observed, grid.dt, sources, receivers, freq)
        model_speed = float(25 * round(fitted_speed.velocity_m_s / 25))
        model_grid = replace(grid, c=model_speed)
        calibrated_image = migrate_cavity(
            observed - background_for_speed(model_speed), model_grid,
            sources, receivers, sensor_depth, freq, scan_x, scan_z
        )
        inclusions.append({
            "world": world,
            "inclusion_center_m": [cx, cz],
            "inclusion_radius_m": radius,
            "inclusion_speed_multiplier": 0.65,
            "fixed_global_peak": fixed.strength,
            "calibrated_global_peak": calibrated_image.strength,
            "fixed_interior_peak": interior_peak(fixed.image, scan_z),
            "calibrated_interior_peak": interior_peak(calibrated_image.image, scan_z),
        })
    impostor_detection = {}
    for method in methods:
        train_null = [r[method] for r in rows if r["cavity"] == "absent"]
        threshold = float(np.quantile(train_null, 0.95))
        impostor_scores = [r[method] for r in inclusions]
        impostor_detection[method] = {
            "frozen_training_null_95pct_threshold": threshold,
            "solid_inclusion_false_alarms": sum(score > threshold for score in impostor_scores),
            "solid_inclusion_controls": len(impostor_scores),
            "solid_inclusion_false_alarm_rate": float(np.mean(np.asarray(impostor_scores) > threshold)),
            "median_solid_inclusion_score": float(np.median(impostor_scores)),
        }

    # Identifiability counterexample: the near-sensor velocity is identical,
    # but a deeper 11% lens changes the late field. Direct-arrival calibration
    # alone has no access to the deep lens profile.
    xx = np.arange(grid.nx)[None, :] * grid.dx
    zz = np.arange(grid.nz)[:, None] * grid.dx
    deep_lens_field = grid.c * (1 + 0.11 * np.exp(-((xx - 7.0)**2 + (zz - 7.0)**2) / 3.0))
    deep_lens_traces = np.stack([
        _simulate(grid, sx, receivers, sensor_depth, None, freq, deep_lens_field)
        for sx in sources
    ])
    reference_speed = estimate_speed(empty_reference, grid.dt, sources, receivers, freq)
    deep_speed = estimate_speed(deep_lens_traces, grid.dt, sources, receivers, freq)
    cut = int(round(0.0055 / grid.dt))
    early_rms = float(np.sqrt(np.mean((deep_lens_traces[..., :cut] - empty_reference[..., :cut])**2)))
    late_rms = float(np.sqrt(np.mean((deep_lens_traces[..., cut:] - empty_reference[..., cut:])**2)))
    counterexample = {
        "uniform_calibrated_speed_m_s": reference_speed.velocity_m_s,
        "deep_lens_calibrated_speed_m_s": deep_speed.velocity_m_s,
        "speed_difference_m_s": deep_speed.velocity_m_s - reference_speed.velocity_m_s,
        "early_difference_rms": early_rms,
        "late_difference_rms": late_rms,
        "early_late_split_s": cut * grid.dt,
        "deep_lens_amplitude_fraction": 0.11,
        "deep_lens_center_m": [7.0, 7.0],
    }

    fig_deep, ax_deep = plt.subplots(2, 2, figsize=(11, 7))
    extent = (0, grid.nx * grid.dx, grid.nz * grid.dx, 0)
    im0 = ax_deep[0, 0].imshow(np.full((grid.nz, grid.nx), grid.c),
                              extent=extent, cmap="viridis", vmin=grid.c, vmax=grid.c * 1.11)
    ax_deep[0, 0].set_title("World A · uniform rock")
    ax_deep[0, 1].imshow(deep_lens_field, extent=extent, cmap="viridis",
                         vmin=grid.c, vmax=grid.c * 1.11)
    ax_deep[0, 1].set_title("World B · deep 11% faster lens")
    for ax in ax_deep[0]:
        ax.axhline(sensor_depth, color="white", ls="--", alpha=0.8)
        ax.set_xlabel("Horizontal position (m)")
        ax.set_ylabel("Depth (m)")
    fig_deep.colorbar(im0, ax=ax_deep[0].tolist(), label="Wave speed (m/s)", fraction=0.035, pad=0.025)
    differences = np.sum((deep_lens_traces - empty_reference)**2, axis=2)
    si, ri = np.unravel_index(np.argmax(differences), differences.shape)
    time_ms = np.arange(grid.steps) * grid.dt * 1000
    ax_deep[1, 0].plot(time_ms, empty_reference[si, ri], label="Uniform", lw=1.4)
    ax_deep[1, 0].plot(time_ms, deep_lens_traces[si, ri], label="Deep lens", lw=1.1, alpha=0.85)
    ax_deep[1, 0].axvline(cut * grid.dt * 1000, ls="--", color="black", alpha=0.5)
    ax_deep[1, 0].set_title("Illustrative trace (largest late difference)")
    ax_deep[1, 0].set_xlabel("Time (ms)")
    ax_deep[1, 0].set_ylabel("Wave amplitude")
    ax_deep[1, 0].legend(fontsize=8)
    aggregate_difference = np.sqrt(np.mean((deep_lens_traces - empty_reference)**2, axis=(0, 1)))
    ax_deep[1, 1].plot(time_ms, aggregate_difference, color="#a3496b", lw=1.6)
    ax_deep[1, 1].axvline(cut * grid.dt * 1000, ls="--", color="black", alpha=0.5)
    ax_deep[1, 1].set_title("RMS difference across all 65 recordings")
    ax_deep[1, 1].set_xlabel("Time (ms)")
    ax_deep[1, 1].set_ylabel("RMS difference")
    fig_deep.suptitle("Two different underground worlds, same shallow direct-arrival calibration\n"
                      f'Both estimated speeds = {reference_speed.velocity_m_s:.0f} m/s', fontsize=13)
    fig_deep.subplots_adjust(top=0.87, bottom=0.08, hspace=0.36, wspace=0.20)
    fig_deep.savefig(out / "deep_lens_ambiguity.png", dpi=175)
    plt.close(fig_deep)

    fig, axes = plt.subplots(2, 2, figsize=(12, 8), sharex=True)
    method_labels = (
        ("fixed_global_peak", "Fixed speed · full scan"),
        ("calibrated_global_peak", "Calibrated speed · full scan"),
        ("fixed_interior_peak", "Fixed speed · interior only"),
        ("calibrated_interior_peak", "Calibrated speed · interior only"),
    )
    for ax, (method, title) in zip(axes.ravel(), method_labels):
        for state, color, marker, offset, label in (
            ("absent", "#c05061", "x", -0.10, "No cavity"),
            ("present", "#278c77", "o", 0.10, "Cavity"),
        ):
            relevant = [r for r in rows if r["cavity"] == state]
            x = [r["world"] + 1 + offset + (r["noise_draw"] - 0.5) * 0.065 for r in relevant]
            ax.scatter(x, [r[method] for r in relevant], c=color,
                       marker=marker, s=48, alpha=0.90, label=label)
        stat = detection[method]
        cv = stat["leave_one_world_out_95pct"]
        ax.set_title(f'{title}\nAUC={stat["auc"]:.2f}; held-out sensitivity={cv["true_positive_rate"]:.0%}, '
                     f'false positive={cv["false_positive_rate"]:.0%}', fontsize=10)
        ax.set_ylabel("Image peak (arbitrary units)")
        ax.set_xlabel("Held-out synthetic geology world")
        ax.set_xticks(range(1, worlds + 1))
        ax.grid(alpha=0.22)
    axes[0, 0].legend(loc="upper left", fontsize=9)
    fig.suptitle("Temporal Acoustics v0.3 · 8 independently varied rock worlds × 2 noise draws\n"
                 "All worlds include matched cavity-present and cavity-free controls", fontsize=13)
    fig.tight_layout(rect=(0, 0, 1, 0.93))
    fig.savefig(out / "holdout_detection.png", dpi=175)
    plt.close(fig)

    fig_imp, ax_imp = plt.subplots(2, 2, figsize=(12, 8), sharex=True)
    for ax, (method, title) in zip(ax_imp.ravel(), method_labels):
        null = [r[method] for r in rows if r["cavity"] == "absent"]
        positive = [r[method] for r in rows if r["cavity"] == "present"]
        imp = [r[method] for r in inclusions]
        ax.scatter(np.full(len(null), 0) + np.linspace(-.12, .12, len(null)),
                   null, color="#c05061", marker="x", label="Smooth rock, no void")
        ax.scatter(np.full(len(positive), 1) + np.linspace(-.12, .12, len(positive)),
                   positive, color="#278c77", marker="o", label="Air void")
        ax.scatter(np.full(len(imp), 2) + np.linspace(-.11, .11, len(imp)),
                   imp, color="#cf8a26", marker="^", s=55, label="Solid inclusion")
        threshold = impostor_detection[method]["frozen_training_null_95pct_threshold"]
        ax.axhline(threshold, color="black", ls="--", alpha=0.55,
                   label="95th percentile smooth-null cutoff")
        false_alarms = impostor_detection[method]["solid_inclusion_false_alarms"]
        ax.set_title(f"{title}\nSolid impostor alarms: {false_alarms}/8")
        ax.set_xticks([0, 1, 2], ["No cavity", "Cavity", "Solid inclusion"])
        ax.set_ylabel("Image score (arbitrary units)")
        ax.grid(alpha=0.2)
    ax_imp[0, 0].legend(fontsize=8, loc="upper left")
    fig_imp.suptitle("Temporal Acoustics v0.3 · sharp, slow solid inclusions impersonate cavities?\n"
                     "Dashed cutoff trained only on the smooth-rock negative controls", fontsize=13)
    fig_imp.tight_layout(rect=(0, 0, 1, 0.93))
    fig_imp.savefig(out / "solid_inclusion_challenge.png", dpi=175)
    plt.close(fig_imp)

    payload = {
        "version": "0.3",
        "model": "2D scalar-wave propagation, matched-filter speed calibration, diffraction migration",
        "geology_worlds": worlds, "independent_noise_draws_per_state": draws,
        "positive_examples": worlds * draws, "negative_examples": worlds * draws,
        "noise_fraction_of_reference_scattered_peak": noise_fraction,
        "inversion_assumed_speed_m_s": assumed.c,
        "true_reference_speed_m_s": grid.c,
        "predeclared_interior_cutoff_m": 4.5,
        "calibrated_background_speed_quantization_m_s": 25,
        "cavity_truth_for_scoring_only": {"center_m": center.tolist(), "radius_m": 1.0},
        "rock_models": rock_worlds, "results": rows, "detection": detection,
        "deep_lens_counterexample": counterexample,
        "solid_inclusion_controls": inclusions,
        "solid_inclusion_challenge": impostor_detection,
    }
    (out / "metrics.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf8")
    error = {
        name: float(np.median([r[name] for r in rows if r["cavity"] == "present"]))
        for name in ("fixed_localization_error_m", "calibrated_localization_error_m")
    }
    lines = [
        "# Temporal Acoustics v0.3 — geology-impostor challenge",
        "",
        "**All data synthetic; no real chamber or archaeological measurement.**",
        "",
        "## Method and predeclared rules",
        "",
        f"- {worlds} independent simulated rock velocity fields: random depth gradient, local",
        "  speed lens, and small lateral ripples; one cavity-present and one cavity-absent",
        f"  simulation each; {draws} independent noise draws per state (20% of baseline",
        "  peak cavity scattering). Total 16 present, 16 absent observations.",
        "- Five sources and 13 receivers all at depth 1.8 m. Initial inverse",
        "  speed 2550 m/s, synthetic reference 2400 m/s. The inverse does not receive",
        "  the cavity truth, true rock field, or world label.",
        "- Two classifiers from each imaging method: global strongest peak and",
        "  interior strongest peak below a **predeclared** depth of 4.5 m",
        "  (excluding likely source/near-surface mismatch artifacts).",
        "- The diagnostic score threshold is the 95th percentile of negative",
        "  scores in **all other rock worlds**. All noise draws from the test world",
        "  are excluded together. This simulates geology-shift validation.",
        "- Matched-filter velocity estimate is quantized to 25 m/s before",
        "  forward background modeling, allowing caching; score is not a probability.",
        "",
        "## Held-out results",
        "",
        "| Score | Pairwise AUC | Held-out sensitivity | Held-out false positive |",
        "|---|---:|---:|---:|",
    ]
    for method, _ in method_labels:
        d = detection[method]
        cv = d["leave_one_world_out_95pct"]
        lines.append(f'| {method} | {d["auc"]:.2f} | {cv["true_positive_rate"]:.1%} '
                     f'| {cv["false_positive_rate"]:.1%} |')
    lines += [
        "",
        "## Strong solid-inclusion impostors",
        "",
        "Eight additional *no-cavity* controls contain a 1 m-radius solid",
        "inclusion at a random interior position with a sharp 35% slower wave",
        "speed. This is an intentionally challenging synthetic contrast, not",
        "a claim about common archaeological geology. Thresholds are frozen at",
        "the pooled 95th percentile of the smoother null worlds before testing",
        "these inclusions. No inclusion recordings train the threshold.",
        "",
        "| Score | Solid-inclusion false alarms / 8 |",
        "|---|---:|",
    ]
    for method, _ in method_labels:
        d = impostor_detection[method]
        lines.append(f'| {method} | {d["solid_inclusion_false_alarms"]}/8 |')
    lines += [
        "",
        "**Crucial limitation:** AUC near 1.0 on these smooth synthetic worlds",
        "does not establish real-world cavity identification. The solid-inclusion",
        "controls, which were absent from the threshold-training set, produce",
        "false alarms. With eight inclusion worlds and 16 samples per class in",
        "the smooth challenge, all rates are highly uncertain and could shift",
        "under different rock families, frequencies, source geometry, or noise.",
    ]
    lines += [
        "",
        f'Positive-case median localization error: fixed {error["fixed_localization_error_m"]:.2f} m; '
        f'calibrated {error["calibrated_localization_error_m"]:.2f} m.',
        "",
        "## Identifiability warning",
        "",
        "The current 5×13 single-depth layout cannot independently constrain a",
        "full 2D deep-rock velocity map from **direct arrival times**. Short-offset",
        "rays primarily sample shallow material. Deep speed lenses can therefore",
        "leave arrival calibration largely unchanged yet create misleading later",
        "reflections. In the targeted counterexample, the estimated direct-arrival",
        f'speeds differ by {counterexample["speed_difference_m_s"]:.3f} m/s, yet late waveform'
        f' RMS difference is {late_rms / (early_rms + 1e-15):.0f}× the early difference.',
        "These experiments quantify that ambiguity; they do **not**",
        "constitute recovered spatial velocity tomography.",
        "",
        "For real 2D tomography, sensor/source geometry must supply intersecting",
        "depth-spanning paths (e.g. accessible boreholes or surrounding faces),",
        "subject to conservation and non-invasive archaeological constraints.",
        "Real rock adds elasticity, P/S conversion, anisotropy, attenuation,",
        "source coupling and instrument errors absent from this toy model.",
        "",
        "## Reproduction",
        "",
        "`python -m unittest discover -s . -p 'test_*.py' -v`",
        "then `python run_validation.py`. Requires NumPy, SciPy, Matplotlib.",
    ]
    (out / "report.md").write_text("\n".join(lines) + "\n", encoding="utf8")
    print("\nHOLD-OUT RESULTS", flush=True)
    for method, _ in method_labels:
        d = detection[method]
        cv = d["leave_one_world_out_95pct"]
        print(f'{method}: AUC={d["auc"]:.3f}; held-out sensitivity='
              f'{cv["true_positive_rate"]:.1%}; false positive={cv["false_positive_rate"]:.1%}', flush=True)
    print("HARD SOLID-INCLUSION CONTROLS", flush=True)
    for method in methods:
        d = impostor_detection[method]
        print(f'{method}: {d["solid_inclusion_false_alarms"]}/8 false alarms', flush=True)
    print(f'Median location error: fixed={error["fixed_localization_error_m"]:.2f}m, '
          f'calibrated={error["calibrated_localization_error_m"]:.2f}m', flush=True)


if __name__ == "__main__":
    main()
