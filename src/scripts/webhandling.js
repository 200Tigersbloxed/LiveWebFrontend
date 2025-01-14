export default {
    POST(url, data){
        return new Promise(resolve => {
            let xhr = new XMLHttpRequest()
            xhr.open("POST", url)
            xhr.setRequestHeader("Accept", "application/json")
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    resolve(xhr.responseText)
                }};
            xhr.send(JSON.stringify(data))
        })
    },
    GET(url, data, responsetype){
        return new Promise(resolve => {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", url)
            xhr.setRequestHeader("Accept", "application/json")
            xhr.setRequestHeader("Content-Type", "application/json")
            if(responsetype)
                xhr.responseType = responsetype
            xhr.send(data)
            xhr.onload = function (){
                if(responsetype){
                    resolve(xhr.response)
                    return
                }
                resolve(xhr.responseText)
            }
        })
    },
    handleResponse(res) {
        return JSON.parse(res)
    }
}