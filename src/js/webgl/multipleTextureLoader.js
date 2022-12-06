import * as THREE from 'three';

const loader = new THREE.TextureLoader();

const loadTexture = async (path) => {
  return new Promise((resolve) => {
    loader.load(path, (res) => resolve(res));
  });
};

export const loadMultipleTexture = async (paths) => {
  const promiseList = paths.map((path) => loadTexture(path));

  return await Promise.all(promiseList);
};
