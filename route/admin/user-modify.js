const { User } = require('../../model/user')

const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
    // 接受客户端传递过来的请求参数
    const {username, email, role, state, password} = req.body;
    const id = req.query.id;

    let user = await User.findOne({_id: id});

    // 密码比对
    const isValid = await bcrypt.compare(password, user.password);

    if(isValid) {
        // 将用户信息更新到数据库中
        await User.updateOne({_id: id}, {
            username: username,
            email: email,
            role: role,
            state: state
        });

        // 重定向用户列表页面
        res.redirect('/admin/user');

    }else {
        let obj = {path:'/admin/user-edit', message:'密码比对失败，不能进行用户信息修改', id: id}
        next(JSON.stringify(obj));
    }

}