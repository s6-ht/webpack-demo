// tabable ---  就是一个标志，表示我这个类是一个可以注册插件的类。提供各类钩子，处理外部注册插件的关系

import Car from './Car'

const car = new Car()
console.log('test')
// 注册
// 一
car.hooks.start.tap('startPlugin1', () => console.log('startPlugin1'))
car.hooks.start.tap('startPlugin2', () => console.log('startPlugin2'))
car.start()

// 二
car.hooks.accelerate.tap('acceleratePlugin', (speed) =>
  console.log(`加速到${speed}`)
)
// car.accelerate(100)

// 三
car.hooks.brake.tap('brakePlugin1', () => console.log(`刹车1`))
// 只需在不想继续往下走的插件return非undefined即可。
car.hooks.brake.tap('brakePlugin2', () => {
  console.log(`刹车2`)
  // return 1
})
car.hooks.brake.tap('brakePlugin3', () => console.log(`刹车3`))
// car.brake()
// 四
car.hooks.addNum.tap('addPlugin1', (speed) => {
  console.log(`add - ${speed}`)
  return speed + 50
})
car.hooks.addNum.tap('addPlugin2', (speed) => {
  console.log(`add - ${speed}`)
  // return speed + 50
})
car.hooks.addNum.tap('addPlugin3', (speed) => {
  console.log(`add - ${speed}`)
})
// car.addNum(10)
// 五
;(function () {
  let index = 0
  car.hooks.loop.tap('loopPlugin1', () => {
    console.log('loop start')
    if (index < 5) {
      index++
      return 1
    }
  })
})()
car.hooks.loop.tap('loopPlugin2', () => {
  console.log('loop end')
})
// car.loop()
// 六
car.hooks.asyncParallel.tapPromise('asyncParallelPlugin1', () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('计算路线1')
      resolve()
    }, 1000)
  })
})

car.hooks.asyncParallel.tapPromise('asyncParallelPlugin2', () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('计算路线2')
      resolve()
    }, 2000)
  })
})

// car.asyncParallel(() => {
//   console.log('最终的回调')
// })
// promise方式
// car.asyncParallel().then(() => { console.log('最终的回调'); });

// 七
car.hooks.drift.tapAsync('driftPlugin1', (callback) => {
  setTimeout(() => {
    console.log('driftPlugin1')
    callback(null, 1) // 第一个参数是err, 这里传递个1，第二个参数传递result
  }, 2000)
})

car.hooks.drift.tapAsync('driftPlugin2', (callback) => {
  setTimeout(() => {
    console.log('driftPlugin2')
    callback()
  }, 1000)
})

// car.drift((result) => {
//   console.log('driftPluginEnd', result)
// })

// 八
car.hooks.asyncSerie.tapPromise('asyncSeriePlugin1', () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asyncSeriePlugin1');
      resolve();
    }, 1000);
  });
});

car.hooks.asyncSerie.tapPromise('asyncSeriePlugin2', () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asyncSeriePlugin2');
      resolve();
    }, 2000);
  });
});

// 1s过后，打印1，再过2s（而不是到了第2s，而是到了第3s），打印2，再立马打印end。
// car.asyncSerie().then(() => { console.log('asyncSerieEnd'); });

// 九
car.hooks.asyncSeriesBail.tapPromise('asyncSeriesBailPlugin1', () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asyncSeriesBailPlugin1');

      resolve(1);
    }, 1000);
  });
});

car.hooks.asyncSeriesBail.tapPromise('asyncSeriesBailPlugin2', () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asyncSeriesBailPlugin2');
      resolve(2);
    }, 2000);
  });
});

// car.asyncSeriesBail().then(() => { console.log('asyncSeriesBailPluginEnd'); });
// 1s过后，打印计算路线1，立马打印最终的回调，不会再执行计算路线2了。

// 十
car.hooks.asyncSeriesWaterfall.tapPromise('asyncSeriesWaterfallPlugin1', (result) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asyncSeriesWaterfallPlugin1', result);

      resolve(1);
    }, 1000);
  });
});

car.hooks.asyncSeriesWaterfall.tapPromise('asyncSeriesWaterfallPlugin2', (result) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asyncSeriesWaterfallPlugin2', result);
      resolve(2);
    }, 2000);
  });
});

car.asyncSeriesWaterfall().then(() => { console.log('asyncSeriesWaterfallPluginEnd'); });
// 1s过后，打印计算路线1 undefined，再过2s打印计算路线2 北京，然后立马打印最终的回调。