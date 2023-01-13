import * as THREE from 'three';

const loader = new THREE.TextureLoader();

const loadTexture = async (path) => {
  return new Promise((resolve) => {
    loader.load(path, (res) => resolve(res));
  });
};

export class MultiTextureLoader {
  constructor() {
    this.loadEvent = new EventTarget();
  }

  load = async (paths) => {
    const promiseList = paths.map((path) => loadTexture(path));

    const textures = await Promise.all(promiseList);
    this.loadEvent.dispatchEvent(
      new CustomEvent('load', { detail: 'all images loaded' })
    );

    return textures;
  };

  on = (callback) => {
    this.loadEvent.addEventListener(callback);
  };

  off = (callback) => {
    this.loadEvent.removeEventListener(callback);
  };
}
