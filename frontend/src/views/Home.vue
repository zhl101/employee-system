<template>
    <div class="home">

        <!-- 欢迎区域 -->
        <section class="welcome-card">
            <div>
                <p>企业员工管理系统</p>
                <h2>欢迎回来，管理员 👋</h2>
                <span>今天也要高效完成员工管理工作。</span>
            </div>

            <div class="welcome-date">
                <span>系统日期</span>
                <strong>{{ currentDateTime }}</strong>
            </div>
        </section>


        <!-- 数据统计 -->
        <div class="stats">

            <StatCard
                title="员工总数"
                :number="employeeStore.employeeCount"
            />

            <StatCard
                title="在职员工"
                :number="employeeStore.activeEmployeeCount"
            />

            <StatCard
                title="离职员工"
                :number="employeeStore.inactiveEmployeeCount"
            />

            <StatCard
                title="部门数量"
                :number="departmentStore.departmentCount"
            />

        </div>


        <!-- 部门人员概况 -->
        <section class="panel">

            <h3>部门人员概况</h3>

            <p class="panel-desc">
                各部门当前员工人数
            </p>

            <div class="department-list">

                <div
                    v-for="item in departmentStats"
                    :key="item.name"
                    class="department-item"
                >

                    <div class="department-info">
                        <span>{{ item.name }}</span>
                        <strong>{{ item.count }} 人</strong>
                    </div>

                    <div class="progress">

                        <div
                            class="progress-inner"
                            :style="{ width: item.percent + '%' }"
                        ></div>

                    </div>

                </div>

            </div>

        </section>


        <!-- 最近员工 -->
        <div class="employee-list">

            <h3>最近员工</h3>

            <!-- 搜索和筛选 -->
            <div class="search-area">

                <el-input
                    v-model="searchText"
                    placeholder="请输入员工姓名"
                    clearable
                    class="search-input"
                />

                <el-select
                    v-model="selectedDepartment"
                    placeholder="选择部门"
                    clearable
                    class="department-select"
                >

                    <el-option
                        label="全部部门"
                        :value="''"
                    />

                    <el-option
                        v-for="department in departments"
                        :key="department.id"
                        :label="department.name"
                        :value="department.name"
                    />

                </el-select>

            </div>


            <!-- 员工表格 -->
            <EmployeeTable
                :employees="filteredEmployees"
                :show-actions="false"
            />

        </div>

    </div>
</template>


<script setup>

import {
    ref,
    computed,
    onMounted,
    onUnmounted
} from 'vue'

import StatCard from '../components/StatCard.vue'

import EmployeeTable from '../components/EmployeeTable.vue'
import { useEmployeeStore } from '../stores/employee'
import { useDepartmentStore } from '../stores/department'
import { storeToRefs } from 'pinia'

const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()

const { employees } = storeToRefs(employeeStore)
const { departments } = storeToRefs(departmentStore)

const currentDateTime = ref('')

const updateDateTime = () => {

    const now = new Date()

    currentDateTime.value = now.toLocaleString(
        'zh-CN',
        {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }
    )

}


let timer = null

onMounted(async () => {

    // 获取员工数据
    await employeeStore.loadEmployees()

    // 获取部门数据
    await departmentStore.loadDepartments()

    // 更新时间
    updateDateTime()

    timer = setInterval(() => {

        updateDateTime()

    }, 1000)

})


onUnmounted(() => {

    clearInterval(timer)

})


const searchText = ref('')

const selectedDepartment = ref('')


const filteredEmployees = computed(() => {

    return employees.value.filter(employee => {

        // 姓名匹配
        const matchName =
            employee.name.includes(searchText.value)

        // 部门匹配
        const matchDepartment =
            selectedDepartment.value === '' ||
            employee.department === selectedDepartment.value

        return matchName && matchDepartment

    })

})






const departmentStats = computed(() => {

    const result = {}

    employees.value.forEach(employee => {

        if (result[employee.department]) {

            result[employee.department]++

        } else {

            result[employee.department] = 1

        }

    })


    const values = Object.values(result)

    if (values.length === 0) {
        return []
    }


    const max = Math.max(...values)


    return Object.entries(result).map(
        ([name, count]) => ({

            name,

            count,

            percent: Math.round(
                (count / max) * 100
            )

        })
    )

})

</script>


<style scoped>

.home {
    padding: 30px;
    background: #f5f6f8;
    min-height: calc(100vh - 64px);
    box-sizing: border-box;
}


/* =========================
   欢迎卡片
========================= */

.welcome-card {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 25px 30px;
    margin-bottom: 20px;

    background: white;

    border: 1px solid #ddd;
    border-radius: 10px;
}


.welcome-card p {
    margin: 0;
    color: #4c8bf5;
}


.welcome-card h2 {
    margin: 8px 0;
    font-size: 24px;
}


.welcome-card span {
    color: #888;
}


/* =========================
   日期
========================= */

.welcome-date {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    gap: 8px;
}


.welcome-date strong {
    font-size: 18px;
    color: #333;
}


/* =========================
   数据统计
========================= */

.stats {
    display: flex;
    gap: 20px;
}


/* =========================
   部门概况
========================= */

.panel {
    margin-top: 20px;

    background: white;

    padding: 20px;

    border: 1px solid #ddd;
    border-radius: 10px;
}


.panel h3 {
    margin: 0 0 5px;
}


.panel-desc {
    margin: 0 0 20px;

    color: #999;

    font-size: 13px;
}


/* =========================
   部门
========================= */

.department-item {
    margin-bottom: 18px;
}


.department-info {
    display: flex;

    justify-content: space-between;

    margin-bottom: 8px;
}


.department-info strong {
    color: #555;
}


/* =========================
   进度条
========================= */

.progress {
    height: 8px;

    background: #edf0f5;

    border-radius: 10px;

    overflow: hidden;
}


.progress-inner {
    height: 100%;

    background: #4c8bf5;

    border-radius: 10px;
}


/* =========================
   员工列表
========================= */

.employee-list {
    margin-top: 30px;

    background: white;

    padding: 20px;

    border-radius: 8px;

    border: 1px solid #ddd;
}


.employee-list h3 {
    margin-top: 0;
}


/* =========================
   搜索区域
========================= */

.search-area {
    display: flex;

    align-items: center;

    gap: 10px;

    margin-bottom: 20px;
}


.search-input {
    width: 300px;
}


.department-select {
    width: 180px;
}

</style>