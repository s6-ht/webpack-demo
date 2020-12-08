let input = document.createElement('input');
document.body.appendChild(input)

let div = document.createElement('div')
document.body.appendChild(div)


let render = () => {
  let title = require('./title.js')
  div.innerHTML = title
}

if (module.hot) {
  // 当title变更时，重新执行render方法
  module.hot.accept(['./title.js'], render)
}
render()

