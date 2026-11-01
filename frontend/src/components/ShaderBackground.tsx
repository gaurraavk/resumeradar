import React, { useEffect, useRef, useState } from 'react';

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,
                        0.366025403784439,
                       -0.577350269189626,
                        0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    vec2 m = u_mouse / u_resolution;
    vec2 mouseOffset = (m - 0.5) * 0.16;
    
    float tSlow = u_time * 0.18;
    float tWave = u_time * 0.38;
    
    vec2 domePos = p - mouseOffset;
    domePos.y += 0.08 + sin(tSlow * 1.5) * 0.035;
    
    float arcDist = length(vec2(domePos.x * 0.62 + sin(domePos.y * 3.5 + tWave) * 0.04, domePos.y + 0.52));
    
    float ribbon = smoothstep(1.06, 0.48, arcDist) * smoothstep(0.12, 0.48, arcDist);
    
    float n1 = snoise(vec2(p.x * 1.8 + cos(tSlow) * 0.6, p.y * 1.5 + sin(tSlow * 0.8) * 0.5));
    float n2 = snoise(vec2(p.x * 2.8 - tWave * 0.5, p.y * 2.5 + tWave * 0.4));
    float n3 = snoise(vec2(p.x * 4.2 + tSlow, p.y * 3.8 - tWave * 0.3)) * 0.5;
    
    vec2 warpedUV = p + vec2(n1 + n3 * 0.3, n2 + n1 * 0.2) * 0.18;
    
    vec3 colBackground = vec3(0.984, 0.976, 0.957);
    
    vec3 colVibrantCyan   = vec3(0.08, 0.84, 0.90);
    vec3 colSoftCyanMist  = vec3(0.58, 0.92, 0.95);
    vec3 colSkyBlue       = vec3(0.24, 0.65, 0.96);
    vec3 colDeepSkyCerulean = vec3(0.12, 0.46, 0.82);
    vec3 colWarmApricot   = vec3(0.96, 0.64, 0.54);
    vec3 colPaleLavender  = vec3(0.82, 0.80, 0.92);
    vec3 colMidnightNavy  = vec3(0.082, 0.149, 0.235);
    
    float xFactor = clamp((warpedUV.x + 0.62) * 0.86, 0.0, 1.0);
    
    vec3 cyanFlow = mix(colSoftCyanMist, colVibrantCyan, smoothstep(0.0, 0.42, xFactor + n1 * 0.15));
    vec3 skyFlow  = mix(colSkyBlue, colDeepSkyCerulean, smoothstep(0.35, 0.78, xFactor + n2 * 0.15));
    
    vec3 primaryBlend = mix(cyanFlow, skyFlow, smoothstep(0.25, 0.65, xFactor));
    
    vec3 auraColor = mix(primaryBlend, colWarmApricot, smoothstep(0.68, 0.96, xFactor + n3 * 0.2) * 0.75);
    auraColor = mix(auraColor, colPaleLavender, smoothstep(0.55, 0.78, xFactor) * 0.25);
    
    float crestDist = abs(arcDist - 0.74);
    float darkRim = smoothstep(0.19, 0.01, crestDist) * smoothstep(-0.35, 0.15, domePos.x + n1 * 0.22);
    auraColor = mix(auraColor, colMidnightNavy, clamp(darkRim * 0.78, 0.0, 1.0));
    
    float wavePulse = 0.58 + 0.32 * sin(u_time * 0.45 + warpedUV.y * 3.0);
    float intensity = ribbon * (0.68 + 0.28 * n2) * wavePulse;
    intensity = clamp(intensity, 0.0, 1.0) * 0.86;
    
    float grain = (fract(sin(dot(gl_FragCoord.xy + fract(u_time * 1.08), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.022;
    
    vec3 finalColor = mix(colBackground, auraColor, intensity) + grain;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const ShaderBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create WebGL context with low-power preservation
    const gl =
      canvas.getContext('webgl', {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        powerPreference: 'high-performance',
      }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      setHasWebGL(false);
      return;
    }

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compile failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    if (!vertShader || !fragShader) {
      setHasWebGL(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setHasWebGL(false);
      return;
    }

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link failed:', gl.getProgramInfoLog(program));
      setHasWebGL(false);
      return;
    }

    gl.useProgram(program);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    // Smooth interpolated mouse tracking
    let currentMouseX = window.innerWidth / 2;
    let currentMouseY = window.innerHeight / 2;
    let targetMouseX = currentMouseX;
    let targetMouseY = currentMouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = window.innerHeight - e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle high-DPI scaling gracefully (cap at 1.5 to guarantee high fps)
    const updateSize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateSize());
      resizeObserver.observe(document.body);
    } else {
      window.addEventListener('resize', updateSize, { passive: true });
    }

    // Animation loop with tab visibility pause
    let animId: number;
    let isTabVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    let startTime = performance.now();
    let accumulatedTime = 0;
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const delta = (now - lastTimestamp) * 0.001;
      lastTimestamp = now;

      if (isTabVisible && canvas) {
        if (!prefersReducedMotion) {
          accumulatedTime += delta;
        } else {
          accumulatedTime += delta * 0.08;
        }

        // Lerp mouse coordinates smoothly
        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        gl.viewport(0, 0, canvas.width, canvas.height);
        if (uTime) gl.uniform1f(uTime, accumulatedTime);
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        if (uMouse) {
          const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          gl.uniform2f(uMouse, currentMouseX * dpr, currentMouseY * dpr);
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Cleanup resources cleanly on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateSize);
      }
      if (quadBuffer) gl.deleteBuffer(quadBuffer);
      if (vertShader) gl.deleteShader(vertShader);
      if (fragShader) gl.deleteShader(fragShader);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {hasWebGL ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: '100vw', height: '100vh' }}
        />
      ) : (
        /* Graceful fallback if WebGL is disabled or unsupported */
        <div className="w-full h-full bg-[#fbf9f4] relative">
          <div
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full blur-[100px] opacity-60"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(21, 214, 230, 0.45) 0%, rgba(61, 166, 245, 0.35) 45%, rgba(242, 182, 167, 0.25) 75%, transparent 100%)',
            }}
          />
        </div>
      )}

      {/* Layer 1: Subtle warm editorial scrim for readability preservation */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          background:
            'radial-gradient(circle at 50% 15%, transparent 20%, rgba(251, 249, 244, 0.45) 80%, rgba(251, 249, 244, 0.85) 100%)',
        }}
      />
    </div>
  );
};

