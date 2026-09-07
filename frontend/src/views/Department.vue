<template>
  <div class="department-page">
    <div class="page-header">
      <div>
        <h2>部门管理</h2>
        <p>管理系统中的部门信息</p>
      </div>
    </div>

    <!-- 新增部门弹窗 -->
    <div class="modal" v-if="showForm">
      <h3>新增部门</h3>

      <div class="form-item">
        <label for="">部门名称</label>
        <input v-model="newDepartment.name" type="text" placeholder="请输入部门名称" />
      </div>

      <div class="form-item">
        <label>部门描述</label>

        <textarea v-model="newDepartment.description" placeholder="请输入部门描述"></textarea>
      </div>

      <!-- 按钮 -->
      <div class="form-actions">

        <button class="cancel-button" @click="cancelAdd">
          取消
        </button>

        <button class="confirm-button" @click="addDepartment">
          确定
        </button>
      </div>


    </div>

    <!-- 编辑部门弹窗 -->
    <div v-if="showEditForm" class="editForm">

      <h3>编辑部门</h3>

      <div class="form-item">
        <label>部门名称</label>

        <input v-model="editDepartmentData.name" type="text" placeholder="请输入部门名称">
      </div>

      <div class="form-item">
        <label>部门描述</label>

        <textarea v-model="editDepartmentData.description" placeholder="请输入部门描述"></textarea>
      </div>

      <div class="form-actions">

        <button class="cancel-button" @click="cancelEdit">
          取消
        </button>

        <button class="confirm-button" @click="saveEdit">
          保存
        </button>

      </div>

    </div>

    <div class="department-table">
      <div class="department-count">
        共 {{ departments.length }} 个部门
        <button class="add-button" @click="openAddForm">+新增部门</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>部门名称</th>
            <th>部门描述</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="department in departments" :key="department.id">
            <td>{{ department.id }}</td>
            <td>{{ department.name }}</td>
            <td>{{ department.description }}</td>
            <td>
              <button class="edit-button" @click="editButton(department)">编辑</button>
              <button class="delete-button" @click="deleteButton(department.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>




  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import departments, { loadDepartments } from '../data/departments';
import axios from 'axios'

// 控制新增部门弹窗
const showForm = ref(false)
// 控制编辑部门弹窗
const showEditForm = ref(false)

const editDepartmentData = ref({
  id: null,
  name: '',
  description: ''
})


// 新部门数据
const newDepartment = ref({
  name: '',
  description: ''
})



onMounted(() => {
  loadDepartments()
})

const openAddForm = () => {
  showForm.value = true
}

// 取消新增
const cancelAdd = () => {
  showForm.value = false

  newDepartment.value = {
    name: '',
    description: ''
  }
}

// 确定新增
const addDepartment = async () => {

  // 检查部门名称
  if (newDepartment.value.name === '') {
    alert('请输入部门名称')
    return
  }
  // 检查部门描述
  if (newDepartment.value.description === '') {
    alert('请输入部门描述')
    return
  }

  // 向后端发送POST请求
  try {
    const res = await axios.post(
      'http://localhost:3000/api/departments',
      newDepartment.value
    )

    console.log('新增部门成功：', res.data)


    // 3. 重新获取数据库中的部门
    await loadDepartments()


    // 4. 关闭弹窗
    showForm.value = false


    // 5. 清空表单
    newDepartment.value = {
      name: '',
      description: ''
    }

  } catch (err) {
    console.error('新增部门失败：', err)

    if (err.response) {
      console.log('服务器返回：', err.response.data)
    }

    alert(err.response?.data?.message || '新增部门失败')
  }
}


// 删除部门
const deleteButton = async (id) => {
  const result = confirm('确定要删除这个部门吗？')
  if (!result) {
    return
  }

  try {
    const res = await axios.delete(
      `http://localhost:3000/api/departments/${id}`
    )
    console.log('删除部门成功：', res.data)

    // 重新获取数据库中的部门数据
    await loadDepartments()

  } catch (err) {
    console.error('删除部门失败：', err)
    alert('删除部门失败')
  }
}

// 编辑部门
const editButton = (department) => {
  editDepartmentData.value = {
    id: department.id,
    name: department.name,
    description: department.description
  }
  showEditForm.value = true
}

// 取消编辑
const cancelEdit = () => {
  showEditForm.value = false
  editDepartmentData.value = {
    id: null,
    name: '',
    description: ''
  }
}

// 保存编辑
const saveEdit = async () => {
  // 检查部门名称
  if (editDepartmentData.value.name === '') {
    alert('请输入部门名称')
    return
  }

  // 检查部门描述
  if (editDepartmentData.value.description === '') {
    alert('请输入部门描述')
    return
  }

  try {
    const res = await axios.put(
      `http://localhost:3000/api/departments/${editDepartmentData.value.id}`,
      {
        name: editDepartmentData.value.name,
        description: editDepartmentData.value.description
      }
    )
    console.log('修改部门成功：', res.data)

    // 重新从数据库获取最新数据
    await loadDepartments()

    // 关闭编辑弹窗
    showEditForm.value = false

    // 清空编辑数据
    editDepartmentData.value = {
      id: null,
      name: '',
      description: ''
    }

  } catch (err) {
    console.error('修改部门失败：', err)

    if (err.response) {
      console.log('服务器返回：', err.response.data)
    }

    alert(err.response?.data?.message || '修改部门失败')
  }
}










</script>

<style scoped>
/* 页面整体 */
.department-page {

  padding: 30px;
  background: #f5f6f8;
  min-height: calc(100vh - 64px);
}

/* 页面标题 */
.department-page h2 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #333;
}

/* 部门表格容器 */
.department-table {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

/* 表格 */
.department-table table {
  width: 100%;
  border-collapse: collapse;
}

/* 表头 */
.department-table th {
  height: 50px;
  background: #f8f9fb;
  color: #555;
  font-weight: 600;
  text-align: center;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
}

/* 单元格 */
.department-table td {
  height: 55px;
  padding: 0 20px;
  color: #555;
  border-bottom: 1px solid #eee;
}

/* 鼠标经过 */
.department-table tbody tr:hover {
  background: #bbd2ff;
}

/* 部门名称 */
.department-name {
  font-weight: 600;
  color: #333;
}

/* 部门描述 */
.department-description {
  color: #888;
}

/* 部门数量提示 */
.department-count {
  margin-bottom: 15px;
  color: #888;
  font-size: 14px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-sizing: border-box;
}

.page-header h2 {
  margin: 0 0 6px;
}

.page-header p {
  margin: 0;
  color: #999;
  font-size: 18px;
}


/* 新增按钮 */
.add-button {
  margin-left: 20px;
  padding: 10px 10px;
  border: none;
  border-radius: 6px;
  background: #7d7e81;
  color: white;
  cursor: pointer;
}

.add-button:hover {
  opacity: 0.9;
}


/* 操作按钮 */
.edit-button,
.delete-button {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  background: white;
}

.edit-button {
  border: 1px solid #4c8bf5;
  color: #4c8bf5;
}

.delete-button {
  border: 1px solid #e55;
  color: #e55;
}





/* 弹窗 */
.modal {

  width: 420px;
  margin: 20px auto;
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-sizing: border-box;
}

.modal h3 {
  margin: 0 0 25px;
  font-size: 20px;
}


/* 表单 */
.form-item {
  margin-bottom: 18px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
}

.form-item input,
.form-item textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;

  border: 1px solid #ddd;
  border-radius: 5px;

  outline: none;
  font-size: 14px;
}

.form-item textarea {
  height: 100px;
  resize: vertical;
}

.form-item input:focus,
.form-item textarea:focus {
  border-color: #4c8bf5;
}


/* 底部按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 25px;
}

.cancel-button,
.confirm-button {
  padding: 9px 18px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  border: 1px solid #ddd;
  background: white;
  color: #555;
}

.confirm-button {
  border: none;
  background: #4c8bf5;
  color: white;
}

.editForm {
  width: 420px;
  margin: 20px auto;
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-sizing: border-box;
}

.editForm h3 {
  margin: 0 0 25px;
  font-size: 20px;
}

.editForm input,
.editForm textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;

  border: 1px solid #ddd;
  border-radius: 5px;

  outline: none;
  font-size: 14px;
}

.editForm textarea {
  height: 100px;
  resize: vertical;
}

.editForm input:focus,
.editForm textarea:focus {
  border-color: #4c8bf5;
}
</style>