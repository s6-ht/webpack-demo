import Car from './Car'

const car = new Car()
console.log(car.startHook)
// 注册
car.hooks.start.tap('startPlugin', () => console.log('我系一下安全带'))
car.start()

car.hooks.accelerate.tap('acceleratePlugin', (speed) =>
  console.log(`加速到${speed}`)
)
car.accelerate(100)

car.hooks.brake.tap('brakePlugin1', () => console.log(`刹车1`))
// 只需在不想继续往下走的插件return非undefined即可。
car.hooks.brake.tap('brakePlugin2', () => {
  console.log(`刹车2`)
  return 1
})
car.hooks.brake.tap('brakePlugin3', () => console.log(`刹车3`))

car.brake()
