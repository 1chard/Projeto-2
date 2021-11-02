let scrollTrack = window.scrollY;

const efeitoSumir = header => {
  // so escondo quando tiver saindo do cabecalho, cuidado! pode esconder o texto
  if (header.offsetHeight * 2 >= window.scrollY || (scrollTrack > window.scrollY)) {
    header.classList.remove('effectHeader');
  } else {
    header.classList.add('effectHeader');
  }

  scrollTrack = window.scrollY;
};

const updateCopy = (header) => {
  header.copiaHeader.style.width = header.header.offsetWidth.toString() + 'px';
  header.copiaHeader.style.height = header.header.offsetHeight.toString() + 'px';
};

function Menu (header) {
  const ret = {
    header: header,
    copiaHeader: document.createElement('div')
  };

  updateCopy(ret);
  window.addEventListener('resize', () => updateCopy(ret));
  document.body.onscroll = () => efeitoSumir(ret.header);
  ret.copiaHeader.style.position = 'relative';
  document.body.insertBefore(ret.copiaHeader, ret.header.nextSibling);

  return ret;
}

export default Menu;
