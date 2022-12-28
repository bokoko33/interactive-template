uniform bool uIsTransformed;

varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = uIsTransformed ? projectionMatrix * modelViewMatrix * vec4(position, 1.0) : vec4(position, 1.0);
}