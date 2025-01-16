import { useEffect, useRef } from "react"
import "./Liquid.css"

// https://github.com/PavelDoGreat/WebGL-Fluid-Simulation/

function applyDeviceRatio(size: number) {
    const pixelRatio = window.devicePixelRatio || 1
    return Math.floor(size * pixelRatio)
}

export const LiquidCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        let animationFrameId: number;

        if (canvas) {
            const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
            let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext || WebGLRenderingContext;
            
            const isWebGL2 = !!gl;
            
            if (!isWebGL2) {
                gl = canvas.getContext('webgl', params) as WebGL2RenderingContext || WebGLRenderingContext || canvas.getContext("experimental-webgl", params) as WebGL2RenderingContext || WebGLRenderingContext;
            }
            
            if (!gl) {
                console.error('WebGL not supported!');
                return;
            }
        
            // Set clear color to black
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        
            // Example of creating a simple color shader program (you can extend it with more complex shaders)
            const vertexShaderSource = `
                attribute vec2 a_position;
                void main() {
                    gl_Position = vec4(a_position, 0.0, 1.0);
                }
            `;
            const fragmentShaderSource = `
                precision mediump float;
                void main() {
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
                }
            `;
        
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader!, vertexShaderSource);
            gl.compileShader(vertexShader!);
        
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader!, fragmentShaderSource);
            gl.compileShader(fragmentShader!);
        
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader!);
            gl.attachShader(program, fragmentShader!);
            gl.linkProgram(program);
            gl.useProgram(program);
        
            // Set up geometry
            const vertices = new Float32Array([
                -0.5, -0.5,  // Bottom left
                0.5, -0.5,   // Bottom right
                0.0,  0.5,   // Top
            ]);
            
            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
            const aPosition = gl.getAttribLocation(program, 'a_position');
            gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aPosition);
        
            const render = () => {
                // yep
                resizeCanvas()

                // draw
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
                animationFrameId = requestAnimationFrame(render);
            };

            const resizeCanvas = () => {
                if (!canvas) return;

                const width = applyDeviceRatio(canvas.clientWidth)
                const height = applyDeviceRatio(canvas.clientHeight)
                
                if (canvas.width != width || canvas.height != height) {
                    canvas.width = width;
                    canvas.height = height;
                    gl.viewport(0, 0, width, height);
                }
            }
            
            render();

            return () => {
              cancelAnimationFrame(animationFrameId);
            };
        }
    }, [canvasRef]);

    return <canvas id={"LiquidContainer"} ref={canvasRef}/>
}