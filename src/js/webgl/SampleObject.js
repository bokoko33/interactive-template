import * as THREE from 'three';

export class SampleObject {
  constructor() {
    this.geometry = new THREE.BoxGeometry(100, 100, 100);
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  update = ({ deltaTime }) => {
    this.mesh.rotation.y += 2 * deltaTime;
  };

  dispose = () => {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  };
}
