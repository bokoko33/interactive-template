import '~/js/common';
import { WebGL } from '~/js/webgl';

const initWebGL = () => {
  new WebGL({
    canvasWrapper: document.querySelector('.canvasWrapper'),
    canvas: document.querySelector('.canvas'),
    isDev: true,
    selfLoop: true,
  });
};

document.addEventListener('DOMContentLoaded', initWebGL);
