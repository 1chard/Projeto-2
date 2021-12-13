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
	const this_color = a.getAttribute("data-color")
	const this_light = a.getAttribute("data-light")
	const this_normal = a.getAttribute("data-normal")
	const this_dark = a.getAttribute("data-dark")

	a.colorChange = function(){
		document.body.style.setProperty("--cor-secundaria-clara", this_light);
		document.body.style.setProperty("--cor-secundaria", this_normal);
		document.body.style.setProperty("--cor-secundaria-escura", this_dark);
	}

	if(Cookies.get("color") === a.getAttribute("data-color")){
		a.colorChange()
		a.checked = true;
	}

	a.addEventListener("change", function(){ 
		Cookies.set("color", this_color, {expires: 365}) 
		data_light = this_light
		data_normal = this_normal
		data_dark = this_dark
	});
	a.addEventListener("mouseover", function(){ this.colorChange() })
	a.addEventListener("mouseout", () => colorDefault())
} );