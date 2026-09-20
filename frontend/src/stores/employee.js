import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '../api/request'

export const useEmployeeStore = defineStore('employee', () => {
    // state:员工数据
    const employees = ref([])



    // getter：员工总人数
    const employeeCount = computed(() => {
        return employees.value.length
    })

    // getter：在职员工人数
    const activeEmployeeCount = computed(() => {
        return employees.value.filter(
            employee => employee.status === '在职'
        ).length
    })
    // getter：离职员工人数
    const inactiveEmployeeCount = computed(() => {
        return employees.value.filter(
            employee => employee.status === '离职'
        ).length
    })
   
  



    // action:获取员工数据
    async function loadEmployees() {
        try {
            const res = await request.get('/employees')
            employees.value = res.data
        } catch (err) {
            console.error('员工数据加载失败：', err)
            throw err
        }
    }

    // 新增员工
    async function addEmployee(employeeData) {
        try {
            await request.post(
                `/employees`,
                employeeData
            )

            // 新增成功后重新获取员工列表
            await loadEmployees()

            console.log('新增员工成功')
        } catch (error) {
            console.error('新增员工失败：', error)
            throw error
        }
    }

    // 修改员工
    async function updateEmployee(id, employeeData) {
        try {
            const res = await request.put(
                `/employees/${id}`,
                employeeData
            )
            console.log('修改员工成功：', res.data)
            await loadEmployees()

        } catch (err) {
            console.error('修改员工失败', err)
            throw err
        }
    }

    // 删除员工
    async function deleteEmployee(id) {
        try {
            const res = await request.delete(
                `/employees/${id}`
            )
            console.log('删除员工成功：', res.data)

            // 重新获取数据库中的员工数据
            await loadEmployees()

        } catch (err) {
            console.error('删除员工失败', err)
            throw err
        }
    }
    return {
        employees,
        employeeCount,
        activeEmployeeCount,
        inactiveEmployeeCount,
        loadEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee
    }
})