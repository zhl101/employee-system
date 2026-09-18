import axios from 'axios'


// 创建axios实例
const request =axios.create({
    baseURL:'http://localhost:3000/api',

    // 如果 5 秒后端还没有返回结果，直接判定请求超时，抛出错误。
    timeout:5000

})

// 加入请求拦截器
request.interceptors.request.use(
    config=>{
        const token= localStorage.getItem('token')

        // console.log('发送请求的 JWT：', token)

        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    error=>{
        return Promise.reject(error)
    }
)

export default request