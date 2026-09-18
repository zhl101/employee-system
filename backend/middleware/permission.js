// 检查用户是否拥有指定权限
const db = require('../config/db')

// 检查用户是否拥有指定权限
function checkPermission(permissionCode) {

    return (req, res, next) => {

        // 获取当前登录用户的角色
        const roleId = req.user.roleId

        const sql = `
            SELECT permissions.code
            FROM role_permissions
            JOIN permissions
            ON role_permissions.permission_id = permissions.id
            WHERE role_permissions.role_id = ?
            AND permissions.code = ?
        `

        db.query(
            sql,
            [roleId, permissionCode],
            (err, results) => {

                if (err) {
                    console.log('权限查询失败：', err)

                    return res.status(500).json({
                        message: '权限查询失败'
                    })
                }

                // 没有权限
                if (results.length === 0) {

                    return res.status(403).json({
                        message: '没有权限访问该接口'
                    })
                }

                // 有权限
                next()
            }
        )
    }
}

module.exports = checkPermission