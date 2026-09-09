<template>

    <div class="employee-page">
        <h2>员工管理</h2>

        <div class="employee-list">
            <div class="filters">
                <el-input v-model="searchText" placeholder="查询员工" style="width: 220px" />

                <el-select v-model="selectedDepartment" placeholder="请选择部门" style="width: 180px">
                    <el-option label="全部部门" :value="''">全部部门</el-option>
                    <el-option v-for="department in departments" :key="department.id" :value="department.name">
                        {{ department.name }}
                    </el-option>
                </el-select>

                <el-button type="primary" @click="showForm = true">
                    新增员工
                </el-button>
            </div>

            <el-dialog v-model="showForm" class="form">
                <h3>新增员工</h3>

                <el-input v-model="newEmployee.name" placeholder="请输入员工姓名" style="width: 220px" />

                <el-select v-model="newEmployee.department" placeholder="请选择部门" style="width: 180px">
                    <el-option v-for="department in departments" :key="department.id" :label="department.name"
                        :value="department.name" />
                </el-select>

                <el-input v-model="newEmployee.position" placeholder="请输入员工职位" style="width: 220px" />

                <el-select v-model="newEmployee.status" placeholder="请选择状态" style="width: 150px">
                    <el-option label="在职" value="在职" />
                    <el-option label="离职" value="离职" />
                </el-select>

                <div class="form-buttons">
                    <el-button type="primary" @click="addEmployee">
                        保存
                    </el-button>

                    <el-button @click="cancelAdd">
                        取消
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog v-model="showEditForm" class="form">
                <h3>编辑员工</h3>

                <el-input v-model="editEmployeeData.name" placeholder="请输入员工姓名" style="width: 220px" />

                <el-select v-model="editEmployeeData.department" placeholder="请选择部门" style="width: 180px">
                    <el-option v-for="department in departments" :key="department.id" :label="department.name"
                        :value="department.name" />
                </el-select>

                <el-input v-model="editEmployeeData.position" placeholder="请输入员工职位" style="width: 220px" />

                <el-select v-model="editEmployeeData.status" placeholder="请选择状态" style="width: 150px">
                    <el-option label="在职" value="在职" />
                    <el-option label="离职" value="离职" />
                </el-select>

                <div class="form-buttons">
                    <el-button type="primary" @click="saveEdit">
                        保存修改
                    </el-button>

                    <el-button @click="showEditForm = false">
                        取消
                    </el-button>
                </div>
            </el-dialog>

            <EmployeeTable :employees="filteredEmployees" @edit="editEmployee" @delete="deleteEmployee"
               />
        </div>
    </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue'
import EmployeeTable from '../components/EmployeeTable.vue'
import { useEmployeeStore } from '../stores/employee.js'
import { storeToRefs } from 'pinia'
import { useDepartmentStore } from '../stores/department'


const employeeStore = useEmployeeStore()
const { employees } = storeToRefs(employeeStore)
const departmentStore = useDepartmentStore()
const { departments } = storeToRefs(departmentStore)
const showForm = ref(false)
const showEditForm = ref(false)
onMounted(async () => {
    await employeeStore.loadEmployees()
    await departmentStore.loadDepartments()
})
const editEmployeeData = ref({
    id: null,
    name: '',
    department: '',
    position: '',
    status: '在职'
})

const newEmployee = ref({
    name: '',
    department: '',
    position: '',
    status: '在职'
})

const addEmployee = async () => {
    if (newEmployee.value.name === '') {
        alert('请输入员工姓名')
        return
    }

    if (newEmployee.value.department === '') {
        alert('请输入员工部门')
        return
    }

    if (newEmployee.value.position === '') {
        alert('请输入员工职位')
        return
    }

    try {
        await employeeStore.addEmployee(newEmployee.value)
        showForm.value = false
        newEmployee.value = {
            name: '',
            department: '',
            position: '',
            status: '在职'
        }
    } catch (err) {
        console.error('新增员工失败：', err)
        alert('新增员工失败')
    }
}

const cancelAdd = () => {
    showForm.value = false

    newEmployee.value = {
        name: '',
        department: '',
        position: '',
        status: '在职'
    }
}

const editEmployee = (employee) => {
    editEmployeeData.value = {
        id: employee.id,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        status: employee.status
    }

    showEditForm.value = true
}

const searchText = ref('')
const selectedDepartment = ref('')

const filteredEmployees = computed(() => {
    return employees.value.filter(employee => {
        const matchName = employee.name.includes(searchText.value)

        const matchDepartment =
            selectedDepartment.value === '' ||
            employee.department === selectedDepartment.value

        return matchName && matchDepartment
    })
})
const deleteEmployee = async (id) => {
    const result = confirm('确定要删除这名员工吗？')

    if (!result) {
        return
    }

    try {
       await employeeStore.deleteEmployee(id)
      
    } catch (err) {
        console.error('删除员工失败：', err)
        alert('删除员工失败')
    }
}
const saveEdit = async () => {
    if (editEmployeeData.value.name === '') {
        alert('请输入员工姓名')
        return
    }

    if (editEmployeeData.value.department === '') {
        alert('请选择部门')
        return
    }

    if (editEmployeeData.value.position === '') {
        alert('请输入员工职位')
        return
    }

    try {
        const id = editEmployeeData.value.id
        await employeeStore.updateEmployee(
            id,
            editEmployeeData.value
        )
        showEditForm.value = false
    } catch (error) {
        console.error('修改员工失败：', error)
        alert('修改员工失败')
    }
}

</script>

<style scoped>
.employee-page {
    padding: 30px;
    background: #f5f6f8;
    min-height: calc(100vh - 64px);
}

.employee-list {
    margin-top: 30px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.filters {
    display: flex;
    align-items: center;
    gap: 12px;
}


.form {
    margin: 20px 0;
    padding: 20px;
    background: #f5f6f8;
    border-radius: 6px;
}

.form h3 {
    margin-top: 0;
    margin-bottom: 20px;
}

.form .el-input,
.form .el-select {
    margin-right: 10px;
    margin-bottom: 15px;
}

.form-buttons {
    margin-top: 10px;
}
</style>