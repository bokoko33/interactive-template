import * as THREE from 'three';
import vertexShader from '../../glsl/screen.vert';
import fragmentShader from '../../glsl/screen.frag';
// import { GUI } from '~/_lib/GUI';
// import { config } from '~/_lib/config';

export class Screen {
  constructor({ viewSize }) {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(viewSize.width, viewSize.height),
        },
        uTexture: { value: null },
      },
      vertexShader,
      fragmentShader,
      transparent: false,
      depthTest: false,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);
  }

  update = ({ time, texture }) => {
    this.mesh.material.uniforms.uTime.value = time;
    this.mesh.material.uniforms.uTexture.value = texture;
  };

  resize = (viewSize) => {
    this.mesh.material.uniforms.uResolution.value.set(
      viewSize.width,
      viewSize.height
    );
  };
}
