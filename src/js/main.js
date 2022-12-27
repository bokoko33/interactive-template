import 'destyle.css';
import '~/css/style.css';
import { WebGL } from '~/js/webgl';

const initWebGL = () => {
  new WebGL({ selfLoop: true });
};

document.addEventListener('DOMContentLoaded', initWebGL);
