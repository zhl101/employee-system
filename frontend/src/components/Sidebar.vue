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

        <nav class="menu">
            <p class="menu-title">
                MENU
            </p>

           <!-- 首页 -->
            <router-link to="/home" class="menu-item">
                <el-icon class="icon">
                    <House />
                </el-icon>
                <span>
                    首页
                </span>
            </router-link>


            <!-- 员工管理 -->
            <router-link  v-if="hasPermission('employee')" to="/employee" class="menu-item">
                <el-icon class="icon">
                    <User />
                </el-icon>
                <span>
                    员工管理
                </span>
            </router-link>


            <!-- 部门管理 -->
            <router-link  v-if="hasPermission('departement')" to="/department"  class="menu-item" >
                <el-icon class="icon">
                    <OfficeBuilding />
                </el-icon>
                <span>
                    部门管理
                </span>
            </router-link>


            <!-- 系统 -->
            <p class="menu-title">
                SYSTEM
            </p>

            <!-- 权限管理 -->
            <router-link  v-if="hasPermission('permission')" to="/authority" class="menu-item" >
                 <el-icon class="icon">
                    <Lock />
                </el-icon>
                <span>
                    权限管理
                </span>
            </router-link>


            <!-- 系统设置 -->
            <router-link  v-if="hasPermission('system')" to="/system" class="menu-item">
                <el-icon class="icon">
                    <Setting />
                </el-icon>
                <span>
                    系统设置
                </span>
            </router-link>
        </nav>


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

                <span>
                    系统管理员
                </span>

            </div>

        </div>
        <button @click="handleLogout">
    退出登录
</button>

    </aside>

</template>


<script setup>

// Element Plus 图标
import { useRouter } from 'vue-router'
import { useLoginStore } from '../stores/login'
import { House,User, OfficeBuilding,Lock,Setting} from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'

const router=useRouter()
const loginStore = useLoginStore()
const { permissions } = storeToRefs(loginStore)
function handleLogout(){
    loginStore.logout()

    router.push('/login')
}

const hasPermission = (permission) => {
    return permissions.value.includes(permission)
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
   菜单项
========================= */

.menu-item {

    display: flex;

    align-items: center;

    width: 100%;

    height: 46px;

    box-sizing: border-box;

    margin-bottom: 5px;

    padding: 0 12px;

    color: #d1d5db;

    text-decoration: none;

    border-radius: 8px;

    transition: all 0.2s;

}


/* =========================
   Element Plus 图标
========================= */

.icon {

    width: 22px;

    height: 22px;

    margin-right: 10px;

    font-size: 18px;

}


/* =========================
   鼠标经过
========================= */

.menu-item:hover {

    background: #374151;

    color: white;

}


/* =========================
   当前页面
========================= */

.menu-item.router-link-active {

    background: #3b82f6;

    color: white;

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