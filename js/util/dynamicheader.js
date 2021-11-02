let scrollTrack = window.scrollY;

const efeitoSumir = header => {
  // so escondo quando tiver saindo do cabecalho, cuidado! pode esconder o texto
  if (header.offsetHeight * 2 >= window.scrollY || (scrollTrack > window.scrollY))
    {header.classList.remove('effectHeader')};
  else
    {header.classList.add('effectHeader')};

  scrollTrack = window.scrollY;
};

class Menu {
  constructor (header) {
    this.header = header;

    // criase um elemento da mesma autura para nao interferir no fluxo
    this.copiaHeader = document.createElement('div');
    this.copiaHeader.style.position = 'relative';
    document.body.insertBefore(this.copiaHeader, this.header.nextSibling);

    window.addEventListener('resize' , () => { this.updateCopy(); });
    document.body.onscroll = () => efeitoSumir(this.header);

    this.updateCopy();
  }

  updateCopy () {
    this.copiaHeader.style.width = this.header.offsetWidth.toString() + 'px';
    this.copiaHeader.style.height = this.header.offsetHeight.toString() + 'px';
  }
}

export default Menu;
