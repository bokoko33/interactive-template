import * as THREE from 'three';
import vertexShader from '~/glsl/plane.vert';
import fragmentShader from '~/glsl/plane.frag';
import { GUI } from '~/js/utils/GUI';
import { config } from '~/js/webgl/config';

/**
 * canvas全体を覆うPlane Mesh
 *
 * 2×2サイズで座標変換を行わずにcanvasにフィットさせる方法と、
 * 座標変換を行いつつcanvasにフィットするサイズに変形する方法の両方に対応。
 *
 */
export class ScreenPlane {
  constructor({ viewSize, isTransformed = false }) {
    this.isTransformed = isTransformed;

    const defaultSize = isTransformed ? 1 : 2;
    const geometry = new THREE.PlaneGeometry(defaultSize, defaultSize);
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
        uDisplacementTexture: { value: null },
        uIsTransformed: { value: isTransformed },
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

  update = ({ time, mouse, displacementTexture }) => {
    this.mesh.material.uniforms.uTime.value = time;
    this.mesh.material.uniforms.uDisplacementTexture.value =
      displacementTexture;
    this.mesh.material.uniforms.uMouse.value.set(mouse.x, mouse.y);
  };

  resize = ({ screenSize, viewSize }) => {
    const size = this.isTransformed ? screenSize : viewSize;
    if (this.isTransformed) {
      this.mesh.scale.set(size.width, size.height, 1);
    }

    this.mesh.material.uniforms.uResolution.value.set(size.width, size.height);
  };

  dispose = (stage) => {
    stage.scene?.remove(this.mesh);

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  };
}
