'use strict'

let categorias = document.getElementById('categorias').children;
let ativo = '';

for(const button of categorias){
    button.addEventListener('pointerover', ev => {
        let style = (ev.target.localName === 'button'? ev.target: ev.target.parentElement)
            .querySelector(".iconeGrande").style;
            
            style.fontFamily = "Material Icons";
            style.filter  = "none";
    })

    button.addEventListener('pointerout', ev => {
        let e = (ev.target.localName === 'button'? ev.target: ev.target.parentElement);

        if(e.getAttribute('data-alvo') !== ativo){
            let style = e.querySelector(".iconeGrande").style
            style.fontFamily = "";
            style.filter  = "";
        }
    })

    button.addEventListener('click', ev => {
        const elemento = ev.target.localName === 'button'? ev.target: ev.target.parentElement;

        Function(`'use strict'; menu_${elemento.getAttribute('data-alvo')}()`).call();

        ativo = elemento.getAttribute('data-alvo');
    });
}