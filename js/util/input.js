const createInputFromCallbacks = (...cond) => {
    const r = document.createElement('input');
    
    cond.forEach( (e, i) => {
        if(e.constructor !== Function)
            throw new TypeError("Argument " + i + " is not a function");
    })

    r.funcs = cond;

    r.addEventListener("input", function(){
        let h = '';
        this.funcs.forEach( callback => {
            if(h !== '')
                return;
            else
                h = callback(this.value);
        });
        this.setCustomValidity(h);
    });

    return r;
};

const createInputFromRegex = (errorMessage, regex) => {
    if(errorMessage.constructor !== String)
        throw new TypeError("Argument 1 is not of type String");
    else if(regex.constructor !== RegExp)
        throw new TypeError("Argument 2 is not a regex");
    else{
        const r = document.createElement('input');

        r.addEventListener("input", function(){
            if(!regex.test(this.value))
                this.setCustomValidity(errorMessage);
            else
                this.setCustomValidity('');
        });

        return r;
    }
};

export { createInputFromCallbacks, createInputFromRegex };