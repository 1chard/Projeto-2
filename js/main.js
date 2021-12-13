'use strict';

import Cookies from "./cookie.js"

let data_light = document.body.style.getPropertyValue("--cor-secundaria-clara")
let data_normal = document.body.style.getPropertyValue("--cor-secundaria")
let data_dark = document.body.style.getPropertyValue("--cor-secundaria-escura")

const colorDefault = () => {
	document.body.style.setProperty("--cor-secundaria-clara", data_light);
	document.body.style.setProperty("--cor-secundaria", data_normal);
	document.body.style.setProperty("--cor-secundaria-escura", data_dark);
}

document.querySelectorAll("header > .colorChooser > .container > *").forEach( a => {
	console.log(Cookies.get())
	a.colorChange = function(){
		document.body.style.setProperty("--cor-secundaria-clara", this.getAttribute("data-light"));
		document.body.style.setProperty("--cor-secundaria", this.getAttribute("data-normal"));
		document.body.style.setProperty("--cor-secundaria-escura", this.getAttribute("data-dark"));
	}

	if(Cookies.get("color") === a.getAttribute("data-color")){
		data_light = a.getAttribute("data-light")
		data_normal = a.getAttribute("data-normal")
		data_dark = a.getAttribute("data-dark")
		a.colorChange()
	}

	a.addEventListener("change", function(){ Cookies.set("color", this.getAttribute("data-color"), {expires: 365}) });
	a.addEventListener("mouseover", function(){ this.colorChange() })
	a.addEventListener("mouseout", () => colorDefault())
} );