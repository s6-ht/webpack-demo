const webpack = require('webpack')

// 配置对象
const config = require('../webpack.config.js')
const Server = require('./lib/server/Server')

// 编译器对象
const compiler = webpack(config)
const server = new Server(compiler)
server.listen(9090, 'localhost', () => {
  console.log(`服务已启动, 端口: 9090`)
})
