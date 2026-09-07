import axios from 'axios'

export function getEmployees(){
    return axios.get('http://localhost:3000/api/employees')
}