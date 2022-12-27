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

  offscreenRender = (stage) => {
    this.renderer.setRenderTarget(stage.renderTarget);
    this.renderer.render(stage.scene, stage.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
  };

  render = (stage) => {
    this.renderer.render(stage.scene, stage.camera);
  };

  resize = () => {
    this.setupViewSize();

    this.setupRenderer();
  };
}
