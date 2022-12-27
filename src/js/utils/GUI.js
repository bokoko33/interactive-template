import LilGUI from 'lil-gui';

export class GUI extends LilGUI {
  static _instance = null;

  constructor() {
    super();
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new GUI();
    }
    return this._instance;
  }
}
