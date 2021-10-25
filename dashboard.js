if(window.matchMedia("screen and (prefers-color-scheme: dark)").matches) {
    temaEscuro();
    mudaTema.textContent = "dark_mode" 
}
else{
    temaClaro(); 
    mudaTema.textContent = "light_mode" 
}

document.getElementById("mudaTema").onclick = e => {
    switch (mudaTema.textContent) {
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