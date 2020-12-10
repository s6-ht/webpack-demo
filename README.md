
module和chunk?
- 在webpack中有各种各样的模块
- 一般一个入口会依赖多个模块
- 一个入口一般会对应一个chunk，这个chunk里包含这个入口所依赖的模块

HotModuleReplacementPlugin(webpack/lib/HotModuleReplacementPlugin.js)
- 会生成两个补丁文件
  - 上一次编译生成的hash.hot-update.json；说明从上次编译到现在哪些代码块的改变
  - chunk名字.上一次编译生成的Hash.hot-update.js；存放着此代码块最新的模块定义。调用webpackHotUpdate方法
- 像代码块中注入HMR runtime代码，热更新的主要逻辑。比如拉取代码，执行代码，执行accept回调都是它注入到chunk中
- hotCreateRequire 帮助维护模块的parents、children关系



热更新工作流程
首先，介绍webpack-dev-server:
webpack-dev-server 主要包含了三个部分：
1.webpack: 负责编译代码
2.webpack-dev-middleware: 主要负责构建内存文件系统，把webpack的 OutputFileSystem 替换成 InMemoryFileSystem。同时作为Express的中间件拦截请求，从内存文件系统中把结果拿出来。
3.express：负责搭建请求路由服务。


要想实现热更新，需要维护父子关系

#### webpack 热更新原理

1. 什么是热更新？
Hot Module Replacement是指当我们对代码修改并保存后，webpack将会对代码进行重新打包，并将新的模块发送到浏览器端，浏览器使用新模块替换旧模块，以实现不刷新浏览器的情况下更新页面。


2. 热更新流程
服务端流程：
- 启动webpack-dev-server服务器
创建webpack实例，在编译期间会向 entry 文件注入热更新代码
创建server服务器
添加webpack的done事件回调，编译完成后向所有客户端发送hash和Ok事件
创建express应用app
以compiler.watch模式启动编译，当文件系统中的某一个文件发生变更后，根据配置文件对模块进行重新编译打包
添加webpack-dev-middleware中间件，将文件系统设置为内存文件系统
创建http服务器并启动服务
使用socket再服务器和浏览器之间建立socket长连接，将打包编译后的各个阶段的状态信息告知浏览器，浏览器根据不同的socket消息进行不同的操作。编译完成后会发送hash和ok消息。将会根据这一hash值进行热更新。




客户端流程：
连接websocket服务器
监听hash事件，并保存此hash值；监听ok事件，判断是否支持热更新，支持则进入热更新逻辑，不支持则直接刷新页面；
支持热更新的情况下，向服务器发送ajax请求，请求manifest文件，该文件包括了本次编译hash值和更新模块的chunk名；
通过JSONP方式请求最新的模块代码;
Client获取到新的JS模块后, 使用新的模块替换原有的模块，并从缓存中删除旧模块；
执行accept的回调函数





为什么需要两个hash?
第一次编译完成后，客户端的代码和服务端的代码一致 hash1
这个时候服务端重新编译了：
1. 重新得到一个新的hash值 hash2
2. 还会创建一个hash1的补丁包，包里会说明hash1到hash2 哪些代码块发生了变更，以及发生了哪些变更


注入两个文件
```
webpack-dev-server/client/index.js
webpack/hot/dev-server.js
```