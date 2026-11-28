"use strict";

(() => {
  const controls = document.getElementById("timing-controls");
  const start = document.getElementById("pulse-start");
  const ticks = [...controls.querySelectorAll(".timing-tick")];
  const sampleTimes = [0, 10, 20];

  function update() {
    const onset = start.valueAsNumber;
    const end = onset + 1;
    const hit = sampleTimes.find(time => onset <= time && time < end);
    controls.style.setProperty("--pulse-left", (onset / 20 * 100) + "%");
    ticks.forEach((tick, index) => tick.classList.toggle("sample-hit", sampleTimes[index] === hit));
    document.getElementById("pulse-time").value = onset.toFixed(1);
    start.setAttribute("aria-valuetext", onset.toFixed(1) + " seconds");
    const result = hit === undefined
      ? "Missed. All three readings show normal even though the fault occurred."
      : "Detected at " + hit + " seconds. The other two readings show normal.";
    document.getElementById("timing-result").textContent =
      "Fault from " + onset.toFixed(1) + " to " + end.toFixed(1) + " seconds. " + result;
  }

  start.addEventListener("input", update);
  update();
  controls.hidden = false;
})();
