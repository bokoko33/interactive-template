import * as THREE from 'three';

export class Canvas2D {
  constructor({ viewSize }) {
    this.canvas = document.createElement('canvas');
    this.dpr = window.devicePixelRatio;

    this.setSize(viewSize);

    this.ctx = this.canvas.getContext('2d');

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
  }

  setSize = (viewSize) => {
    this.canvas.width = viewSize.width * this.dpr;
    this.canvas.height = viewSize.height * this.dpr;
  };

  update = ({ time }) => {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(
      this.canvas.width / 2 + (Math.cos(time * 6) - 0.5) * 100,
      this.canvas.height * 0.4,
      300,
      300
    );

    this.texture.needsUpdate = true;
  };

  resize = (viewSize) => {
    this.setSize(viewSize);
  };
}
