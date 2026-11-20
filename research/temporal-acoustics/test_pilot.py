"""Behavior checks for the synthetic, present-day cavity localization pilot."""

import numpy as np
import unittest

from pilot import Grid, generate_shots, migrate_cavity, ricker


class PilotTests(unittest.TestCase):
    def test_ricker_is_centered_and_zero_mean(self):
        dt = 2.0e-5
        t = np.arange(1000) * dt
        pulse = ricker(t, center=0.004, frequency=900.0)
        self.assertLess(abs(t[np.argmax(pulse)] - 0.004), dt)
        self.assertLess(abs(np.sum(pulse)), 0.01 * np.sum(np.abs(pulse)))


    def test_cavity_changes_wavefield_and_inversion_does_not_receive_truth(self):
        grid = Grid(nx=151, nz=111, dx=0.1, c=2500.0, dt=2.0e-5, steps=750)
        sources = np.array([2.0, 4.5, 7.0, 9.5, 12.0])
        receivers = np.linspace(1.8, 13.2, 13)
        empty, cavity = generate_shots(
            grid, sources, receivers, sensor_depth=1.8,
            cavity_center=(8.6, 6.5), cavity_radius=1.0,
            frequency=900.0,
        )
        residual = cavity - empty
        self.assertGreater(np.max(np.abs(residual)), 0.001 * np.max(np.abs(empty)))
        self.assertEqual(empty.shape, (len(sources), len(receivers), grid.steps))

        # The inverse algorithm receives only waveforms and geometry of sensors.
        result = migrate_cavity(
            residual, grid, sources, receivers, sensor_depth=1.8,
            frequency=900.0, scan_x=np.arange(3.0, 13.1, 0.25),
            scan_z=np.arange(3.0, 9.1, 0.25),
        )
        self.assertLess(np.linalg.norm(np.array(result.position) - [8.6, 6.5]), 1.75)
        # A map peak by itself must never become an uncalibrated detection claim.
        self.assertIsNone(result.detected)


    def test_zero_residual_produces_no_detection(self):
        grid = Grid(nx=101, nz=81, dx=0.1, c=2500.0, dt=2.0e-5, steps=400)
        result = migrate_cavity(
            np.zeros((2, 3, grid.steps)), grid, np.array([2.0, 7.0]),
            np.array([2.0, 4.5, 7.0]), sensor_depth=1.8,
            frequency=900.0, scan_x=np.arange(2.0, 7.1, 0.5),
            scan_z=np.arange(3.0, 6.1, 0.5),
        )
        self.assertEqual(result.strength, 0)
        self.assertFalse(result.detected)

    def test_layered_rock_changes_waveforms_even_without_a_cavity(self):
        grid = Grid(nx=101, nz=81, dx=0.1, c=2500.0, dt=2.0e-5, steps=400)
        sources = np.array([2.0])
        receivers = np.array([3.0, 5.0])
        homogeneous, _ = generate_shots(
            grid, sources, receivers, 1.8, (5.0, 5.0), 0.0, 900.0
        )
        z = np.arange(grid.nz)[:, None] * grid.dx
        speed = np.broadcast_to(grid.c * (1.0 + 0.08 * (z / 8.0 - 0.5)),
                                (grid.nz, grid.nx)).copy()
        layered, _ = generate_shots(
            grid, sources, receivers, 1.8, (5.0, 5.0), 0.0, 900.0,
            velocity_field=speed,
        )
        self.assertGreater(np.max(np.abs(layered - homogeneous)),
                           0.01 * np.max(np.abs(homogeneous)))


if __name__ == "__main__":
    unittest.main()
