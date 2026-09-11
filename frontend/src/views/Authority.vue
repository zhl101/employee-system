<template>
  <div class="authority-page">


    <div class="table-header">
      <h3>角色权限管理</h3>

      <header-buttons>
        <el-button type="primary" @click="openAddForm">新增角色</el-button>
        <el-button type="primary" @click="openAddUserForm">新增用户</el-button>
      </header-buttons>
    </div>


    <el-dialog v-model="showForm" title="新增角色" width="420px">

      <el-form ref="formRef" :model="newRole" :rules="rules" label-width="80px">
        <el-form-item label="角色名字" prop="name">
          <el-input v-model="newRole.name" placeholder="请输入角色名字" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="newRole.description" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
      <!-- Dialog 底部 -->
      <template #footer>

        <el-button @click="cancelAdd">
          取消
        </el-button>

        <el-button type="primary" @click="addRole">
          确定
        </el-button>

      </template>
    </el-dialog>

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

    <el-dialog v-model="showPermissionForm" title="设置权限" width="420px">
      <p>
        当前角色：
        {{ currentRole?.name }}
      </p>

      <el-checkbox-group v-model="selectedPermissions">
        <el-checkbox v-for="permission in permissions" :key="permission.id" :value="permission.id">
          {{ permission.name }}
        </el-checkbox>
      </el-checkbox-group>

      <template #footer>
        <el-button @click="showPermissionForm = false">
          取消
        </el-button>

        <el-button type="primary" @click="savePermissions">
          保存
        </el-button>
      </template>
    </el-dialog>

    <el-table :data="roles">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="description" label="权限" />
      <el-table-column label="操作">
        <template #default="scope">
          <!-- <el-button type="primary">编辑</el-button> -->
          <el-button type="success" @click="openPermissionForm(scope.row)">
            设置权限
          </el-button>
          <el-button typy="danger" @click="deleteButton(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>


  </div>
</template>


<script setup>

import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useRoleStore } from '../stores/role';
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePermissionStore } from '../stores/permission'
import { useUserStore } from '../stores/user';



const currentRole = ref(null)
const selectedPermissions = ref([])


const permissionStore = usePermissionStore()
const { permissions } = storeToRefs(permissionStore)

const roleStore = useRoleStore()
const { roles } = storeToRefs(roleStore)

const userStore = useUserStore()
const { users } = storeToRefs(userStore)

const showPermissionForm = ref(false)
const showForm = ref(false)
const showUserForm = ref(false)

const openAddUserForm = () => {
  showUserForm.value = true
}

const openPermissionForm = async (role) => {
  currentRole.value = role

  try {
    const data = await permissionStore.loadRolePermissions(role.id)

    selectedPermissions.value = data.map(
      item => item.permission_id
    )

    showPermissionForm.value = true
  } catch (err) {
    console.error('获取角色权限失败：', err)
    ElMessage.error('获取角色权限失败')
  }
}

const newUser = ref({
  username: '',
  password: '',
  roleId: ''
})
const savePermissions = async () => {
  try {
    await permissionStore.savePermissions(
      currentRole.value.id,
      selectedPermissions.value
    )

    ElMessage.success('权限保存成功')

    showPermissionForm.value = false
  } catch (err) {
    console.error('保存权限失败：', err)

    ElMessage.error(
      err.response?.data?.message || '权限保存失败'
    )
  }
}



const newRole = ref({
  name: '',
  description: ''

})

const formRef = ref()
const rules = {
  name: [{
    required: true,
    message: '请输入要角色名称',
    trigger: 'blur'//失去焦点
  }],
  description: [{
    required: true,
    message: '请输入角色描述',
    trigger: 'blur'
  }]
}

const openAddForm = () => {
  showForm.value = true
}
const cancelAdd = () => {
  showForm.value = false

  newRole.value = {

    name: '',

    description: ''

  }
  formRef.value?.resetFields()
}
const cancelAddUser = () => {
  showUserForm.value = false
  newUser.value = {
    username: '',
    password: '',
    roleId: ''
  }
}

const addRole = async () => {

  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    await roleStore.addRole(newRole.value)
    showForm.value = false

    newRole.value = {
      name: '',
      description: ''
    }
    // 成功提示
    ElMessage.success(
      '新增角色成功'
    )
  } catch (err) {
    console.error(
      '新增角色失败：',
      err
    )
    console.log(
      '服务器返回：',
      err.response?.data
    )


    ElMessage.error(
      err.response?.data?.message ||
      '新增角色失败'
    )
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
      '确定要删除这个角色吗？',
      '删除提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }

    )

    // 用户点击确定
    await roleStore.deleteRole(id)
    // 成功提示
    ElMessage.success(
      '删除部门成功'
    )
  } catch (err) {
    // 点击取消也会进入 catch
    // 所以这里不直接提示删除失败
    if (err === 'cancel') {
      return
    }
    if (err === 'close') {
      return
    }
    console.error(
      '删除角色失败：',
      err
    )
    ElMessage.error(
      err.response?.data?.message ||
      '删除角色失败'
    )

  }

}

onMounted(async () => {
  await roleStore.loadRoles()
  await permissionStore.loadPermissions()
  await userStore.loadUsers()
})
</script>


<style scoped>
.authority-page {
  padding: 30px;
  background: #f5f6f8;
  min-height: calc(100vh - 64px);
}

.table-header {
  /* display: flex;
  justify-content: center;
  align-items: center; */
  padding: 15px 20px;
  margin-bottom: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}
</style>