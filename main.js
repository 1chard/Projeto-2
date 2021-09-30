'use strict'

import Menu from "./modules/dynamicheader.js";

let menu = new Menu(document.querySelector("header"))

document.querySelector("#mudaTema").onclick = () => {
    document.body.style.setProperty("--main-color", "#ddc");
    document.body.style.setProperty("--background-color", "#ffe");

}