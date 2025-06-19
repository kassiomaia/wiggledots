import {WebGLSystem} from "@wiggledots/webgl";

// @ts-ignore
import render from "./shaders/render.glsl?raw";
// @ts-ignore
import vertex from "./shaders/vertex.glsl?raw";

import {type State} from "./State";
import {TextureConverter} from "./TextureConverter";

export class Renderer {
  private readonly webgl: WebGLSystem;
  private readonly gl: WebGL2RenderingContext | null;
  private canvas: HTMLCanvasElement;
  private renderProgram: WebGLProgram | null = null;
  private readTexture: WebGLTexture | null = null;
  private writeTexture: WebGLTexture | null = null;
  private readFrameBuffer: WebGLFramebuffer | null = null;
  private writeFrameBuffer: WebGLFramebuffer | null = null;
  private vertexArray: WebGLVertexArrayObject | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  
  constructor(webglSystem: WebGLSystem) {
    this.webgl = webglSystem;
    this.gl = webglSystem.getGL();
    this.canvas = webglSystem.getCanvas();
    this.init();
  }
  
  init(): boolean {
    if (!this.gl) return false;
    
    // Create shaders and programs
    const vertexShader = this.webgl.createShader(this.gl.VERTEX_SHADER, vertex);
    const renderFragmentShader = this.webgl.createShader(
      this.gl.FRAGMENT_SHADER,
      render,
    );
    
    if (!vertexShader || !renderFragmentShader) {
      console.error("Failed to create shaders");
      return false;
    }
    
    this.renderProgram = this.webgl.createProgram(
      vertexShader,
      renderFragmentShader,
    );
    
    if (!this.renderProgram) {
      console.error("Failed to create programs");
      return false;
    }
    
    this.initVertexBuffer();
    this.initTextures();
    
    return true;
  }
  
  public update(state: State): void {
    if (
      !this.gl || !this.renderProgram || !this.writeFrameBuffer ||
      !this.readTexture
    ) return;
    
    this.resetTexture(TextureConverter.toData(state));
    
    // Step 1: Compute next state
    this.gl.useProgram(this.renderProgram);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.writeFrameBuffer);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.readTexture);
    
    const resolutionLocation = this.gl.getUniformLocation(
      this.renderProgram,
      "u_resolution",
    );
    if (resolutionLocation) {
      this.gl.uniform2f(
        resolutionLocation,
        this.canvas.width,
        this.canvas.height,
      );
    }
    
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    
    // Step 2: Swap textures
    [this.readTexture, this.writeTexture] = [
      this.writeTexture,
      this.readTexture,
    ];
    [this.readFrameBuffer, this.writeFrameBuffer] = [
      this.writeFrameBuffer,
      this.readFrameBuffer,
    ];
  }
  
  public render(): void {
    if (!this.gl || !this.renderProgram || !this.readTexture) return;
    
    this.gl.useProgram(this.renderProgram);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.readTexture);
    
    const resolutionLocation = this.gl.getUniformLocation(
      this.renderProgram,
      "u_resolution",
    );
    if (resolutionLocation) {
      this.gl.uniform2f(
        resolutionLocation,
        this.canvas.width,
        this.canvas.height,
      );
    }
    
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
  
  private initVertexBuffer(): void {
    if (!this.gl || !this.renderProgram) return;
    
    const positions = new Float32Array([
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      1,
    ]);
    
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    
    this.vertexArray = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vertexArray);
    
    // Setup vertex attributes for both programs
    [this.renderProgram].forEach((prog: WebGLProgram) => {
      if (!this.gl) return;
      
      this.gl.useProgram(prog);
      const positionLocation = this.gl.getAttribLocation(prog, "a_position");
      this.gl.enableVertexAttribArray(positionLocation);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
      this.gl.vertexAttribPointer(
        positionLocation,
        2,
        this.gl.FLOAT,
        false,
        0,
        0,
      );
      
      const textureLocation = this.gl.getUniformLocation(prog, "u_texture");
      this.gl.uniform1i(textureLocation, 0);
    });
  }
  
  private initTextures(): void {
    if (!this.webgl) return;
    
    this.readTexture = this.webgl.createTexture(
      this.canvas.width,
      this.canvas.height,
    );
    this.writeTexture = this.webgl.createTexture(
      this.canvas.width,
      this.canvas.height,
    );
    
    if (this.readTexture && this.writeTexture) {
      this.readFrameBuffer = this.webgl.createFramebuffer(this.readTexture);
      this.writeFrameBuffer = this.webgl.createFramebuffer(this.writeTexture);
    }
  }
  
  private resetTexture(data: Uint8Array): void {
    if (!this.gl || !this.readTexture) return;
    
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.readTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.canvas.width,
      this.canvas.height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      data,
    );
  }
}
