import '~/common/js/common';
import { WebGL } from './webgl';

const initWebGL = () => {
  new WebGL({
    canvasWrapper: document.querySelector('.canvasWrapper'),
    canvas: document.querySelector('.canvas'),
    isDev: true,
    selfLoop: true,
  });
};

document.addEventListener('DOMContentLoaded', initWebGL);
