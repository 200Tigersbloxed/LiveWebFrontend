import webhandling from './webhandling.js'

const localStorage = window.localStorage

function getAuthFromLocalStorage() {
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')
    return { username, token }
}

export default {
    getSavedUsername(){
        return localStorage.getItem('username')
    },
    async isAuthenticated(apiUrl){
        const {username, token} = getAuthFromLocalStorage()
        if(username === undefined || username === null || token === undefined || token === null) return false
        const response = await webhandling.POST(apiUrl + "validToken", {
            username: username,
            token: token
        })
        const parsed = webhandling.handleResponse(response)
        if(!parsed.success){
            localStorage.removeItem('username')
            localStorage.removeItem('token')
        }
        return parsed.success
    },
    async needsSignupToken(apiUrl){
        const response = await webhandling.GET(apiUrl + "needsSignupToken")
        const parsed = webhandling.handleResponse(response)
        if(!parsed.success) return true
        return parsed.data.required
    },
    async getServers(apiUrl){
        const response = await webhandling.GET(apiUrl + "getServers")
        const parsed = webhandling.handleResponse(response)
        if(!parsed.success) return []
        return parsed.data.servers
    },
    async createUser(apiUrl, username, password, signupToken){
        const response = await webhandling.POST(apiUrl + "createUser", {
            username: username.toLowerCase(),
            password: password,
            signupToken: signupToken
        })
        const parsed = webhandling.handleResponse(response)
        if(!parsed.success) return false
        const token = parsed.data.token
        localStorage.setItem('username', username.toLowerCase())
        localStorage.setItem('token', token)
        return true
    },
    async login(apiUrl, username, password){
        const response = await webhandling.POST(apiUrl + "login", {
            username: username.toLowerCase(),
            password: password
        })
        const parsed = webhandling.handleResponse(response)
        if(!parsed.success) return false
        const token = parsed.data.token
        localStorage.setItem('username', username.toLowerCase())
        localStorage.setItem('token', token)
        return true
    },
    async logout(apiUrl){
        const {username, token} = getAuthFromLocalStorage()
        if(username === undefined || username === null || token === undefined || token === null) return false
        const response = await webhandling.POST(apiUrl + "logout", {
            username: username.toLowerCase(),
            token: token
        })
        const parsed = webhandling.handleResponse(response)
        return parsed.success
    },
    async revokeTokens(apiUrl){
        const {username, token} = getAuthFromLocalStorage()
        if(username === undefined || username === null || token === undefined || token === null) return false
        const response = await webhandling.POST(apiUrl + "revokeTokens", {
            username: username.toLowerCase(),
            token: token
        })
        const parsed = webhandling.handleResponse(response)
        return parsed.success
    },
    async getStreamKey(apiUrl){
        const {username, token} = getAuthFromLocalStorage()
        if(username === undefined || username === null || token === undefined || token === null) return false
        const response = await webhandling.POST(apiUrl + "getStreamKey", {
            username: username.toLowerCase(),
            token: token
        })
        const parsed = webhandling.handleResponse(response)
        if(!parsed.success) return undefined
        return parsed.data.streamKey
    },
    async resetStreamKey(apiUrl){
        const {username, token} = getAuthFromLocalStorage()
        if(username === undefined || username === null || token === undefined || token === null) return false
        const response = await webhandling.POST(apiUrl + "resetStreamKey", {
            username: username.toLowerCase(),
            token: token
        })
        const parsed = webhandling.handleResponse(response)
        if(!parsed.success) return undefined
        return parsed.data.streamKey
    }
}