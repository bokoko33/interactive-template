import * as THREE from 'three';

export class SampleObject {
  constructor() {
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
  }

  update = ({ deltaTime }) => {
    this.mesh.rotation.y += 2 * deltaTime;
  };

  dispose = (stage) => {
    stage.scene?.remove(this.mesh);

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  };
}
