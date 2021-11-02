'use strict';

import { temaClaro, temaEscuro } from "./util/tema.js";


let mudaTema = document.getElementById("mudaTema")

if (window.matchMedia("screen and (prefers-color-scheme: dark)").matches) {
    temaEscuro();
    mudaTema.textContent = "dark_mode"
}
else {
    temaClaro();
    mudaTema.textContent = "light_mode"
}

document.getElementById("mudaTema").onclick = () => {
    switch (mudaTema.textContent) {
        case "dark_mode":
            temaClaro();
            mudaTema.textContent = "light_mode";
            break;
        case "light_mode":
            temaEscuro();
            mudaTema.textContent = "dark_mode";
            break;
    }
}

let ativo = '';

const butaoFoco = ev => {
    let style = (ev.target.localName === 'button' ? ev.target : ev.target.parentElement)
        .querySelector(".iconeGrande").style;

    style.fontFamily = "Material Icons";
    style.filter = "none";
}

const butaoDesfoco = ev => {
    let e = (ev.target.localName === 'button' ? ev.target : ev.target.parentElement);

    if (e.getAttribute('data-alvo') !== ativo) {
        let style = e.querySelector(".iconeGrande").style;
        style.fontFamily = "";
        style.filter = "";
    }
}

for (const button of document.getElementById('categorias').children) {
    button.addEventListener('pointerover', butaoFoco)
    button.addEventListener('focusin', butaoFoco)

    button.addEventListener('pointerout', butaoDesfoco)
    button.addEventListener('focusout', butaoDesfoco)

    button.addEventListener('click', function() {
        let pedido = button.getAttribute('data-alvo');

        if (pedido !== ativo) {
            ativo = pedido;
            import(`./interface/${ativo}.js`).then(ev => void ev.start());
        }
        });
}