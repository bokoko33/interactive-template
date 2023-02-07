precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uSceneTexture;
uniform sampler2D uDisplacementTexture;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;

  // canvasの縦長or横長を判定して正規化したuv
  vec2 normalizeUvScale = vec2(min(aspect, 1.0), min(1.0 / aspect, 1.0));
  vec2 normalizeUv = (vUv - 0.5) * normalizeUvScale + 0.5;

  vec4 displace = texture2D(uDisplacementTexture, vUv);
  float displaceValue = displace.r * snoise2(normalizeUv * 2.0 + uTime) * 0.4;
  
  vec3 color = texture2D(uSceneTexture, vUv + displaceValue).rgb;

  gl_FragColor = vec4(color, 1.0);
}