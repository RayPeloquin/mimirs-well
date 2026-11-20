"""v0.2: compare fixed-speed and arrival-calibrated cavity images.

All cases are synthetic. The imager never receives the planted cavity position.
"""

from dataclasses import replace
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

from pilot import Grid, _simulate, generate_shots, migrate_cavity
from joint import calibrate_and_localize


def main() -> None:
    output = Path(__file__).parent / "output_v02"
    output.mkdir(exist_ok=True)
    grid = Grid(151, 111, 0.1, 2400.0, 2e-5, 750)
    assumed = replace(grid, c=2550.0)
    sources = np.array([2.0, 4.5, 7.0, 9.5, 12.0])
    receivers = np.linspace(1.8, 13.2, 13)
    sensor_depth, frequency = 1.8, 900.0
    center = np.array([8.6, 6.5])
    radius = 1.0
    xs = np.arange(3.0, 13.1, 0.25)
    zs = np.arange(3.0, 9.1, 0.25)

    x = np.arange(grid.nx)[None, :] * grid.dx
    z = np.arange(grid.nz)[:, None] * grid.dx
    rock = grid.c * (
        1 + 0.08 * (z / (grid.nz * grid.dx) - 0.5)
        + 0.06 * np.exp(-((x - 5.0)**2 + (z - 5.0)**2) / 4.0)
    )
    uniform_empty, uniform_void = generate_shots(
        grid, sources, receivers, sensor_depth, tuple(center), radius, frequency
    )
    varied_empty, varied_void = generate_shots(
        grid, sources, receivers, sensor_depth, tuple(center), radius, frequency,
        velocity_field=rock
    )
    fixed_background = np.stack([
        _simulate(assumed, sx, receivers, sensor_depth, None, frequency)
        for sx in sources
    ])

    rng = np.random.default_rng(118)
    sigma = 0.20 * float(np.max(np.abs(uniform_void - uniform_empty)))
    noise = rng.normal(0, sigma, size=uniform_void.shape)
    cases = [
        ("Uniform rock + cavity", uniform_void + noise, True),
        ("Varied rock + cavity", varied_void + noise, True),
        ("Uniform rock, no cavity", uniform_empty + noise, False),
        ("Varied rock, no cavity", varied_empty + noise, False),
    ]

    fig, axes = plt.subplots(len(cases), 2, figsize=(10, 15), sharex=True, sharey=True)
    metrics = {
        "experiment": "synthetic 2D scalar acoustic surrogate; two-stage speed calibration",
        "ground_truth_speed_m_s": grid.c,
        "fixed_initial_model_speed_m_s": assumed.c,
        "cavity_center_m": center.tolist(),
        "cavity_radius_m": radius,
        "noise_standard_deviation": sigma,
        "sensor_depth_m": sensor_depth,
        "sources": len(sources),
        "receivers": len(receivers),
        "scenarios": {},
    }
    images = []
    for name, observed, has_cavity in cases:
        fixed = migrate_cavity(
            observed - fixed_background, assumed, sources, receivers,
            sensor_depth, frequency, xs, zs
        )
        calibrated = calibrate_and_localize(
            observed, assumed, sources, receivers,
            sensor_depth, frequency, xs, zs
        )
        pair = (fixed, calibrated.imaging)
        images.append(pair)
        metrics["scenarios"][name] = {
            "cavity_present": has_cavity,
            "fixed_position_m": list(fixed.position),
            "fixed_peak": fixed.strength,
            "calibrated_speed_m_s": calibrated.speed.velocity_m_s,
            "direct_arrival_rms_s": calibrated.speed.residual_rms_s,
            "calibration_pairs": calibrated.speed.pairs_used,
            "calibrated_position_m": list(calibrated.imaging.position),
            "calibrated_peak": calibrated.imaging.strength,
            "fixed_error_m": float(np.linalg.norm(np.asarray(fixed.position) - center)) if has_cavity else None,
            "calibrated_error_m": float(np.linalg.norm(np.asarray(calibrated.imaging.position) - center)) if has_cavity else None,
        }

    global_peak = max(float(np.max(np.abs(image.image))) for pair in images for image in pair)
    for row, ((name, _, has_cavity), pair) in enumerate(zip(cases, images)):
        for col, image in enumerate(pair):
            ax = axes[row, col]
            ax.imshow(np.abs(image.image), origin="lower",
                      extent=(xs[0], xs[-1], zs[0], zs[-1]),
                      cmap="inferno", aspect="equal", interpolation="nearest",
                      vmin=0, vmax=global_peak)
            ax.plot(*image.position, marker="+", color="cyan", ms=13, mew=2)
            if has_cavity:
                ax.add_patch(plt.Circle(center, radius, fill=False, ec="lime", lw=1.7))
            ax.set_title(f"{name}\n{'Fixed 2550 m/s' if col == 0 else 'Calibrated speed'}", fontsize=10)
            ax.set_xlabel("Horizontal distance (m)")
            ax.set_ylabel("Depth (m)")
            ax.invert_yaxis()
            ax.grid(alpha=0.16)
    fig.suptitle("Temporal Acoustics v0.2 — calibrated vs fixed-speed imaging\n"
                 "Synthetic only · same 20% noise · shared color scale", fontsize=14)
    fig.tight_layout(rect=(0, 0, 1, 0.96))
    fig.savefig(output / "joint_comparison.png", dpi=170)
    plt.close(fig)

    (output / "metrics.json").write_text(json.dumps(metrics, indent=2) + "\n", encoding="utf8")
    lines = [
        "# Temporal Acoustics v0.2 — shallow speed calibration",
        "",
        "**Synthetic demonstration, 20 November 2026. No actual archaeological recordings.**",
        "",
        "## What changed",
        "",
        "The v0.1 inversion had to assume a rock wave speed. The v0.2 test fits",
        "a straight-line arrival-time-versus-offset regression on short-offset direct",
        "pulses (0.5–2.5 m), models the no-cavity wavefield at that fitted speed,",
        "and migrates the remaining reflections. The imager receives no cavity",
        "location or radius. This is **two-stage effective speed calibration**,",
        "not a spatially resolved elastic-material inversion or historical reconstruction.",
        "Direct-arrival times are picked by cross-correlating with a *known* 900 Hz",
        "Ricker source pulse. That is a favorable, simulated condition. Speed",
        "estimates can be biased by propagation numerics and site geometry.",
        "",
        "The forward model is a 2D scalar finite-difference surrogate for P-like waves.",
        "The true uniform speed is 2400 m/s; the comparison assumes 2550 m/s",
        "(6.25% high). Additional cases contain a smooth 8% depth gradient and a",
        "localized 6% speed lens, which the inversion does not know about.",
        "Gaussian noise SD is 20% of the baseline peak cavity scattering amplitude.",
        "The same seed/noise realization is reused across comparison cases.",
        "",
        "## Comparison",
        "",
        "| Case | Estimated speed (m/s) | Fixed location error (m) | Calibrated error (m) | Fixed peak | Calibrated peak |",
        "|---|---:|---:|---:|---:|---:|",
    ]
    for name, data in metrics["scenarios"].items():
        ferror = "n/a" if data["fixed_error_m"] is None else f'{data["fixed_error_m"]:.2f}'
        cerror = "n/a" if data["calibrated_error_m"] is None else f'{data["calibrated_error_m"]:.2f}'
        lines.append(f'| {name} | {data["calibrated_speed_m_s"]:.0f} | {ferror} | {cerror} | '
                     f'{data["fixed_peak"]:.3g} | {data["calibrated_peak"]:.3g} |')
    lines += [
        "",
        "## Interpretation and limitations",
        "",
        "The null cases have no cavity. Their image peaks demonstrate that a migration",
        "maximum alone does not identify a cavity. Direct-arrival calibration probes",
        "the shallow line between sensors, not deeper material where anomalies may hide.",
        "For this one random seed, both planted-cavity location errors improve by",
        "roughly a quarter-meter; however, the calibrated no-cavity varied-rock",
        "peak remains substantial relative to the cavity-present case.",
        "Do not interpret this single realization as a performance distribution.",
        "It is not a calibrated probability or a field-validated method. A negative",
        "control threshold and fuller elastic model are necessary before claims",
        "about real voids; inferring *past* chamber layouts requires still more evidence.",
        "",
        "## Repeat",
        "",
        "`python -m unittest discover -s . -p 'test_*.py'` then `python run_joint.py`.",
        "Needs NumPy, SciPy, and Matplotlib.",
    ]
    (output / "report.md").write_text("\n".join(lines) + "\n", encoding="utf8")
    for name, data in metrics["scenarios"].items():
        print(f'{name}: speed={data["calibrated_speed_m_s"]:.0f} m/s; '
              f'fixed error={data["fixed_error_m"]}; '
              f'calibrated error={data["calibrated_error_m"]}; '
              f'fixed peak={data["fixed_peak"]:.2f}; '
              f'calibrated peak={data["calibrated_peak"]:.2f}')


if __name__ == "__main__":
    main()
