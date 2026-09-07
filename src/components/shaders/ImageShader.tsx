import { useEffect, useRef } from "react";
import * as THREE from "three";

/* =========================================================
 * SHADERS
 * ======================================================= */

const vertexShader = `
varying vec2 vUv;

uniform float uTime;
uniform float uEnableWaves;
uniform float uWaveStrength;
uniform float uWaveSpeed;

void main() {
    vUv = uv;

    vec3 transformed = position;

    if (uEnableWaves > 0.0) {
        float time = uTime * uWaveSpeed;

        transformed.x +=
            sin(time + position.y * 2.0)
            * 0.15
            * uWaveStrength;

        transformed.y +=
            cos(time + position.x * 2.0)
            * 0.10
            * uWaveStrength;

        transformed.z +=
            sin(time + position.x + position.y)
            * 0.20
            * uWaveStrength;
    }

    gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;

uniform float uTime;
uniform float uMouse;
uniform sampler2D uTexture;

uniform float uDistortion;
uniform float uDistortionSpeed;
uniform float uMouseDistortion;

void main() {
    float time = uTime;

    vec2 uv = vUv;

    float distortion =
        sin(
            time * uDistortionSpeed +
            uv.y * 8.0
        )
        * uDistortion;

    float mouseOffset =
        uMouse * uMouseDistortion;

    float r = texture2D(
        uTexture,
        uv + vec2(
            distortion + mouseOffset,
            0.0
        )
    ).r;

    float g = texture2D(
        uTexture,
        uv + vec2(
            distortion,
            0.0
        )
    ).g;

    float b = texture2D(
        uTexture,
        uv - vec2(
            distortion + mouseOffset,
            0.0
        )
    ).b;

    float a = texture2D(
        uTexture,
        uv
    ).a;

    gl_FragColor =
        vec4(r, g, b, a);
}
`;

/* =========================================================
 * TYPES
 * ======================================================= */

interface AsciiFilterOptions {
  fontSize: number;
  fontFamily: string;
  charset: string;
  invert: boolean;
  maxColumns: number;
  colorMode: "original" | "monochrome";
  color: string;
}

interface DistortedImageProps {
  /* Image */
  src: string;

  /* Container */
  className?: string;

  /*
   * Animation visibility.
   *
   * false:
   * - RAF stopped
   * - WebGL stopped
   * - ASCII stopped
   *
   * Three.js resources remain alive.
   */
  visible?: boolean;

  /* Waves */
  enableWaves?: boolean;
  waveStrength?: number;
  waveSpeed?: number;

  /* RGB distortion */
  distortion?: number;
  distortionSpeed?: number;
  mouseDistortion?: number;

  /* Mouse */
  enableMouse?: boolean;
  mouseRotation?: boolean;
  mouseRotationStrength?: number;
  mouseSmoothing?: number;

  /* ASCII */
  asciiFontSize?: number;
  asciiFontFamily?: string;
  asciiFps?: number;
  maxAsciiColumns?: number;

  asciiColorMode?: "original" | "monochrome";
  asciiColor?: string;

  /* ASCII character mapping */
  asciiCharset?: string;
  invertAscii?: boolean;

  /* Renderer */
  maxPixelRatio?: number;
}

/* =========================================================
 * HELPERS
 * ======================================================= */

function map(
  value: number,
  start: number,
  stop: number,
  start2: number,
  stop2: number,
) {
  return ((value - start) / (stop - start)) * (stop2 - start2) + start2;
}

/* =========================================================
 * ASCII FILTER
 * ======================================================= */

class AsciiFilter {
  renderer: THREE.WebGLRenderer;

  domElement: HTMLDivElement;
  canvas: HTMLCanvasElement;
  sampleCanvas: HTMLCanvasElement;

  context: CanvasRenderingContext2D | null;
  sampleContext: CanvasRenderingContext2D | null;

  fontSize: number;
  fontFamily: string;
  charset: string;
  invert: boolean;

  maxColumns: number;

  colorMode: "original" | "monochrome";
  color: string;

  width = 0;
  height = 0;

  cols = 0;
  rows = 0;

  charWidth = 0;
  charHeight = 0;

  constructor(renderer: THREE.WebGLRenderer, options: AsciiFilterOptions) {
    this.renderer = renderer;

    this.fontSize = options.fontSize;
    this.fontFamily = options.fontFamily;
    this.charset = options.charset;
    this.invert = options.invert;

    this.maxColumns = options.maxColumns;

    this.colorMode = options.colorMode;
    this.color = options.color;

    /*
     * Main ASCII container.
     */
    this.domElement = document.createElement("div");

    Object.assign(this.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
    });

    /*
     * Final visible ASCII canvas.
     */
    this.canvas = document.createElement("canvas");

    Object.assign(this.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });

    this.domElement.appendChild(this.canvas);

    /*
     * Low-resolution sampling canvas.
     */
    this.sampleCanvas = document.createElement("canvas");

    this.context = this.canvas.getContext("2d");

    this.sampleContext = this.sampleCanvas.getContext("2d");

    if (this.context) {
      this.context.imageSmoothingEnabled = false;
      this.context.textBaseline = "top";
      this.context.textAlign = "left";
    }

    if (this.sampleContext) {
      this.sampleContext.imageSmoothingEnabled = false;
    }
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.renderer.setSize(width, height);

    this.reset();
  }

  reset() {
    if (!this.context) {
      return;
    }

    this.context.font = `500 ${this.fontSize}px ${this.fontFamily}`;

    this.charWidth = this.context.measureText("M").width;

    this.charHeight = this.fontSize * 0.85;

    /*
     * Natural column count.
     */
    const naturalColumns = Math.floor(this.width / this.charWidth);

    /*
     * Limit ASCII resolution.
     */
    this.cols = Math.max(1, Math.min(naturalColumns, this.maxColumns));

    /*
     * Preserve aspect ratio.
     */
    const aspect = this.height / this.width;

    this.rows = Math.max(1, Math.floor(this.cols * aspect));

    /*
     * Visible canvas.
     */
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    /*
     * Sampling canvas.
     */
    this.sampleCanvas.width = this.cols;
    this.sampleCanvas.height = this.rows;
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    /*
     * Render WebGL first.
     */
    this.renderer.render(scene, camera);

    if (!this.context || !this.sampleContext) {
      return;
    }

    /*
     * Downsample WebGL result.
     */
    this.sampleContext.clearRect(0, 0, this.cols, this.rows);

    this.sampleContext.drawImage(
      this.renderer.domElement,
      0,
      0,
      this.cols,
      this.rows,
    );

    /*
     * Read low-resolution pixels.
     */
    const imageData = this.sampleContext.getImageData(
      0,
      0,
      this.cols,
      this.rows,
    );

    /*
     * Clear final ASCII canvas.
     */
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /*
     * Configure text.
     */
    this.context.font = `500 ${this.fontSize}px ${this.fontFamily}`;

    this.context.textBaseline = "top";
    this.context.textAlign = "left";

    /*
     * Draw ASCII pixels.
     */
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const i = (x + y * this.cols) * 4;

        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];

        /*
         * Transparent pixel.
         */
        if (a < 10) {
          continue;
        }

        /*
         * Perceived luminance.
         */
        const gray = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        /*
         * Brightness → ASCII index.
         */
        let index = Math.floor((1 - gray) * (this.charset.length - 1));

        if (this.invert) {
          index = this.charset.length - index - 1;
        }

        index = Math.max(0, Math.min(index, this.charset.length - 1));

        const char = this.charset[index];

        /*
         * Position.
         */
        const px = x * this.charWidth;

        const py = y * this.charHeight;

        /*
         * Color.
         */
        if (this.colorMode === "original") {
          this.context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        } else {
          this.context.fillStyle = this.color;
        }

        /*
         * Draw glyph.
         */
        this.context.fillText(char, px, py);
      }
    }
  }

  dispose() {
    /*
     * Nothing external to release.
     */
  }
}

/* =========================================================
 * COMPONENT
 * ======================================================= */

export default function DistortedImage({
  src,
  className,

  visible = true,

  enableWaves = true,
  waveStrength = 1,
  waveSpeed = 2,

  distortion = 0.005,
  distortionSpeed = 2,
  mouseDistortion = 0.003,

  enableMouse = true,
  mouseRotation = true,
  mouseRotationStrength = 0.3,
  mouseSmoothing = 0.05,

  asciiFontSize = 8,
  asciiFontFamily = "IBM Plex Mono",

  asciiFps = 30,
  maxAsciiColumns = 240,

  asciiColorMode = "original",
  asciiColor = "#ffffff",

  asciiCharset = " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",

  invertAscii = true,

  maxPixelRatio = 1,
}: DistortedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * Current visibility.
   *
   * Stored in ref so changing `visible`
   * does NOT recreate the entire
   * Three.js scene.
   */
  const visibleRef = useRef(visible);

  /*
   * Current animation frame.
   */
  const animationFrameRef = useRef<number | null>(null);

  /*
   * Animation function.
   *
   * Stored in ref so the visibility
   * effect can start it without
   * recreating WebGL.
   */
  const animateRef = useRef<((now: number) => void) | null>(null);

  /*
   * Update visibility ref.
   */
  useEffect(() => {
    visibleRef.current = visible;

    /*
     * If becoming invisible,
     * immediately cancel RAF.
     */
    if (!visible) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);

        animationFrameRef.current = null;
      }

      return;
    }

    /*
     * If becoming visible,
     * start the animation again.
     */
    if (animateRef.current && animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(animateRef.current);
    }
  }, [visible]);

  /*
   * =======================================================
   * THREE.JS INITIALIZATION
   * =======================================================
   *
   * IMPORTANT:
   *
   * `visible` is deliberately NOT in
   * this dependency array.
   *
   * Changing visibility must not
   * destroy and recreate WebGL.
   */
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let disposed = false;

    /*
     * ==========================
     * INITIAL SIZE
     * ==========================
     */

    const width = container.clientWidth;

    const height = container.clientHeight;

    if (!width || !height) {
      return;
    }

    /*
     * ==========================
     * THREE.JS
     * ==========================
     */

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));

    renderer.setSize(width, height);

    renderer.setClearColor(0x000000, 0);

    /*
     * WebGL canvas is only an
     * intermediate framebuffer.
     */
    renderer.domElement.style.display = "none";

    container.appendChild(renderer.domElement);

    /*
     * ==========================
     * TEXTURE
     * ==========================
     */

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load(src, undefined, undefined, (error) => {
      console.error("Failed to load image:", src, error);
    });

    texture.minFilter = THREE.LinearFilter;

    texture.magFilter = THREE.LinearFilter;

    texture.colorSpace = THREE.SRGBColorSpace;

    /*
     * ==========================
     * GEOMETRY
     * ==========================
     */

    const geometry = new THREE.PlaneGeometry(4, 3, 64, 64);

    /*
     * ==========================
     * MATERIAL
     * ==========================
     */

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,

      transparent: true,

      uniforms: {
        uTime: {
          value: 0,
        },

        uMouse: {
          value: 0,
        },

        uTexture: {
          value: texture,
        },

        uEnableWaves: {
          value: enableWaves ? 1 : 0,
        },

        uWaveStrength: {
          value: waveStrength,
        },

        uWaveSpeed: {
          value: waveSpeed,
        },

        uDistortion: {
          value: distortion,
        },

        uDistortionSpeed: {
          value: distortionSpeed,
        },

        uMouseDistortion: {
          value: mouseDistortion,
        },
      },
    });

    /*
     * ==========================
     * MESH
     * ==========================
     */

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    /*
     * ==========================
     * ASCII
     * ==========================
     */

    const asciiFilter = new AsciiFilter(renderer, {
      fontSize: asciiFontSize,

      fontFamily: asciiFontFamily,

      charset: asciiCharset,

      invert: invertAscii,

      maxColumns: maxAsciiColumns,

      colorMode: asciiColorMode,

      color: asciiColor,
    });

    container.appendChild(asciiFilter.domElement);

    asciiFilter.setSize(width, height);

    /*
     * ==========================
     * MOUSE
     * ==========================
     */

    const mouse = {
      x: 0.5,
      y: 0.5,
    };

    const targetRotation = {
      x: 0,
      y: 0,
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!enableMouse) {
        return;
      }

      const rect = container.getBoundingClientRect();

      mouse.x = (event.clientX - rect.left) / rect.width;

      mouse.y = (event.clientY - rect.top) / rect.height;
    };

    if (enableMouse) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    /*
     * ==========================
     * ASCII FPS
     * ==========================
     */

    const safeAsciiFps = Math.max(1, Math.min(asciiFps, 60));

    const asciiInterval = 1000 / safeAsciiFps;

    let lastAsciiUpdate = 0;

    /*
     * ==========================
     * ANIMATION
     * ==========================
     */

    const animate = (now: number) => {
      /*
       * Component destroyed.
       */
      if (disposed) {
        return;
      }

      /*
       * Component currently invisible.
       *
       * Do NOT schedule another RAF.
       */
      if (!visibleRef.current) {
        animationFrameRef.current = null;

        return;
      }

      /*
       * Schedule next frame.
       */
      animationFrameRef.current = requestAnimationFrame(animate);

      const time = now * 0.001;

      /*
       * ========================
       * SHADER TIME
       * ========================
       */

      material.uniforms.uTime.value = time;

      /*
       * ========================
       * MOUSE → SHADER
       * ========================
       */

      const mouseX = enableMouse ? (mouse.x - 0.5) * 2 : 0;

      material.uniforms.uMouse.value = mouseX;

      /*
       * ========================
       * MOUSE ROTATION
       * ========================
       */

      if (enableMouse && mouseRotation) {
        targetRotation.x = map(
          mouse.y,
          0,
          1,
          mouseRotationStrength,
          -mouseRotationStrength,
        );

        targetRotation.y = map(
          mouse.x,
          0,
          1,
          -mouseRotationStrength,
          mouseRotationStrength,
        );
      } else {
        targetRotation.x = 0;
        targetRotation.y = 0;
      }

      /*
       * Smooth rotation.
       */
      mesh.rotation.x += (targetRotation.x - mesh.rotation.x) * mouseSmoothing;

      mesh.rotation.y += (targetRotation.y - mesh.rotation.y) * mouseSmoothing;

      /*
       * ========================
       * WEBGL
       * ========================
       */

      renderer.render(scene, camera);

      /*
       * ========================
       * ASCII
       * ========================
       */

      if (now - lastAsciiUpdate >= asciiInterval) {
        asciiFilter.render(scene, camera);

        lastAsciiUpdate = now;
      }
    };

    /*
     * Store animation function.
     */
    animateRef.current = animate;

    /*
     * Start only when visible.
     */
    if (visibleRef.current && !disposed) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    /*
     * ==========================
     * RESIZE
     * ==========================
     */

    const resizeObserver = new ResizeObserver(() => {
      if (disposed) {
        return;
      }

      const newWidth = container.clientWidth;

      const newHeight = container.clientHeight;

      if (!newWidth || !newHeight) {
        return;
      }

      camera.aspect = newWidth / newHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);

      asciiFilter.setSize(newWidth, newHeight);
    });

    resizeObserver.observe(container);

    /*
     * ==========================
     * CLEANUP
     * ==========================
     */

    return () => {
      disposed = true;

      /*
       * Stop RAF.
       */
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);

        animationFrameRef.current = null;
      }

      /*
       * Remove animation ref.
       */
      if (animateRef.current === animate) {
        animateRef.current = null;
      }

      /*
       * Resize observer.
       */
      resizeObserver.disconnect();

      /*
       * Mouse listener.
       */
      if (enableMouse) {
        container.removeEventListener("mousemove", handleMouseMove);
      }

      /*
       * ASCII.
       */
      asciiFilter.dispose();

      if (asciiFilter.domElement.parentNode) {
        asciiFilter.domElement.parentNode.removeChild(asciiFilter.domElement);
      }

      /*
       * Three.js resources.
       */
      geometry.dispose();

      material.dispose();

      texture.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [
    src,

    enableWaves,
    waveStrength,
    waveSpeed,

    distortion,
    distortionSpeed,
    mouseDistortion,

    enableMouse,
    mouseRotation,
    mouseRotationStrength,
    mouseSmoothing,

    asciiFontSize,
    asciiFontFamily,
    asciiFps,
    maxAsciiColumns,

    asciiColorMode,
    asciiColor,
    asciiCharset,
    invertAscii,

    maxPixelRatio,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap');

        .ascii-text-container {
          position: relative;
        }

        .ascii-text-container canvas {
          display: block;
        }
      `}</style>
    </div>
  );
}
