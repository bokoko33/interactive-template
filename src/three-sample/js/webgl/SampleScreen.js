import * as THREE from 'three';
import vertexShader from '../../glsl/SampleScreen.vert';
import fragmentShader from '../../glsl/SampleScreen.frag';
import { GUI } from '~/_lib/GUI';
import { config } from '~/_lib/config';

/**
 * canvas全体を覆うPlane Mesh
 * 主にfragmentShaderでサッと何かする用
 */
export class SampleScreen {
  constructor({ viewSize }) {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: {
          value: new THREE.Vector2(viewSize.width, viewSize.height),
        },
        uTexture1: {
          value: {
            texture: null,
            aspect: 1,
          },
        },
        uTexture2: {
          value: {
            texture: null,
            aspect: 1,
          },
        },
      },
      vertexShader,
      fragmentShader,
      transparent: false,
      depthTest: false,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);

    // テクスチャとそのアスペクトを後から挿入
    const loader = new THREE.TextureLoader();
    loader.load('/images/sample1.jpg', (texture) => {
      const aspect = texture.image.width / texture.image.height;
      this.mesh.material.uniforms.uTexture1.value = { texture, aspect };
    });
    loader.load('/images/sample2.jpg', (texture) => {
      const aspect = texture.image.width / texture.image.height;
      this.mesh.material.uniforms.uTexture2.value = { texture, aspect };
    });

    // 複数テクスチャを一括で扱いたい場合
    // const texturePaths = ['/images/sample1.jpg', '/images/sample2.jpg'];
    // loader.load(texturePaths).then((textures) => {
    //   // 全部読み込まれた後
    // });

    if (config.isDev) {
      // たとえばuProgress.valueを更新したい場合、第一引数がobject, 第二引数がプロパティ（文字列）になる
      GUI.instance
        .add(this.mesh.material.uniforms.uProgress, 'value', 0.0, 1.0, 0.01)
        .name('progress');
    }
  }

  update = ({ time, mouse }) => {
    this.mesh.material.uniforms.uTime.value = time;
    this.mesh.material.uniforms.uMouse.value.set(mouse.x, mouse.y);
  };

  resize = (viewSize) => {
    this.mesh.material.uniforms.uResolution.value.set(
      viewSize.width,
      viewSize.height
    );
  };
}
