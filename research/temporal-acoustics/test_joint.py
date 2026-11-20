"""Contracts for velocity calibration and cavity localization without ground truth."""

import unittest
from dataclasses import replace
import numpy as np

from pilot import Grid, generate_shots
from joint import estimate_speed, calibrate_and_localize


class JointCalibrationTests(unittest.TestCase):
    def test_direct_arrivals_calibrate_uniform_rock_without_cavity_coordinates(self):
        grid = Grid(151, 111, 0.1, 2400.0, 2e-5, 750)
        sources = np.array([2.0, 4.5, 7.0, 9.5, 12.0])
        receivers = np.linspace(1.8, 13.2, 13)
        _, observed = generate_shots(grid, sources, receivers, 1.8,
                                     cavity_center=(8.6, 6.5), cavity_radius=1.0,
                                     frequency=900.0)
        speed = estimate_speed(observed, grid.dt, sources, receivers,
            frequency=900.0, min_offset=0.5, max_offset=2.5)
        self.assertGreater(speed.pairs_used, 10)
        self.assertLess(abs(speed.velocity_m_s - 2400.0), 150.0)

    def test_calibration_recovers_cavity_with_wrong_initial_speed(self):
        grid = Grid(151, 111, 0.1, 2400.0, 2e-5, 750)
        sources = np.array([2.0, 4.5, 7.0, 9.5, 12.0])
        receivers = np.linspace(1.8, 13.2, 13)
        _, observed = generate_shots(grid, sources, receivers, 1.8,
                                     cavity_center=(8.6, 6.5), cavity_radius=1.0,
                                     frequency=900.0)
        result = calibrate_and_localize(
            observed, replace(grid, c=2550.0), sources, receivers, sensor_depth=1.8,
            frequency=900.0, scan_x=np.arange(3.0, 13.1, 0.25),
            scan_z=np.arange(3.0, 9.1, 0.25),
        )
        self.assertLess(abs(result.speed.velocity_m_s - 2400), 150)
        self.assertLess(np.linalg.norm(np.array(result.imaging.position) - [8.6, 6.5]), 1.75)
        self.assertIsNone(result.imaging.detected)  # Not statistically calibrated.

    def test_correlated_arrival_picking_handles_noisy_varied_rock(self):
        grid = Grid(151, 111, 0.1, 2400.0, 2e-5, 750)
        sources = np.array([2.0, 4.5, 7.0, 9.5, 12.0])
        receivers = np.linspace(1.8, 13.2, 13)
        x = np.arange(grid.nx)[None, :] * grid.dx
        z = np.arange(grid.nz)[:, None] * grid.dx
        rock = grid.c * (1 + 0.08 * (z / (grid.nz * grid.dx) - 0.5)
                         + 0.06 * np.exp(-((x - 5)**2 + (z - 5)**2) / 4))
        uniform_empty, uniform_void = generate_shots(
            grid, sources, receivers, 1.8, (8.6, 6.5), 1.0, 900.0
        )
        _, varied = generate_shots(
            grid, sources, receivers, 1.8, (8.6, 6.5), 1.0, 900.0,
            velocity_field=rock
        )
        noise_sigma = 0.20 * np.max(np.abs(uniform_void - uniform_empty))
        observed = varied + np.random.default_rng(118).normal(0, noise_sigma, varied.shape)
        speed = estimate_speed(observed, grid.dt, sources, receivers, 900.0)
        self.assertLess(abs(speed.velocity_m_s - 2400), 150)


if __name__ == '__main__':
    unittest.main()
