'use strict'

let menu = new Menu(document.querySelector("header"))
let banner = new Banner(document.querySelector("banner"))

banner.generateImage("img/hamburguer_salada.jpg")

temaEscuro(document.getElementById("mudaTema"))

document.getElementById("mudaTema").onclick = e => {
    if (document.getElementById("mudaTema").src.includes("moon"))
        temaClaro(e.target);
    else
        temaEscuro(e.target);
}
