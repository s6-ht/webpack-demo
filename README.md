什么是hmr?
Hot Module Replacement是指当我们对代码修改并保存后，webpack将会对代码进行重新打包，并将新的模块发送到浏览器端，浏览器使用新模块替换旧模块，以实现不刷新浏览器的情况下更新页面。

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


为什么需要两个hash?
第一次编译完成后，客户端的代码和服务端的代码一致 hash1
这个时候服务端重新编译了：
1. 重新得到一个新的hash值 hash2
2. 还会创建一个hash1的补丁包，包里会说明hash1到hash2 哪些代码块发生了变更，以及发生了哪些变更


要想实现热更新，需要维护父子关系
