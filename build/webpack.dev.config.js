module.exports = {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    // progress: true,
    stats: 'errors-only',
    open: true,
    // useLocalIp: true,
    proxy: {
      '/api/*': {
        target: 'http://api-h5.huanletang.com',
        // pathRewrite: {},
        changeOrigin: true, // target是域名的话，需要这个参数，
        // secure: false, // 设置支持https协议的代理
      }
    }
  }
}