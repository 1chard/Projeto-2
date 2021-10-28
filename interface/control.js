'use strict'

let categorias = document.getElementById('categorias').children;
let ativo = '';

const clearChildren = (dom) => {
    while (dom.firstChild)
        dom.firstChild.remove();
}

const butaoFoco = ev => {
    let style = (ev.target.localName === 'button'? ev.target: ev.target.parentElement)
        .querySelector(".iconeGrande").style;
        
        style.fontFamily = "Material Icons";
        style.filter  = "none";
}

const butaoDesfoco = ev => {
    let e = (ev.target.localName === 'button'? ev.target: ev.target.parentElement);

    if(e.getAttribute('data-alvo') !== ativo){
        let style = e.querySelector(".iconeGrande").style
        style.fontFamily = "";
        style.filter  = "";
    }
}

for(const button of categorias){
    button.addEventListener('pointerover', butaoFoco)
    button.addEventListener('focusin', butaoFoco)

    button.addEventListener('pointerout', butaoDesfoco)
    button.addEventListener('focusout', butaoDesfoco)

    button.addEventListener('click', ev => {
        const elemento = ev.target.localName === 'button'? ev.target: ev.target.parentElement;

        Function(`'use strict'; menu_${elemento.getAttribute('data-alvo')}()`).call();

        ativo = elemento.getAttribute('data-alvo');
    });
}