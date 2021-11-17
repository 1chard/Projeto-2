const ajax = {
    post: function (url, body = {}){
        
        return fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then( async response => {
                return response.json()
            });       
    },
    get: function (url, body = {}){
        
        return fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then( async response => {
                return response.json()
            });        
    }
    
}

export { Recurse };