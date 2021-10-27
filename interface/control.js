'use strict'

let categorias = document.getElementById('categorias').children;

for(const button of categorias){
    button.addEventListener('click', ev => {
        const elemento = ev.target.localName === 'button'? ev.target: ev.target.parentElement;

        Function(`'use strict'; menu_${elemento.getAttribute('data-alvo')}()`).call();

        for(const extra of categorias){
            if(extra === elemento)
                elemento.classList.add("alvo-button");
            else
                elemento.id = ''
        }
    });
}