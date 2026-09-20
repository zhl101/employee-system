import { defineStore } from "pinia";
import {ref } from 'vue'
import request from "../api/request"

export  const useUserStore=defineStore('user',()=>{
    // status:
    const users=ref([])

    // actions:获取用户
    async function loadUsers(){
        try{
            const res =await request.get(
                `/users`
            )

            users.value=res.data
            console.log('用户数据加载成功',users.value)

        }catch(err){
            console.error('获取用户失败：',err)
            throw err

        }
    }
    // actions:
    async function addUser(userdata){
        try{
            const res =await request.post(
                `/users`,
                userdata
            )
            await loadUsers()
            console.log('新增用户成功：', res.data)
            return res.data
        }catch(err){
            console.error("新增用户失败：",err)
            throw err
        }
    }


    return {
        users,
        loadUsers,
        addUser

    }

})