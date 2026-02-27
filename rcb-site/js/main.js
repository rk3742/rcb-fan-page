/* ============================================
   RCB FAN PAGE — MAIN JS
   EE SALA CUP NAMDE 🏆 2025
   ============================================ */

/* ===== LOADER ===== */
const lbar = document.getElementById('lbar');
let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    lbar.style.width = '100%';
    setTimeout(() => {
      const loader = document.getElementById('loader');
      loader.style.transition = 'opacity 0.9s ease';
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        initHeroAnimation();
      }, 900);
    }, 400);
  }
  lbar.style.width = progress + '%';
}, 90);

/* ===== CUSTOM CURSOR ===== */
const cur = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
let curX = 0, curY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
  curX = e.clientX;
  curY = e.clientY;
});

function animateCursor() {
  dotX += (curX - dotX) * 0.12;
  dotY += (curY - dotY) * 0.12;
  cur.style.left = curX + 'px';
  cur.style.top = curY + 'px';
  cur2.style.left = dotX + 'px';
  cur2.style.top = dotY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .p-card, .stat, .tl-row').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('hover'));
  el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
});

/* ===== THREE.JS 3D SCENE ===== */
function init3D() {
  const canvas = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  /* PARTICLE SYSTEM — 2000 ember particles */
  const count = 2000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    speeds[i] = Math.random() * 0.006 + 0.002;
    const pick = Math.random();
    if (pick < 0.45) {
      // Red embers
      colors[i*3]=0.8; colors[i*3+1]=0; colors[i*3+2]=0;
    } else if (pick < 0.75) {
      // Gold embers
      colors[i*3]=1; colors[i*3+1]=0.84; colors[i*3+2]=0;
    } else {
      // White sparks
      colors[i*3]=1; colors[i*3+1]=1; colors[i*3+2]=1;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.045, vertexColors: true, transparent: true, opacity: 0.65, sizeAttenuation: true
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* 3D TORUS RINGS */
  function addRing(radius, tube, color, opacity, rotX, rotZ) {
    const g = new THREE.TorusGeometry(radius, tube, 16, 120);
    const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = rotX;
    mesh.rotation.z = rotZ;
    scene.add(mesh);
    return mesh;
  }

  const ring1 = addRing(3.2, 0.009, 0xFFD700, 0.18, Math.PI/3, 0);
  const ring2 = addRing(2.5, 0.007, 0xCC0000, 0.22, Math.PI/4, Math.PI/6);
  const ring3 = addRing(1.8, 0.006, 0xFFD700, 0.12, Math.PI/2.2, Math.PI/4);
  const ring4 = addRing(1.2, 0.004, 0xFFFFFF, 0.07, Math.PI/1.8, Math.PI/3);

  /* FLOATING GEOMETRIC SHAPES */
  const floaters = [];
  const shapeColors = [0xCC0000, 0xFFD700, 0xFF4500];
  for (let i = 0; i < 8; i++) {
    const g = i % 2 === 0
      ? new THREE.OctahedronGeometry(0.15 + Math.random() * 0.1)
      : new THREE.TetrahedronGeometry(0.12 + Math.random() * 0.1);
    const m = new THREE.MeshBasicMaterial({
      color: shapeColors[i % shapeColors.length],
      transparent: true,
      opacity: 0.12,
      wireframe: true
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set((Math.random()-0.5)*9, (Math.random()-0.5)*9, (Math.random()-0.5)*5);
    mesh.userData = {
      speedX: (Math.random()-0.5)*0.008,
      speedY: (Math.random()-0.5)*0.006,
      speedZ: (Math.random()-0.5)*0.01,
      offset: Math.random() * Math.PI * 2,
      floatAmp: Math.random() * 0.008 + 0.004
    };
    scene.add(mesh);
    floaters.push(mesh);
  }

  /* Mouse parallax */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    // Ring rotation
    ring1.rotation.z += 0.003;
    ring2.rotation.z -= 0.004;
    ring3.rotation.z += 0.006;
    ring4.rotation.z -= 0.008;

    // Mouse parallax
    targetX += (mouseX * 1.2 - targetX) * 0.04;
    targetY += (-mouseY * 1.2 - targetY) * 0.04;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(scene.position);

    // Particles drift upward
    const pos = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i*3+1] += speeds[i];
      if (pos[i*3+1] > 11) pos[i*3+1] = -11;
      // Slight swirl
      pos[i*3] += Math.sin(t + i * 0.01) * 0.001;
    }
    geo.attributes.position.needsUpdate = true;

    // Float shapes
    floaters.forEach(m => {
      m.rotation.x += m.userData.speedX;
      m.rotation.y += m.userData.speedY;
      m.rotation.z += m.userData.speedZ;
      m.position.y += Math.sin(t + m.userData.offset) * m.userData.floatAmp;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Init 3D
init3D();

/* ===== HERO ANIMATION ===== */
function initHeroAnimation() {
  const sequence = [
    { id: 'hero-eye', delay: 200 },
    { id: 'hero-rcb', delay: 500 },
    { id: 'hero-full', delay: 900 },
    { id: 'hero-champ', delay: 1150 },
    { id: 'hero-date', delay: 1450 },
    { id: 'scroll-hint', delay: 2000 },
  ];
  sequence.forEach(({ id, delay }) => {
    const el = document.getElementById(id);
    if (el) setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, delay);
  });
}

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.rv, .rv-l, .rv-r');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = target / 75;
  const run = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
      requestAnimationFrame(run);
    } else {
      el.textContent = target.toLocaleString() + suffix;
    }
  };
  run();
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const t = parseInt(e.target.dataset.target);
      if (!isNaN(t)) animateCounter(e.target, t);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

/* ===== PARALLAX RINGS on SCROLL ===== */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const rc = document.querySelector('.ring-container');
  if (rc) rc.style.transform = `translate(-50%, calc(-50% + ${sy * 0.18}px))`;
}, { passive: true });

/* ===== KEYBOARD SHORTCUT — press R for roar effect ===== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    document.body.style.animation = 'none';
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:rgba(204,0,0,0.15);z-index:9999;pointer-events:none;animation:fadeOut .5s ease forwards;';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
  }
});
