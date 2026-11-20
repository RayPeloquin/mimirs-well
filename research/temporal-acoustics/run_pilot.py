"""Reproduce a synthetic blind-location experiment and mismatched-geology controls.

The inversion never receives cavity coordinates.  Coordinates are revealed
only after image generation for error reporting and chart annotation.
"""

import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

from pilot import Grid, generate_shots, migrate_cavity


def main() -> None:
    outdir = Path(__file__).parent / "output"
    outdir.mkdir(exist_ok=True)
    grid = Grid(nx=151, nz=111, dx=0.1, c=2500.0, dt=2e-5, steps=750)
    sources = np.array([2.0, 4.5, 7.0, 9.5, 12.0])
    receivers = np.linspace(1.8, 13.2, 13)
    true_center = np.array([8.6, 6.5])
    radius = 1.0
    xs = np.arange(3.0, 13.1, 0.25)
    zs = np.arange(3.0, 9.1, 0.25)

    # Smooth bedding gradient and off-axis high-speed lens, invisible to the
    # inverse's constant-speed model.  A synthetic rock model, not a measured
    # property of any archaeological site.
    x = np.arange(grid.nx)[None, :] * grid.dx
    z = np.arange(grid.nz)[:, None] * grid.dx
    velocity_field = grid.c * (
        1 + 0.08 * (z / (grid.nz * grid.dx) - 0.5)
        + 0.06 * np.exp(-((x - 5.0)**2 + (z - 5.0)**2) / 4.0)
    )

    empty_uniform, void_uniform = generate_shots(
        grid, sources, receivers, 1.8, tuple(true_center), radius, 900.0
    )
    empty_hetero, void_hetero = generate_shots(
        grid, sources, receivers, 1.8, tuple(true_center), radius, 900.0,
        velocity_field=velocity_field,
    )
    rng = np.random.default_rng(118)
    noise_sigma = 0.20 * float(np.max(np.abs(void_uniform - empty_uniform)))
    noise = rng.normal(0, noise_sigma, size=void_uniform.shape)

    # Positive, null, and material-model-error controls.
    scenarios = {
        "A: known uniform stone": void_uniform - empty_uniform + noise,
        "B: known varied stone": void_hetero - empty_hetero + noise,
        "C: wrong stone model": void_hetero - empty_uniform + noise,
        "D: no cavity, wrong model": empty_hetero - empty_uniform + noise,
        "E: noise only": noise,
    }
    results = {}
    for name, residual in scenarios.items():
        # To model a further calibration error, inversion assumes 2% too-fast
        # material. All candidates see the same erroneous velocity.
        assumed_grid = Grid(grid.nx, grid.nz, grid.dx, 2550.0, grid.dt, grid.steps)
        fit = migrate_cavity(residual, assumed_grid, sources, receivers, 1.8, 900.0, xs, zs)
        error = float(np.linalg.norm(np.array(fit.position) - true_center)) if name[0] in "ABC" else None
        results[name] = {"position_m": list(fit.position), "peak_score": fit.strength,
                         "localization_error_m": error, "fit": fit}

    fig, axes = plt.subplots(2, 3, figsize=(13.5, 7), sharex=True, sharey=True)
    axes = axes.ravel()
    common_max = max(float(np.max(np.abs(data["fit"].image))) for data in results.values())
    for ax, (name, data) in zip(axes, results.items()):
        im = data["fit"].image
        ax.imshow(np.abs(im), origin="lower", extent=[xs[0], xs[-1], zs[0], zs[-1]],
                  aspect="equal", cmap="inferno", interpolation="nearest", vmin=0, vmax=common_max)
        ax.plot(data["position_m"][0], data["position_m"][1], "+", color="cyan",
                markersize=14, markeredgewidth=2, label="Inversion peak")
        if name[0] in "ABC":
            circle = plt.Circle(true_center, radius, fill=False, lw=1.8,
                                edgecolor="lime", label="True cavity")
            ax.add_patch(circle)
        ax.set_title(name, fontsize=10)
        ax.set_xlabel("Horizontal distance (m)")
        ax.invert_yaxis()
        ax.grid(alpha=0.2)
    axes[0].set_ylabel("Depth (m)")
    axes[3].set_ylabel("Depth (m)")
    axes[0].legend(loc="lower left", fontsize=7)
    axes[5].axis("off")
    fig.suptitle("Temporal Acoustics pilot: wave-imaging map (synthetic, 20% noise)")
    fig.subplots_adjust(top=0.90, bottom=0.10, left=0.07, right=0.98,
                        hspace=0.22, wspace=0.14)
    fig.savefig(outdir / "synthetic_imaging_comparison.png", dpi=170)
    plt.close(fig)

    control_score = results["D: no cavity, wrong model"]["peak_score"]
    distilled = {
        name: {k: v for k, v in result.items() if k != "fit"}
        for name, result in results.items()
    }
    metrics = {
        "experiment": "2D scalar wave equation with pressure-release circular scatterer",
        "grid_m": [grid.nx * grid.dx, grid.nz * grid.dx],
        "truth_center_m": list(map(float, true_center)),
        "truth_radius_m": radius,
        "sources": len(sources), "receivers": len(receivers),
        "true_reference_speed_m_s": grid.c,
        "assumed_inverse_speed_m_s": 2550.0,
        "noise_sigma_as_fraction_of_baseline_peak_scatter": 0.2,
        "scenarios": distilled,
        "false_positive_reference_score": control_score,
    }
    (outdir / "metrics.json").write_text(json.dumps(metrics, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Temporal Acoustics — synthetic localization pilot",
        "",
        "First experiment, 20 November 2026. **Computer simulation only.**",
        "",
        "## Design",
        "",
        "2D constant-density scalar-wave finite differences; circular pressure-release scatterer ",
        "used as a surrogate for an air cavity in stone.  Five source locations, 13 receivers,",
        "151×111 cells at 0.1 m spacing, and 900 Hz Ricker pulses.  The inverse uses",
        "a separate straight-ray diffraction stack; it receives neither true cavity coordinates",
        "nor radius.  A genuine elastic model would include P/S conversions, rock anisotropy,",
        "finite source coupling and site-specific attenuation, which this does not.",
        "",
        "## Measurements and limits",
        "",
        "All runs use pseudo-random Gaussian noise with standard deviation 20% of the",
        "peak scattered signal in the baseline case.  The inverse velocity is 2550 m/s",
        "(2% above the baseline 2500 m/s).  For the harder cases, the true speed",
        "varies with depth and has a 6% localized speed anomaly.  In the hardest",
        "case, the model used to subtract expected background propagation ignores",
        "that heterogeneity, contaminating the residual with geological modeling error.",
        "",
        "| Case | Estimated center (m) | Error (m) | Migration peak |",
        "|---|---|---:|---:|",
    ]
    for name, result in distilled.items():
        position = result["position_m"]
        err = "n/a" if result["localization_error_m"] is None else f'{result["localization_error_m"]:.2f}'
        lines.append(f'| {name} | ({position[0]:.2f}, {position[1]:.2f}) | {err} | {result["peak_score"]:.3g} |')
    lines += [
        "",
        "**Interpretation:** Peak amplitude alone is *not* a calibrated detection",
        "probability. The no-void cases are controls for spurious peaks. Without",
        "verified material properties, false positives can be caused by geological",
        "mis-modeling. This experiment does not reconstruct past layouts.",
        "",
        "## Reproduction",
        "",
        "From this folder: `python -m unittest discover -s . -p 'test_*.py'`,",
        "then `python run_pilot.py`. Requires NumPy, SciPy, Matplotlib.",
        "",
        "## Prior work and what is reused conceptually",
        "",
        "- Conventional 2D finite-difference acoustic propagation and Kirchhoff migration.",
        "- Published inverse-wave, GPR/seismic, and archaeoacoustic methods.",
        "- Not based on proprietary patent implementation, data, or site measurements.",
    ]
    (outdir / "pilot_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    for name, result in distilled.items():
        print(f'{name}: position={result["position_m"]}, '
              f'error={result["localization_error_m"]}, score={result["peak_score"]:.3g}')
    print(f'Comparison to no-void wrong-model peak: {results["C: wrong stone model"]["peak_score"]/control_score:.2f}x')


if __name__ == "__main__":
    main()
