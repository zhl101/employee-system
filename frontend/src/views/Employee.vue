<template>

    <div class="employee-page">
        <h2>员工管理</h2>

        <div class="employee-list">
            <div class="filters">
                <input v-model="searchText" type="text" placeholder="查询员工" />

                <select v-model="selectedDepartment">
                    <option value="">全部部门</option>
                    <option v-for="department in departments" :key="department.id" :value="department.name">
                        {{ department.name }}
                    </option>
                </select>

                <button class="add-btn" @click="showForm = true">
                    新增员工
                </button>
            </div>

            <div v-if="showForm" class="form">
                <input v-model="newEmployee.name" type="text" placeholder="员工姓名" />
                <select v-model="newEmployee.department">
                    <option value="">请选择部门</option>

                    <option v-for="department in departments" :key="department.id" :value="department.name">
                        {{ department.name }}
                    </option>
                </select>


                <input v-model="newEmployee.position" type="text" placeholder="员工职位" />

                <select v-model="newEmployee.status">
                    <option value="在职">在职</option>
                    <option value="离职">离职</option>
                </select>

                <button @click="addEmployee">保存</button>
                <button @click="cancelAdd">取消</button>
            </div>

            <div v-if="showEditForm" class="add-form">
                <h4>编辑员工</h4>

                <input v-model="editEmployeeData.name" type="text" placeholder="请输入姓名">

                <select v-model="editEmployeeData.department">
                    <option value="">请选择部门</option>
                    <option v-for="department in departments" :key="department.id" :value="department.name">
                        {{ department.name }}
                    </option>
                </select>

                <input v-model="editEmployeeData.position" type="text" placeholder="请输入职位">

                <select v-model="editEmployeeData.status">
                    <option value="在职">在职</option>
                    <option value="离职">离职</option>
                </select>

                <button @click="saveEdit">
                    保存修改
                </button>

                <button @click="showEditForm = false">
                    取消
                </button>
            </div>

            <EmployeeTable :employees="filteredEmployees" @edit="editEmployee" @delete="deleteEmployee"
                @toggle-status="toggleStatus" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import EmployeeTable from '../components/EmployeeTable.vue'
import employees, { loadEmployees } from '../data/employees'
import departments, { loadDepartments } from '../data/departments'

const showForm = ref(false)
const showEditForm = ref(false)
onMounted(async () => {
    await loadEmployees()
    await loadDepartments()
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
        const res = await axios.post('http://localhost:3000/api/employees', newEmployee.value)
        console.log('新增员工成功：', res.data)

        // 重新获取员工数据
        await loadEmployees()
        showForm.value = false
        newEmployee.value = {
            name: '',
            department: '',
            position: '',
            status: '在职'
        }
    } catch (err) {
        console.error('新增员工失败：', error)
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
        const res = await axios.delete(
            `http://localhost:3000/api/employees/${id}`
        )
        console.log('删除员工成功：', res.data)

        // 重新获取数据库中的员工数据
        await loadEmployees()

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
        const res = await axios.put(
            `http://localhost:3000/api/employees/${id}`,
            editEmployeeData.value
        )
        console.log('修改员工成功：', res.data)
        // 重新获取数据库中的最新数据
        await loadEmployees(
            // 关闭编辑窗口
            showEditForm.value = false
        )
    } catch (error) {
        console.error('修改员工失败：', error)
        alert('修改员工失败')
    }
}
const toggleStatus = (id) => {
    const employee = employees.value.find(
        employee => employee.id === id
    )

    if (!employee) {
        return
    }

    employee.status = employee.status === '在职' ? '离职' : '在职'

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

.employee-list input {
    width: 300px;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.employee-list select {
    width: 150px;
    padding: 10px;
    margin-left: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.add-btn {
    padding: 8px 10px;
    margin-left: 10px;
    border: none;
    border-radius: 6px;
    background: #1f2937;
    color: white;
    font-size: 14px;
    cursor: pointer;
}

.add-btn:hover {
    background: #374151;
}

.form {
    margin: 20px 0;
    padding: 20px;
    background: #f5f6f8;
    border-radius: 6px;
}

.form input,
.form select {
    padding: 8px;
    margin-right: 10px;
    margin-bottom: 10px;
}

.form button {
    padding: 8px 16px;
    margin-right: 10px;
    cursor: pointer;
}
</style>