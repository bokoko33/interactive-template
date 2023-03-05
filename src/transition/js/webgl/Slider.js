import * as THREE from 'three';
import vertexShader from '../../glsl/screen.vert';
import fragmentShader from '../../glsl/screen.frag';
import { AssetLoader } from '~/_lib/webgl/AssetLoader';
import { SliderBase } from '~/_lib/SliderBase';
import { gsap } from 'gsap';
// import { GUI } from '~/_lib/GUI';
// import { config } from '~/_lib/config';

const SLIDER_INTERVAL = 4;
const DEFAULT_SCALE = 1.1; // 縮小していくアニメーションをするので初期状態のscaleを定義

export class Slider {
  constructor({ viewSize }) {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(viewSize.width, viewSize.height),
        },
        uCurrent: {
          value: {
            texture: null,
            aspect: 1,
            scale: DEFAULT_SCALE,
          },
        },
        uNext: {
          value: {
            texture: null,
            aspect: 1,
            scale: DEFAULT_SCALE,
          },
        },
      },
      vertexShader,
      fragmentShader,
      transparent: false,
      depthTest: false,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);

    // テクスチャとそのアスペクトを後から挿入
    this.textures = []; // {data: Texture, width: number, height: number}
    const loader = new AssetLoader();
    const texturePaths = ['/videos/sample.mp4', '/images/sample2.jpg'];
    loader.load(texturePaths).then((textures) => {
      // 全部読み込まれた後
      this.textures = textures;

      this.setImageUniform();
    });

    // slider
    this.slider = new SliderBase({
      slideCount: texturePaths.length,
      autoplay: true,
      interval: SLIDER_INTERVAL,
    });

    this.slider.on('change', this.handleSliderChange);
    this.slider.on('update', this.handleSliderUpdate);
  }

  handleSliderChange = () => {
    const { uniforms } = this.mesh.material;

    // nextのscaleを初期化
    uniforms.uNext.value.scale = DEFAULT_SCALE;

    // 動画なら最初から再生する
    if (uniforms.uNext.value.texture.isVideoTexture) {
      uniforms.uNext.value.texture.image.currentTime = 0;
    }

    gsap.to(uniforms.uProgress, {
      value: 1,
      duration: 0.8,
      ease: 'none',
      onComplete: () => {
        this.setImageUniform();
        uniforms.uProgress.value = 0;

        // 切り替わり時のscaleをなめらかにするため、scaleはcurrent/nextそれぞれが持ち、
        // 切り替わり直後にその時点までのscaleを入れ替える
        uniforms.uCurrent.value.scale = uniforms.uNext.value.scale;
        uniforms.uNext.value.scale = DEFAULT_SCALE; // こっちは初期化
      },
    });
  };

  handleSliderUpdate = () => {
    const scaleValue =
      (DEFAULT_SCALE - 1.0) /
      ((60 / gsap.ticker.deltaRatio()) * SLIDER_INTERVAL);
    this.mesh.material.uniforms.uCurrent.value.scale -= scaleValue;

    // nextも動かして、切り替え時にscaleをなめらかにつなげる
    this.mesh.material.uniforms.uNext.value.scale -= scaleValue;
  };

  setImageUniform = () => {
    const { uniforms } = this.mesh.material;

    const currentIndex = this.slider.current;
    const nextIndex = this.slider.getNext();

    const currentTexture = this.textures[currentIndex];
    if (currentTexture) {
      uniforms.uCurrent.value.texture = currentTexture.data;
      uniforms.uCurrent.value.aspect =
        currentTexture.width / currentTexture.height;
    }

    const nextTexture = this.textures[nextIndex];
    if (nextTexture) {
      uniforms.uNext.value.texture = nextTexture.data;
      uniforms.uNext.value.aspect = nextTexture.width / nextTexture.height;
    }
  };

  update = () => {};

  resize = (viewSize) => {
    this.mesh.material.uniforms.uResolution.value.set(
      viewSize.width,
      viewSize.height
    );
  };
}
