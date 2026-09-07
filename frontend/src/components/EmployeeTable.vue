<template>

    <div class="employee-table">

        <div class="table-header">

            <h3>员工列表</h3>

            <span>
                共 {{ employees.length }} 名员工
            </span>

        </div>


        <el-table
            :data="employees"
            border
            stripe
            style="width: 100%"
        >

            <!-- 姓名 -->
            <el-table-column
                prop="name"
                label="姓名"
                min-width="120"
            />


            <!-- 部门 -->
            <el-table-column
                prop="department"
                label="部门"
                min-width="120"
            />


            <!-- 职位 -->
            <el-table-column
                prop="position"
                label="职位"
                min-width="150"
            />


            <!-- 状态 -->
            <el-table-column
                label="状态"
                min-width="100"
            >

                <template #default="scope">

                    <el-tag
                        :type="
                            scope.row.status === '在职'
                                ? 'success'
                                : 'info'
                        "
                    >
                        {{ scope.row.status }}
                    </el-tag>

                </template>

            </el-table-column>


            <!-- 操作 -->
            <el-table-column
                v-if="showActions"
                label="操作"
                width="180"
                fixed="right"
            >

                <template #default="scope">

                    <el-button
                        type="primary"
                        link
                        @click="$emit('edit', scope.row)"
                    >
                        编辑
                    </el-button>


                    <el-button
                        type="danger"
                        link
                        @click="$emit('delete', scope.row.id)"
                    >
                        删除
                    </el-button>

                </template>

            </el-table-column>

        </el-table>

    </div>

</template>


<script setup>

defineProps({

    employees: {

        type: Array,

        default: () => []

    },


    showActions: {

        type: Boolean,

        default: true

    }

})

</script>


<style scoped>

.employee-table {

    width: 100%;

}


.table-header {

    display: flex;

    align-items: center;

    justify-content: space-between;

    margin-bottom: 15px;

}


.table-header h3 {

    margin: 0;

}


.table-header span {

    color: #909399;

    font-size: 14px;

}

</style>