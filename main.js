'use strict'



import Menu from "./modules/dynamicheader.js";
import Banner from "./modules/banner.js";

let menu = new Menu(document.querySelector("header"))
let banner = new Banner(document.querySelector("banner"))

document.getElementById("mudaTema").onclick = event => {
    if(document.getElementById("mudaTema").src.includes("moon")){
        event.target.src = "./img/sun.svg"
        document.body.style.setProperty("--main-color", "#fea");
        document.body.style.setProperty("--background-color", "#ffefa0");
        document.body.style.setProperty("--secondary-color", "#51d");
        document.body.style.setProperty("--secondary-extra", "#40b");
        document.body.style.setProperty("--text-color", "#123");
        document.body.style.setProperty("--text-extra", "#512");
    }
    else if(document.getElementById("mudaTema").src.includes("sun")){
        event.target.src = "./img/moon.svg"
        document.body.style.setProperty("--main-color", "#232a30");
        document.body.style.setProperty("--background-color", "#202629");
        document.body.style.setProperty("--secondary-color", "#701");
        document.body.style.setProperty("--secondary-extra", "#730");
        document.body.style.setProperty("--text-color", "#eec");
        document.body.style.setProperty("--text-extra", "#da0");
    }
    else
        throw null;

}