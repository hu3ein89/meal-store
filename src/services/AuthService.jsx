import {ulid} from 'ulid'
const AuthService = {
    register : (username,password) => {
        const storedUser = JSON.parse(localStorage.getItem('users')) || []
        const existingUser = storedUser.find(user => user.username === username)
        if (existingUser) {
            throw new Error ('This username is already chosen')
        }
        const newUser = {username,password}
        storedUser.push(newUser)
        localStorage.setItem('user',JSON.stringify(storedUser))
        return newUser
    },
    login : (username,password) => {
        const storedUser = JSON.parse(localStorage.getItem('users'))
        const user = storedUser.find(user => user.username === username && user.password === password)
        if (user) {
            localStorage.setItem('user',JSON.stringify({username,id:ulid()}))
            return user
        } else {
            throw new Error('Invalid username and password')
        }
    },
    logout : () => {
        localStorage.removeItem('user')
    },
    getUser: () => {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    }
}
export default AuthService