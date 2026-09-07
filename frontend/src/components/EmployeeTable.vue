<template>
  <div>
    <h3>员工列表</h3>

    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>部门</th>
          <th>职位</th>
          <th>状态</th>
          <th v-if="showActions">操作</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="employee in employees"
          :key="employee.id"
        >
          <td>{{ employee.name }}</td>
          <td>{{ employee.department }}</td>
          <td>{{ employee.position }}</td>
          <td>{{ employee.status }}</td>
          <td v-if="showActions">
            <button @click="$emit('edit',employee)" >编辑</button>
            <button @click="$emit('delete',employee.id)" >删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const {employees,showActions}=defineProps({
  employees: {
    type: Array,
    default: () => []
  },
  showActions:{
    type:Boolean,
    default:true
  }
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
</style>