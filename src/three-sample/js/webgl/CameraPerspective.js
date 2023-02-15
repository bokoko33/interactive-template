import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';

export class CameraPerspective extends PerspectiveCamera {
  /**
   * @typedef {object} props
   * @property {object} viewSize {width, height}
   * @property {boolean} isFitCanvas
   */
  constructor({ viewSize, isFitCanvas }) {
    super();

    this.isFitCanvas = isFitCanvas; // canvasサイズと画角を合わせるかどうか

    this.fov = 45;
    this.near = 0.1;
    this.far = 5000;

    this.setSize(viewSize);
  }

  setSize = (viewSize) => {
    this.aspect = viewSize.width / viewSize.height;

    if (this.isFitCanvas) {
      // canvasの画角ぴったりなカメラ距離の計算
      const dist = this.calcScreenFitDist({
        fov: this.fov,
        viewSize: viewSize,
      });
      this.position.z = dist;
    }

    this.updateProjectionMatrix();
  };

  /**
   * 視野角と画面サイズから、画面にフィットするカメラ距離を計算する
   */
  calcScreenFitDist = ({ fov, viewSize }) => {
    const fovRad = (fov / 2) * (Math.PI / 180);
    const dist = viewSize.height / 2 / Math.tan(fovRad);

    return dist;
  };

  // カメラ距離と視野角から、画面にフィットするスクリーンのサイズを計算する
  calcScreenSize = (camera) => {
    const fovRadian = (camera.fov / 2) * (Math.PI / 180);
    const screenHeight = camera.position.z * Math.tan(fovRadian) * 2;
    const screenWidth = screenHeight * camera.aspect;

    return { width: screenWidth, height: screenHeight };
  };
}
