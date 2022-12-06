precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

varying vec2 vUv;

float circle(vec2 uv, vec2 pos, float r, float edge) {
 return 1.0 - smoothstep(r - edge * 0.5, r + edge * 0.5, length(uv - pos));
}

void main() {
  float time = uTime;
  vec2 uv = vUv;

  // canvasの縦長or横長を判定して正規化したuv
  vec2 normalizeUvScale = vec2(
    min((uResolution.x / uResolution.y), 1.0),
    min((uResolution.y / uResolution.x), 1.0)
  );
  uv = (uv - 0.5) * normalizeUvScale + 0.5;
  
  vec2 center = vec2(0.5);
  vec2 mouse = uMouse * normalizeUvScale * 0.5 + center; // uMouseが-1.0 ~ 1.0 なので、uv座標に合わせて0.0 ~ 1.0に

  float circle = circle(uv, mouse, 0.1, 0.1);
  float noiseCircle = snoise2(uv * 2.0 + time * 0.1) * circle;
  vec3 color1 = texture2D(uTexture1, uv + noiseCircle).rgb;
  vec3 color2 = texture2D(uTexture2, uv + noiseCircle).rgb;
  vec3 finalColor = mix(color1, color2, uProgress);

  gl_FragColor = vec4(finalColor, 1.0);
}