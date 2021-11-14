const ajax = {
    post: function (url, body = {}){
        
        return fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });  
    },
    get: function (url, body = {}){
        const link = new URLSearchParams();
        Object.entries(body).forEach( entry => {
            link.set(entry[0], entry[1]);
        });
        
        return fetch(url + '?' + link.toString());     
    }
};

const functionTypeSafe = (callback, ...args) => {
    if(callback.constructor !== Function)
        throw new TypeError('callback is not a Function');
    
    args.forEach( (arg, index) => {
        if( arg.constructor !== Function ){
            throw new TypeError(typeof arg + " (at index " + index + ') is not a Function');
        }
    });
    
    return function (){
        "use strict";
        args.forEach( (arg, index) => {
        if( arguments[index].constructor !== arg ){
            throw new TypeError(typeof arguments[index] + " (at index " + index + ') is not of type ' + typeof arg.name);
        }
        });
        
        return callback.apply(null, arguments);
    };
};

export { ajax, functionTypeSafe };