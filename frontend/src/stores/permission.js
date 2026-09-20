import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../api/request'


export const usePermissionStore = defineStore('permission', () => {
    // status:保存权限列表
    const permissions = ref([])

    // action:获取权限列表
    async function loadPermissions() {
        try {
            const res = await request.get(
                `/permissions`
            )
            permissions.value = res.data
            console.log('权限数据加载成功', permissions.value)
        } catch (err) {
            console.error('获取权限失败：', err)
            throw err
        }
    }


    async function savePermissions(roleId, permissionIds) {
        try {
            const res = await request.put(
                `/permissions/${roleId}/permissions`,
                {
                    permissionIds
                }
            )
            console.log('权限保存成功：', res.data)
            return res.data

        } catch (err) {
            console.error('保存权限失败：', err)
            throw err
        }
    }

    async function loadRolePermissions(roleId) {
    try {
        const res = await request.get(
            `/permissions/role/${roleId}`
        )

        console.log('角色权限加载成功：', res.data)

        return res.data
    } catch (err) {
        console.error('获取角色权限失败：', err)
        throw err
    }
}

    return {
        permissions,
        loadPermissions,
        savePermissions,
        loadRolePermissions
    }
})