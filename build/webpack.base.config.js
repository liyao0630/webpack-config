const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'bundle': './src/main.js',
    'demo': './src/client/demo.js',
    'lib': './src/core/main.js',
  },
  output: {
    path: __dirname + '/../public',
    filename: './js/[name].js?v=[hash:6]'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
          loader: MiniCssExtractPlugin.loader
        },
        "css-loader"
      ]
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'img/[name].[ext]?[hash:6]',
          publicPath: '..'
        }
      }]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].css?[hash:6]',
      chunkFilename: './css/[id].css?[hash:6]'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.tpl.html',
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
      template: './src/debug.tpl.html',
      filename: 'debug.html',
      chunks: ['lib', 'demo']
    })
  ]
}