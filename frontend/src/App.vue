<template>

   <!-- 登录页面 -->
    <router-view v-if="route.path === '/login'" />

  <div v-else class="app">
    <!-- 左侧菜单 -->
    <Sidebar />
    <!-- 右侧区域 -->
    <div class="main">
      <Header />



      <!-- 内容区域 -->
      <router-view />
     
    </div>


  </div>
</template>


<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

</script>

<style>


.app {
  min-height: 100vh;
}


.main {
   margin-left: 220px;
  width: calc(100% - 220px);
  min-height: 100vh;
  box-sizing: border-box;
}


</style>
