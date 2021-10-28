let mudaTema = document.getElementById("mudaTema")

if(window.matchMedia("screen and (prefers-color-scheme: dark)").matches) {
    temaEscuro();
    mudaTema.textContent = "dark_mode" 
}
else{
    temaClaro(); 
    mudaTema.textContent = "light_mode" 
}

document.querySelector("button[data-alvo='categorias']").click();

document.getElementById("mudaTema").onclick = () => {
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