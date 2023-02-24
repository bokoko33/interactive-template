// ページ作成の際にごっそり複製するので相対パスの方が都合が良い
import * as THREE from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SampleScreen } from './SampleScreen';
import { SampleObject } from './SampleObject';
import { MouseDisplacement } from './MouseDisplacement';
import { GLCanvas } from '~/_lib/webgl/GLCanvas';
import { CameraOrthographic } from '~/_lib/webgl/CameraOrthographic';
import { CameraPerspective } from '~/_lib/webgl/CameraPerspective';
import { Mouse2D } from '~/_lib/Mouse2D';
import { config } from '~/_lib/config';
import screenVertexShader from '../../glsl/screen.vert';
import screenFragmentShader from '../../glsl/screen.frag';

export class WebGL {
  constructor({ canvasWrapper, canvas, selfLoop = true }) {
    this.selfLoop = selfLoop; // rafループを外部ループに挿入するか、このclassで実行するか
    this.rafId = 0;

    this.glCanvas = new GLCanvas({
      wrapperEl: canvasWrapper,
      el: canvas,
    });

    const { viewSize } = this.glCanvas;

    // cameras
    this.pCamera = new CameraPerspective({ viewSize });
    this.pCamera.position.z = 300; // canvas fitさせない場合の任意値
    this.oCamera = new CameraOrthographic({ viewSize, type: 'orthographic' });

    // sample scene (offscreen)
    this.sampleScene = new THREE.Scene();
    this.sampleFBO = new THREE.WebGLRenderTarget(
      viewSize.width,
      viewSize.height
    );
    this.sampleBg = new SampleScreen({ viewSize });
    this.sampleObj = new SampleObject();
    this.sampleScene.add(this.sampleBg.mesh, this.sampleObj.mesh);

    // mouse displace scene (offscreen)
    this.displaceSene = new THREE.Scene();
    this.displace = new MouseDisplacement({ viewSize });
    this.displaceFBO = new THREE.WebGLRenderTarget(
      viewSize.width,
      viewSize.height
    );
    this.displaceSene.add(...this.displace.meshArray);

    // render scene
    this.scene = new THREE.Scene();
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
    this.scene.add(this.screenMesh);

    // utils
    this.lastTime = this.getTime();
    this.mouse = Mouse2D.instance;

    if (this.selfLoop) {
      this.ticker();
    }

    window.addEventListener('resize', this.resize);

    // development mode
    if (config.isDev) {
      // stats.js
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);

      // OrbitControls
      this.controls = new OrbitControls(
        this.pCamera,
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

    // render sample scene (offscreen)
    this.sampleBg.update({ time, mouse: this.mouse.normalizedPosition });
    this.sampleObj.update({ deltaTime });
    this.glCanvas.offscreenRender({
      renderTarget: this.sampleFBO,
      scene: this.sampleScene,
      camera: this.pCamera,
    });

    // render displace scene (offscreen)
    this.displace.update({
      mouse: this.mouse.relativePositionForGL,
    });
    this.glCanvas.offscreenRender({
      renderTarget: this.displaceFBO,
      scene: this.displaceSene,
      camera: this.oCamera,
    });

    // render output scene
    const screenUniforms = this.screenMesh.material.uniforms;
    screenUniforms.uTime.value = time;
    screenUniforms.uSceneTexture.value = this.sampleFBO.texture;
    screenUniforms.uDisplacementTexture.value = this.displaceFBO.texture;

    this.glCanvas.render({ scene: this.scene, camera: this.pCamera });

    this.stats?.end();

    if (this.selfLoop) {
      this.rafId = window.requestAnimationFrame(this.ticker);
    }
  };

  resize = () => {
    this.glCanvas.resize();
    const newSize = this.glCanvas.viewSize;

    this.pCamera.setSize(newSize);
    this.oCamera.setSize(newSize);

    this.sampleFBO.setSize(newSize.width, newSize.height);
    this.displaceFBO.setSize(newSize.width, newSize.height);

    this.sampleBg.resize(newSize);
  };

  dispose = () => {
    // TODO: three.jsのdispose処理

    if (this.selfLoop) {
      window.cancelAnimationFrame(this.rafId);
    }
    window.removeEventListener('resize', this.resize);
  };
}
