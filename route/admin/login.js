// 导入用户集合构造函数
const { User } = require('../../model/user')
// 导入bcrypt
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    // 接受请求参数
    const { email, password } = req.body;

    if (email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).render('admin/error', { msg: '邮件地址或者密码错误' });
    }
    // 根据邮箱地址查询用户信息
    // 查询到了用户 user变量的值是对象类型 对象存储的是用户信息
    // 查询不到 user变量为空
    let user = await User.findOne({ email });
    // 查询到了用户
    if (user) {
        // 将客户端传过来的密码和用户信息中的密进行比对
        // 返回值为布尔值
        let isValid = bcrypt.compare(password, user.password)
        if (isValid) {
            // 登录成功
            // 将用户名存储在请求对象中
            req.session.username = user.username;
            // 将用户角色存储在请求对象中
            req.session.role = user.role;
            req.app.locals.userInfo = user;
            // 对用户的角色进行判断
            if (user.role == 'admin') {
                // 重定向到用户列表页面
                res.redirect('/admin/user')
            } else {
                // 重定向到用户列表页面
                res.redirect('/home/')
            }

        } else {
            // 登录失败
            res.status(400).render('admin/error', { msg: '邮箱地址或者密码错误' })
        }
    } else {
        res.status(400).render('admin/error', { msg: '邮箱地址或者密码错误' })
    }
}
