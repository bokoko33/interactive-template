import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export class Model {
  constructor({ scene }) {
    // 3Dデータをロード
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/js/draco/');
    loader.setDRACOLoader(dracoLoader);
    const model = '/models/sample.glb';
    loader.load(model, (gltf) => {
      scene.add(gltf.scene);

      // 大きさ、位置とかとか若干調整
      const scale = 5;
      gltf.scene.scale.set(scale, scale, scale);
      gltf.scene.rotation.z += 0.5;

      gltf.scene.traverse((node) => {
        if (node.type == 'Mesh') {
          node.material.metalness = 0; // これやらないとlightが正しく反映されなかった。blenderの初期設定的なアレかな
        }
      });
    });
  }

  update = () => {};

  resize = () => {};
}
