import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Employee from '../views/Employee.vue'
import Department from '../views/Department.vue'
import Authority from '../views/Authority.vue'
import System from '../views/System.vue'
import Login from '../views/Login.vue'

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
        component: Employee
    },
    {
        path: '/department',
        name: 'Department',
        component: Department
    },
    {
        path: '/authority',
        name: 'Authority',
        component: Authority
    }
    ,
    {
        path: '/system',
        name: 'System',
        component: System
    }

]

// 创建整个Vue Router
const router = createRouter({
    // 使用浏览器正常的URL：
    history: createWebHistory(),
    routes
})


// 路由守卫
router.beforeEach((to)=>{
     // 从 localStorage 获取 JWT
    const token = localStorage.getItem('token')

    // 没有 token，不允许访问其他页面
    if (!token && to.path !== '/login') {
        return '/login'
    }

    // 已经登录，不允许再次进入登录页
    if (token && to.path === '/login') {
        return '/home'
    }

    // 其他情况正常进入
    return true
})

export default router