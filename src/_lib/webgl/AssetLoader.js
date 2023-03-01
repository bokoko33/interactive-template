import { EventEmitter } from 'events';
import { VideoTexture } from 'three/src/textures/VideoTexture';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

const loader = new TextureLoader();

const loadByPathString = (path, resolve) => {
  const fileType = path.split('.').pop();
  const isVideo = ['mp4', 'webm'].includes(fileType);

  if (isVideo) {
    // --- 動画の場合 ---
    const videoEl = document.createElement('video');
    const videoTexture = new VideoTexture(videoEl);
    videoEl.onloadeddata = () => {
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
};

const loadByHTMLElement = (el, resolve) => {
  const isVideo = el.tagName === 'VIDEO';

  if (isVideo) {
    // --- 動画の場合 ---
    const videoTexture = new VideoTexture(el);
    el.onloadeddata = () => {
      el.play(); // ここでもう再生しておく
      resolve({
        data: videoTexture,
        width: videoTexture.image.videoWidth,
        height: videoTexture.image.videoHeight,
      });
    };

    // onloadeddataがすでに発火している可能性があるのでsrcをリフレッシュ
    const src = el.src;
    el.src = '';
    el.src = src;
  } else {
    // --- 画像の場合 ---
    loader.load(el.src, (res) =>
      resolve({
        data: res,
        width: res.image.width,
        height: res.image.height,
      })
    );
  }
};

const loadTexture = async (prop) => {
  const promise = new Promise((resolve, reject) => {
    if (typeof prop === 'string') {
      loadByPathString(prop, resolve);
    } else if (prop instanceof HTMLElement) {
      loadByHTMLElement(prop, resolve);
    } else {
      reject();
    }
  });

  return promise;
};

/**
 * @param {string | HTMLElement} prop
 *
 * width/heightの取り方がvideo/imageで異なってややこしいので、
 * {data: Texture, width: number, height: number}
 * のオブジェクトで返す。複数ならそれを配列に。
 */
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
