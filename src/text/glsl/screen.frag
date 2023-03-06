precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;

  // canvasの縦長or横長を判定して正規化したuv
  vec2 normalizeUvScale = vec2(min(aspect, 1.0), min(1.0 / aspect, 1.0));
  vec2 normalizeUv = (vUv - 0.5) * normalizeUvScale + 0.5;

  vec2 noisedUv = vec2(snoise2(normalizeUv));

  float n = snoise2(noisedUv * 2.0 + uTime * 0.2) * 0.01;

  // vec3 color = texture2D(uTexture, vUv + n).rgb;
  float r = texture2D(uTexture, vUv + n - 0.001).r;
  float g = texture2D(uTexture, vUv + n + 0.002).g;
  float b = texture2D(uTexture, vUv + n + 0.001).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}