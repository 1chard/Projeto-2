'use strict'

let menu = new Menu(document.querySelector("header"))
let banner = new Banner(document.getElementById("banner"))

// banner.autoMove(5000)


banner.buttonLeft.classList.add("material-icons")
banner.buttonLeft.textContent = "arrow_back"
banner.buttonRight.classList.add("material-icons")
banner.buttonRight.textContent = "arrow_forward"

let mudaTema = document.getElementById("mudaTema")


temaEscuro()

document.getElementById("mudaTema").onclick = e => {
    switch(mudaTema.textContent){
        case "dark_mode":
            temaClaro()
            mudaTema.textContent = "light_mode" 
        break
        case "light_mode":
            temaEscuro()
            mudaTema.textContent = "dark_mode" 
        break
        default:
        throw null
    }
}
