import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Stage {
  constructor({ wrapper }) {
    this.canvasWrapper = wrapper;
    this.canvas = wrapper.querySelector('canvas');

    // canvas size
    this.canvasSize = { w: 0, h: 0 };
    this.setupCanvas();

    // renderer
    this.renderer = null;
    this.setupRenderer();

    // camera
    this.camera = null;
    this.setupCamera();

    // scene
    this.scene = new THREE.Scene();

    // plugins
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  getWrapperElementSize = () => {
    const width = this.canvasWrapper.clientWidth;
    const height = this.canvasWrapper.clientHeight;

    return { width, height };
  };

  setupCanvas = () => {
    const { width, height } = this.getWrapperElementSize();

    this.canvasSize.w = width;
    this.canvasSize.h = height;
  };

  setupCamera = () => {
    if (!this.camera) {
      this.camera = new THREE.PerspectiveCamera();
    }

    this.camera.fov = 45;
    this.camera.aspect = this.canvasSize.w / this.canvasSize.h;
    this.camera.near = 0.1;
    this.camera.far = 10000;

    // canvasの画角ぴったりなカメラ距離の計算
    const fovRad = (this.camera.fov / 2) * (Math.PI / 180);
    const dist = this.canvasSize.h / 2 / Math.tan(fovRad);
    this.camera.position.z = dist;

    this.camera.updateProjectionMatrix();
  };

  setupRenderer = () => {
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
      });
    }

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvasSize.w, this.canvasSize.h);
  };

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  resize = () => {
    this.setupCanvas();
    this.setupRenderer();
    this.setupCamera();
  };

  dispose = () => {
    this.renderer?.dispose();
  };
}
