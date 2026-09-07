<template>
  <div class="stat-card">
    <div class="stat-title">{{ title }}</div>
    <div class="stat-number">{{ number }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  number: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.stat-card {
  flex: 1;
  padding: 25px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.stat-title {
  color: #666;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
}
</style>