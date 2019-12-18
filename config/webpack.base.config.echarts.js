const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const package = require("../package.json");
const path = require("path")
const {
  mode
} = require('yargs').argv

const entryDir = path.resolve(__dirname, '..' + package.entryDir)
const outputDir = path.resolve(__dirname, '..' + package.outputDir)

const config = {
  entry: {
    'pie1': entryDir + '/src/js/echarts.pie1.js',
    'pie2': entryDir + '/src/js/echarts.pie2.js',
    'pie3': entryDir + '/src/js/echarts.pie3.js',
    'pie4': entryDir + '/src/js/echarts.pie4.js',
  },
  output: {
    path: outputDir,
    filename: './js/[name].js?v=[hash:6]'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].css?[hash:6]',
      chunkFilename: './css/[id].css?[hash:6]'
    }),
    new HtmlWebpackPlugin({
      template: entryDir + '/src/index-pie1.html',
      filename: 'index.html',
      chunks: ['echartsVenodr', 'pie1'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuites: true
      }
    })
  ]
}
if (mode === 'production') {
  config.optimization = {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '.',
      name: true,
      cacheGroups: {
        echartsVenodr: { // 异步加载echarts包
          test: /(echarts|zrender)/,
          priority: 100, // 高于async-commons优先级
          name: 'echartsVenodr',
          chunks: 'all'
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 90
        },
        // default: {
        //     minChunks: 2,
        //     priority: -20,
        //     reuseExistingChunk: true
        // }
      }
    },
  }
}

module.exports = config