<template>

    <aside class="sidebar">
        <div class="logo">
            <div class="logo-icon">
                E
            </div>
            <div class="logo-text">
                <h2>
                    企业管理系统
                </h2>
            </div>
        </div>
        <div class="box">
            <span>
                Management System
            </span>
        </div>

  <el-menu
    class="sidebar-menu"
    :default-active="$route.path"
    router
>
    <el-menu-item
        v-for="menu in visibleMenus"
        :key="menu.path"
        :index="menu.path"
    >
        <el-icon>
            <component :is="menu.icon" />
        </el-icon>

        <span>{{ menu.name }}</span>
    </el-menu-item>
</el-menu>


        <!-- =========================
             底部用户信息
        ========================== -->

        <div class="sidebar-footer">

            <div class="avatar">
                管
            </div>


            <div class="user-info">

                <strong>
                    {{ loginStore.user?.username }}
                </strong>

               

            </div>

        </div>
        <button @click="handleLogout">
            退出登录
        </button>

    </aside>

</template>


<script setup>
import { computed } from 'vue'
// Element Plus 图标
import { useRouter } from 'vue-router'
import { useLoginStore } from '../stores/login'
import { House, User, OfficeBuilding, Lock, Setting } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'

const router = useRouter()
const loginStore = useLoginStore()
const { permissions } = storeToRefs(loginStore)

const menus = [
    {
        name: '首页',
        path: '/home',
        icon: House
    },
    {
        name: '员工管理',
        path: '/employee',
        icon: User,
        permission: 'employee'
    },
    {
        name: '部门管理',
        path: '/department',
        icon: OfficeBuilding,
        permission: 'department'
    },
    {
        name: '权限管理',
        path: '/authority',
        icon: Lock,
        permission: 'authority'
    },
    {
        name: '系统管理',
        path: '/system',
        icon: Setting,
        permission: 'system'
    }
]
const visibleMenus = computed(() => {
    return menus.filter(menu => {
        // 首页不需要权限
        if (!menu.permission) {
            return true
        }

        // 有权限才显示
        return permissions.value.includes(menu.permission)
    })
})
function handleLogout() {
    loginStore.logout()

    router.push('/login')
}

</script>


<style scoped>
/* =========================
   整个侧边栏
========================= */

.sidebar {

    position: fixed;

    left: 0;

    top: 0;

    width: 220px;

    height: 100vh;

    box-sizing: border-box;

    background: #1f2937;

    color: white;

    padding: 24px 14px;

    display: flex;

    flex-direction: column;

}


/* =========================
   Logo
========================= */

.logo {

    display: flex;

    align-items: center;

    padding: 0 8px 12px;

}


.logo-icon {

    width: 38px;

    height: 38px;

    display: flex;

    align-items: center;

    justify-content: center;

    background: #3b82f6;

    border-radius: 10px;

    font-size: 20px;

    font-weight: bold;

    margin-right: 10px;

}


.logo-text h2 {

    margin: 0;

    color: white;

    font-size: 20px;

    font-weight: 600;

}


/* =========================
   英文副标题
========================= */

.box {

    padding-left: 8px;

    margin-bottom: 20px;

}


.box span {

    display: block;

    font-size: 13px;

    color: #6b93d7;

    letter-spacing: 0.5px;

}


/* =========================
   菜单
========================= */

.menu {

    flex: 1;

}


.menu-title {

    margin: 18px 8px 8px;

    font-size: 11px;

    color: #6b7280;

    letter-spacing: 1px;

}



/* =========================
   Element Plus 菜单
========================= */

.sidebar-menu {
    flex: 1;

    border-right: none;

    background: transparent;

    --el-menu-bg-color: transparent;
    --el-menu-text-color: #d1d5db;
    --el-menu-hover-bg-color: #374151;
    --el-menu-active-color: white;
}


/* =========================
   菜单项
========================= */

.sidebar-menu :deep(.el-menu-item) {

    height: 46px;

    line-height: 46px;

    margin-bottom: 5px;

    padding: 0 12px !important;

    color: #d1d5db;

    border-radius: 8px;

    font-size: 14px;

    transition: all 0.2s;

}


/* =========================
   鼠标经过
========================= */

.sidebar-menu :deep(.el-menu-item:hover) {

    background: #374151;

    color: white;

}


/* =========================
   当前页面
========================= */

.sidebar-menu :deep(.el-menu-item.is-active) {

    background: #3b82f6;

    color: white;

}


/* =========================
   Element Plus 图标
========================= */

.sidebar-menu :deep(.el-icon) {

    width: 22px;

    height: 22px;

    margin-right: 10px;

    font-size: 18px;

}



/* =========================
   底部用户
========================= */

.sidebar-footer {

    display: flex;

    align-items: center;

    padding: 14px 8px;

    border-top: 1px solid #374151;

}


.avatar {

    width: 36px;

    height: 36px;

    display: flex;

    align-items: center;

    justify-content: center;

    background: #374151;

    border-radius: 50%;

    font-size: 14px;

    margin-right: 10px;

}


.user-info {

    display: flex;

    flex-direction: column;

}


.user-info strong {

    font-size: 13px;

}


.user-info span {

    margin-top: 3px;

    font-size: 11px;

    color: #9ca3af;

}
</style>