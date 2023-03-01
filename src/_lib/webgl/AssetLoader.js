import { EventEmitter } from 'events';
import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const loadTexture = async (path) => {
  const fileType = path.split('.').pop();
  const isVideo = ['mp4', 'webm'].includes(fileType);

  return new Promise((resolve) => {
    if (isVideo) {
      // --- 動画の場合 ---
      const videoEl = document.createElement('video');
      const videoTexture = new THREE.VideoTexture(videoEl);
      videoEl.oncanplay = () => {
        // width/heightの取り方がvideo/imageで異なってややこしいのでまとめる
        resolve({
          data: videoTexture,
          width: videoTexture.image.videoWidth,
          height: videoTexture.image.videoHeight,
        });
      };

      videoEl.src = path;
      videoEl.crossOrigin = 'Anonymous';
      videoEl.loop = true;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.play(); // ここでもう再生しておいて、使う側で再生位置をいじる
    } else {
      // --- 画像の場合 ---
      loader.load(path, (res) =>
        resolve({
          data: res,
          width: res.image.width,
          height: res.image.height,
        })
      );
    }
  });
};

export class AssetLoader extends EventEmitter {
  constructor() {
    super();
  }

  load = async (paths) => {
    const promiseList = paths.map((path) => loadTexture(path));

    const textures = await Promise.all(promiseList);
    this.emit('load');

    return textures;
  };
}
