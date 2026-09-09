const bcrypt = require('bcrypt')

const users = [
    {
        username: 'admin',
        password: '123456',
        roleId: 1
    },
    {
        username: 'hr',
        password: '123456',
        roleId: 2
    },
    {
        username: 'employee',
        password: '123456',
        roleId: 3
    }
]

async function createUsers() {

    for (const user of users) {

        const hash = await bcrypt.hash(
            user.password,
            10
        )

        console.log('--------------------------')
        console.log('用户名：', user.username)
        console.log('角色ID：', user.roleId)
        console.log('原密码：', user.password)
        console.log('加密密码：', hash)
    }
}

createUsers()