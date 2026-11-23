/* Publication-control designations: NOT access controls.
 * This metadata labels PUBLIC summaries and guides human source review.
 * Restricted originals must stay outside this PUBLIC Git repository. */
(function (root) {
  "use strict";
  const controls = Object.freeze({
    version: "2026-11-23",
    policy: "publication-safety.html",
    holdLabel: "Technical-source release hold",
    watchLabel: "Publication review watch",
    /* Every added equation source needs publication/safety review; this is
     * a second list in addition to equation-cores.js, not a security boundary. */
    equationEligible: Object.freeze([
      "skeptic-1",
      "echo-rx",
      "ghostglass",
      "temporal-acoustics"
    ]),
    holds: Object.freeze({
      "mimir-hippo-extreme-energy-systems": "Original technical source requires a separate safety/publication review before any public release.",
      "hippo-dragon": "Archive title only. Keep original detailed energy-system source nonpublic pending review.",
      "hippo-thunderlung": "Archive title only. Keep original technical source nonpublic pending review.",
      "hippo-vortex-lmb": "Archive title only. Keep original technical source nonpublic pending review.",
      "hippo-mag-01-magnetic-compensation-experiment": "Public concept and software-evidence summary allowed; no apparatus parameters or control implementation.",
      "hippo-thruster-array": "Public architectural summary allowed; no propulsion construction, power-routing, or operational-control specifications."
    }),
    watches: Object.freeze({
      "hippo-bus-scheduled-hybrid-power-distribution": "General energy-management overview allowed; separately review any detailed power-switching or high-energy implementation.",
      "sound-bus": "Shipboard utility/sensing interface overview allowed; separately review operational or tactical technical details.",
      "quantum-shepherd": "Facility-management concept allowed; review any unpublished infrastructure or control specifications before release."
    })
  });
  if (typeof module !== "undefined" && module.exports) module.exports = controls;
  if (root) root.WellPublicationControls = controls;
})(typeof window === "undefined" ? globalThis : window);
