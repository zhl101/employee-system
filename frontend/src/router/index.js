import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Employee from '../views/Employee.vue'
import Department from '../views/Department.vue'
import Authority from '../views/Authority.vue'
import System from '../views/System.vue'
import Login from '../views/Login.vue'
import { useLoginStore } from '../stores/login'

// 挂载路由
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/employee',
        name: 'Employee',
        component: Employee,
        meta: {
            permission: 'employee'
        }
    },
    {
        path: '/department',
        name: 'Department',
        component: Department,
        meta: {
            permission: 'department'
        }
    },
    {
        path: '/authority',
        name: 'Authority',
        component: Authority,
        meta: {
            permission: 'permission'
        }
    }
    ,
    {
        path: '/system',
        name: 'System',
        component: System,
        meta: {
            permission: 'system'
        }
    }

]

// 创建整个Vue Router
const router = createRouter({
    // 使用浏览器正常的URL：
    history: createWebHistory(),
    routes
})

function isTokenExpired(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(atob(base64))
        return payload.exp * 1000 <= Date.now()
    } catch (e) {
        return true
    }
}


// 路由守卫
router.beforeEach(async (to) => {
    const token = localStorage.getItem('token')

    if ((!token || isTokenExpired(token)) && to.path !== '/login') {
        localStorage.removeItem('user')
        localStorage.removeItem('permissions')
        localStorage.removeItem('token')
        return '/login'
    }

    if (token && to.path === '/login') {
        return '/home'
    }

    let permissions = []

    if (token) {
        const loginStore = useLoginStore()

        try {
            await loginStore.refreshPermissions()
            permissions = loginStore.permissions
        } catch (err) {
            console.error('刷新权限失败：', err)
            localStorage.removeItem('user')
            localStorage.removeItem('permissions')
            localStorage.removeItem('token')
            return '/login'
        }
    } else {
        const savedPermissions = localStorage.getItem('permissions')
        permissions = savedPermissions ? JSON.parse(savedPermissions) : []
    }

    const requiredPermission = to.meta.permission

    if (requiredPermission && !permissions.includes(requiredPermission)) {
        return '/home'
    }

    return true
})

export default router