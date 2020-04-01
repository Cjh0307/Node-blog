// 引用express框架
const express = require('express');
// 处理路径
const path = require('path');
// 引入body-parser模块 处理post请求参数
const bodyParser = require('body-parser');
// 引入express-session模块
const session = require('express-session');
// 导入art-tempate模板引擎
const template = require('art-template');
// 导入dataformat第三方模块
const dateFormat = require('dateformat');
// 导入morgan第三方模块
const morgan = require('morgan');
// 导入config模块
const config = require('config');


// 创建网站服务器
const app = express();
// 数据库连接
require('./model/connect')

// 处理post请求参数
app.use(bodyParser.urlencoded({ extended: false }));
// 配置session
app.use(session({
	resave: false, //添加 resave 选项
	saveUninitialized: true, //添加 saveUninitialized 选项
	secret: 'secret key',
	saveUninitialized: false,
	cookie: {
		maxAge: 24 * 60 * 60 * 1000
	}
}));

// 告诉express框架使用什么模板引擎什么后缀的模板文件
app.engine('art', require('express-art-template'));
// 告诉express框架模板存放位置
app.set('views', path.join(__dirname, 'views'));
// 告诉express框架模板默认后缀
app.set('view engine', 'art');

template.defaults.imports.dateFormat = dateFormat;

// 开发静态资源文件
app.use(express.static(path.join(__dirname, 'public')));

console.log(config.get('title'));


// 区分开发环境和生产环境
// 获取系统环境变量 返回值是对象
if (process.env.Node_ENV == 'development') {
	console.log('当前是开发环境');
	// 在开发环境中，将客户端发送到服务器端的请求信息打印到控制台中
	app.use(morgan('dev'));
} else {
	console.log('当前是生产环境');
}


// 引入路由模块
const home = require('./route/home');
const admin = require('./route/admin');

// 拦截请求 判断用户登录页面
app.use('/admin', require('./middleware/loginGuard'));

// 为路由匹配请求路径
app.use('/home', home);
app.use('/admin', admin)

app.use((err, req, res, next) => {
	// 将字符串对象转换为对象类型
	// JSON.parse() 
	const result = JSON.parse(err);
	// {path: '/admin/user-edit', message: '密码比对失败,不能进行用户信息的修改', id: id}
	let params = [];
	for (let attr in result) {
		if (attr != 'path') {
			params.push(attr + '=' + result[attr]);
		}
	}
	res.redirect(`${result.path}?${params.join('&')}`);
})

// 监听端口
app.listen(80)
console.log('网站服务器启动成功，请访问localhost');