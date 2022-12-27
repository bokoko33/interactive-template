import * as THREE from 'three';

export class Stage {
  /**
   * @typedef {object} props
   * @property {object} viewSize {width, height}
   * @property {HTMLCanvasElement} canvas
   * @property {boolean} isOffscreen
   * @property {string} cameraType perspective | perspectiveFit | orthographic
   */
  constructor({ viewSize, canvas, cameraType = 'perspectiveFit' }) {
    this.cameraType = cameraType;
    this.isOffscreen = !canvas;

    // renderer (onscreen only)
    this.renderer = null;
    this.setupRenderer({ viewSize, canvas });

    // offscreen render target (offscreen only)
    this.offScreenRenderTarget = null;
    this.setupOffscreenRenderTarget(viewSize);

    // camera
    this.camera = null;
    this.setupCamera(viewSize);

    // scene
    this.scene = new THREE.Scene();
  }

  setupCamera = (viewSize) => {
    this.cameraType === 'orthographic'
      ? this.setupOrthographicCamera(viewSize)
      : this.setupPerspectiveCamera(viewSize);
  };

  setupPerspectiveCamera = (viewSize) => {
    if (!this.camera) {
      this.camera = new THREE.PerspectiveCamera();
    }

    this.camera.fov = 45;
    this.camera.aspect = viewSize.width / viewSize.height;
    this.camera.near = 0.1;
    this.camera.far = 10000;

    // canvasの画角ぴったりなカメラ距離の計算
    const fovRad = (this.camera.fov / 2) * (Math.PI / 180);
    const dist = viewSize.height / 2 / Math.tan(fovRad);
    this.camera.position.z = dist;

    this.camera.updateProjectionMatrix();
  };

  setupOrthographicCamera = (viewSize) => {
    if (!this.camera) {
      this.camera = new THREE.OrthographicCamera();
    }

    // canvasにフィットするサイズを計算
    const frustumSize = viewSize.height;
    const aspect = viewSize.width / viewSize.height;
    const [w, h] = [(frustumSize * aspect) / 2, frustumSize / 2];

    this.camera.left = -w;
    this.camera.right = w;
    this.camera.top = h;
    this.camera.bottom = -h;
    this.camera.position.set(0, 0, 2);

    this.camera.updateProjectionMatrix();
  };

  setupRenderer = ({ viewSize, canvas }) => {
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({ canvas });
    }

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(viewSize.width, viewSize.height);
  };

  setupOffscreenRenderTarget = (viewSize) => {
    if (!this.isOffscreen) return;

    if (!this.offScreenRenderTarget) {
      this.offScreenRenderTarget = new THREE.WebGLRenderTarget();
    }

    this.offScreenRenderTarget.setSize(viewSize.width, viewSize.height);
  };

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  resize = ({ viewSize, canvas }) => {
    this.setupRenderer({ viewSize, canvas });
    this.setupOffscreenRenderTarget(viewSize);
    this.setupCamera(viewSize);
  };

  dispose = () => {
    this.renderer?.dispose();
    this.offScreenRenderTarget?.dispose();
  };
}
