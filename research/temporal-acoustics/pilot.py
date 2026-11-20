"""First synthetic cavity-imaging experiment (scalar-wave approximation)."""

from dataclasses import dataclass
import numpy as np
from scipy.signal import fftconvolve


@dataclass(frozen=True)
class Grid:
    nx: int
    nz: int
    dx: float
    c: float
    dt: float
    steps: int


@dataclass(frozen=True)
class Reconstruction:
    position: tuple[float, float]
    strength: float
    detected: bool | None  # None means no calibrated significance threshold.
    image: np.ndarray
    x: np.ndarray
    z: np.ndarray


def ricker(t, center, frequency):
    tau = np.pi * frequency * (np.asarray(t) - center)
    return (1.0 - 2.0 * tau**2) * np.exp(-tau**2)


def _simulate(grid, source_x, receivers, sensor_depth, obstacle, frequency, velocity_field=None):
    """2D scalar wave with a pressure-release circle and sponge boundaries.

    The scalar field is an acoustic-like P-wave surrogate for solid-borne
    elastic waves, not a full coupled elastic/fluid simulation.
    """
    if grid.c * grid.dt / grid.dx >= 1.0 / np.sqrt(2):
        raise ValueError("Unstable 2D wave-equation time step")

    zix, xix = np.indices((grid.nz, grid.nx))
    distance_to_edge = np.minimum.reduce(
        [xix, grid.nx - 1 - xix, zix, grid.nz - 1 - zix]
    )
    sponge_width = 13
    sponge = np.exp(-0.065 * np.clip(1.0 - distance_to_edge / sponge_width, 0, 1)**2).astype(np.float32)

    prev = np.zeros((grid.nz, grid.nx), dtype=np.float32)
    now = prev.copy()
    nxt = prev.copy()
    out = np.zeros((len(receivers), grid.steps), dtype=np.float32)
    sx = round(source_x / grid.dx)
    sz = round(sensor_depth / grid.dx)
    rx = np.rint(np.asarray(receivers) / grid.dx).astype(int)
    rz = sz
    if obstacle is not None:
        (cx, cz), radius = obstacle
        solid_void = ((xix * grid.dx - cx)**2 + (zix * grid.dx - cz)**2) <= radius**2
    else:
        solid_void = None

    times = np.arange(grid.steps) * grid.dt
    source = ricker(times, center=0.0035, frequency=frequency).astype(np.float32)
    speed = grid.c if velocity_field is None else np.asarray(velocity_field)
    if np.any(np.asarray(speed) * grid.dt / grid.dx >= 1.0 / np.sqrt(2)):
        raise ValueError("Velocity field violates the stability bound")
    coefficient = np.asarray((speed * grid.dt / grid.dx)**2, dtype=np.float32)
    coefficient_interior = coefficient if coefficient.ndim == 0 else coefficient[1:-1, 1:-1]

    for step in range(grid.steps):
        nxt[:] = 2 * now - prev
        nxt[1:-1, 1:-1] += coefficient_interior * (
            now[2:, 1:-1] + now[:-2, 1:-1]
            + now[1:-1, 2:] + now[1:-1, :-2]
            - 4 * now[1:-1, 1:-1]
        )
        nxt[sz, sx] += source[step]
        if solid_void is not None:
            nxt[solid_void] = 0
        nxt *= sponge
        out[:, step] = nxt[rz, rx]
        prev, now, nxt = now, nxt, prev
    return out


def generate_shots(grid, sources, receivers, sensor_depth, cavity_center, cavity_radius, frequency,
                   velocity_field=None):
    empty = np.stack([
        _simulate(grid, sx, receivers, sensor_depth, None, frequency, velocity_field)
        for sx in sources
    ])
    cavity = np.stack([
        _simulate(grid, sx, receivers, sensor_depth,
                  (cavity_center, cavity_radius), frequency, velocity_field)
        for sx in sources
    ])
    return empty, cavity


def migrate_cavity(residual, grid, sources, receivers, sensor_depth, frequency, scan_x, scan_z):
    """Kirchhoff-style diffraction stack: no cavity coordinates are supplied."""
    x, z = np.meshgrid(scan_x, scan_z)
    image = np.zeros_like(x, dtype=float)
    if not np.any(residual):
        return Reconstruction((float(scan_x[0]), float(scan_z[0])), 0.0, False, image, scan_x, scan_z)

    # Correlating with a wavelet is only a migration approximation; the forward
    # traces come from independent numerical finite-difference propagation.
    offsets = np.arange(-110, 111) * grid.dt
    wavelet = ricker(offsets, center=0.0, frequency=frequency)
    tt = np.arange(grid.steps) * grid.dt
    for sidx, sx in enumerate(sources):
        ds = np.hypot(x - sx, z - sensor_depth)
        for ridx, rx in enumerate(receivers):
            dr = np.hypot(x - rx, z - sensor_depth)
            travel = (ds + dr) / grid.c + 0.0035
            correlation = fftconvolve(residual[sidx, ridx], wavelet[::-1], mode="same")
            image += np.interp(travel, tt, correlation, left=0.0, right=0.0)

    pick = np.unravel_index(np.argmax(np.abs(image)), image.shape)
    position = (float(x[pick]), float(z[pick]))
    strength = float(np.max(np.abs(image)))
    return Reconstruction(position, strength, None, image, scan_x, scan_z)
