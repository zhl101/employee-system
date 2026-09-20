const express =require('express')
const router =express.Router()
const db =require('../config/db')
const verifyToken=require('../middleware/auth')

// 返回当前登录用户的身份和最新权限
router.get('/',verifyToken,(req,res)=>{
    const sql=`
    SELECT permissions.code
        FROM role_permissions
        JOIN permissions
        ON role_permissions.permission_id = permissions.id
        WHERE role_permissions.role_id = ?
    `

    db.query(sql, [req.user.roleId], (err, results) => {
        if (err) {
            console.error('查询当前用户权限失败：', err)
            return res.status(500).json({
                message: '查询权限失败'
            })
        }

        res.json({
            user: {
                id: req.user.id,
                username: req.user.username,
                roleId: req.user.roleId
            },
            permissions: results.map(item => item.code)
        })
    })
})
module.exports = router