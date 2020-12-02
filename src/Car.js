import { SyncHook, SyncBailHook } from 'tapable'


// 事件声明和调用中心
export default class Car {
  constructor() {
    // 声明
    this.hooks = {
      start: new SyncHook(),
      // 传递参数
      accelerate: new SyncHook(["newSpeed"]),
      // brake: new SyncHook()
      brake: new SyncBailHook()
    }
  }
  // 调用
  start() {
    this.hooks.start.call()
  }
  accelerate(speed) {
    this.hooks.accelerate.call(speed);
  }

  brake() {
    this.hooks.brake.call()
  }

}

