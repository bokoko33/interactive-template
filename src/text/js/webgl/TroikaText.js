import * as THREE from 'three';
import { Text } from 'troika-three-text';
// import { GUI } from '~/_lib/GUI';
// import { config } from '~/_lib/config';

export class TroikaText {
  constructor({ viewSize }) {
    this.fbo = new THREE.WebGLRenderTarget(
      viewSize.width * window.devicePixelRatio,
      viewSize.height * window.devicePixelRatio
    );
    this.scene = new THREE.Scene();

    this.mesh = new Text();
    this.mesh.text = 'Love Three.js';
    this.mesh.fontSize = 120;
    this.mesh.textAlign = 'center';
    this.mesh.anchorX = 'center';
    this.mesh.anchorY = 'center';
    this.mesh.color = 0xffffff;

    this.scene.add(this.mesh);
  }

  update = () => {
    this.mesh.sync();
  };

  resize = (viewSize) => {
    this.fbo.setSize(
      viewSize.width * window.devicePixelRatio,
      viewSize.height * window.devicePixelRatio
    );
  };
}
