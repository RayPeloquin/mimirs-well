"""Two-stage calibration of uniform wave speed and cavity position.

This is an intentionally limited *effective-speed* estimate from direct
arrivals near the sensor line, not a recovered 2D elastic-velocity model.
"""

from dataclasses import dataclass, replace
import numpy as np
from scipy.signal import fftconvolve

from pilot import Grid, Reconstruction, _simulate, migrate_cavity, ricker


@dataclass(frozen=True)
class SpeedEstimate:
    velocity_m_s: float
    intercept_s: float
    residual_rms_s: float
    pairs_used: int


@dataclass(frozen=True)
class CalibratedImage:
    speed: SpeedEstimate
    imaging: Reconstruction
    residual: np.ndarray


def estimate_speed(traces, dt, sources, receivers, frequency, min_offset=0.5,
                   max_offset=2.5):
    """Match-filter direct arrivals and regress arrival time against offset.

    The intercept absorbs unknown source pulse delay. We deliberately use
    short offsets: long offsets in this small model suffer appreciable sponge
    and finite-difference amplitude/phase biases. The pulse template must be
    known, which is an idealization for real field acquisition. The result
    describes the shallow sensor-line region, not deep geology, and retains
    finite-difference velocity bias.
    """
    offsets = []
    arrivals = []
    lag = np.arange(-110, 111) * dt
    template = ricker(lag, center=0.0, frequency=frequency)
    for sidx, sx in enumerate(sources):
        for ridx, rx in enumerate(receivers):
            distance = float(abs(sx - rx))
            if not min_offset <= distance <= max_offset:
                continue
            start = max(0, round((0.0030 + distance / 3400.0) / dt))
            stop = min(traces.shape[-1], round((0.0041 + distance / 1900.0) / dt))
            if stop <= start:
                continue
            # The pulse shape is known in this controlled experiment, allowing
            # a matched filter to reject broadband measurement noise.
            correlation = fftconvolve(traces[sidx, ridx], template[::-1], mode="same")
            peak = start + int(np.argmax(np.abs(correlation[start:stop])))
            offsets.append(distance)
            arrivals.append(peak * dt)
    offsets = np.asarray(offsets)
    arrivals = np.asarray(arrivals)
    if len(offsets) < 8 or np.ptp(offsets) < 1.0:
        raise ValueError("Insufficient direct-arrival aperture for speed calibration")
    slope, intercept = np.polyfit(offsets, arrivals, 1)
    if slope <= 0:
        raise ValueError("Nonphysical calibrated wave speed")
    rms = np.sqrt(np.mean((arrivals - intercept - slope * offsets)**2))
    return SpeedEstimate(float(1.0 / slope), float(intercept), float(rms), len(offsets))


def calibrate_and_localize(observed, grid: Grid, sources, receivers, sensor_depth,
                           frequency, scan_x, scan_z):
    speed = estimate_speed(observed, grid.dt, sources, receivers, frequency)
    model_grid = replace(grid, c=speed.velocity_m_s)
    background = np.stack([
        _simulate(model_grid, sx, receivers, sensor_depth, None, frequency)
        for sx in sources
    ])
    residual = observed - background
    imaging = migrate_cavity(residual, model_grid, sources, receivers,
                             sensor_depth, frequency, scan_x, scan_z)
    return CalibratedImage(speed, imaging, residual)
