const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    index: __dirname + '/src/index.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
  },
  mode: 'development',
  devtool: false,
  devServer: {
    hot: true,
    hotOnly: true,
    open: true,
    port: 8866
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
  ],
}
