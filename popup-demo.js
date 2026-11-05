/* popup-demo.js — self-contained in-popup demonstration of BlindPass.
 *
 * Loads BEFORE popup.js. It is intentionally independent of chrome.* and the
 * service worker so a reviewer (or any user) sees the core blur / reveal
 * function the instant the popup opens, WITHOUT needing a gated recruiter
 * site (LinkedIn Recruiter, Lever, Indeed) that the content script targets.
 *
 * It also mirrors the master switch onto the demo list, so clicking the
 * primary control produces an obvious, immediate visual change in the popup.
 */
(() => {
  "use strict";

  function syncBlind(list, master) {
    if (!list) return;
    const on = !master || master.getAttribute("aria-checked") !== "false";
    list.classList.toggle("is-blind", on);
  }

  function onRevealClick(ev) {
    const target = ev.target;
    const btn = target && target.closest ? target.closest("[data-demo-reveal]") : null;
    if (!btn) return;
    ev.preventDefault();
    const cand = btn.closest(".bp-demo__cand");
    if (!cand) return;
    const revealed = cand.classList.toggle("is-revealed");
    btn.setAttribute("aria-pressed", revealed ? "true" : "false");
    btn.setAttribute("aria-label", revealed ? "Blur this candidate" : "Reveal this candidate");
  }

  function init() {
    const list = document.getElementById("bp-demo-list");
    if (!list) return;
    const master = document.getElementById("bp-master");

    syncBlind(list, master);

    if (master && typeof MutationObserver === "function") {
      const observer = new MutationObserver(() => syncBlind(list, master));
      observer.observe(master, { attributes: true, attributeFilter: ["aria-checked"] });
    }

    list.addEventListener("click", onRevealClick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
