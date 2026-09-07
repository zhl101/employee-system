<template>
    <div class="home">
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

        <div class="stats">
            <StatCard title="员工总数" :number="totalEmployees" />

            <StatCard title="在职员工" :number="activeEmployees" />

            <StatCard title="离职员工" :number="inactiveEmployees" />

            <StatCard title="部门数量" :number="departmentCount" />
        </div>

        <section class="panel">
            <h3>部门人员概况</h3>
            <p class="panel-desc">各部门当前员工人数</p>

            <div class="department-list">
                <div v-for="item in departmentStats" :key="item.name" class="department-item">
                    <div class="department-info">
                        <span>{{ item.name }}</span>
                        <strong>{{ item.count }} 人</strong>
                    </div>

                    <div class="progress">
                        <div class="progress-inner" :style="{ width: item.percent + '%' }"></div>
                    </div>
                </div>
            </div>
        </section>

        <div class="employee-list">
            <h3>最近员工</h3>

            <input v-model="searchText" type="text" placeholder="查询员工" />

            <select v-model="selectedDepartment">
                <option value="">全部部门</option>
                <option v-for="department in departments" :key="department.id" :value="department.name">
                    {{ department.name }}
                </option>
            </select>



            <EmployeeTable :employees="filteredEmployees" :show-actions="false" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import StatCard from '../components/StatCard.vue'
import EmployeeTable from '../components/EmployeeTable.vue'
import employees, { loadEmployees } from '../data/employees'
import departments, { loadDepartments } from '../data/departments.js'

const currentDateTime = ref('')
const updateDateTime = () => {
    // 获取当前电脑的日期和时间
    const now = new Date()

    currentDateTime.value = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}
onUnmounted(() => {
    clearInterval(timer)
})
let timer = null
onMounted(async () => {
    // 加载数据库中的员工数据
    await loadEmployees()

    await loadDepartments()

    // 更新时间
    updateDateTime()

    timer = setInterval(() => {
        updateDateTime()
    }, 1000)
})
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

const totalEmployees = computed(() => {
    return employees.value.length
})

const activeEmployees = computed(() => {
    return employees.value.filter(
        employee => employee.status === '在职'
    ).length
})
const inactiveEmployees = computed(() => {
    return employees.value.filter(
        employee => employee.status === '离职'
    ).length
})

const departmentCount = computed(() => {
    const departments = employees.value.map(
        employee => employee.department
    )

    return new Set(departments).size
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

    const max = Math.max(...Object.values(result))

    return Object.entries(result).map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / max) * 100)
    }))
})



</script>

<style scoped>
.home {
    padding: 30px;
    background: #f5f6f8;
    min-height: calc(100vh - 64px);
}

.home h2 {
    font-size: 24px;
    margin-top: 0;
}

.stats {
    display: flex;
    gap: 20px;
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

.employee-list h3 {
    margin-top: 0;
}

.employee-list select {
    width: 150px;
    padding: 10px;
    margin-left: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

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

.welcome-card h2 {
    margin: 8px 0;
}

.welcome-card p {
    margin: 0;
    color: #4c8bf5;
}

.welcome-card span {
    color: #888;
}

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

.panel {
    background: white;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    margin-bottom: 20px;
}

.panel h3 {
    margin: 0 0 5px;
}

.panel-desc {
    margin: 0 0 20px;
    color: #999;
    font-size: 13px;
}

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
</style>