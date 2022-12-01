precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uTexture;

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

  vec3 texture = texture2D(uTexture, uv).rgb;

  float circle = circle(uv, mouse, 0.1, 0.001) * snoise2(uv);

  vec3 color = texture + circle;

  gl_FragColor = vec4(color, 1.0);
}