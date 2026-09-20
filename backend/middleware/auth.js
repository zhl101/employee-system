const jwt =require('jsonwebtoken') 
const JWT_SECERET='employee_system-secret'


function verifyToken(req,res,next){
    // 1.从请求头获取Authorization
    const authHeader =req.headers.authorization

    // 2.没有Authorization
    if(!authHeader){
        return res.status(401).json({
            message:'未登录，请先登录'
        })

    }

    // 3.获取JWT
    const token=authHeader.split(' ')[1]

    // 4.验证JWT
    try{
        const decoded=jwt.verify(
            token,
            JWT_SECRET
        )

       // 5. 把 JWT 中的信息保存到 req.user
        req.user = decoded

        // 6. 验证成功，继续执行后面的代码
        next()


    }catch(err){
        return res.status(401).json({
            message:'Token无效或已过期'
        })
    }
}

module.exports = verifyToken