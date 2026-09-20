import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import request from '../api/request'
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
            const res = await request.get<Department[]>(
                '/departments'
            )
            departments.value = res.data
        } catch (err) {
            console.error('获取部门失败', err)
            throw err
        }
    }

    // 新增部门
    async function addDepartment(departmentData:Omit<Department,'id'>):Promise<void> {
        try {
            const res = await request.post<Department>(
                '/departments',
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
            const res = await request.put<Department>(
                `/departments/${id}`,
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
            const res = await request.delete<{message:string}>(
                `/departments/${id}`
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