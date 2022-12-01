/**
 * https://github.com/nemutas/r3f-shadow/blob/main/src/modules/mouse2d.ts
 */
import { Vector2 } from 'three/src/math/Vector2';

export class Mouse2D {
  static _instance = null;

  constructor() {
    this._relativePosition = new Vector2(0, 0);
    window.addEventListener('mousemove', this._handleMouseMove);
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new Mouse2D();
    }
    return this._instance;
  }

  _handleMouseMove = (e) => {
    this._relativePosition.set(e.clientX, e.clientY);
  };

  get normalizedPosition() {
    return new Vector2(
      (this._relativePosition.x / window.innerWidth) * 2 - 1,
      (this._relativePosition.y / window.innerHeight) * 2 - 1
    );
  }

  get relativePosition() {
    return this._relativePosition.clone();
  }

  get relativePositionForGL() {
    return new Vector2(
      this._relativePosition.x - window.innerWidth / 2,
      this._relativePosition.y - window.innerHeight / 2
    );
  }

  get absolutePosition() {
    return new Vector2(
      this._relativePosition.x + window.pageXOffset,
      this._relativePosition.y + window.pageYOffset
    );
  }

  // SPAプロジェクトでも、基本的にdisposeせずずっと使い回す
  dispose = () => {
    window.removeEventListener('mousemove', this._handleMouseMove);
    delete Mouse2D._instance;
  };
}
