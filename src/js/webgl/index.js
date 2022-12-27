import { Stage } from '~/js/webgl/Stage';
import { ScreenPlane } from '~/js/webgl/ScreenPlane';
// import { SampleObject } from '~/js/webgl/SampleObject';
import { Mouse2D } from '~/js/utils/Mouse2D';
import Stats from 'stats.js';
import { MouseDisplacement } from '~/js/webgl/MouseDisplacement';

export class WebGL {
  constructor(props = {}) {
    // rafループを外部ループに挿入するか、このclassで実行するか
    this.selfLoop = props.selfLoop ?? true;
    this.rafId = 0;

    const canvasWrapperEl = document.querySelector('.canvasWrapper');
    this.stage = new Stage({ wrapper: canvasWrapperEl });

    this.screenPlane = new ScreenPlane({ canvasSize: this.stage.canvasSize });
    this.stage.scene.add(this.screenPlane.mesh);

    // this.sample = new SampleObject();
    // this.stage.scene.add(this.sample.mesh);

    this.lastTime = this.getTime();

    this.mouse = Mouse2D.instance;

    this.mouseDisplacement = new MouseDisplacement({
      canvasSize: this.stage.canvasSize,
    });

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    if (this.selfLoop) {
      this.ticker();
    }

    window.addEventListener('resize', this.resize);
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
    this.stats.begin();

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
      displacementTexture: this.mouseDisplacement.target.texture,
      mouse: this.mouse.normalizedPosition,
    });
    // this.sample.update({ deltaTime });

    this.stage.render();

    this.stats.end();

    if (this.selfLoop) {
      this.rafId = window.requestAnimationFrame(this.ticker);
    }
  };

  resize = () => {
    this.stage.resize();

    this.mouseDisplacement.resize(this.stage.canvasSize);
    this.screenPlane.resize(this.stage.canvasSize);
  };

  dispose = () => {
    this.screenPlane.dispose();
    this.stage.scene.remove(this.screenPlane);
    this.stage.dispose();
  };
}
