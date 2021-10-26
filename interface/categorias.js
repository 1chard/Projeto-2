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
    </table>`;
}