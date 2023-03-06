// ページ作成の際にごっそり複製するので相対パスの方が都合が良い
import * as THREE from 'three';
import Stats from 'stats.js';
import { Screen } from './Screen';
import { GLCanvas } from '~/_lib/webgl/GLCanvas';
import { CameraOrthographic } from '~/_lib/webgl/CameraOrthographic';
import { config } from '~/_lib/config';

export class WebGL {
  constructor({ canvasWrapper, canvas, selfLoop = true }) {
    this.selfLoop = selfLoop; // rafループを外部ループに挿入するか、このclassで実行するか
    this.rafId = 0;

    this.glCanvas = new GLCanvas({
      wrapperEl: canvasWrapper,
      el: canvas,
    });

    const { viewSize } = this.glCanvas;

    this.camera = new CameraOrthographic({ viewSize });

    this.screen = new Screen({ viewSize });

    this.scene = new THREE.Scene();
    this.scene.add(this.screen.mesh);

    // utils
    this.lastTime = this.getTime();

    if (this.selfLoop) {
      this.ticker();
    }

    window.addEventListener('resize', this.resize);

    // development mode
    if (config.isDev) {
      // stats.js
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
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
    // const deltaTime = time - this.lastTime;
    // const timeScale = this.getTimeScale(deltaTime);
    this.lastTime = time;

    this.screen.update({ time });

    this.glCanvas.render({ scene: this.scene, camera: this.camera });

    this.stats?.end();

    if (this.selfLoop) {
      this.rafId = window.requestAnimationFrame(this.ticker);
    }
  };

  resize = () => {
    this.glCanvas.resize();
    const newSize = this.glCanvas.viewSize;

    this.camera.setSize(newSize);
    this.screen.resize(newSize);
  };

  dispose = () => {
    // TODO: three.jsのdispose処理

    if (this.selfLoop) {
      window.cancelAnimationFrame(this.rafId);
    }
    window.removeEventListener('resize', this.resize);
  };
}
