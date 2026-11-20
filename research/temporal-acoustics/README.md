# Temporal Acoustics — synthetic wave-imaging pilot

This experimental code explores whether wave data can localize a **present-day
void** while imperfectly estimating the propagation speed of surrounding rock.
It does **not** reconstruct an actual archaeological site, identify a hidden
chamber in Malta, or verify any historical account.

## Reproduce

Requires Python 3.10+, NumPy, SciPy and Matplotlib.

```bash
python -m unittest discover -s . -p 'test_*.py' -v
python run_pilot.py
python run_joint.py
python run_validation.py
```

- `pilot.py`, `run_pilot.py`, `test_pilot.py`, `output/`: preserved v0.1 experiment.
- `joint.py`, `run_joint.py`, `test_joint.py`, `output_v02/`: v0.2 short-offset
  matched-filter calibration, forward background subtraction, and migration.
- `output_v02/report.md`: methods, measurements, and limitations.
- `output_v02/joint_comparison.png`: same-color-scale comparisons of four
  scenarios, including two with no cavity.
- `validation.py`, `run_validation.py`, `test_validation.py`, `output_v03/`:
  v0.3 blind held-out geology scores, a direct-arrival depth-ambiguity test,
  and strong solid-inclusion controls that may mimic cavities.
- `assets/acoustic_survey_concept.png`: artistic cutaway of a non-invasive
  surface survey, with idealized wavefronts around an underground cavity.
- `assets/cavity_vs_solid_concept.png`: paired *conceptual* illustration of
  an empty cavity versus a contrasting solid inclusion. The generated imagery
  is **not** a measured image or a mathematically exact propagation diagram.

The calibration is **two-stage**, not a simultaneous 2D elastic velocity and
shape inversion. Its source pulse is exactly known, a favorable synthetic
assumption. Migration score is uncalibrated and can be high even without a
cavity; imaging peaks are not probabilities or confirmed archaeological finds.
The v0.3 detection threshold learned on smooth geology does **not** reliably
exclude sharply contrasting solid inclusions. Multiple measurement directions,
elastic wave modes, and field ground truth would be needed before attempting
site-specific claims or reconstructing a former layout.
