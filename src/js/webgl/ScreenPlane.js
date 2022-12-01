import * as THREE from 'three';
import vertexShader from '~/glsl/plane.vert?raw';
import fragmentShader from '~/glsl/plane.frag?raw';

/**
 * canvas全体を覆うPlane Mesh
 */
export class ScreenPlane {
  constructor({ canvasSize }) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/images/sample1.jpg');

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(canvasSize.w, canvasSize.h) },
        uTexture: { value: texture },
      },
      vertexShader,
      fragmentShader,
      transparent: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);
  }

  update = ({ time, mouse }) => {
    this.mesh.material.uniforms.uTime.value = time;
    this.mesh.material.uniforms.uMouse.value.set(mouse.x, -mouse.y);
  };

  resize = (size) => {
    this.mesh.material.uniforms.uResolution.value.set(size.w, size.h);
  };
}
