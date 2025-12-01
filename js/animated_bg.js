// Premium Animated Background
// Smooth, organic blobs with theme colors

const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
canvas.style.position = 'fixed';
canvas.style.inset = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let w, h;
let dpr = window.devicePixelRatio || 1;

function resize() {
  dpr = window.devicePixelRatio || 1;
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.scale(dpr, dpr);
}

window.addEventListener('resize', resize);
resize();

// Blob Configuration
const blobs = [
  { x: 0, y: 0, r: 600, color: 'rgba(37, 99, 235, 0.15)', vx: 0.5, vy: 0.2 }, // Primary
  { x: w, y: 0, r: 500, color: 'rgba(244, 63, 94, 0.15)', vx: -0.3, vy: 0.4 }, // Accent
  { x: 0, y: h, r: 550, color: 'rgba(16, 185, 129, 0.1)', vx: 0.4, vy: -0.3 }, // Success
  { x: w, y: h, r: 450, color: 'rgba(245, 158, 11, 0.1)', vx: -0.2, vy: -0.5 }  // Warning
];

let time = 0;

function animate() {
  ctx.clearRect(0, 0, w, h);

  // Global composite operation for smooth blending
  ctx.globalCompositeOperation = 'screen';

  blobs.forEach(blob => {
    // Smooth movement
    blob.x += blob.vx;
    blob.y += blob.vy;

    // Bounce off walls
    if (blob.x < -blob.r / 2 || blob.x > w + blob.r / 2) blob.vx *= -1;
    if (blob.y < -blob.r / 2 || blob.y > h + blob.r / 2) blob.vy *= -1;

    // Pulsate radius
    const r = blob.r + Math.sin(time * 0.002 + blob.x) * 50;

    const g = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r);
    g.addColorStop(0, blob.color);
    g.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  time++;
  requestAnimationFrame(animate);
}

// Start animation
animate();

// Respect reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Draw once and stop
  cancelAnimationFrame(animate);
}

export default {};



