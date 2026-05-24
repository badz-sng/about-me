document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  // SKILLS DATA — edit this array to add/remove/reorder skills
  // ============================================================
  const skills = [
    { label: "PHP", color: "#7c6bff" },
    { label: "Laravel", color: "#ff4e50" },
    { label: "Vue.js", color: "#42b883" },
    { label: "React.js", color: "#61dafb" },
    { label: "JavaScript", color: "#f7df1e" },
    { label: "Tailwind CSS", color: "#38bdf8" },
    { label: "MySQL", color: "#4479a1" },
    { label: "Docker", color: "#2496ed" },
    { label: "Git", color: "#f05032" },
    { label: "Ubuntu Server", color: "#e95420" },
    { label: "RESTful APIs", color: "#7c6bff" },
    { label: "Bootstrap", color: "#7952b3" },
    { label: "HTML & CSS", color: "#e34f26" },
    { label: "SQL", color: "#4479a1" },
    { label: "MVC Architecture", color: "#42b883" },
    { label: "Agile / Scrum", color: "#00b4d8" },
    { label: "VSCode", color: "#007acc" },
    { label: "ClickUp / Jira", color: "#7c6bff" },
  ];

  function buildRow(container, items) {
    const doubled = [...items, ...items]; // duplicate for seamless loop
    doubled.forEach((s) => {
      const chip = document.createElement("div");
      chip.className = "skill-chip";
      chip.innerHTML = `<span class="skill-dot" style="background:${s.color}"></span>${s.label}`;
      container.appendChild(chip);
    });
  }

  buildRow(document.getElementById("row1"), skills.slice(0, 7));
  buildRow(document.getElementById("row2"), skills.slice(5, 14));
  buildRow(document.getElementById("row3"), skills.slice(10));

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  const body = document.body;
  const themeBtn = document.getElementById("theme-toggle");
  let isDark = true;

  themeBtn.addEventListener("click", () => {
    isDark = !isDark;
    body.setAttribute("data-theme", isDark ? "dark" : "light");
    themeBtn.innerHTML = isDark ? "<i class=\"ti ti-sun-high\"></i>" : "<i class=\"ti ti-moon\"></i>";
  });

  // ============================================================
  // ANIMATED BACKGROUND — canvas particles + soft orbs
  // ============================================================
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const PARTICLE_COUNT = 60;
  const particles = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      r: rand(1, 2.5),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.15, 0.15),
      alpha: rand(0.1, 0.4),
    });
  }

  // Soft background orbs — tweak x/y (0–1 relative), r (radius), color (RGB)
  const orbs = [
    { x: 0.15, y: 0.2, r: 280, color: [124, 107, 255] },
    { x: 0.85, y: 0.7, r: 220, color: [79, 195, 247] },
    { x: 0.5, y: 0.55, r: 180, color: [167, 139, 250] },
  ];

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dark = body.getAttribute("data-theme") !== "light";
    const particleColor = dark ? "200,200,255" : "80,80,180";

    // Draw orbs
    orbs.forEach((o) => {
      const gx = o.x * canvas.width;
      const gy = o.y * canvas.height;
      const alpha = dark ? 0.08 : 0.06;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, o.r);
      g.addColorStop(0, `rgba(${o.color.join(",")},${alpha})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(gx, gy, o.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw + move particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor},${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(drawFrame);
  }

  drawFrame();

  // ============================================================
  // FADE IN ON SCROLL
  // ============================================================
  const fadeEls = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  fadeEls.forEach((el) => observer.observe(el));

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const lightboxBackdrop = document.querySelector(".lightbox-backdrop");

  document.querySelectorAll(".zoomable").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("active");
    });
  });

  // close on backdrop click
  lightboxBackdrop.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });

  // close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lightbox.classList.remove("active");
  });

  const backToTop = document.getElementById("backToTop");
  const impressionCard = document.getElementById("impressionCard");
  const impressionClose = document.getElementById("impressionClose");
  const impressionBtn = document.getElementById("impressionBtn");
  const footer = document.querySelector("footer");
  let impressionShown = false;
  let waitingForTop = false;

  // Step 1: detect footer → show back to top button
  function hideImpressionCard() {
    impressionCard.classList.remove("visible");
    impressionCard.classList.add("hidden");
  }

  function showImpressionCard() {
    impressionShown = true;
    waitingForTop = false;
    impressionCard.classList.remove("hidden");
    impressionCard.classList.add("visible");
  }

  function isAtTop() {
    return window.scrollY <= 8;
  }

  function showCardWhenTopIsReached() {
    if (!waitingForTop || impressionShown || !isAtTop()) return;
    showImpressionCard();
  }

  if (backToTop && impressionCard && footer) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        const footerIsVisible = entries.some((entry) => entry.isIntersecting);
        backToTop.classList.toggle(
          "visible",
          footerIsVisible && !waitingForTop && !impressionShown,
        );
      },
      { threshold: 0.1 },
    );

    footerObserver.observe(footer);
  }

  // Step 2: click back to top → scroll up → show impression card
  if (backToTop && impressionCard && footer) {
    backToTop.addEventListener("click", () => {
      waitingForTop = true;
      backToTop.classList.remove("visible");
      window.scrollTo({ top: 0, behavior: "smooth" });
      showCardWhenTopIsReached();
    });

    window.addEventListener("scroll", showCardWhenTopIsReached, {
      passive: true,
    });

    if ("onscrollend" in window) {
      window.addEventListener("scrollend", showCardWhenTopIsReached);
    }
  }

  // Step 3: close button
  if (impressionClose && impressionCard) {
    impressionClose.addEventListener("click", hideImpressionCard);
  }

  // Step 4: get in touch → close card after short delay
  if (impressionBtn && impressionCard) {
    impressionBtn.addEventListener("click", () => {
      setTimeout(hideImpressionCard, 600);
    });
  }
});
