const express=require('express')
const router =express.Router()
const db=require('../config/db')
const  verifyToken = require('../middleware/auth')
const  checkPermission = require('../middleware/permission')

// 获取角色数据
router.get('/',verifyToken,checkPermission('permission'),(req,res)=>{
    const sql='SELECT * FROM roles'

    db.query(sql,(err,results)=>{
        if(err){
            console.error('查询角色失败：',err)
            return res.status(500).json({
                message:'查询角色失败'
            })
        }
        res.json(results)
    })
})

// 新增角色
router.post('/',verifyToken,checkPermission('permission'),(req,res)=>{
     const { name, description } = req.body
    const sql = `INSERT INTO roles (name,description) VALUES(?,?)`
     db.query(sql, [name, description], (err, results) => {
        if (err) {
            console.error('新增角色失败：', err)
            
            // 角色名称重复
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    message: '该角色已经存在'
                })
            }
            return res.status(500).json({
                message: '新增角色失败'
            })

         } 
        

        res.json({
            code: 200,
            message: '新增角色成功',
            id: results.insertId
        })
    })
})


// 删除角色

router.delete('/:id',verifyToken,checkPermission('permission'),(req,res)=>{
    const id=req.params.id
    const sql=`DELETE FROM roles WHERE id=?`
    db.query(sql,[id],(err,results)=>{
        if(err){
             console.error('删除角色失败：',err)
            return res.status(500).json({
                message:"删除角色失败"
            })
        }
         res.json({
            code:200,
            message:'删除部门成功'
        })
    })
})
module.exports=router