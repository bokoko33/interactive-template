import * as THREE from 'three';

export class Stage {
  /**
   * @typedef {object} props
   * @property {object} viewSize {width, height}
   * @property {HTMLCanvasElement} canvas
   * @property {boolean} isOffscreen
   * @property {string} cameraType perspective | perspectiveFit | orthographic
   */
  constructor({
    viewSize,
    isOffscreen = false,
    cameraType = 'perspectiveFit',
  }) {
    this.isOffscreen = isOffscreen;
    this.cameraType = cameraType;

    // offscreen render target
    this.renderTarget = null;
    this.setupRenderTarget(viewSize);

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
    this.camera.far = 5000;

    if (this.cameraType === 'perspectiveFit') {
      // canvasの画角ぴったりなカメラ距離の計算
      const fovRad = (this.camera.fov / 2) * (Math.PI / 180);
      const dist = viewSize.height / 2 / Math.tan(fovRad);
      this.camera.position.z = dist;
    } else {
      // 任意の距離
      this.camera.position.z = 300;
    }

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

  setupRenderTarget = (viewSize) => {
    if (!this.isOffscreen) return;

    if (!this.renderTarget) {
      this.renderTarget = new THREE.WebGLRenderTarget();
    }

    this.renderTarget.setSize(viewSize.width, viewSize.height);
  };

  resize = (viewSize) => {
    this.setupRenderTarget(viewSize);
    this.setupCamera(viewSize);
  };

  dispose = () => {
    this.renderer?.dispose();
    this.offScreenRenderTarget?.dispose();
  };
}
