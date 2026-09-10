import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useLoginStore = defineStore('login', () => {

    // localStorage持久化

    // 从localStorage 恢复用户信息
    const user = ref(
        JSON.parse(localStorage.getItem('user')) || null
    )

    // 从localStorage 恢复权限
    const permissions = ref(
        JSON.parse(localStorage.getItem('permissions')) || []
    )

    // 从localStorage恢复token
    const token = ref(
        localStorage.getItem('token') || ''
    )
    // 根据token判断登陆状态
    const isLogin = ref(!!token.value)


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
            permissions.value = res.data.permissions


            // 保存JWT
            token.value = res.data.token

            // 修改登录状态
            isLogin.value = true

            // 保存到localStorage
            localStorage.setItem(
                'user',
                JSON.stringify(user.value)
            )
            localStorage.setItem(
                'permissions',
                JSON.stringify(permissions.value)
            )

            localStorage.setItem(
                'token',
                token.value
            )

            console.log('登录成功：', user.value)
            console.log('登录成功：', permissions.value)
            console.log('Token:', token.value)

            return res.data

        } catch (err) {
            console.error('登录失败：', err)

            throw err
        }
    }

    // 退出登录
    function logout() {

        // 删除用户信息
        user.value = null
        permissions.value = []
        token.value = ''
        isLogin.value = false

        // 删除localStorage
        localStorage.removeItem('user')
        localStorage.removeItem('permissons')
        localStorage.removeItem('token')
    }

    return {
        user,
        permissions,
        token,
        isLogin,
        login,
        logout
    }
})

