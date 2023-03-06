precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;

  // canvasの縦長or横長を判定して正規化したuv
  vec2 normalizeUvScale = vec2(min(aspect, 1.0), min(1.0 / aspect, 1.0));
  vec2 normalizeUv = (vUv - 0.5) * normalizeUvScale + 0.5;

  vec2 noisedUv = vec2(snoise2(normalizeUv * 0.4));

  float n1 = snoise2(noisedUv * 3.0 + uTime * 0.4);
  // float n2 = snoise2(noisedUv * 1.5 + uTime * 0.2);

  // float n = mix(n1, n2, 0.5);

  vec3 color = vec3(n1);

  gl_FragColor = vec4(color, 1.0);
}