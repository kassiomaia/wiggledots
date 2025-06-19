#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
in vec2 v_texCoord;
out vec4 outColor;

void main() {
    float next = texture(u_texture, v_texCoord).a;
    vec3 color = vec3(1.0, 0.4, 0.5);
    outColor = next > 0.0 ? vec4(color.r, color.g, color.b, next) : outColor;
}
