<template>
  <h2>用户管理页面</h2>

  <el-button type="primary" @click="openAddUserForm">新增用户</el-button>

  <el-dialog v-model='showUserForm' title="新增用户" width="420px">
    <el-form :model="newUser" label-width="80px">
      <el-form-item label="用户名字">
        <el-input v-model="newUser.username" placeholder="请输入用户名字" />
      </el-form-item>


      <el-form-item>
        <el-input v-model="newUser.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>


      <el-form-item label="用户角色">
        <el-select v-model="newUser.roleId" placeholder=" 请选择角色">
          <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>


      </el-form-item>
    </el-form>
    <!-- Dialog 底部 -->
    <template #footer>

      <el-button @click="cancelAddUser">
        取消
      </el-button>

      <el-button type="primary" @click="addUser">
        确定
      </el-button>

    </template>
  </el-dialog>

  <el-table :data="users">
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="username" label="用户名" />
    <el-table-column prop="role_name" label="用户角色" />
    <el-table-column>
      <template #default="scope">
        <el-button type="danger" @click="deleteButton(scope.row.id)">删除用户</el-button>
      </template>
    </el-table-column>



  </el-table>
</template>


<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user';
import { useRoleStore } from '../stores/role';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue'

const userStore = useUserStore()
const roleStore = useRoleStore()
const { users } = storeToRefs(userStore)
const { roles } = storeToRefs(roleStore)

const newUser = ref({
  username: '',
  password: '',
  roleId: ''
})

const showUserForm = ref(false)
const openAddUserForm = () => {
  showUserForm.value = true
}
const cancelAddUser = () => {
  showUserForm.value = false
  newUser.value = {
    username: '',
    password: '',
    roleId: ''
  }
}

const addUser = async () => {
  try {

    // 调用Pinia,发送新增用户请求
    await userStore.addUser(newUser.value)

    showUserForm.value = false

    //  清空表单
    newUser.value = {
      username: '',
      password: '',
      roleId: ''
    }

    //  成功提示
    ElMessage.success('新增用户成功')

  } catch (err) {
    // 5. 控制台打印错误
    console.error('新增用户失败：', err)

    // 6. 显示后端返回的错误信息
    ElMessage.error(
      err.response?.data?.message || '新增用户失败')
  }
}
const deleteButton = async (id) => {
  try {
    // Element Plus确认框
    await ElMessageBox.confirm(
      '确认要删除这个用户吗？',
      '删除提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 用户确定删除
    await userStore.deleteUser(id)

    

  } catch (err) {
    console.error('删除用户失败', err)
     
  }
}
onMounted(() => {
  roleStore.loadRoles()
  userStore.loadUsers()
})




</script>