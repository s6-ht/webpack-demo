module.exports = {
  entry:{
    index: __dirname + '/src/index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  mode: 'development',
  devtool: false,
  devServer: {
    open: true
  }
}