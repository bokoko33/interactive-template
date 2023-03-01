precision mediump float;

struct TextureData {
  sampler2D texture;
  float aspect;
  float scale;
};

uniform vec2 uResolution;
uniform float uProgress;
uniform TextureData uCurrent;
uniform TextureData uNext;

varying vec2 vUv;

vec2 fixUv(vec2 uv, float aspect, float textureAspect) {
  vec2 uvScale = vec2(
    min(aspect / textureAspect, 1.0),
    min((1.0 / aspect) / (1.0 / textureAspect), 1.0)
  );

  return (uv - 0.5) * uvScale + 0.5;
}

void main() {
  float aspect = uResolution.x / uResolution.y;

  vec2 scaledUvCurrent = (vUv - 0.5) / uCurrent.scale + 0.5;
  vec2 textureUvCurrent = fixUv(scaledUvCurrent, aspect, uCurrent.aspect);
  vec3 colorCurrent = texture2D(uCurrent.texture, textureUvCurrent).rgb;

  vec2 scaledUvNext = (vUv - 0.5) / uNext.scale + 0.5;
  vec2 textureUvNext = fixUv(scaledUvNext, aspect, uNext.aspect);
  vec3 colorNext = texture2D(uNext.texture, textureUvNext).rgb;

  vec3 finalColor = mix(colorCurrent, colorNext, uProgress);

  gl_FragColor = vec4(finalColor, 1.0);
}