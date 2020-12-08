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
})
