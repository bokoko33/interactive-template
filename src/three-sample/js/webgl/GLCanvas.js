import * as THREE from 'three';

export class GLCanvas {
  constructor({ wrapperEl, el }) {
    this.wrapperEl = wrapperEl;

    this.viewSize = { width: 0, height: 0 };
    this.setupViewSize();

    this.renderer = null;
    this.setupRenderer(el);
  }

  setupViewSize = () => {
    const width = this.wrapperEl.clientWidth;
    const height = this.wrapperEl.clientHeight;

    this.viewSize = { width, height };
  };

  setupRenderer = (el) => {
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({ canvas: el });
    }

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewSize.width, this.viewSize.height);
  };

  offscreenRender = ({ renderTarget, scene, camera }) => {
    this.renderer.setRenderTarget(renderTarget);
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
  };

  render = ({ scene, camera }) => {
    this.renderer.render(scene, camera);
  };

  resize = () => {
    this.setupViewSize();

    this.setupRenderer();
  };
}
