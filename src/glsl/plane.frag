precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uTexture1;
uniform float uTexture1Aspect;
uniform sampler2D uTexture2;
uniform float uTexture2Aspect;


varying vec2 vUv;

float circle(vec2 uv, vec2 pos, float r, float edge) {
 return 1.0 - smoothstep(r - edge * 0.5, r + edge * 0.5, length(uv - pos));
}

void main() {
  float time = uTime;

  float aspect = uResolution.x / uResolution.y;

  // ---- 画像をobject-fit: cover 表示するためのuvを作る（2枚分） ----
  vec2 textureUv1Scale = vec2(
    min(aspect / uTexture1Aspect, 1.0),
    min((1.0 / aspect) / (1.0 / uTexture1Aspect), 1.0)
  );
  vec2 texture1Uv = (vUv - 0.5) * textureUv1Scale + 0.5;

  vec2 textureUv2Scale = vec2(
    min(aspect / uTexture2Aspect, 1.0),
    min((1.0 / aspect) / (1.0 / uTexture2Aspect), 1.0)
  );
  vec2 texture2Uv = (vUv - 0.5) * textureUv2Scale + 0.5;

  // ---- ----

  // canvasの縦長or横長を判定して正規化したuv
  vec2 normalizeUvScale = vec2(min(aspect, 1.0), min(1.0 / aspect, 1.0));
  vec2 normalizeUv = (vUv - 0.5) * normalizeUvScale + 0.5;
  
  vec2 center = vec2(0.5);
  vec2 mouse = uMouse * normalizeUvScale * 0.5 + center; // uMouseが-1.0 ~ 1.0 なので、uv座標に合わせて0.0 ~ 1.0に

  float circle = circle(normalizeUv, mouse, 0.1, 0.1);
  float noiseCircle = snoise2(normalizeUv * 2.0 + time * 0.1) * circle;
  
  vec3 color1 = texture2D(uTexture1, texture1Uv + noiseCircle).rgb;
  vec3 color2 = texture2D(uTexture2, texture2Uv + noiseCircle).rgb;
  vec3 finalColor = mix(color1, color2, uProgress);

  gl_FragColor = vec4(finalColor, 1.0);
}