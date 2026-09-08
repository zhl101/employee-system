const express = require('express')
const router = express.Router()
const db = require('../config/db')

// 获取所有部门
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM departments'
    db.query(sql, (err, results) => {
        if (err) {
            console.error('查询部门失败：', err)
            return res.status(500).json({
                message: '查询部门失败'
            })
        }
        res.json(results)
    })
})


// 新增部门
router.post('/', (req, res) => {
    const { name, description } = req.body
    const sql = `INSERT INTO departments (name,description) VALUES(?,?)`
    db.query(sql, [name, description], (err, results) => {
        if (err) {
            console.error('新增部门失败：', err)

            // 部门名称重复
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    message: '该部门已经存在'
                })
            }
            return res.status(500).json({
                message: '新增部门失败'
            })
        }

        res.json({
            code: 200,
            message: '新增部门成功',
            id: results.insertId
        })
    })

})

// 删除部门
router.delete('/:id',(req,res)=>{
    const id=req.params.id
    const sql=`DELETE FROM departments WHERE id=?`
    db.query(sql,[id],(err,result)=>{
         if(err){
            console.error('删除部门失败：',err)
            return res.status(500).json({
                message:"删除部门失败"
            })
        }
        res.json({
            code:200,
            message:'删除部门成功'
        })
    })
})

// 编辑部门
router.put('/:id', (req, res) => {

    const id = req.params.id

    const { name, description } = req.body

    const sql = `
        UPDATE departments
        SET name = ?, description = ?
        WHERE id = ?
    `

    db.query(
        sql,
        [name, description, id],
        (err, results) => {

            if (err) {

                console.error('修改部门失败：', err)

                // 部门名称重复
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({
                        message: '该部门名称已经存在'
                    })
                }

                return res.status(500).json({
                    message: '修改部门失败'
                })
            }

            res.json({
                code: 200,
                message: '修改部门成功'
            })
        }
    )
})

module.exports = router