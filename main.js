/* ============================================================
   Solid Share — solidshare.app
   Scroll reveals and the header state. No dependencies.
   ============================================================ */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var supported = "IntersectionObserver" in window;

  /* ---- 1. Header turns solid once the page scrolls ---- */

  var header = document.getElementById("site-header");
  var sentinel = document.getElementById("top-sentinel");

  if (header && sentinel && supported) {
    new IntersectionObserver(
      function (entries) {
        header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
      },
      { rootMargin: "0px" }
    ).observe(sentinel);
  }

  /* ---- 2. Reveal each element the first time it enters the viewport ---- */

  var items = document.querySelectorAll(".reveal");

  if (reduced || !supported) {
    // Show everything at once and stop here.
    for (var i = 0; i < items.length; i++) {
      items[i].classList.add("is-visible");
    }
    return;
  }

  // Give siblings in the same container a staggered delay.
  var groups = new Map();

  items.forEach(function (el) {
    var parent = el.parentElement;
    var index = groups.get(parent) || 0;
    groups.set(parent, index + 1);
    if (index > 0) {
      el.style.setProperty("--d", Math.min(index, 5) * 90 + "ms");
    }
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
})();
