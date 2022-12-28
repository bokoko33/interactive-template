import Stats from 'stats.js';
import { config } from '~/js/webgl/config';
import { Stage } from '~/js/webgl/Stage';
import { ScreenPlane } from '~/js/webgl/ScreenPlane';
import { SampleObject } from '~/js/webgl/SampleObject';
import { Mouse2D } from '~/js/utils/Mouse2D';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MouseDisplacement } from '~/js/webgl/MouseDisplacement';
import { GLCanvas } from '~/js/webgl/GLCanvas';

export class WebGL {
  constructor({ canvasWrapper, canvas, isDev = false, selfLoop = true }) {
    config.isDev = isDev;

    this.selfLoop = selfLoop; // rafループを外部ループに挿入するか、このclassで実行するか
    this.rafId = 0;

    this.glCanvas = new GLCanvas({
      wrapperEl: canvasWrapper,
      el: canvas,
    });

    this.stage = new Stage({
      viewSize: this.glCanvas.viewSize,
      cameraType: 'perspectiveFit',
    });

    this.screenPlane = new ScreenPlane({
      viewSize: this.glCanvas.viewSize,
      // isTransformed: true,
    });
    this.screenPlane.resize({
      viewSize: this.glCanvas.viewSize,
      screenSize: this.stage.calcScreenSize(),
    });

    this.stage.scene.add(this.screenPlane.mesh);

    this.sample = new SampleObject();
    this.stage.scene.add(this.sample.mesh);

    this.lastTime = this.getTime();

    this.mouse = Mouse2D.instance;

    this.mouseDisplacement = new MouseDisplacement({
      viewSize: this.glCanvas.viewSize,
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
        this.glCanvas.renderer.domElement
      );
    }
  }

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
      mouse: this.mouse.relativePositionForGL,
    });
    this.glCanvas.offscreenRender(this.mouseDisplacement.stage);

    this.screenPlane?.update({
      time,
      deltaTime,
      timScale,
      displacementTexture: this.mouseDisplacement.stage.renderTarget.texture,
      mouse: this.mouse.normalizedPosition,
    });
    this.sample?.update({ deltaTime });

    this.glCanvas.render(this.stage);

    this.stats?.end();

    if (this.selfLoop) {
      this.rafId = window.requestAnimationFrame(this.ticker);
    }
  };

  resize = () => {
    this.glCanvas.resize();
    this.stage.resize(this.glCanvas.viewSize);

    this.mouseDisplacement.resize(this.glCanvas.viewSize);
    this.screenPlane.resize({
      viewSize: this.glCanvas.viewSize,
      screenSize: this.stage.calcScreenSize(),
    });
  };

  dispose = () => {
    this.sample?.dispose(this.stage);
    this.screenPlane?.dispose(this.stage);
    this.mouseDisplacement.dispose(this.stage);
    this.stage.dispose();

    window.removeEventListener('resize', this.resize);
  };
}
