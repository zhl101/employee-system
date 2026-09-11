const express=require ('express')
const cors=require('cors')
const db=require('./config/db')
const app=express()
const employeeRouter=require('./routes/employee')
const departmentRouter=require('./routes/department')
const roleRouter=require('./routes/role')
const permissionRouter=require('./routes/permission')
const loginRouter = require('./routes/login')
const userRouter=require('./routes/user')
// 允许跨域
app.use(cors())
// 解析JSON
app.use(express.json())
app.use('/api/employees',employeeRouter)
app.use('/api/departments',departmentRouter)
app.use('/api/roles',roleRouter)
app.use('/api/permissions',permissionRouter)
app.use('/api/login', loginRouter)
app.use('/api/users',userRouter)

// 测试接口
app.get('/api/test',(req,res)=>{
    res.json({
        code:200,
        message:'后端接口连接成功'
    })
})

// 启动服务器
app.listen(3000,()=>{
    console.log('服务器启动成功：http://localhost:3000')
})