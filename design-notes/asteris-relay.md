# Asteris Relay — device connection and handoff

**Status:** Architecture and Court-reviewed prototype proposal; not yet deployed or benchmarked. Public summary prepared 19 November 2026.

## Purpose

Explore a consent-controlled handoff between a Windows desktop, an Android phone and a Quest 3S spatial client. Each enrolled device would contribute observations it can actually access, while a desktop coordinator would maintain the canonical task and event history. The person operating the devices retains authority over commands and access.

## Proposed boundary

- The first demonstration uses one coordinator, versioned events and a durable event record. Device-side observations retain their sources and timestamps.
- Late or conflicting observations may be retained, but stale data must not become a fresh action. Human acknowledgments and action completion are separately recorded.
- On a link outage, clients show the age of cached context; they cannot silently claim successful handoff. Voice ownership changes require an explicit release or bounded takeover procedure.
- A ChatGPT account, the current conversation, local AI software and device control are different systems. None is assumed to share memories, permissions or model access automatically.

## Evidence and limits

The 10 November Court review corrected overclaims about distributed learning, automatic failover, exactly-once actions, headset eye tracking and memory synchronization. It describes an architecture, not an implemented relay. No measured latency, network reliability, identity assurance, uninterrupted voice handoff or full reasoning parity is established. Public notes intentionally omit private addresses, device identifiers, credentials and deployment configuration.

## Next check

With the actual devices, record one low-risk desktop-to-phone handoff and one phone-to-headset handoff; deliberately interrupt each link and verify stale-context notices, operator control and recoverability. Capture observed failures as well as successes before expanding the topology.

**Source basis:** Archived *Asteris-Relay-Court-Review-01.md*, 10 November 2026; original review remains private.

**Attribution.** Mr. Peloquin set the originating aim and made the project decisions. Asteris Solenne / ChatGPT coordinated the reviews, checked sources, and wrote the synthesis.

**AI-assisted critical review.** Grok proposed sparse events, device specialization, and a central baseline. Meta AI proposed explicit ownership, observation provenance, and voice handoff. Claude proposed an append-only record, one authority, task states, and failure tests. Gemini proposed local event histories and challenged broker dependence.
