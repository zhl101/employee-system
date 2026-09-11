const express = require('express')
const router = express.Router()
const db = require('../config/db')
const bcrypt = require('bcrypt')

// 获取用户
router.get('/', (req, res) => {
    const sql = `SELECT * FROM users`
    db.query(sql, (err, results) => {
        if (err) {
            console.log('获取用户失败:', err)
            return res.status(500).json({
                message: '获取用户失败'
            })
        }
        res.json(results)
    })
})

// 新增用户
router.post('/', async (req, res) => {
    const {
        username,
        password,
        roleId
    } = req.body

    // 基本校验
    if (!username || !password || !roleId) {
        return res.status(400).json({
            message: '用户名,密码和角色不能为空'
        })
    }


    try {
        // 检查用户名是否已经存在
        const checkSql = `SELECT id FROM users WHERE username=?`

        db.query(checkSql, [username], async (err, results) => {
            if (err) {
                console.error('检查用户名失败：', err)

                return res.status(500).json({
                    message: '服务器错误'
                })
            }

            // 用户名已经存在
            if (results.length > 0) {
                return res.status(400).json({
                    message: '用户名已经存在'
                })
            }

            // 使用bcypt加密密码
            const hashedPassword = await bcrypt.hash(password, 10)

            const sql = 'INSERT INTO users (username,password,role_id)VALUE(?,?,?)'
            db.query(sql,[username, hashedPassword, roleId], (err, results) => {
                if (err) {
                    console.error('新增用户失败：', err)
                    return res.status(500).json({
                        message: '新增用户失败'
                    })
                }

                res.json({
                    code: 200,
                    message: '新增用户成功',
                    id: results.insertId
                })
            })

        })
    }catch(err){
         console.error('密码加密失败：', error)

        res.status(500).json({
            message: '服务器错误'
        })
    }
})

module.exports=router



   
