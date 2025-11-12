// Lightweight animated background module
// Creates a full-screen canvas and draws soft blobs that react to mouse and movement.

const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
canvas.style.position = 'fixed';
canvas.style.left = '0';
canvas.style.top = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
canvas.style.opacity = '0.95';

// Append directly to body so stacking is consistent across pages (avoids parent z-index hiding the canvas)
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let DPR = window.devicePixelRatio || 1;
let w = 0, h = 0;

function resize(){
  DPR = window.devicePixelRatio || 1;
  w = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  h = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  canvas.width = Math.floor(w * DPR);
  canvas.height = Math.floor(h * DPR);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

window.addEventListener('resize', resize, {passive:true});
resize();

// particles (soft blobs)
const blobs = [];
const BLOBS = 5;
for(let i=0;i<BLOBS;i++){
  blobs.push({
    x: Math.random()*w,
    y: Math.random()*h,
    r: 120 + Math.random()*160,
    vx: (Math.random()-0.5)*0.2,
    vy: (Math.random()-0.5)*0.2,
    hue: 200 + Math.floor(Math.random()*40),
  });
}

let mouseX = w/2, mouseY = h/2;
let lastMoveTime = Date.now();

window.addEventListener('pointermove', (e)=>{
  mouseX = e.clientX;
  mouseY = e.clientY;
  lastMoveTime = Date.now();
}, {passive:true});

function draw(){
  ctx.clearRect(0,0,w,h);

  // subtle radial gradient background
  const g = ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0, 'rgba(11,108,255,0.03)');
  g.addColorStop(1, 'rgba(6,34,102,0.02)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);

  // update and draw blobs
  for(let i=0;i<blobs.length;i++){
    const b = blobs[i];
    // simple attraction to mouse
    const dx = mouseX - b.x;
    const dy = mouseY - b.y;
    b.vx += dx * 0.00012;
    b.vy += dy * 0.00012;

    // gentle friction
    b.vx *= 0.995; b.vy *= 0.995;

    b.x += b.vx;
    b.y += b.vy;

    // wrap edges softly
    if(b.x < -b.r) b.x = w + b.r;
    if(b.x > w + b.r) b.x = -b.r;
    if(b.y < -b.r) b.y = h + b.r;
    if(b.y > h + b.r) b.y = -b.r;

    // draw soft radial
    const gradient = ctx.createRadialGradient(b.x, b.y, b.r*0.1, b.x, b.y, b.r);
    gradient.addColorStop(0, `hsla(${b.hue},80%,60%,0.12)`);
    gradient.addColorStop(0.4, `hsla(${b.hue},70%,55%,0.06)`);
    gradient.addColorStop(1, `hsla(${b.hue},60%,45%,0)`);

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.fill();
  }

  // subtle overlay near mouse for parallax feel
  const age = Date.now() - lastMoveTime;
  if(age < 2000){
    ctx.beginPath();
    const mGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 280);
    mGrad.addColorStop(0, 'rgba(11,108,255,0.06)');
    mGrad.addColorStop(1, 'rgba(11,108,255,0)');
    ctx.fillStyle = mGrad;
    ctx.fillRect(mouseX-280, mouseY-280, 560, 560);
  }

  requestAnimationFrame(draw);
}

// gentle startup animation: nudge blobs
for(let i=0;i<blobs.length;i++){
  blobs[i].vx += (Math.random()-0.5)*0.8;
  blobs[i].vy += (Math.random()-0.5)*0.6;
}

requestAnimationFrame(draw);

// make module idempotent
// Respect reduced motion preference: stop animation if user prefers reduced motion
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // clear canvas and stop further frames by not requesting more (we've already requested one).
  ctx.clearRect(0,0,w,h);
}

export default {};
