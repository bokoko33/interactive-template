import * as THREE from 'three';
import EMath from '~/js/utils/EMath';
import { Stage } from '~/js/webgl/Stage';

export class MouseDisplacement {
  constructor({ viewSize }) {
    this.stage = new Stage({
      viewSize,
      isOffscreen: true,
      cameraType: 'orthographic',
    });

    this.current = 0;
    this.max = 2000;
    this.meshArray = [];
    this.createMesh();

    this.prevMouse = new THREE.Vector2(0, 0);
  }

  setNewMesh = (mouse) => {
    const moveLength = mouse.distanceTo(this.prevMouse);

    // 大きすぎる移動（画面外に出てもう一回入る時など）、小さすぎる移動は無視
    if (moveLength < 0.1 || moveLength > 300) return;

    // いくつ生成するか
    const emitCount = Math.max(Math.floor(moveLength * 0.1), 1.0);

    for (let i = 0; i < emitCount; i++) {
      const mesh = this.meshArray[this.current];
      mesh.visible = true;
      mesh.material.opacity = 0.5;
      mesh.scale.set(0, 0, 1);

      // lerp関数でマウス移動の間を補完して生成し、ただの丸の連なりに見せないようにする
      // 参考: https://github.com/p5aholic/playground/blob/main/particle-emitter/src/js/AppCanvas/index.js
      const emitX = EMath.lerp(this.prevMouse.x, mouse.x, i / emitCount);
      const emitY = EMath.lerp(this.prevMouse.y, mouse.y, i / emitCount);
      mesh.position.set(emitX, emitY, 0);

      this.current = (this.current + 1) % this.max;
    }
  };

  createMesh = () => {
    const size = 64;
    const segments = 32;
    const geometry = new THREE.CircleGeometry(size, segments);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(0xffffff),
      depthTest: false,
      depthWrite: false,
      // 波紋テクスチャなど入れても良し
    });

    for (let i = 0; i < this.max; i++) {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.visible = false;
      this.stage.scene.add(mesh);
      this.meshArray.push(mesh);
    }
  };

  update = ({ mouse }) => {
    this.setNewMesh(mouse);

    this.meshArray.forEach((mesh) => {
      if (!mesh.visible) return;

      const newScale = mesh.scale.x + 0.016;
      mesh.scale.set(newScale, newScale, 1);

      mesh.material.opacity *= 0.96;

      if (mesh.material.opacity < 0.001) mesh.visible = false;
    });

    this.prevMouse.set(mouse.x, mouse.y);
  };

  resize = (viewSize) => {
    this.stage.resize(viewSize);
  };

  dispose = (stage) => {
    this.meshArray.forEach((mesh) => {
      stage.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
  };
}
