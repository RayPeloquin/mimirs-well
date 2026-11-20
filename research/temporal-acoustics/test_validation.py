"""Contracts for held-out worlds and predeclared interior imaging scores."""

import unittest
import numpy as np

from validation import auc_pairwise, leave_one_world_out, interior_peak


class ValidationTests(unittest.TestCase):
    def test_auc_counts_pairwise_orderings_including_ties(self):
        # Positive/negative comparisons: 3 wins, 1 tie -> (3+0.5)/4.
        self.assertAlmostEqual(auc_pairwise([4.0, 2.0], [2.0, 1.0]), 0.875)

    def test_leave_one_world_out_trains_threshold_on_other_worlds_only(self):
        report = leave_one_world_out(
            positive_scores=[9.0, 8.0], negative_scores=[1.0, 2.0],
            world_ids=["a", "b"], training_quantile=0.95,
        )
        self.assertAlmostEqual(report["true_positive_rate"], 1.0)
        self.assertAlmostEqual(report["false_positive_rate"], 0.5)
        self.assertEqual(report["held_out_worlds"], 2)

    def test_interior_score_rejects_shallow_bright_edge_without_truth_position(self):
        image = np.array([[100.0, 4.0], [5.0, -12.0], [1.0, 8.0]])
        depths = np.array([3.0, 5.0, 7.0])
        self.assertEqual(interior_peak(image, depths, min_depth=4.5), 12.0)


if __name__ == "__main__":
    unittest.main()
