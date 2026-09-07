import { ref } from 'vue'
import axios from 'axios'


const employees = ref([])

// 从后端获取数据
export async function loadEmployees(){
    try{
        const res =await axios.get('http://localhost:3000/api/employees')
        employees.value=res.data
        console.log('员工数据加载成功：',employees.value)
    }catch(error){
        console.log('员工数据加载失败：',error)
    }
}

export default employees