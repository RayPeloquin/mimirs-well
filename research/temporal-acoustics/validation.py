"""Held-out validation statistics for synthetic wave-imaging experiments."""

import numpy as np


def auc_pairwise(positive_scores, negative_scores):
    """Nonparametric AUC: P(positive > negative) + 0.5 P(tie)."""
    positive = np.asarray(positive_scores, dtype=float)
    negative = np.asarray(negative_scores, dtype=float)
    if not (positive.size and negative.size and
            np.all(np.isfinite(positive)) and np.all(np.isfinite(negative))):
        raise ValueError("AUC requires finite positive and negative scores")
    comparisons = positive[:, None] - negative[None, :]
    return float((np.sum(comparisons > 0) + 0.5 * np.sum(comparisons == 0)) / comparisons.size)


def leave_one_world_out(positive_scores, negative_scores, world_ids, training_quantile=0.95):
    """Train a null-score threshold on other rock worlds, then test held-out.

    Each paired positive/negative example shares a world identifier. Repeated
    noise acquisitions of a world are held out together to prevent leakage.
    """
    positive = np.asarray(positive_scores, dtype=float)
    negative = np.asarray(negative_scores, dtype=float)
    worlds = np.asarray(world_ids)
    if (positive.ndim != 1 or negative.shape != positive.shape or
            worlds.shape != positive.shape or not positive.size or
            not (np.all(np.isfinite(positive)) and np.all(np.isfinite(negative)))):
        raise ValueError("Expected equally sized, finite paired examples")
    groups = np.unique(worlds)
    if groups.size < 2 or not 0 < training_quantile <= 1:
        raise ValueError("Need two rock worlds and a quantile in (0, 1]")
    true_positives = false_positives = positives = negatives = 0
    thresholds = {}
    for world in groups:
        held_out = worlds == world
        threshold = float(np.quantile(negative[~held_out], training_quantile))
        thresholds[str(world)] = threshold
        true_positives += int(np.sum(positive[held_out] > threshold))
        false_positives += int(np.sum(negative[held_out] > threshold))
        positives += int(np.sum(held_out))
        negatives += int(np.sum(held_out))
    return {
        "true_positive_rate": true_positives / positives,
        "false_positive_rate": false_positives / negatives,
        "true_positives": true_positives,
        "false_positives": false_positives,
        "positive_cases": positives,
        "negative_cases": negatives,
        "held_out_worlds": int(groups.size),
        "thresholds": thresholds,
    }


def interior_peak(image, depths, min_depth=4.5):
    """Image strength deeper than a predeclared shallow-boundary exclusion."""
    image = np.asarray(image, dtype=float)
    depths = np.asarray(depths, dtype=float)
    if image.ndim != 2 or image.shape[0] != len(depths) or not np.any(depths >= min_depth):
        raise ValueError("Image must have at least one sampled interior row")
    return float(np.max(np.abs(image[depths >= min_depth])))
