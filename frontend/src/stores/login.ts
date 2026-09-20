import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../api/request'
import type { User } from '../types/user'


export const useLoginStore = defineStore('login', () => {
    const user = ref<User | null>(null)
    const permissions = ref<string[]>([])
    const token = ref<string>('')
    // 定义登录状态
    const isLogin = ref(false)

    function loadFromStorage() {
        const savedUser = localStorage.getItem('user')
        const savedPermissions = localStorage.getItem('permissions')
        const savedToken = localStorage.getItem('token')

        if (savedUser) {
            user.value = JSON.parse(savedUser)
        }

        if (savedPermissions) {
            permissions.value = JSON.parse(savedPermissions)
        }

        if (savedToken) {
            token.value = savedToken
        }

        if (savedToken) {
            isLogin.value = true
        }
    }
    loadFromStorage()

    // 登录函数
    async function login(username: string, password: string) {
        try {
            const res = await request.post(
                `/login`,
                {
                    username,
                    password
                }
            )

            user.value = res.data.user
            permissions.value = res.data.permissions
            token.value = res.data.token

            // 修改登录状态
            isLogin.value = true

            // 持久化用户信息
            localStorage.setItem(
                'user',
                JSON.stringify(user.value)
            )

            //  持久化权限
            localStorage.setItem(
                'permissions',
                JSON.stringify(permissions.value)
            )

            //  持久化 JWT
            localStorage.setItem(
                'token',
                token.value
            )

            console.log('登录成功')
            console.log('用户：', user.value)
            console.log('权限：', permissions.value)
            console.log('JWT：', token.value)

            return res.data



        } catch (err) {
            console.error('登录失败', err)
            throw err
        }
    }


        // 重新拉取当前用户的权限
    async function refreshPermissions() {
        const res = await request.get('/me')

        user.value = res.data.user
        permissions.value = res.data.permissions

        localStorage.setItem('user', JSON.stringify(user.value))
        localStorage.setItem('permissions', JSON.stringify(permissions.value))
    }

    function logout() {
        // 清空pinia
        user.value = null
        permissions.value = []
        token.value = ''
        isLogin.value = false

        // 清空localStorage
        localStorage.removeItem('user')
        localStorage.removeItem('permissions')
        localStorage.removeItem('token')

    }

    return {
        user,
        permissions,
        token,
        isLogin,
        login,
        refreshPermissions,
        logout
    }
})