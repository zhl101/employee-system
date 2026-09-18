const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../config/db')
const jwt=require('jsonwebtoken')

router.post('/', (req, res) => {
    const { username, password } = req.body

    

    // 1. 检查前端有没有传账号密码
    if (!username || !password) {
        return res.status(400).json({
            message: '请输入账号和密码'
        })
    }

    // 2. 根据账号查询用户
    const sql = `
        SELECT id, username, password, role_id
        FROM users
        WHERE username = ?
    `

    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('查询用户失败：', err)

            return res.status(500).json({
                message: '服务器错误'
            })
        }

        // 3. 没找到用户
        if (results.length === 0) {
            return res.status(401).json({
                message: '账号或密码错误'
            })
        }

        const user = results[0]

        // 4. 比较密码
        const isMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!isMatch) {
            return res.status(401).json({
                message: '账号或密码错误'
            })
        }
        const permissionSql = `
    SELECT permissions.code
    FROM role_permissions
    JOIN permissions
    ON role_permissions.permission_id = permissions.id
    WHERE role_permissions.role_id = ?
`

        db.query(
            permissionSql,
            [user.role_id],
            (err, permissionResults) => {

                if (err) {
                    console.error('查询权限失败：', err)

                    return res.status(500).json({
                        message: '查询权限失败'
                    })
                }

                const permissions = permissionResults.map(
                    item => item.code
                )

                // 生成JWT
                const token =jwt.sign(
                    {
                        // token里面存放用户信息
                        id:user.id,
                        username:user.username,
                        roleId:user.role_id
                    },
                    // 加密签名
                   ' employee_system-secret',
                   {
                    expiresIn:'2h'
                   }
                )

                res.json({
                    code: 200,
                    message: '登录成功',
                    user: {
                        id: user.id,
                        username: user.username,
                        roleId: user.role_id
                    },
                    permissions,
                    token
                })
            }
        )
       
    })
})

module.exports = router