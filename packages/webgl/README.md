# WebGL System

A lightweight TypeScript wrapper for WebGL2 that simplifies common graphics programming tasks. This library provides a clean, object-oriented interface for creating shaders, programs, textures, and framebuffers with built-in error handling.

## Features

- **WebGL2 Context Management**: Automatic context initialization with fallback handling
- **Shader Creation**: Simplified shader compilation with error reporting
- **Program Linking**: Easy shader program creation and linking
- **Texture Management**: Streamlined texture creation with configurable parameters
- **Framebuffer Support**: Simple framebuffer creation for render-to-texture operations
- **Responsive Canvas**: Automatic canvas resizing with grid-based scaling
- **Error Handling**: Comprehensive error checking and logging throughout

## Installation

```bash
npm install webgl-system
```

## Quick Start

```typescript
import { WebGLSystem } from 'webgl-system';

// Get your canvas element
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;

// Initialize the WebGL system
const webglSystem = new WebGLSystem(canvas);

// Get the WebGL context
const gl = webglSystem.getGL();
if (!gl) {
  console.error('WebGL2 not supported');
}
```

## API Reference

### Constructor

```typescript
new WebGLSystem(canvas: HTMLCanvasElement)
```

Creates a new WebGL system instance and initializes the WebGL2 context.

**Parameters:**
- `canvas`: The HTML canvas element to use for rendering

**Throws:**
- `Error`: If the canvas is undefined

### Methods

#### `createShader(type: GLenum, source: string): WebGLShader | null`

Creates and compiles a shader from source code.

**Parameters:**
- `type`: Shader type (`gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`)
- `source`: GLSL shader source code as a string

**Returns:**
- Compiled `WebGLShader` object or `null` if compilation failed

**Example:**
```typescript
const vertexShaderSource = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`;

const vertexShader = webglSystem.createShader(gl.VERTEX_SHADER, vertexShaderSource);
```

#### `createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null`

Creates and links a shader program from vertex and fragment shaders.

**Parameters:**
- `vertexShader`: Compiled vertex shader
- `fragmentShader`: Compiled fragment shader

**Returns:**
- Linked `WebGLProgram` object or `null` if linking failed

**Example:**
```typescript
const program = webglSystem.createProgram(vertexShader, fragmentShader);
if (program) {
  gl.useProgram(program);
}
```

#### `createTexture(width: number, height: number, data?: ArrayBufferView | null): WebGLTexture | null`

Creates a 2D texture with specified dimensions and optional data.

**Parameters:**
- `width`: Texture width in pixels
- `height`: Texture height in pixels
- `data`: Optional texture data (defaults to `null` for empty texture)

**Returns:**
- `WebGLTexture` object or `null` if creation failed

**Texture Configuration:**
- Format: RGBA
- Type: UNSIGNED_BYTE
- Min/Mag Filter: NEAREST
- Wrap Mode: REPEAT

**Example:**
```typescript
// Create empty texture
const texture = webglSystem.createTexture(512, 512);

// Create texture with data
const imageData = new Uint8Array(width * height * 4); // RGBA
const textureWithData = webglSystem.createTexture(width, height, imageData);
```

#### `createFramebuffer(texture: WebGLTexture): WebGLFramebuffer | null`

Creates a framebuffer and attaches the provided texture as a color attachment.

**Parameters:**
- `texture`: Texture to attach as COLOR_ATTACHMENT0

**Returns:**
- `WebGLFramebuffer` object or `null` if creation failed

**Example:**
```typescript
const renderTexture = webglSystem.createTexture(512, 512);
const framebuffer = webglSystem.createFramebuffer(renderTexture);

// Render to texture
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
// ... perform rendering ...
gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Back to screen
```

#### `getGL(): WebGL2RenderingContext | null`

Returns the WebGL2 rendering context.

**Returns:**
- WebGL2 context or `null` if initialization failed

#### `getCanvas(): HTMLCanvasElement`

Returns the canvas element associated with this WebGL system.

**Returns:**
- The HTML canvas element

#### `resize(): void`

Resizes the canvas and updates the WebGL viewport. Called automatically during initialization.

**Behavior:**
- Limits canvas size to maximum 1920x1080
- Applies grid-based scaling for reasonable resolution
- Updates WebGL viewport to match canvas dimensions

## Usage Examples

### Basic Triangle Rendering

```typescript
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const webglSystem = new WebGLSystem(canvas);
const gl = webglSystem.getGL();

if (!gl) {
  throw new Error('WebGL2 not supported');
}

// Vertex shader
const vertexShaderSource = `#version 300 es
  in vec4 position;
  void main() {
    gl_Position = position;
  }
`;

// Fragment shader
const fragmentShaderSource = `#version 300 es
  precision mediump float;
  out vec4 fragColor;
  void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

// Create shaders and program
const vertexShader = webglSystem.createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = webglSystem.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

if (vertexShader && fragmentShader) {
  const program = webglSystem.createProgram(vertexShader, fragmentShader);
  if (program) {
    gl.useProgram(program);
    // Continue with rendering setup...
  }
}
```

### Render-to-Texture

```typescript
// Create texture and framebuffer for off-screen rendering
const renderTexture = webglSystem.createTexture(512, 512);
const framebuffer = webglSystem.createFramebuffer(renderTexture);

if (renderTexture && framebuffer) {
  // Render to texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.viewport(0, 0, 512, 512);
  
  // Clear and render your scene
  gl.clear(gl.COLOR_BUFFER_BIT);
  // ... rendering commands ...
  
  // Switch back to screen
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, canvas.width, canvas.height);
  
  // Use renderTexture for further processing
}
```

## Browser Support

Requires WebGL2 support:
- Chrome 56+
- Firefox 51+
- Safari 15+
- Edge 79+

## Error Handling

The library includes comprehensive error checking:
- WebGL2 context availability
- Shader compilation errors
- Program linking errors
- Resource creation failures
- Framebuffer completeness

All errors are logged to the console with descriptive messages.

# Netlify (Static Site Hosting)

This project has been deployed to Netlify for easy hosting and sharing. You can view the live demo and documentation at:

https://wiggledots.netlify.app/

## License

MIT License - see LICENSE file for details.
