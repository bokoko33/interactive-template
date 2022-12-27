import * as THREE from 'three';
import Stats from 'stats.js';
import { config } from '~/js/webgl/config';
import { Stage } from '~/js/webgl/Stage';
import { ScreenPlane } from '~/js/webgl/ScreenPlane';
// import { SampleObject } from '~/js/webgl/SampleObject';
import { Mouse2D } from '~/js/utils/Mouse2D';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MouseDisplacement } from '~/js/webgl/MouseDisplacement';

export class WebGL {
  constructor({ canvasWrapper, canvas, isDev = false, selfLoop = true }) {
    config.isDev = isDev;

    this.selfLoop = selfLoop; // rafループを外部ループに挿入するか、このclassで実行するか
    this.rafId = 0;

    this.canvasWrapper = canvasWrapper;
    this.canvas = canvas;

    this.viewSize = this.getWrapperElementSize();

    this.renderer = null;
    this.setupRenderer({ viewSize: this.viewSize, canvas });

    this.stage = new Stage({
      viewSize: this.viewSize,
    });

    this.screenPlane = new ScreenPlane({ viewSize: this.viewSize });
    this.screenPlane.mesh.renderOrder = 1;
    this.stage.scene.add(this.screenPlane.mesh);

    // this.sample = new SampleObject();
    // this.stage.scene.add(this.sample.mesh);

    this.lastTime = this.getTime();

    this.mouse = Mouse2D.instance;

    this.mouseDisplacement = new MouseDisplacement({
      viewSize: this.viewSize,
    });

    if (this.selfLoop) {
      this.ticker();
    }

    window.addEventListener('resize', this.resize);

    // development mode
    if (isDev) {
      // stats.js
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);

      // OrbitControls
      this.controls = new OrbitControls(
        this.stage.camera,
        this.renderer.domElement
      );
    }
  }

  getWrapperElementSize = () => {
    const width = this.canvasWrapper.clientWidth;
    const height = this.canvasWrapper.clientHeight;

    return { width, height };
  };

  getTime = () => {
    return performance.now() * 0.001;
  };

  getTimeScale = (deltaTime) => {
    // 60fpsを基準に時間経過のスケール値を返す
    // ex. 60fps → 1.0, 120fps → 0.5
    return deltaTime * 60;
  };

  setupRenderer = ({ viewSize, canvas }) => {
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({ canvas });
    }

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(viewSize.width, viewSize.height);
  };

  offscreenRender = (stage) => {
    this.renderer.setRenderTarget(stage.renderTarget);
    this.renderer.render(stage.scene, stage.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
  };

  render = () => {
    this.renderer.render(this.stage.scene, this.stage.camera);
  };

  ticker = () => {
    this.stats?.begin();

    const time = this.getTime();
    const deltaTime = time - this.lastTime;
    const timScale = this.getTimeScale(deltaTime);
    this.lastTime = time;

    this.mouseDisplacement.update({
      mouse: this.mouse.relativePositionForGL,
    });
    this.offscreenRender(this.mouseDisplacement.stage);

    this.screenPlane?.update({
      time,
      deltaTime,
      timScale,
      displacementTexture: this.mouseDisplacement.stage.renderTarget.texture,
      mouse: this.mouse.normalizedPosition,
    });
    this.sample?.update({ deltaTime });

    this.render();

    this.stats?.end();

    if (this.selfLoop) {
      this.rafId = window.requestAnimationFrame(this.ticker);
    }
  };

  resize = () => {
    const newSize = this.getWrapperElementSize();
    this.stage.resize({ viewSize: newSize, canvas: this.canvas });

    this.mouseDisplacement.resize(newSize);
    this.screenPlane.resize(newSize);
  };

  dispose = () => {
    this.sample?.dispose(this.stage);
    this.screenPlane?.dispose(this.stage);
    this.mouseDisplacement.dispose(this.stage);
    this.stage.dispose();

    window.removeEventListener('resize', this.resize);
  };
}
