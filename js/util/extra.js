const ajax = {
    post: function (url, body = {}){
        
        return fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })     
    },
    get: function (url, body = {}){
        const link = new URLSearchParams();
        Object.entries(body).forEach( entry => {
            link.set(entry[0], entry[1]);
        })
        
        return fetch(url + '?' + link.toString());     
    }
    
}

export { ajax };