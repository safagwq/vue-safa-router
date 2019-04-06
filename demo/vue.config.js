module.exports = {
    // 线上环境使用相对路径
    publicPath: process.env.NODE_ENV === 'production'? './' : '/' ,
}

