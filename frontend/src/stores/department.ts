import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import axios from 'axios'
import type { Department } from '../types/department'

export const useDepartmentStore = defineStore('department', () => {
    // 部门数据
    const departments = ref<Department[]>([])

     // getter:部门数量
    const departmentCount = computed(() => {

        return departments.value.length

    })

    // 获取所有部门
    async function loadDepartments() :Promise<void>{
        try {
            const res = await axios.get<Department[]>(
                'http://localhost:3000/api/departments'
            )
            departments.value = res.data
            console.log(
                '部门数据加载成功：',
                departments.value
            )
        } catch (err) {
            console.error('获取部门失败', err)
            throw err
        }
    }

    // 新增部门
    async function addDepartment(departmentData:Omit<Department,'id'>):Promise<void> {
        try {
            const res = await axios.post<Department>(
                'http://localhost:3000/api/departments',
                departmentData
            )
            console.log(
                '新增部门成功：',
                res.data
            )

            await loadDepartments()
        } catch (err) {
            console.error('新增部门失败', err)
            throw err
        }
    }

    // 修改部门
    async function updateDepartment(id:number, departmentData:Omit<Department,'id'>) :Promise<void>{
        try {
            const res = await axios.put<Department>(
                `http://localhost:3000/api/departments/${id}`,
                departmentData
            )

            console.log(
                '修改部门成功：',
                res.data
            )

            // 修改后重新查询
            await loadDepartments()

        } catch (error) {
            console.error(
                '修改部门失败：',
                error
            )

            throw error
        }
    }

    // 删除部门
    async function deleteDepartment(id:number):Promise<void> {
        try {
            const res = await axios.delete<{message:string}>(
                `http://localhost:3000/api/departments/${id}`
            )

            console.log(
                '删除部门成功：',
                res.data
            )

            // 删除后重新查询
            await loadDepartments()

        } catch (error) {
            console.error(
                '删除部门失败：',
                error
            )

            throw error
        }
    }


    return {
        departments,
        loadDepartments,
        departmentCount,
        addDepartment,
        updateDepartment,
        deleteDepartment
    }
})