<template>
    <div class="login-page">

        <div class="login-box">

            <h2>企业员工管理系统</h2>

            <p class="login-title">
                用户登录
            </p>

            <el-form ref="formRef" :model="loginForm" :rules="rules" label-width="70px">

                <!-- 账号 -->
                <el-form-item label="账号" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入账号" clearable />
                </el-form-item>

                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
                </el-form-item>

                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button type="primary" style="width: 100%" :loading="loading" @click="handleLogin">
                        {{ loading ? '登录中...' : '登录' }}
                    </el-button>
                </el-form-item>

            </el-form>

        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useLoginStore } from '../stores/login'

// Router
const router = useRouter()

// Pinia
const loginStore = useLoginStore()

// 表单
const formRef = ref()

const loginForm = ref({
    username: '',
    password: ''
})

// 登录按钮 loading
const loading = ref(false)

// 表单验证规则
const rules = {
    username: [
        {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
        }
    ],

    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        }
    ]
}

// 登录
const handleLogin = async () => {

    // 先进行表单验证
    try {
        await formRef.value.validate()
    } catch (error) {
        return
    }

    loading.value = true

    try {

        // 调用 Pinia 登录方法
        await loginStore.login(
            loginForm.value.username,
            loginForm.value.password
        )

        // 登录成功
        ElMessage.success('登录成功')

        // 检查 token
        console.log(
            'localStorage中的token:',
            localStorage.getItem('token')
        )


        // 跳转首页
        router.push('/home')

    } catch (err) {

        console.error('登录失败：', err)

        ElMessage.error(
            err.response?.data?.message || '登录失败'
        )

    } finally {

        loading.value = false

    }
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    background: #f5f7fa;
}

.login-box {
    width: 400px;

    padding: 40px;

    background: white;

    border-radius: 10px;

    box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
    text-align: center;

    margin-bottom: 10px;
}

.login-title {
    text-align: center;

    color: #909399;

    margin-bottom: 30px;
}
</style>
