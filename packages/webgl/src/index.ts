export class WebGLSystem {
  private readonly canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext | null = null;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error(`the canvas is undefined`);
    }
    this.canvas = canvas;
    this.init();
  }

  public createShader(type: GLenum, source: string): WebGLShader | null {
    if (!this.gl) {
      console.error("WebGL context not initialized");
      return null;
    }

    const shader = this.gl.createShader(type);
    if (!shader) {
      console.error("Failed to create shader");
      return null;
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  public createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ): WebGLProgram | null {
    if (!this.gl) {
      console.error("WebGL context not initialized");
      return null;
    }

    const program = this.gl.createProgram();
    if (!program) {
      console.error("Failed to create program");
      return null;
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error("Program link error:", this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  public createTexture(
    width: number,
    height: number,
    data: ArrayBufferView | null = null,
  ): WebGLTexture | null {
    if (!this.gl) {
      console.error("WebGL context not initialized");
      return null;
    }

    const texture = this.gl.createTexture();
    if (!texture) {
      console.error("Failed to create texture");
      return null;
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      width,
      height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      data,
    );

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT,
    );

    return texture;
  }

  public createFramebuffer(texture: WebGLTexture): WebGLFramebuffer | null {
    if (!this.gl) {
      console.error("WebGL context not initialized");
      return null;
    }

    const framebuffer = this.gl.createFramebuffer();
    if (!framebuffer) {
      console.error("Failed to create framebuffer");
      return null;
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0,
    );

    const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
    if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
      console.error("Framebuffer not complete:", status);
    }

    return framebuffer;
  }

  public getGL(): WebGL2RenderingContext | null {
    return this.gl;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  private init(): boolean {
    this.gl = this.canvas.getContext("webgl2");

    if (!this.gl) {
      console.error("WebGL2 not supported");
      return false;
    }

    this.resize();

    console.log("WebGL2 initialized successfully");
    return true;
  }

  public resize(): void {
    this.canvas.width = Math.min(window.innerWidth, 1920);
    this.canvas.height = Math.min(window.innerHeight, 1080);

    // Make it a reasonable grid size
    const scale = Math.max(
      1,
      Math.floor(Math.min(this.canvas.width, this.canvas.height) / 100),
    );
    this.canvas.width = Math.floor(this.canvas.width / scale);
    this.canvas.height = Math.floor(this.canvas.height / scale);

    if (this.gl) {
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
