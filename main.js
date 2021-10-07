'use strict'

let menu = new Menu(document.querySelector("header"))
let banner = new Banner(document.querySelector("banner"))

const temaClaro = image => {
    image.src = "./img/sun.svg"
    document.body.style.setProperty("--main-color", "#ffa100");
    document.body.style.setProperty("--main-extra", "#ffa100");
    document.body.style.setProperty("--background-color", "#fff");
    document.body.style.setProperty("--secondary-color", "#51d");
    document.body.style.setProperty("--secondary-extra", "#40b");
    document.body.style.setProperty("--text-color", "#123");
    document.body.style.setProperty("--text-extra", "#512");
}

const temaEscuro = image => {
    image.src = "./img/moon.svg"
    document.body.style.setProperty("--main-color", "#202328");
    document.body.style.setProperty("--main-extra", "#282c32");
    document.body.style.setProperty("--background-color", "#1e2226");
    document.body.style.setProperty("--background-extra", "#161b20");
    document.body.style.setProperty("--secondary-color", "#701");
    document.body.style.setProperty("--secondary-extra", "#730");
    document.body.style.setProperty("--text-color", "#eec");
    document.body.style.setProperty("--text-extra", "#da0");
}

temaEscuro(document.getElementById("mudaTema"))

document.getElementById("mudaTema").onclick = e => {
    if(document.getElementById("mudaTema").src.includes("moon")) temaClaro(e.target);
    else temaEscuro(e.target);
}


