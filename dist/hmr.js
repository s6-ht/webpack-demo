class EventEmiter {
  constructor() {
    this.events = {}
  }
  on(eventName, fn) {
    this.events[eventName] = fn
  }
  emit(eventName, ...args) {
    this.events[eventName](...args)
  }
}

let hotEmitter = new EventEmiter()
let currentHash
let lastHash
;(function (modules) {
  // 模块缓存
  var installedModules = {}

  // 热更新
  function hotCreateModule() {
    let hot = {
      _acceptedDependencies: {},
      accept(deps, callback) {
        deps.forEach((dep) => (hot._acceptedDependencies[dep] = callback))
      },
      check: hotCheck,
    }
    return hot
  }
  function hotCheck() {
    console.log('hotCheck')
    hotDownloadManifest()
      .then((update) => {
        let chunkIds = Object.keys(update.c)
        chunkIds.forEach((chunkId) => {
          // 下载更新的代码模块
          hotDownloadUpdateChunk(chunkId)
        })
        lastHash = currentHash
      })
      .catch(() => {
        window.location.reload()
      })
  }
  // 以Jsonp的形式拉去更新的代码
  function hotDownloadUpdateChunk(chunkId) {
    let script = document.createElement('script')
    script.src = `${chunkId}.${lastHash}.hot-update.js`
    document.head.appendChild(script)
  }

  window.webpackHotUpdate = function (chunkId, moreModules) {
    hotAddUpdateChunk(chunkId, moreModules)
  }
  let hotUpdate = {}
  function hotAddUpdateChunk(chunkId, moreModules) {
    for (let moduleId in moreModules) {
      modules[moduleId] = hotUpdate[moduleId] = moreModules[moduleId]
    }
    hotApply()
  }

  function hotApply() {
    for (let moduleId in hotUpdate) {
      // 旧模块
      let oldModule = installedModules[moduleId]
      // 删除缓存中的旧模块
      delete installedModules[moduleId]
      // 循环旧模块上的所有父模块，并取出回调并执行
      oldModule.parents.forEach((parentModule) => {
        let cb = parentModule.hot._acceptedDependencies[moduleId]
        cb && cb()
      })
    }
  }

  function hotDownloadManifest() {
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest()
      let url = `${lastHash}.hot-update.json`
      xhr.open('get', url)
      xhr.responseType = 'json'
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.send()
    })
  }

  // 维护模块的父子关系
  function hotCreateRequire(parentModuleId) {
    // 因为要加载子模块的时候，父模块肯定加载完成，可以从缓存中通过父模块的ID拿到父模块对象
    let parentModule = installedModules[parentModuleId]
    // 如果缓存里没有值，说明这是一个顶级模块
    if (!parentModule) return __webpack_require__
    let hotRequire = function (childModuleId) {
      // 执行子模块，执行了require后，子模块已经被添加到installedModules中
      __webpack_require__(childModuleId)
      // 取出子模块对象
      let childModule = installedModules[childModuleId]
      // 把子模块添加到父模块对象的children里 将父模块添加到子模块的parents里
      childModule.parents.push(parentModule)
      parentModule.children.push(childModule)
      console.log(childModule)
      // 返回子模块的导出对象
      return childModule.exports
    }
    return hotRequire
  }

  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId]
    }
    let module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      hot: hotCreateModule(moduleId),
      exports: {},
      // 当前模块的父
      parents: [],
      // 当前模块的子模块
      children: [],
    })
    // 执行模块代码给module.exports赋值
    modules[moduleId].call(
      moduleId.exports,
      module,
      module.exports,
      hotCreateRequire(moduleId)
    )
    module.l = true
    return module.exports
  }
  return hotCreateRequire('./src/index.js')('./src/index.js')
  // return __webpack_require__('./src/index.js')
})({
  './src/index.js': function (module, exports, __webpack_require__) {
    // 监听webpackHotUpdate消息
    __webpack_require__('webpack/hot/dev-server.js')
    // 连接websocket服务器, 如果监听到服务器发来的ok消息，则触发webpackHotUpdate事件
    __webpack_require__('webpack-dev-server/client/index.js')
    let input = document.createElement('input')
    document.body.appendChild(input)

    let div = document.createElement('div')
    document.body.appendChild(div)

    let render = () => {
      let title = __webpack_require__('./src/title.js')
      div.innerHTML = title
    }

    // console.log(document.body)
    if (module.hot) {
      // 当title变更时，重新执行render方法
      module.hot.accept(['./src/title.js'], render)
    }
    render()
  },
  './src/title.js': function (module, exports, __webpack_require__) {
    module.exports = 'title'
  },
  'webpack-dev-server/client/index.js': function (
    module,
    exports,
    __webpack_require__
  ) {
    const socket = io('/')
    socket.on('hash', (hash) => {
      currentHash = hash
    })

    socket.on('ok', () => {
      console.log('ok')
      reloadApp()
    })

    function reloadApp() {
      hotEmitter.emit('webpackHotUpdate')
    }
  },
  'webpack/hot/dev-server.js': function (module, exports, __webpack_require__) {
    hotEmitter.on('webpackHotUpdate', () => {
      console.log('hotCheck')
      // 第一次编辑
      if (!lastHash) {
        lastHash = currentHash
        return
      }
      // 向服务器检查更新并拉去最新代码
      module.hot.check()
    })
  },
})
