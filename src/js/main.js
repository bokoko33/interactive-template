import 'destyle.css';
import '~/css/style.css';
import { WebGL } from '~/js/webgl';

const initWebGL = () => {
  new WebGL();
};

document.addEventListener('DOMContentLoaded', initWebGL);
