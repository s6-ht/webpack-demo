const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const { HotModuleReplacementPlugin } = require('webpack')
module.exports = {
  entry: {
    // 从入门文件开始进行编译，找到它依赖的模块，打包在一起，就会形成一个chunk代码块
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    chunkFilename: '[name].[hash].js',
  },
  mode: 'development',
  devtool: false,
  devServer: {
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new HotModuleReplacementPlugin()
  ],
}
