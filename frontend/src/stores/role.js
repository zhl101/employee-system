import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useRoleStore = defineStore('role', () => {
    // states:角色数据
    const roles = ref([])

    // action:获取所有角色
    async function loadRoles() {
        try {
            const res = await axios.get(
                `http://localhost:3000/api/roles`
            )
            roles.value = res.data
            console.log('角色数据加载成功：', roles.value)
        } catch (err) {
            console.error('角色数据加载失败：', err)
            throw err
        }
    }
    // actions:增加角色
    async function addRole(roleData){
        try{
            const res =await axios.post(
                `http://localhost:3000/api/roles`,
               roleData
            )
            console.log(
                '新增角色成功：',
                res.data
            )
            await loadRoles()
        }catch(err){
            console.error('增加角色失败：', err)
            throw err
        }
    }

    // 删除角色
    async function deleteRole(id){
        try{
            const res =await axios.delete(
                `http://localhost:3000/api/roles/${id}`
            )
            console.log(
                '删除角色成功：',
                res.data
            )

            // 删除后重新查询
            await loadRoles()
        }catch (error) {
            console.error(
                '删除角色失败：',
                error
            )

            throw error
        }

    }

    

    return{
        roles,
        loadRoles,
        addRole,
        deleteRole
    }
}) 