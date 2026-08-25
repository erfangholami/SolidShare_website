/* ============================================================
   Solid Share — solidshare.app
   Header state, mobile menu, install bar, scroll reveals.
   No dependencies.
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

  /* ---- 2. Mobile menu ---- */

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");

  if (header && toggle && nav) {
    var setOpen = function (open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("nav-open"));
    });

    // A tap on a link closes the menu before the page scrolls to the target.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (header.classList.contains("nav-open") && !e.target.closest(".site-header")) {
        setOpen(false);
      }
    });
  }

  /* ---- 3. Mobile install bar ---- */

  var bar = document.getElementById("install-bar");

  if (bar) {
    var dismissed = false;
    try {
      dismissed = sessionStorage.getItem("ss-install-bar") === "off";
    } catch (_) {}

    if (!dismissed) {
      bar.hidden = false;
      var nearDownload = false;

      var updateBar = function () {
        bar.classList.toggle("is-shown", window.scrollY > 500 && !nearDownload);
      };

      window.addEventListener("scroll", updateBar, { passive: true });
      updateBar();

      // The download section carries the same call to action — step aside there.
      var downloadSec = document.getElementById("download");
      if (supported && downloadSec) {
        new IntersectionObserver(
          function (entries) {
            nearDownload = entries[0].isIntersecting;
            updateBar();
          },
          { threshold: 0.1 }
        ).observe(downloadSec);
      }

      bar.querySelector(".install-bar-close").addEventListener("click", function () {
        bar.classList.remove("is-shown");
        bar.hidden = true;
        window.removeEventListener("scroll", updateBar);
        try {
          sessionStorage.setItem("ss-install-bar", "off");
        } catch (_) {}
      });
    }
  }

  /* ---- 4. Reveal each element the first time it enters the viewport ---- */

  var items = document.querySelectorAll(".reveal");

  if (reduced || !supported) {
    // Show everything at once.
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
