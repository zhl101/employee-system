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

export default router