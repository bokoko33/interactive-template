// ページ作成の際にごっそり複製するので相対パスの方が都合が良い
import * as THREE from 'three';
import Stats from 'stats.js';
import { config } from '../config';
import { Stage } from './Stage';
import { SampleScreen } from './SampleScreen';
import { SampleObject } from './SampleObject';
import { Mouse2D } from '../utils/Mouse2D';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MouseDisplacement } from './MouseDisplacement';
import { GLCanvas } from './GLCanvas';
import screenVertexShader from '../../glsl/screen.vert';
import screenFragmentShader from '../../glsl/screen.frag';

export class WebGL {
  constructor({ canvasWrapper, canvas, isDev = false, selfLoop = true }) {
    config.isDev = isDev;

    this.selfLoop = selfLoop; // rafループを外部ループに挿入するか、このclassで実行するか
    this.rafId = 0;

    this.glCanvas = new GLCanvas({
      wrapperEl: canvasWrapper,
      el: canvas,
    });

    const { viewSize } = this.glCanvas;

    // offscreen
    this.offStage = new Stage({
      viewSize: viewSize,
      cameraType: 'perspective',
      isOffscreen: true,
    });

    this.sampleBg = new SampleScreen({
      viewSize: viewSize,
    });
    this.offStage.scene.add(this.sampleBg.mesh);

    this.sampleObj = new SampleObject();
    this.offStage.scene.add(this.sampleObj.mesh);

    // render scene
    this.stage = new Stage({
      viewSize: viewSize,
      cameraType: 'perspective',
    });

    const screenGeo = new THREE.PlaneGeometry(2, 2);
    const screenMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(viewSize.width, viewSize.height),
        },
        uSceneTexture: { value: null },
        uDisplacementTexture: { value: null },
      },
      vertexShader: screenVertexShader,
      fragmentShader: screenFragmentShader,
      transparent: false,
      depthTest: false,
      depthWrite: false,
    });
    this.screenMesh = new THREE.Mesh(screenGeo, screenMat);
    this.stage.scene.add(this.screenMesh);

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
    // const timeScale = this.getTimeScale(deltaTime);
    this.lastTime = time;

    // off render
    this.sampleBg.update({ time, mouse: this.mouse.normalizedPosition });
    this.sampleObj.update({ deltaTime });
    this.glCanvas.offscreenRender(this.offStage);

    this.mouseDisplacement.update({
      mouse: this.mouse.relativePositionForGL,
    });
    this.glCanvas.offscreenRender(this.mouseDisplacement.stage);

    // main render
    const screenUniforms = this.screenMesh.material.uniforms;
    screenUniforms.uTime.value = time;
    screenUniforms.uSceneTexture.value = this.offStage.renderTarget.texture;
    screenUniforms.uDisplacementTexture.value =
      this.mouseDisplacement.stage.renderTarget.texture;

    this.glCanvas.render(this.stage);

    this.stats?.end();

    if (this.selfLoop) {
      this.rafId = window.requestAnimationFrame(this.ticker);
    }
  };

  resize = () => {
    this.glCanvas.resize();
    const newSize = this.glCanvas.viewSize;

    this.stage.resize(newSize);

    this.mouseDisplacement.resize(newSize);

    this.sampleBg.resize(newSize);

    this.mesh.material.uniforms.uResolution.value.set(
      newSize.width,
      newSize.height
    );
  };

  dispose = () => {
    this.sampleBg.dispose(this.stage);
    this.sampleObj.dispose(this.stage);

    this.mouseDisplacement.dispose(this.stage);
    this.stage.dispose();

    window.removeEventListener('resize', this.resize);
  };
}
