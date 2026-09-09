const express=require('express')
const router =express.Router()
const db=require('../config/db')

// 获取权限接口
router.get('/',(req,res)=>{
    const sql=`SELECT   id,name,code,parent_id,description 
    FROM permissions ORDER BY id`

    db.query(sql,(err,results)=>{
        if(err){    
            console.log('获取权限表失败:',err)
            return res.status(500).json({
                message: '获取权限失败'
            })
        }
         res.json(results)
    })
})

router.get('/role/:roleId', (req, res) => {
    const roleId = req.params.roleId

    const sql = `
        SELECT permission_id
        FROM role_permissions
        WHERE role_id = ?
    `

    db.query(sql, [roleId], (err, results) => {
        if (err) {
            console.error('获取角色权限失败：', err)

            return res.status(500).json({
                message: '获取角色权限失败'
            })
        }

        res.json(results)
    })
})

// 更改权限

router.put('/:id/permissions', (req, res) => {
    const roleId = req.params.id
    const permissionIds = req.body.permissionIds

    // 检查前端有没有传权限数组
    if (!Array.isArray(permissionIds)) {
        return res.status(400).json({
            message: '权限数据格式错误'
        })
    }

    // 先删除这个角色原来的权限
    const deleteSql = `
        DELETE FROM role_permissions
        WHERE role_id = ?
    `

    db.query(deleteSql, [roleId], (err) => {
        if (err) {
            console.error('删除原权限失败：', err)

            return res.status(500).json({
                message: '保存权限失败'
            })
        }

        // 如果没有选择任何权限
        if (permissionIds.length === 0) {
            return res.json({
                code: 200,
                message: '权限保存成功'
            })
        }

        // 生成插入数据
        const values = permissionIds.map(permissionId => {
            return [roleId, permissionId]
        })

        const insertSql = `
            INSERT INTO role_permissions
            (role_id, permission_id)
            VALUES ?
        `

        db.query(insertSql, [values], (err) => {
            if (err) {
                console.error('新增角色权限失败：', err)

                return res.status(500).json({
                    message: '保存权限失败'
                })
            }

            res.json({
                code: 200,
                message: '权限保存成功'
            })
        })
    })
})


module.exports = router