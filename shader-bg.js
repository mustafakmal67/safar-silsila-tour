/**
 * shader-bg.js — Roamistan Cinematic WebGL Background
 * Organic domain-warped FBM flow in deep forest greens, olive, warm gold, evergreen.
 * Visibly animated, smooth, elegant — not distracting.
 */
(function () {
  'use strict';

  /* ── 1. Inject fixed fullscreen canvas ── */
  const canvas = document.createElement('canvas');
  canvas.id = 'shader-bg';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-10;pointer-events:none;display:block;';
  document.body.prepend(canvas);

  /* ── 2. WebGL context ── */
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: true,          // transparent canvas — blends via CSS mix-blend-mode
    depth: false,
    stencil: false,
    powerPreference: 'default',
  });

  if (!gl) { canvas.remove(); return; }

  /* ── 3. Shaders ── */
  const VS = `
    attribute vec2 a_pos;
    void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  // Core visual tuning knobs (easy to tweak):
  //  SPEED     → how fast the field flows  (try 0.10 – 0.25)
  //  WARP      → how much the domain twists (try 1.0 – 2.5)
  //  CONTRAST  → pushes darks darker / brights brighter

  const FS = `
    precision highp float;
    uniform float u_time;
    uniform vec2  u_res;

    /* ── smooth-noise helpers ── */
    vec2 hash2(vec2 p) {
      p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
    }
    float gnoise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(
        mix(dot(hash2(i+vec2(0,0)), f-vec2(0,0)),
            dot(hash2(i+vec2(1,0)), f-vec2(1,0)), u.x),
        mix(dot(hash2(i+vec2(0,1)), f-vec2(0,1)),
            dot(hash2(i+vec2(1,1)), f-vec2(1,1)), u.x),
        u.y);
    }

    /* ── 4-octave FBM with rotating basis ── */
    const mat2 M = mat2(0.80, 0.60, -0.60, 0.80);
    float fbm(vec2 p) {
      float v=0.0, a=0.55;
      for(int i=0;i<4;i++){
        v += a * gnoise(p);
        p  = M * p * 2.1 + vec2(5.3,1.7);
        a *= 0.45;
      }
      return v; /* range roughly -1 .. 1 */
    }

    /* ── colour palette — rich & saturated for mix-blend-mode:color ── */
    vec3 palette(float t) {
      vec3 c0 = vec3(0.030, 0.100, 0.060);   /* deep forest green       */
      vec3 c1 = vec3(0.055, 0.200, 0.090);   /* vivid forest green      */
      vec3 c2 = vec3(0.130, 0.280, 0.090);   /* bright fern green       */
      vec3 c3 = vec3(0.260, 0.310, 0.070);   /* rich warm olive         */
      vec3 c4 = vec3(0.350, 0.220, 0.055);   /* warm amber / gold       */
      vec3 c5 = vec3(0.040, 0.160, 0.120);   /* deep teal-evergreen     */

      vec3 col = c0;
      col = mix(col, c1, smoothstep(0.08, 0.32, t));
      col = mix(col, c2, smoothstep(0.28, 0.52, t));
      col = mix(col, c3, smoothstep(0.47, 0.68, t));
      col = mix(col, c4, smoothstep(0.62, 0.82, t) * 0.65);
      col = mix(col, c5, smoothstep(0.78, 1.00, t));
      return col;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;             /* 0→1              */
      float ar = u_res.x / u_res.y;
      vec2 p   = vec2(uv.x * ar, uv.y) * 1.8;       /* zoom-out a bit   */

      /* ── SPEED: 0.15 gives clear visible motion; feel free to tune ── */
      float t = u_time * 0.15;

      /* ── Layer 1: slow primary warp ── */
      vec2 q;
      q.x = fbm(p + vec2(0.00, 0.00) + t * 0.45);
      q.y = fbm(p + vec2(4.20, 1.70) + t * 0.45);

      /* ── Layer 2: faster secondary warp riding on layer 1 ── */
      vec2 r;
      r.x = fbm(p + 1.8 * q + vec2(1.70, 9.20) + t * 0.60);
      r.y = fbm(p + 1.8 * q + vec2(8.30, 2.80) + t * 0.60);

      /* ── Final FBM field value ── */
      float f = fbm(p + 2.0 * r + t * 0.30);
      f = 0.5 + 0.5 * f;               /* map  -1..1  →  0..1            */
      f = pow(f, 0.85);                /* slight contrast boost           */

      /* ── Colour ── */
      vec3 col = palette(f);

      /* ── Drifting warm-gold ember ── */
      vec2 e1 = vec2(0.30 + 0.18*sin(t*0.40), 0.65 + 0.12*cos(t*0.33));
      float em1 = smoothstep(0.55, 0.0, distance(uv, e1));
      col += em1 * vec3(0.080, 0.048, 0.012);

      /* ── Evergreen bloom ── */
      vec2 e2 = vec2(0.75 + 0.12*cos(t*0.28), 0.22 + 0.10*sin(t*0.38));
      float em2 = smoothstep(0.50, 0.0, distance(uv, e2));
      col += em2 * vec3(0.010, 0.045, 0.032);

      /* ── Vignette — corners go near-black ── */
      vec2 vc = uv * 2.0 - 1.0;
      float vig = 1.0 - 0.60 * dot(vc*vec2(0.5,0.7), vc*vec2(0.5,0.7));
      vig = clamp(vig, 0.0, 1.0);
      col *= vig;

      /* Output with 0.88 alpha — lets darkest photo regions bleed through */
      gl_FragColor = vec4(col, 0.88);
    }
  `;

  /* ── 4. Compile + link ── */
  function mkShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[shader-bg]', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null;
    }
    return s;
  }

  const vs = mkShader(gl.VERTEX_SHADER,   VS);
  const fs = mkShader(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) { canvas.remove(); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[shader-bg]', gl.getProgramInfoLog(prog)); canvas.remove(); return;
  }
  gl.useProgram(prog);

  /* ── 5. Fullscreen quad ── */
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPosLoc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPosLoc);
  gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

  /* ── 6. Uniforms ── */
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes  = gl.getUniformLocation(prog, 'u_res');

  /* ── 7. Resize — render at 0.75× DPR for good quality + speed balance ── */
  const DPR   = Math.min(window.devicePixelRatio || 1, 2);
  const SCALE = DPR * 0.75;

  function resize() {
    const w = Math.floor(window.innerWidth  * SCALE);
    const h = Math.floor(window.innerHeight * SCALE);
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  }

  let rTimer;
  window.addEventListener('resize', () => { clearTimeout(rTimer); rTimer = setTimeout(resize, 60); });
  resize();

  /* ── 8. Full 60 fps render loop ── */
  const START = performance.now();

  function render(now) {
    requestAnimationFrame(render);
    gl.uniform1f(uTime, (now - START) * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  requestAnimationFrame(render);

  /* ── 9. Pause on hidden tab ── */
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) requestAnimationFrame(render);
  });

})();
