# SMT-R1 — Authenticated update governance

**Status:** Archived local prototype and revision reviewed; cryptographic architecture research, not production security assurance.

## Purpose
Make a small, auditable state update verifiable against a previously trusted checkpoint using a Merkle-style authenticated witness. A verifier checks the changed cell and its proof without reconstructing the full state.

## What the archive actually supports
The SMT-R1 Court Revision v0.4 archive documents a frozen v0.2 executable pilot, local tests and fault-case checks, followed by a v0.4 reporting revision. This supports a bounded local demonstration of the stated verification logic, **not** an independently audited distributed protocol. The verifier still relies on a trusted earlier state commitment and ordinary cryptographic assumptions.

## Evidence limits
No independent security audit, production deployment, network adversary trial, signature or rollback protocol, concurrent-writer handling, or long-term integrity guarantee has been demonstrated. This does not invent a new hash primitive and does not experimentally validate claims about time or physics.

## Next check
Reproduce the fixture independently, publish a finite threat model and negative cases, then test signed checkpoints, replay/rollback protection, conflicting writers and compromised witnesses before any security claim.

**Source basis:** Archived `SMT-R1-Court-Revision-v0.4.md` in Mr. Peloquin's collection; this is a public digest, not the complete archive. Credits beyond the collaborating Court remain provisional.
