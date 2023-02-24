import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera';

export class CameraOrthographic extends OrthographicCamera {
  /**
   * @typedef {object} props
   * @property {object} viewSize {width, height}
   */
  constructor({ viewSize }) {
    super();

    this.setSize(viewSize);
  }

  setSize = (viewSize) => {
    // canvasにフィットするサイズを計算
    const frustumSize = viewSize.height;
    const aspect = viewSize.width / viewSize.height;
    const [w, h] = [(frustumSize * aspect) / 2, frustumSize / 2];

    this.left = -w;
    this.right = w;
    this.top = h;
    this.bottom = -h;
    this.position.set(0, 0, 2);

    this.updateProjectionMatrix();
  };
}
