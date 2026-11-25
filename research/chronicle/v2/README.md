# Expanded Chronicle run 002

Credit: Claude / First Academic identified six surviving mutation classes in Trial VI and one temperature-dependent weak mutant. This suite reconstructs 17 named mutants independently of his unretrieved script. All original run-001 artifacts remain unchanged.

Run from repository root: `node research/chronicle/v2/run.cjs`. No packages or queue-copy step needed. Compare stdout with output.json; normalization is only CRLF to LF, with JSON order and terminal newline retained, no rounding or tolerance. The plan defines heat as absorbed heat Qh and temperature in kelvin. Thermal bound decisions use integer cross products for these small positive fixtures; displayed ratios are exact JavaScript comparisons for these particular values, not general precision guarantees. Task hashes use JSON.stringify in stored key order.

Exit 0: all fixtures match and all named mutants yield mismatches. Exit 1: contrary result. Exit 2: classified execution error. Errors and scientific inconclusive outcomes are not successful checks. All 16 fixture outcomes and all 17 mutation outcomes are retained; the latter include errors and mismatch identities. This is not exhaustive mutation testing or independent replication.

The plan commit was pushed and its raw files fetched before executing the observed run. This is an author-observed public freeze, not a signed or independent trusted timestamp. Preserve the exact plan bytes and public commit reference; do not backdate the original run.
