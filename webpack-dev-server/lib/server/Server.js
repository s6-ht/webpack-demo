
const express = require('express')
const http = require('http')
const path = require('path')
const updateCompiler = require('../utils/updateCompiler')
const fs = require('fs-extra')
fs.join = path.join
// const MemoryFs = require('memory-fs')
const mime = require('mime')
const socketIO = require('socket.io')

class Server {
  constructor(compiler) {
    // 保存编译器对象
    this.compiler = compiler
    // 每次编译产生的hash
    this.currentHash;
    this.clientSocketList = []
    // 所有通过websocket连接到的客户端
    updateCompiler(this.compiler)
    // 创建app
    this.setupApp()
    // 建立钩子
    this.setupHooks()
    this.setupDevMiddleware()
    // 配置路由
    this.routes()
    // 创建服务器，以app作为路由
    this.createServer()
    // 创建socket服务器
    this.createSocketServer()
  }
  createSocketServer() {
    // websocket依赖http服务
    const io = socketIO(this.server)
    io.on('connection', socket => {
      this.clientSocketList.push(socket)
      socket.emit('hash', this.currentHash)
      socket.emit('ok')
      // 断开连接
      socket.on('disconnect', () => {
        let index = this.clientSocketList.indexOf(socket)
        this.clientSocketList.splice(index, 1)
      })
    })
  }
  routes() {
    let { compiler } = this
    let config = compiler.options
    this.app.use(this.middleware(config.output.path))
  }

  setupDevMiddleware() {
    // 返回一个express中间件
    this.middleware = this.webpackDevMiddleware()
  }

  webpackDevMiddleware() {
    let { compiler } = this
    // 以监听模式启动编译，如果文件发生变更，就进行重新编译
    compiler.watch({}, () => {
      console.log('监听模式编译成功')
    })
    // 内存文件系统
    // let fs = new MemoryFs()
    this.fs = compiler.outputFileSystem = fs
    // 返回一个中间件，用于响应客户端对于产出文件的请求 index.html main.js  json js
    return (staticDir) => {
      // 静态文件目录 即输出目录
      return (req, res, next) => {
        let { url } = req
        if (url === './favicon.ico') {
          return res.sendStatus(404)
        }
        url === '/' ? url = '/index.html' : null
        // 得到要访问的静态路径
        let filePath = path.join(staticDir, url)
        // console.log(filePath)
        try {
          // 返回此路径的文件的描述对象，如果此文件不存在，报错
          let statObj = this.fs.statSync(filePath)
          // console.log(statObj, 'statObj')
          if(statObj.isFile()) {
            // 读取文件内容
            let content = this.fs.readFileSync(filePath, 'utf-8')
            // console.log(content)
            // 设置响应头
            res.setHeader('Content-Type', mime.getType(filePath))
            res.send(content)
          } else {
            return res.sendStatus(404)
          }
        }catch(e) {
          return res.sendStatus(404)
        }
        
      }
    }
  }
  setupHooks() {
    let { compiler } = this
    // 监听编译完成事件
    compiler.hooks.done.tap('webpack-dev-server', stats => {
      // stats是一个描述对象，里面存放着打包后的hash chunkHash contentHash 产生了哪些代码块  产出哪些模块
      this.currentHash = stats.hash
      // 发消息给所有的客户端
      this.clientSocketList.forEach(socket => {
        socket.emit('hash', this.currentHash)
        socket.emit('ok')
      })
    })

  }
  setupApp() {
    // 执行express函数，得到this.app  代表http应用
    this.app = express()
  }
  createServer() {
    // 创建http服务器  this.app是一个路由中间件
    this.server = http.createServer(this.app)
  }
  listen(port, host, callback) {
    this.server.listen(port, host, callback)
  }
}

module.exports = Server
