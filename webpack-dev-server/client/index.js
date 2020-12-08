const socket = io('/')

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
socket.on('hash', hash => {
  currentHash = hash
})

socket.on('ok', () => {
  console.log('ok')
  reloadApp()
})

function reloadApp() {
  hotEmitter.emit('webpackHotUpdate')
}