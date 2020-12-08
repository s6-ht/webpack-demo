let currentHash
let lastHash
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

hotEmitter.on('webpackHotUpdate', () => {
  console.log('hotCheck')
  // 如果lastHash不存在，则表明是第一次编译
  if (!lastHash) {
    lastHash = currentHash
    return
  }
  // 向服务器检查更新并拉去最新代码
  module.hot.check()
})
