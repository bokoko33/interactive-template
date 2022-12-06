import * as THREE from 'three';
import vertexShader from '~/glsl/plane.vert';
import fragmentShader from '~/glsl/plane.frag';
import GUI from 'lil-gui';

/**
 * canvas全体を覆うPlane Mesh
 */
export class ScreenPlane {
  constructor({ canvasSize }) {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(canvasSize.w, canvasSize.h) },
        uTexture1: { value: loader.load('/images/sample1.jpg') },
        uTexture2: { value: loader.load('/images/sample2.jpg') },
      },
      vertexShader,
      fragmentShader,
      transparent: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);

    // 複数テクスチャを一括で扱いたい場合
    // const texturePaths = ['/images/sample1.jpg', '/images/sample2.jpg'];
    // loader.load(texturePaths).then((textures) => {
    //   // 全部読み込まれた後
    // });

    // たとえばuProgress.valueを更新したい場合、第一引数がobject, 第二引数がプロパティ（文字列）になる
    const gui = new GUI();
    gui
      .add(this.mesh.material.uniforms.uProgress, 'value', 0.0, 1.0, 0.01)
      .name('progress');
  }

  update = ({ time, mouse }) => {
    this.mesh.material.uniforms.uTime.value = time;
    this.mesh.material.uniforms.uMouse.value.set(mouse.x, -mouse.y);
  };

  resize = (size) => {
    this.mesh.material.uniforms.uResolution.value.set(size.w, size.h);
  };
}
