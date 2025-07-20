import {
    Geometry,
    Mesh,
    Program,
    Renderer,
    Transform,
    Vec2,
    type OGLRenderingContext,
} from "ogl";

interface Options {
    element: HTMLDivElement;
}

export default class Canvas {
    time: number;

    mesh: Mesh;
    program: Program;
    geometry: Geometry;

    scene: Transform;
    renderer: Renderer;
    gl: OGLRenderingContext;

    width: number;
    height: number;

    dom: HTMLElement;

    constructor(options: Options) {
        this.time = 0;

        this.dom = options.element;

        this.width = this.dom.offsetWidth;
        this.height = this.dom.offsetHeight;

        this.renderer = new Renderer();
        this.renderer.setSize(this.width, this.height);

        this.gl = this.renderer.gl;

        this.scene = new Transform();

        this.dom.appendChild(this.gl.canvas);

        this.setupMesh();
        this.setupResize();
        window.requestAnimationFrame(() => {
            this.render();
        });
    }

    setupMesh() {
        this.geometry = new Geometry(this.gl, {
            position: {
                size: 2,
                data: new Float32Array([-1, -1, 3, -1, -1, 3]),
            },
            uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
        });

        this.program = new Program(this.gl, {
            vertex: /* glsl */ `
                attribute vec2 uv;
                attribute vec2 position;

                varying vec2 vUv;

                void main() {
                    gl_Position = vec4(position, 0, 1);

                    // Varyings
                    vUv = uv;
                }
            `,
            fragment: /* glsl */ `
                precision highp float;

                uniform float uTime;
                uniform vec2 uResolution;
                uniform float uPlay;

                varying vec2 vUv;

                const mat2 myt = mat2(.12121212, .13131313, -.13131313, .12121212);
                const vec2 mys = vec2(1e4, 1e6);

                vec2 rhash(vec2 uv) {
                    uv *= myt;
                    uv *= mys;
                    return fract(fract(uv / mys) * uv);
                }

                vec3 hash(vec3 p) {
                return fract(sin(vec3(dot(p, vec3(1.0, 57.0, 113.0)),
                                        dot(p, vec3(57.0, 113.0, 1.0)),
                                        dot(p, vec3(113.0, 1.0, 57.0)))) *
                            43758.5453);
                }

                float voronoi2d(const in vec2 point) {
                    vec2 p = floor(point);
                    vec2 f = fract(point);
                    float res = 0.0;
                    for (int j = -1; j <= 1; j++) {
                        for (int i = -1; i <= 1; i++) {
                        vec2 b = vec2(i, j);
                        vec2 r = vec2(b) - f + rhash(p + b);
                        res += 1. / pow(dot(r, r), 8.);
                        }
                    }
                    return pow(1. / res, 0.0625);
                }

                // Simplex 2D noise
                vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

                float snoise(vec2 v){
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy) );
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1;
                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod(i, 289.0);
                    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                    + i.x + vec3(0.0, i1.x, 1.0 ));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                        dot(x12.zw,x12.zw)), 0.0);
                    m = m*m ;
                    m = m*m ;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                    vec3 g;
                    g.x  = a0.x  * x0.x  + h.x  * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                float random (vec2 st) {
                    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
                        43758.5453123);
                }

                void main() {
                    vec3 WHITE = vec3(1.);
                    vec3 color = vec3(0.);

                    vec2 uv = vUv;

                    float aspect = uResolution.x / uResolution.y;
                    uv = (uv - 0.5) * vec2(aspect, 1.0) + 0.5;

                    vec2 o_uv = uv;

                    float n = snoise(uv - uTime * 0.05 * (uPlay * 2. - 1.));
                    n *= snoise(uv * 12. + uTime * 0.05);

                    float ti = sin(uTime * 0.25) - sin(uTime * 0.12) - sin(ceil(uTime * 0.5));

                    float ipos = random(floor(uv * 40.));
                    float fpos = random(fract(uv * 20.));

                    uv = fract(uv * 20.);

                    float vo = voronoi2d(uv + n - voronoi2d(fpos - uv));

                    float o = random(vec2(ipos) - uTime * 0.00000005);

                    vec2 ip = floor(uv * 15. + n * o) / 15.;

                    float s = length(ip - 0.5) * 2.;
                    s = 1. - smoothstep(0.4, 0.585, s);

                    float t = n - length(ip - 0.5) * 2. * uPlay;
                    t = 1. - smoothstep(0.25, 0.365, t);

                    s -= (t + o); 
                    s += vo * 0.15;

                    color = vec3(s);
                    color = mix(vec3(0.), WHITE, color);

                    color = mix(color , vec3(0.5 + n, 0.2, 0.4), s * uPlay);

                    gl_FragColor = vec4(color, 1.);
                }
            `,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vec2(this.width, this.height) },
                uPlay: { value: 0 },
            },
        });

        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program,
        });
    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.width = this.dom.offsetWidth;
        this.height = this.dom.offsetHeight;

        this.renderer.setSize(this.width, this.height);
        this.program.uniforms.uResolution.value.set(this.width, this.height);
    }

    render() {
        this.time += 0.01;

        this.program.uniforms.uTime.value = this.time;

        this.renderer.render({ scene: this.mesh });

        window.requestAnimationFrame(this.render.bind(this));
    }
}
