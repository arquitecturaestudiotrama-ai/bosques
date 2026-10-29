const PLANS = ["Planta baja", "Planta alta"];

(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Parallax leve ---- */
  const pars = [...document.querySelectorAll(".drift")];
  if (!reduce && pars.length) {
    let ticking = false;
    const run = () => {
      ticking = false;
      const vh = innerHeight;
      for (const p of pars) {
        const r = p.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) continue;
        const k = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        p.style.transform = "translate3d(0," + (k * 26).toFixed(2) + "px,0)";
      }
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    addEventListener("resize", run);
    run();
  }

  /* ---- Aparición al hacer scroll ---- */
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.remove("hide"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    document.querySelectorAll(".rv").forEach(el => {
      if (el.getBoundingClientRect().top > innerHeight * 0.95) { el.classList.add("hide"); io.observe(el); }
    });
  }

  /* ---- Índice fijo ---- */
  const toc = document.querySelector(".toc");
  const links = [...toc.querySelectorAll("a")];
  const secs = links.map(a => document.querySelector(a.getAttribute("href")));
  const hero = document.querySelector(".hero");
  const onScroll = () => {
    toc.classList.toggle("on", hero.getBoundingClientRect().bottom < 0);
    let cur = -1;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.35) cur = i; });
    links.forEach((a, i) => a.classList.toggle("cur", i === cur));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Propuestas: pestañas ---- */
  const tabs = [...document.querySelectorAll('.opt-tabs [role="tab"]')];
  const cards = [...document.querySelectorAll(".opt-card")];
  function selectOpt(k, focusTab) {
    tabs.forEach(t => {
      const on = t.dataset.opt === k;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (on && focusTab) t.focus();
    });
    document.querySelectorAll(".opt-panel").forEach(p => { p.hidden = p.id !== "p-" + k; });
    cards.forEach(c => c.classList.toggle("sel", c.dataset.opt === k));
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectOpt(t.dataset.opt));
    t.addEventListener("keydown", e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      selectOpt(n.dataset.opt, true);
    });
  });
  cards.forEach(c => c.addEventListener("click", () => {
    selectOpt(c.dataset.opt);
    document.getElementById("opt-detail").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }));
  selectOpt("arena");

  /* ---- Visor de plantas ---- */
  const lb = document.getElementById("lb"), view = document.getElementById("lb-view"),
        lImg = document.getElementById("lb-img"), lT = document.getElementById("lb-t"),
        hint = document.getElementById("lb-hint");
  const planImgs = [...document.querySelectorAll(".plan img")];
  const touch = matchMedia("(hover: none)").matches;
  const HINT_IN = touch ? "Tocá para acercar" : "Clic para acercar", HINT_OUT = touch ? "Deslizá para recorrer · tocá para alejar" : "Arrastrá para recorrer · clic para alejar";
  let cur = 0, last = null;
  function setZoom(on, cx, cy) {
    if (!on) { view.classList.remove("z"); hint.textContent = HINT_IN; view.scrollTo(0, 0); return; }
    const before = lImg.getBoundingClientRect();
    const fx = before.width ? (cx - before.left) / before.width : .5, fy = before.height ? (cy - before.top) / before.height : .5;
    view.style.setProperty("--zw", (innerWidth < 700 ? 420 : 150) + "%");
    view.classList.add("z"); hint.textContent = HINT_OUT;
    requestAnimationFrame(() => {
      view.scrollLeft = lImg.offsetWidth * fx - view.clientWidth / 2;
      view.scrollTop = lImg.offsetHeight * fy - view.clientHeight / 2;
    });
  }
  function openPlan(i) {
    cur = (i + PLANS.length) % PLANS.length;
    lImg.src = planImgs[cur].src; lImg.alt = planImgs[cur].alt; lT.textContent = PLANS[cur];
    setZoom(false);
    lb.classList.add("on"); lb.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    document.getElementById("lb-close").focus();
  }
  function closePlan() {
    lb.classList.remove("on"); lb.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    if (last) last.focus();
  }
  document.querySelectorAll("[data-plan]").forEach(b => b.addEventListener("click", () => { last = b; openPlan(+b.dataset.plan); }));
  document.getElementById("lb-close").addEventListener("click", closePlan);
  document.getElementById("lb-prev").addEventListener("click", () => openPlan(cur - 1));
  document.getElementById("lb-next").addEventListener("click", () => openPlan(cur + 1));
  addEventListener("keydown", e => {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") closePlan();
    if (e.key === "ArrowRight") openPlan(cur + 1);
    if (e.key === "ArrowLeft") openPlan(cur - 1);
  });
  let drag = null, moved = false;
  view.addEventListener("pointerdown", e => {
    moved = false;
    if (e.pointerType !== "mouse" || !view.classList.contains("z")) return;
    drag = { x: e.clientX, y: e.clientY, l: view.scrollLeft, t: view.scrollTop };
    view.classList.add("drag");
  });
  addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
    view.scrollLeft = drag.l - dx; view.scrollTop = drag.t - dy;
  });
  addEventListener("pointerup", () => { drag = null; view.classList.remove("drag"); });
  view.addEventListener("click", e => {
    if (moved) { moved = false; return; }
    view.classList.contains("z") ? setZoom(false) : setZoom(true, e.clientX, e.clientY);
  });
})();
