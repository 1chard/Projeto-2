'use strict';

import Header from './util/dynamicheader.js';
import Banner from './util/banner.js';
import { temaClaro, temaEscuro } from './util/tema.js';

new Header(document.querySelector('header'));
const banner = new Banner(document.getElementById('banner'));

banner.autoMove(8000);
banner.selectable();
banner.touchable();
banner.moveable();
banner.buttonLeft.classList.add('material-icons');
banner.buttonLeft.textContent = 'navigate_before';
banner.buttonRight.classList.add('material-icons');
banner.buttonRight.textContent = 'navigate_next';

const mudaTema = document.getElementById('mudaTema');

if (window.matchMedia('screen and (prefers-color-scheme: dark)').matches) {
  temaEscuro();
  mudaTema.textContent = 'dark_mode';
} else {
  temaClaro();
  mudaTema.textContent = 'light_mode';
}

document.getElementById('mudaTema').onclick = e => {
  switch (mudaTema.textContent) {
    case 'dark_mode':
      temaClaro();
      mudaTema.textContent = 'light_mode';
      break;
    case 'light_mode':
      temaEscuro();
      mudaTema.textContent = 'dark_mode';
      break;
    default:
      throw new Error('n foi');
  }
};
