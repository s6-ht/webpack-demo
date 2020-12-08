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
;(function () {
  // 模块缓存
  var installedModules = {}
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId]
    }
    let module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    })
    // 执行模块代码给module.exports赋值
    modules[moduleId].call(
      moduleId.exports,
      module,
      module.exports,
      __webpack_require__
    )
    module.l = true
    return module.exports
  }
  return __webpack_require__('./src/index.js')
})({
  './src/index.js': function (module, exports, __webpack_require__) {
    // 监听webpackHotUpdate消息
    __webpack_require__('webpack/hot/dev-server.js')
    // 连接websocket
    __webpack_require__('webpack-dev-server/client/index.js')
    let input = document.createElement('input')
    document.body.appendChild(input)

    let div = document.createElement('div')
    document.body.appendChild(div)

    let render = () => {
      let title = __webpack_require__('./src/title.js')
      div.innerHTML = title
    }

    console.log(document.body)
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
    })
  },
})
