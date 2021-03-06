const temaClaro = () => {
  document.body.style.setProperty('--main-color', '#2e6');
  document.body.style.setProperty('--main-extra', '#20e070');
  document.body.style.setProperty('--background-color', '#fff');
  document.body.style.setProperty('--background-extra', '#fdfbf8');
  document.body.style.setProperty('--secondary-color', '#aae5c6');
  document.body.style.setProperty('--secondary-extra', '#a6efd0');
  document.body.style.setProperty('--text-color', '#030303');
  document.body.style.setProperty('--text-extra', '#432');
};

const temaEscuro = () => {
  document.body.style.setProperty('--main-color', '#202328');
  document.body.style.setProperty('--main-extra', '#24272b');
  document.body.style.setProperty('--background-color', '#1e2226');
  document.body.style.setProperty('--background-extra', '#24232a');
  document.body.style.setProperty('--secondary-color', '#422a3b');
  document.body.style.setProperty('--secondary-extra', '#472e33');
  document.body.style.setProperty('--text-color', '#eec');
  document.body.style.setProperty('--text-extra', '#ed9');
};

export { temaClaro, temaEscuro };
