import { SampleObject } from '~/js/webgl/SampleObject';
import { Stage } from '~/js/webgl/Stage';

export class WebGL {
  constructor(props = {}) {
    // rafループを外部ループに挿入するか、このclassで実行するか
    this.selfLoop = props.selfLoop ?? true;
    this.rafId = 0;

    const canvasWrapperEl = document.querySelector('.canvasWrapper');
    this.stage = new Stage({ wrapper: canvasWrapperEl });
    this.sampleObject = new SampleObject();
    this.stage.scene.add(this.sampleObject.mesh);

    this.lastTime = this.getTime();

    if (this.selfLoop) {
      this.ticker();
    }

    canvasWrapperEl.addEventListener('resize', this.resize);
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
    const time = this.getTime();
    const deltaTime = time - this.lastTime;
    const timScale = this.getTimeScale(deltaTime);
    this.lastTime = time;

    this.sampleObject.update({ time, deltaTime, timScale });
    this.stage.render();

    if (this.selfLoop) {
      this.rafId = window.requestAnimationFrame(this.ticker);
    }
  };

  resize = () => {
    this.stage.resize();
  };
}
