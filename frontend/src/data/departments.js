import {ref} from 'vue'
import axios from 'axios'

const departments =ref([])

// 从后端数据库获取部门数据
export async function loadDepartments(){
    try{
        const res=await axios.get ('http://localhost:3000/api/departments')
        departments.value=res.data

        console.log('部门数据加载成功：',departments.value)
    }catch(err){
        console.error(('部门数据加载失败：',err))
    }
}

export default departments