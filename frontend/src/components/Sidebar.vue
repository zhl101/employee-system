<template>
  <aside class="sidebar">
    <!-- 系统标题 -->
    <div class="logo">
      <div class="logo-icon">E</div>

      <div class="logo-text">
        <h2>企业管理系统</h2>
      </div>

    </div>
    <div class="box">
      <span>Management System</span>
    </div>



    <!-- 菜单 -->
    <nav class="menu">
      <p class="menu-title">MENU</p>

      <router-link to="/" class="menu-item">
        <span class="icon">⌂</span>
        <span>首页</span>
      </router-link>

      <router-link to="/employee" class="menu-item">
        <span class="icon">♙</span>
        <span>员工管理</span>
      </router-link>

      <router-link to="/department" class="menu-item">
        <span class="icon">▦</span>
        <span>部门管理</span>
      </router-link>

      <p class="menu-title">SYSTEM</p>

      <router-link to="/authority" class="menu-item">
        <span class="icon">♢</span>
        <span>权限管理</span>
      </router-link>

      <router-link to="/system" class="menu-item">
        <span class="icon">⚙</span>
        <span>系统设置</span>
      </router-link>
    </nav>

    <!-- 底部用户信息 -->
    <div class="sidebar-footer">
      <div class="avatar">管</div>

      <div class="user-info">
        <strong>管理员</strong>
        <span>系统管理员</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* 整个侧边栏 */
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
  padding: 0 8px 25px;
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
.box span {
  display: block;
  margin-top: 3px;
  font-size: 18px;
  
  color: #6b93d7;
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

/* 菜单按钮 */
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

/* 图标 */
.icon {
  width: 28px;

  font-size: 18px;

  text-align: center;

  margin-right: 8px;
}

/* 鼠标经过 */
.menu-item:hover {
  background: #374151;
  color: white;
}

/* 当前页面 */
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