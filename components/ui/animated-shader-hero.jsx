import React, { useRef, useEffect } from "react";

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.)*vec3(.35,.55,1.25);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.03,bg*.08,bg*.2),d);
  }
  O=vec4(col,1);
}`;

const useShaderBackground = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef();
  const rendererRef = useRef(null);
  const pointersRef = useRef(null);

  class WebGLRenderer {
    constructor(canvas, scale) {
      this.canvas = canvas;
      this.scale = scale;
      this.gl = canvas.getContext("webgl2");
      this.program = null;
      this.buffer = null;
      this.vertexSrc = `#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}`;
      this.vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
      this.mouseMove = [0, 0];
      this.mouseCoords = [0, 0];
      this.pointerCoords = [0, 0];
      this.nbrOfPointers = 0;
      this.shaderSource = defaultShaderSource;
      this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
    }

    updateShader(source) { this.reset(); this.shaderSource = source; this.setup(); this.init(); }
    updateMove(deltas) { this.mouseMove = deltas; }
    updateMouse(coords) { this.mouseCoords = coords; }
    updatePointerCoords(coords) { this.pointerCoords = coords; }
    updatePointerCount(nbr) { this.nbrOfPointers = nbr; }
    updateScale(scale) { this.scale = scale; this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale); }

    compile(shader, source) {
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
    }

    test(source) {
      const gl = this.gl;
      const shader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      const err = ok ? null : gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      return err;
    }

    reset() {
      const gl = this.gl;
      if (!this.program) return;
      gl.deleteProgram(this.program);
      this.program = null;
    }

    setup() {
      const gl = this.gl;
      const vs = gl.createShader(gl.VERTEX_SHADER);
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      this.compile(vs, this.vertexSrc);
      this.compile(fs, this.shaderSource);
      this.program = gl.createProgram();
      gl.attachShader(this.program, vs);
      gl.attachShader(this.program, fs);
      gl.linkProgram(this.program);
    }

    init() {
      const gl = this.gl;
      const program = this.program;
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      program.resolution = gl.getUniformLocation(program, "resolution");
      program.time = gl.getUniformLocation(program, "time");
      program.move = gl.getUniformLocation(program, "move");
      program.touch = gl.getUniformLocation(program, "touch");
      program.pointerCount = gl.getUniformLocation(program, "pointerCount");
      program.pointers = gl.getUniformLocation(program, "pointers");
    }

    render(now = 0) {
      const gl = this.gl;
      const program = this.program;
      if (!program) return;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.uniform2f(program.resolution, this.canvas.width, this.canvas.height);
      gl.uniform1f(program.time, now * 1e-3);
      gl.uniform2f(program.move, ...this.mouseMove);
      gl.uniform2f(program.touch, ...this.mouseCoords);
      gl.uniform1i(program.pointerCount, this.nbrOfPointers);
      gl.uniform2fv(program.pointers, this.pointerCoords);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  class PointerHandler {
    constructor(element, scale) {
      this.scale = scale;
      this.active = false;
      this.pointers = new Map();
      this.lastCoords = [0, 0];
      this.moves = [0, 0];
      const map = (x, y) => [x * this.scale, element.height - y * this.scale];
      element.addEventListener("pointerdown", (e) => {
        this.active = true;
        this.pointers.set(e.pointerId, map(e.clientX, e.clientY));
      });
      const cleanup = (e) => {
        if (this.count === 1) this.lastCoords = this.first;
        this.pointers.delete(e.pointerId);
        this.active = this.pointers.size > 0;
      };
      element.addEventListener("pointerup", cleanup);
      element.addEventListener("pointerleave", cleanup);
      element.addEventListener("pointermove", (e) => {
        if (!this.active) return;
        this.lastCoords = [e.clientX, e.clientY];
        this.pointers.set(e.pointerId, map(e.clientX, e.clientY));
        this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
      });
    }
    updateScale(scale) { this.scale = scale; }
    get count() { return this.pointers.size; }
    get move() { return this.moves; }
    get coords() { return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0]; }
    get first() { return this.pointers.values().next().value || this.lastCoords; }
  }

  const resize = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    rendererRef.current?.updateScale(dpr);
    pointersRef.current?.updateScale(dpr);
  };

  const loop = (now) => {
    if (!rendererRef.current || !pointersRef.current) return;
    rendererRef.current.updateMouse(pointersRef.current.first);
    rendererRef.current.updatePointerCount(pointersRef.current.count);
    rendererRef.current.updatePointerCoords(pointersRef.current.coords);
    rendererRef.current.updateMove(pointersRef.current.move);
    rendererRef.current.render(now);
    animationFrameRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    rendererRef.current = new WebGLRenderer(canvas, dpr);
    pointersRef.current = new PointerHandler(canvas, dpr);
    rendererRef.current.setup();
    rendererRef.current.init();
    resize();
    if (rendererRef.current.test(defaultShaderSource) === null) rendererRef.current.updateShader(defaultShaderSource);
    loop(0);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      rendererRef.current?.reset();
    };
  }, []);

  return canvasRef;
};

export default function Hero({ trustBadge, headline, subtitle, buttons, className = "" }) {
  const canvasRef = useShaderBackground();
  return (
    <section
      className={className}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#050b1a",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          touchAction: "none",
          background: "#050b1a",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 16px",
          textAlign: "center",
          color: "#f8fbff",
        }}
      >
        {trustBadge && <p style={{ fontSize: 13, opacity: 0.9, color: "#c9d9ff" }}>{trustBadge.text}</p>}
        <h1 style={{ fontSize: "clamp(42px, 8vw, 96px)", lineHeight: 0.95, color: "#eaf2ff" }}>{headline?.line1}</h1>
        <h1 style={{ fontSize: "clamp(42px, 8vw, 96px)", lineHeight: 0.95, color: "#93c5fd" }}>{headline?.line2}</h1>
        <p style={{ maxWidth: 820, fontSize: "clamp(16px, 2vw, 24px)", opacity: 0.92, color: "#dbeafe" }}>{subtitle}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {buttons?.primary && <button onClick={buttons.primary.onClick} className="btn btn-primary">{buttons.primary.text}</button>}
          {buttons?.secondary && <button onClick={buttons.secondary.onClick} className="btn btn-outline">{buttons.secondary.text}</button>}
        </div>
      </div>
    </section>
  );
}