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

    this.stage = new Stage({
      viewSize: this.viewSize,
      canvas: this.canvas,
    });

    this.screenPlane = new ScreenPlane({ viewSize: this.viewSize });
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
        this.stage.renderer.domElement
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

  ticker = () => {
    this.stats?.begin();

    const time = this.getTime();
    const deltaTime = time - this.lastTime;
    const timScale = this.getTimeScale(deltaTime);
    this.lastTime = time;

    this.mouseDisplacement.update({
      gl: this.stage.renderer,
      mouse: this.mouse.relativePositionForGL,
    });

    this.screenPlane.update({
      time,
      deltaTime,
      timScale,
      displacementTexture:
        this.mouseDisplacement.stage.offScreenRenderTarget.texture,
      mouse: this.mouse.normalizedPosition,
    });
    // this.sample.update({ deltaTime });

    this.stage.render();

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
    this.screenPlane.dispose(this.stage);
    this.mouseDisplacement.dispose(this.stage);
    this.stage.dispose();

    window.removeEventListener('resize', this.resize);
  };
}
