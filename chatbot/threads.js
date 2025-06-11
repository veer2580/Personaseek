// Threads effect implementation
class Threads {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            color: options.color || [1, 1, 1],
            amplitude: options.amplitude || 1,
            distance: options.distance || 0,
            enableMouseInteraction: options.enableMouseInteraction || false
        };

        console.log('Threads initializing with options:', this.options);
        this.init();
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        
        // Try to get WebGL context with more options
        this.gl = this.canvas.getContext('webgl', { 
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        }) || this.canvas.getContext('experimental-webgl', {
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        });

        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        console.log('WebGL context created successfully');

        // Set up WebGL
        this.gl.clearColor(0, 0, 0, 0); // Transparent black clear color
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        // Create shaders (using original shaders now)
        this.program = this.createProgram(vertexShader, fragmentShader);
        if (!this.program) {
            console.error('Failed to create shader program');
            return;
        }
        this.gl.useProgram(this.program);

        // Set up geometry
        this.setupGeometry();
        
        // Set up uniforms (re-introducing all uniforms)
        this.setupUniforms();

        // Set up event listeners
        this.setupEventListeners();

        // Start animation
        this.animate();
    }

    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        const vShader = this.createShader(this.gl.VERTEX_SHADER, vertexShader);
        const fShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShader);

        if (!vShader || !fShader) {
            console.error('Failed to create shaders');
            return null;
        }

        this.gl.attachShader(program, vShader);
        this.gl.attachShader(program, fShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize shader program:', this.gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    setupGeometry() {
        // Create a simple triangle that covers the entire canvas
        const vertices = new Float32Array([
            -1, -1,
            3, -1,
            -1, 3
        ]);

        const uvs = new Float32Array([
            0, 0,
            2, 0,
            0, 2
        ]);

        // Position attribute
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        
        const positionLocation = this.gl.getAttribLocation(this.program, 'position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        // UV attribute
        this.uvBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, uvs, this.gl.STATIC_DRAW);
        
        const uvLocation = this.gl.getAttribLocation(this.program, 'uv');
        this.gl.enableVertexAttribArray(uvLocation);
        this.gl.vertexAttribPointer(uvLocation, 2, this.gl.FLOAT, false, 0, 0);
    }

    setupUniforms() {
        this.uniforms = {
            iTime: this.gl.getUniformLocation(this.program, 'iTime'),
            iResolution: this.gl.getUniformLocation(this.program, 'iResolution'),
            uColor: this.gl.getUniformLocation(this.program, 'uColor'),
            uAmplitude: this.gl.getUniformLocation(this.program, 'uAmplitude'),
            uDistance: this.gl.getUniformLocation(this.program, 'uDistance'),
            uMouse: this.gl.getUniformLocation(this.program, 'uMouse')
        };

        this.currentMouse = [0.5, 0.5];
        this.targetMouse = [0.5, 0.5];
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        this.resize();

        if (this.options.enableMouseInteraction) {
            this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
        }
    }

    resize() {
        const { clientWidth, clientHeight } = this.container;
        this.canvas.width = clientWidth;
        this.canvas.height = clientHeight;
        this.gl.viewport(0, 0, clientWidth, clientHeight);
        console.log('Canvas resized to:', clientWidth, 'x', clientHeight);
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        this.targetMouse = [x, y];
    }

    handleMouseLeave() {
        this.targetMouse = [0.5, 0.5];
    }

    animate() {
        if (this.options.enableMouseInteraction) {
            const smoothing = 0.05;
            this.currentMouse[0] += smoothing * (this.targetMouse[0] - this.currentMouse[0]);
            this.currentMouse[1] += smoothing * (this.targetMouse[1] - this.currentMouse[1]);
        }

        // Update uniforms
        this.gl.uniform1f(this.uniforms.iTime, performance.now() * 0.001);
        this.gl.uniform3f(this.uniforms.iResolution, this.canvas.width, this.canvas.height, this.canvas.width / this.canvas.height);
        this.gl.uniform3f(this.uniforms.uColor, ...this.options.color);
        this.gl.uniform1f(this.uniforms.uAmplitude, this.options.amplitude);
        this.gl.uniform1f(this.uniforms.uDistance, this.options.distance);
        this.gl.uniform2f(this.uniforms.uMouse, this.currentMouse[0], this.currentMouse[1]);

        // Clear the canvas
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Draw
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);

        requestAnimationFrame(() => this.animate());
    }
}

// Shader code
const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = 40;
const float u_line_width = 15.0; // Adjusted for better visibility
const float u_line_blur = 0.5; // Reduced for sharper lines

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
    float split_offset = (perc * 0.4);
    float split_point = 0.1 + split_offset;

    float amplitude_normal = smoothstep(split_point, 0.7, st.x);
    float amplitude_strength = 0.5;
    float finalAmplitude = amplitude_normal * amplitude_strength
                           * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

    float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
    float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
    );

    float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

    float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
    );

    float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
    );

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    float line_strength = 1.0;
    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count);
        line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
            (PI * 1.0) * p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance
        ));
    }

    float colorVal = 1.0 - line_strength;
    fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`; 