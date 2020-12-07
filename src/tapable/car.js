import {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} from 'tapable'

// SyncBailHook: 注册多个相同的插件时，判断执行几次事件
// SyncWaterfallHook: 每一步都依赖上一步的执行结果，上一步的返回值作为下一步的参数，无返回值则默认返回当前参数
// SyncLoopHook: 同步循环钩子，如果插件返回一个非undefined, 则会一直执行该插件的回调函数，直到返回undefined
// AsyncParallelHook: 异步并行执行插件。可以确保所有插件的代码都执行完之后，再执行某些逻辑
// 
/**
 * AsyncParallelBailHook
 * 第一个注册的插件执行完毕后，会进行bail(熔断)，调用最终的回调，然后再执行另外的插件。
 * 遵守js执行机制(宏任务/微任务)
 */

 /**
  * AsyncSeriesHook
  * 按照插件注册顺序，串行执行
  */

  /**
   * AsyncSeriesBailHook
   * 按照插件注册顺序，串行执行
   * 只要一个插件有返回值，立即调用最终回调，终止执行后续插件。
   */

   /**
    * AsyncSeriesWaterfallHook
    * 按照插件注册顺序，串行执行
    * 前一个插件的返回值，作为后一个插件的参数
    */

// 插件声明和调用中心
export default class Car {
  constructor() {
    // 声明
    this.hooks = {
      start: new SyncHook(),
      // 传递参数
      accelerate: new SyncHook(['newSpeed']),
      // brake: new SyncHook()
      brake: new SyncBailHook(),
      addNum: new SyncWaterfallHook(['speed']),
      loop: new SyncLoopHook(),
      asyncParallel: new AsyncParallelHook(),
      drift: new AsyncParallelBailHook(),
      asyncSerie: new AsyncSeriesHook(),
      asyncSeriesBail: new AsyncSeriesBailHook(),
      asyncSeriesWaterfall: new AsyncSeriesWaterfallHook(['name'])
    }
  }
  // 调用
  start() {
    this.hooks.start.call()
  }
  accelerate(speed) {
    this.hooks.accelerate.call(speed)
  }

  brake() {
    this.hooks.brake.call()
  }

  addNum(speed) {
    console.log('add')
    this.hooks.addNum.call(speed)
  }

  loop() {
    this.hooks.loop.call()
  }

  asyncParallel(cb) {
    this.hooks.asyncParallel.callAsync(cb)
    // return this.hooks.asyncParallel.promise();
  }

  drift(cb) {
    this.hooks.drift.callAsync(cb);
  }

  asyncSerie() {
    return this.hooks.asyncSerie.promise()
  }

  asyncSeriesBail(cb) {
    return this.hooks.asyncSeriesBail.promise()
  }

  asyncSeriesWaterfall() {
    return this.hooks.asyncSeriesWaterfall.promise()
  }
}
