import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: process.env.NODE_ENV === 'production'
            ? '/gestion/api'
            : '/api',
        withCredentials: false,
        headers: {
            'Accept': 'application/ld+json',
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    })
}
