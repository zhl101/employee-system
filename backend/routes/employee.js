const express = require('express')
const router = express.Router()

const db = require('../config/db')

const verifyToken=require('../middleware/auth')
const checkPermission =require('../middleware/permission')
// 获取所有员工
router.get('/', verifyToken,checkPermission('employee'),(req, res) => {
    const sql = 'SELECT * FROM employees'

    db.query(sql, (err, results) => {
        if (err) {
            console.error('查询员工失败：', err)
            return res.status(500).json({
                message: '查询员工失败'
            })
        }

        res.json(results)
    })
})

// 新增员工
router.post('/',verifyToken,checkPermission('employee'), (req, res) => {
    const {
        name,
        department ,
        position,
        status
    }=req.body

    const sql =`INSERT INTO employees
    (name,department,position,status)
    VALUES(?,?,?,?)
    `
    db.query(sql,[name,department,position,status],(err,result)=>{
            if(err){
                console.error('新增员工失败：',err)
                return res.status(500).json({
                    message:'新增员工失败'
                })
            }

            res.json({
                code: 200,
                message: '新增员工成功',
                id: result.insertId
                })
        }

    )
})

// 编辑员工
router.put('/:id',verifyToken,checkPermission('employee'),(req,res)=>{
    const id=req.params.id
    const {
        name,
        department,
        position,
        status
    }=req.body

    const sql=`
    UPDATE employees
    SET name=?,department=?,position=?,status=?
    WHERE ID =?
    `
    db.query(sql,[name,department,position,status,id],(err,result)=>{
        if(err){
             console.error('修改员工失败：', err)

                return res.status(500).json({
                    message: '修改员工失败'
                })
        }
        res.json({
                code: 200,
                message: '修改员工成功'
            })
    })
})

// 删除员工
router.delete('/:id',verifyToken,checkPermission('employee'),(req,res)=>{
    const id=req.params.id
    const sql=`DELETE   FROM employees WHERE id=?`
    db.query(sql,[id],(err,result)=>{
        if(err){
            console.error('删除员工失败：',err)
            return res.status(500).json({
                message:"删除员工失败"
            })
        }
        res.json({
            code:200,
            message:'删除员工成功'
        })
    })
})

module.exports = router