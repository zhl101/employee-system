<template>
    <div class="system">
        <h2>系统管理</h2>

        <el-form
            :model="systemForm"
            label-width="100px"
        >
            <el-form-item label="系统名称">
                <el-input
                    v-model="systemForm.name"
                    placeholder="请输入系统名称"
                />
            </el-form-item>

            <el-form-item label="系统描述">
                <el-input
                    v-model="systemForm.description"
                    type="textarea"
                    placeholder="请输入系统描述"
                />
            </el-form-item>

            <el-form-item>
                <el-button type="primary">
                    保存设置
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const systemForm = ref({
    name: '企业员工管理系统',
    description: '企业内部员工管理平台'
})
</script>