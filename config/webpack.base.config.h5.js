const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { mode } = require('yargs').argv
const package = require("../package.json");
const path = require("path")

var entryDir = path.resolve(__dirname, '..' + package.entryDir)
var outputDir = path.resolve(__dirname, '..' + package.outputDir)
console.log(mode);
module.exports = {
  entry: {
    'bundle': entryDir + '/src/main.js',
    'demo': entryDir + '/src/client/demo.js',
    'lib': entryDir + '/src/core/main.js',
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
      template: entryDir + '/src/index.tpl.html',
      filename: 'index.html',
      chunks: ['bundle'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuites: true
      }
    }),
    new HtmlWebpackPlugin({
      template: entryDir + '/src/debug.tpl.html',
      filename: 'debug.html',
      chunks: ['lib', 'demo']
    })
  ]
}