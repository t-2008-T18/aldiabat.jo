/* ============================================================
   AlDiabat.jo — Shared site behavior
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Dark / Light Theme ---------- */
  var LIGHT_VARS = {
    "--black": "#eae6dd",
    "--dark": "#f6f4ef",
    "--gold": "#a9761f",
    "--gold-lt": "#8f6116",
    "--steel": "#5a6b7e",
    "--offwhite": "#171a1e",
    "--white": "#0c0f12",
    "--nav-bg": "rgba(255,255,255,.85)",
    "--footer-bg": "#f0ede5"
  };
  var DARK_VARS = {
    "--black": "#080b0f", "--dark": "#0f1419", "--gold": "#c9952a",
    "--gold-lt": "#e0b44a", "--steel": "#8a9bb0", "--offwhite": "#f0ede8", "--white": "#ffffff",
    "--nav-bg": "rgba(8,11,15,.92)", "--footer-bg": "#050709"
  };

  function applyTheme(mode) {
    var root = document.documentElement.style;
    var vars = mode === "light" ? LIGHT_VARS : DARK_VARS;
    Object.keys(vars).forEach(function (k) { root.setProperty(k, vars[k]); });
    document.documentElement.setAttribute("data-theme", mode);
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.textContent = mode === "light" ? "🌙" : "☀️";
      btn.setAttribute("aria-label", mode === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري");
    });
  }

  var savedTheme = localStorage.getItem("aldiabat-theme") || "dark";
  applyTheme(savedTheme);

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".theme-toggle");
    if (!btn) return;
    var current = document.documentElement.getAttribute("data-theme") || "dark";
    var next = current === "dark" ? "light" : "dark";
    localStorage.setItem("aldiabat-theme", next);
    applyTheme(next);
  });

  /* ---------- Mobile Menu ---------- */
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".menu-toggle");
    var menu = document.querySelector(".nav-menu");
    if (toggle && menu) {
      menu.classList.toggle("open");
      toggle.textContent = menu.classList.contains("open") ? "✕" : "☰";
      return;
    }
    if (menu && menu.classList.contains("open") && !e.target.closest(".nav-menu") && !e.target.closest(".menu-toggle")) {
      menu.classList.remove("open");
      var mt = document.querySelector(".menu-toggle");
      if (mt) mt.textContent = "☰";
    }
  });
  document.querySelectorAll(".nav-menu a").forEach(function (a) {
    a.addEventListener("click", function () {
      var menu = document.querySelector(".nav-menu");
      var mt = document.querySelector(".menu-toggle");
      if (menu) menu.classList.remove("open");
      if (mt) mt.textContent = "☰";
    });
  });

  /* ---------- Back to Top ---------- */
  var topBtn = document.getElementById("back-to-top");
  if (topBtn) {
    window.addEventListener("scroll", function () {
      topBtn.classList.toggle("show", window.scrollY > 420);
    });
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Toast Notifications ---------- */
  window.showToast = function (message, type) {
    var stack = document.getElementById("toast-stack");
    if (!stack) return;
    var t = document.createElement("div");
    t.className = "toast" + (type === "error" ? " error" : "");
    t.innerHTML = '<span class="toast-icon">' + (type === "error" ? "⚠️" : "✅") + '</span><span>' + message + '</span>';
    stack.appendChild(t);
    setTimeout(function () {
      t.classList.add("hide");
      setTimeout(function () { t.remove(); }, 350);
    }, 3800);
  };

  /* ---------- Scroll Reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-scale");
  if (revealEls.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("active"); });
  }

  /* ---------- Animated Counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        var el = entry.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var prefix = el.getAttribute("data-prefix") || "";
        var duration = 1400;
        var start = performance.now();
        function step(now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.round(target * eased);
          el.textContent = prefix + val + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Mark active nav link by current page ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
  });
})();
