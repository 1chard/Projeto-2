
const modal = {
    hidden: true,
    container: document.createElement('div'),
    main: document.createElement('div'),
    toggle: function () {
        this.container.style.display = this.hidden ? "block" : "none";
        this.hidden = !this.hidden;
    },
    hide: function () {
        this.container.style.display = "none";
        this.hidden = true;
    },
    show: function () {
        this.container.style.display = "block";
        this.hidden = false;
    },
    html: function (html) {
        this.main.innerHTML = html;
    },
    append: function(...elements) {
        elements.forEach( e => void this.main.appendChild(e));
    },
    clear: function(){
        this.main.innerHTML = "";
    }
}


    modal.container.id = "modalContainer";
    modal.container.onclick = function (e) {
        if (e.target === this)
            modal.toggle();
    };

    modal.main.id = "modal";
    modal.container.appendChild(modal.main);

    if (window.getComputedStyle(modal.container).getPropertyValue('display') !== 'none')
        modal.container.style.display = 'none';

    document.body.appendChild(modal.container);


export default modal;


