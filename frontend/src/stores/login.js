import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useLoginStore = defineStore('login', () => {

    // 保存登录后的用户信息
    const user = ref(null)

    const permissions = ref([])

    // 登录状态
    const isLogin = ref(false)

    // 登录
    async function login(username, password) {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/login',
                {
                    username,
                    password
                }
            )

            // 保存后端返回的用户信息
            user.value = res.data.user

            // 保存后端返回的权限信息
            permissions.value=res.data.permissions

            // 修改登录状态
            isLogin.value = true

            console.log('登录成功：', user.value)
            console.log('登录成功：', permissions.value)

            return res.data

        } catch (err) {
            console.error('登录失败：', err)

            throw err
        }
    }

    // 退出登录
    function logout() {
        user.value = null
        permissions.value=[]
        isLogin.value = false
    }

    return {
        user,
        permissions,
        isLogin,
        login,
        logout
    }
})

