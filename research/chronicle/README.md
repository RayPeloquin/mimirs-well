# Reproduce the observed Chronicle run

The first three checks in the Crucible queue are synthetic accounting fixtures, not demonstrations of any physical design. Inputs and expected values were frozen in a local Git commit before the observed run. This is not a trusted timestamp, external preregistration or independent replication.

## Reproduce

Use Node.js (observed version v24.22.2) from the repository root. No npm packages are needed.

```sh
node research/chronicle/replay.cjs
```

Compare stdout to observed-output.json, including contrary cases and null values. The runner checks the frozen queue and its own source hash before evaluating cases. The run receipt preserves its observed environment, exit code, stderr and artifact hashes (UTF-8, LF). Use the checkout that includes this run, or use the archived queue-snapshot.json as test-queue.json in a separate isolated copy of the repository if the current queue changes. Do not replace a working research archive. A squash merge may not retain the local intermediate plan commit on main; the actual frozen plan bytes remain in the archive.

The original three tasks have 11 fixture cases in total. These are small deterministic controls, not statistical samples or independent scientific evidence. The original queue remains a plan registry, not a live execution status system; the Chronicle records results separately.

Temporal Acoustics v0.3 is a separate historical report. Exact original package versions are not established. Its source artifacts are indexed with hashes, but the study was not rerun as part of this release. Retain the solid-inclusion counterexample alongside positive results.

A future independent researcher should identify their source revision and environment, preserve output bytes, report disagreements, and avoid treating a self-authored replay as independent replication.
