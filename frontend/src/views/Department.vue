<template>

    <div class="department-page">
        <div class="page-header">

            <div>

                <h2>部门管理</h2>

                <p>
                    管理系统中的部门信息
                </p>

            </div>

        </div>

        <div class="department-table">

            <div class="table-header">

                <div class="department-count">

                    共
                    <strong>{{ departmentStore.departmentCount}}</strong>
                    个部门

                </div>


                <el-button type="primary" @click="openAddForm">

                    + 新增部门

                </el-button>

            </div>


            <!-- Element Plus 表格 -->
            <el-table :data="departments" border stripe style="width: 100%">
                <!-- ID -->
                <el-table-column prop="id" label="ID" width="80" />
                <!-- 部门名称 -->
                <el-table-column prop="name" label="部门名称" min-width="160" />
                <!-- 部门描述 -->
                <el-table-column prop="description" label="部门描述" min-width="300" />

                <el-table-column label="操作" width="180" fixed="right">

                    <template #default="scope">

                        <el-button type="primary" link @click="editButton(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="danger" link @click="deleteButton(scope.row.id)">
                            删除
                        </el-button>

                    </template>

                </el-table-column>

            </el-table>

        </div>

        <el-dialog v-model="showForm" title="新增部门" width="420px">

            <el-form ref="formRef" :model="newDepartment" :rules="rules" label-width="80px">

                <!-- 部门名称 -->

                <el-form-item label="部门名称" prop="name">

                    <el-input v-model="newDepartment.name" placeholder="请输入部门名称" />

                </el-form-item>


                <!-- 部门描述 -->

                <el-form-item label="部门描述" prop="description">

                    <el-input v-model="newDepartment.description" type="textarea" :rows="4" placeholder="请输入部门描述" />

                </el-form-item>

            </el-form>


            <!-- Dialog 底部 -->

            <template #footer>

                <el-button @click="cancelAdd">
                    取消
                </el-button>

                <el-button type="primary" @click="addDepartment">
                    确定
                </el-button>

            </template>

        </el-dialog>


        <el-dialog v-model="showEditForm" title="编辑部门" width="420px">

            <el-form ref="editFormRef" :model="editDepartmentData" :rules="rules" label-width="80px">

                <!-- 部门名称 -->

                <el-form-item label="部门名称" prop="name">

                    <el-input v-model="editDepartmentData.name" placeholder="请输入部门名称" />

                </el-form-item>


                <!-- 部门描述 -->

                <el-form-item label="部门描述" prop="description">

                    <el-input v-model="editDepartmentData.description" type="textarea" :rows="4"
                        placeholder="请输入部门描述" />

                </el-form-item>

            </el-form>


            <!-- Dialog 底部 -->

            <template #footer>

                <el-button @click="cancelEdit">
                    取消
                </el-button>

                <el-button type="primary" @click="saveEdit">
                    保存
                </el-button>

            </template>

        </el-dialog>

    </div>

</template>


<script setup>

import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDepartmentStore } from '../stores/department'
import { storeToRefs } from 'pinia'

const showForm = ref(false)
const showEditForm = ref(false)
const departmentStore = useDepartmentStore()
const { departments } = storeToRefs(departmentStore)

const newDepartment = ref({
    name: '',
    description: ''
})
const formRef=ref()
const editFormRef=ref()

const rules={
    name:[{
        required:true,
        message:'请输入要部门名称',
        trigger:'blur'//失去焦点
    }],
    description:[{
        required:true,
        message:'请输入部门描述',
        trigger:'blur'
    }]
}

const editDepartmentData = ref({

    id: null,

    name: '',

    description: ''

})


onMounted(async () => {

    await departmentStore.loadDepartments()

})



const openAddForm = () => {

    showForm.value = true

}

const cancelAdd = () => {

    showForm.value = false

    newDepartment.value = {

        name: '',

        description: ''

    }
    formRef.value?.resetFields()

}



const addDepartment = async () => {
    const valid =await formRef.value.validate()
    if(!valid)return
    try {
        await departmentStore.addDepartment(
            newDepartment.value
        )
        // 关闭 Dialog
        showForm.value = false

        // 清空表单
        newDepartment.value = {
            name: '',
            description: ''
        }

        // 成功提示
        ElMessage.success(
            '新增部门成功'
        )
    } catch (err) {

        console.error(
            '新增部门失败：',
            err
        )
        console.log(
            '服务器返回：',
            err.response?.data
        )
        ElMessage.error(
            err.response?.data?.message ||
            '新增部门失败'
        )

    }

}



const deleteButton = async (id) => {

    try {
        // Element Plus 确认框
        await ElMessageBox.confirm(
            '确定要删除这个部门吗？',
            '删除提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }

        )

        // 用户点击确定
        await departmentStore.deleteDepartment(id)
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
            '删除部门失败：',
            err
        )
        ElMessage.error(
            err.response?.data?.message ||
            '删除部门失败'
        )

    }

}



const editButton = (department) => {

    editDepartmentData.value = {

        id: department.id,

        name: department.name,

        description: department.description

    }


    // 打开编辑 Dialog

    showEditForm.value = true

}




const cancelEdit = () => {

    showEditForm.value = false

    editDepartmentData.value = {

        id: null,

        name: '',

        description: ''

    }
    editFormRef.value?.resetFields()

}



const saveEdit = async () => {
    const valid=await editFormRef.value.validate()
    if(!valid)return
    try {

         await departmentStore.updateDepartment(
            editDepartmentData.value.id,
            {
                name: editDepartmentData.value.name,
                description: editDepartmentData.value.description
            }
        )

        showEditForm.value = false


        // 清空编辑数据

        editDepartmentData.value = {

            id: null,

            name: '',

            description: ''

        }


        // 成功提示

        ElMessage.success(
            '修改部门成功'
        )


    } catch (err) {

        console.error(
            '修改部门失败：',
            err
        )


        console.log(
            '服务器返回：',
            err.response?.data
        )


        ElMessage.error(

            err.response?.data?.message ||
            '修改部门失败'

        )

    }

}

</script>


<style scoped>
.department-page {

    padding: 30px;

    background: #f5f6f8;

    min-height: calc(100vh - 64px);

    box-sizing: border-box;

}


/* =========================
   页面头部
========================= */

.page-header {

    display: flex;

    align-items: center;

    margin-bottom: 20px;

    background: white;

    padding: 25px;

    border-radius: 10px;

    box-sizing: border-box;

}


.page-header h2 {

    margin: 0 0 6px;

    font-size: 24px;

    color: #333;

}


.page-header p {

    margin: 0;

    color: #999;

    font-size: 14px;

}


/* =========================
   表格容器
========================= */

.department-table {

    background: white;

    padding: 20px;

    border-radius: 10px;

    border: 1px solid #ddd;

}


/* =========================
   表格头部
========================= */

.table-header {

    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 20px;

}


.department-count {

    color: #888;

    font-size: 14px;

}


.department-count strong {

    color: #409eff;

    font-size: 16px;

}
</style>