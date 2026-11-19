# Adaptive Qubit Allocator — governed scheduling

**Status:** v1.0 archived control-layer concept; no benchmarked scheduler or demonstrated quantum advantage. Public summary prepared 19 November 2026.

## Purpose

Explore a classical allocation layer that assigns better-characterized physical qubits to higher-priority upcoming jobs using reported calibration data. This is scheduling, not a way to create, teleport or improve qubits.

## Proposed boundary

- Use relevant calibration information, such as relaxation/dephasing measures, gate error and readout quality, when selecting an eligible qubit set for a pending circuit.
- Consider reserving a capped high-quality pool, but measure idle capacity and starvation of ordinary jobs.
- Make allocations before execution or between jobs/shots where supported. No mid-shot transfer of quantum state or modification of the underlying computation is claimed.
- An explicit governance gate evaluates an allocation proposal against the job's permission, available resources and competing workload. Implementation details depend on the chosen hardware/backend.

## Evidence and limits

The archived state block defines a useful classical control concept, but supplies no measured device data, source code, benchmark, successful allocation experiment or improvement in fidelity. Calibration can be stale or inaccurate; reservation can waste capacity or delay other tasks. A policy that rearranges workloads does not improve the physics of individual qubits.

## Next check

Choose a simulator or public calibration snapshot, define an unambiguous scheduling objective and compare a fixed policy, a calibration-aware policy and priority reservation under identical jobs. Report performance, fairness, refusal conditions, calibration age and overhead.

**Source basis:** Archived *Adaptive cubit allocator.txt* (“Ribbon Scheduler”), v1.0 state block. Title spelling is normalized here; lineage with Quantum Ribbon Worm remains a separate review question.

**Attribution:** Mr. Peloquin's research archive; authorship and individual implementation contributions are not established by the saved state block.
