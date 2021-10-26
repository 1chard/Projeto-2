'use strict';

const menu_categorias = async() => {
    const janela = document.getElementById('janela');

    let array = await fetch('./backend/main.php').then( t => t.json()) ?? [];

    janela.style.cssText = `
    `

    let texto = '';

    array.forEach(element => {
        texto += `<tr>
        <td>${element.id}</td>
        <td>${element.nome}</td>
        </tr>`
    });

    janela.innerHTML = `<table>
    <tbody>
        ${texto}
    </tbody>
    </table>
    
    <input type='text' id='buttonNome' >
    <input type='button' id='buttonAdicionar' value='enviar' >`
    
    janela.querySelector('#buttonAdicionar').addEventListener(
        "click", () => {
            let request = new FormData();
            request.append("nome", document.getElementById("buttonNome").value)
            fetch("backend/main.php", {method: 'post', body: request} ).then(t => console.log(t.text()))
        }
    );
}