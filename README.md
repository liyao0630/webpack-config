| 目录   | 描述                                                |
|--------|-----------------------------------------------------|
| build  | 通用配置                                            |
| config | 项目配置:webpack.base.config.[package.configKey].js |

package.json
| 字段      | 描述        |
|-----------|-------------|
| configKey | 项目配置key |
| entryDir  | 项目入口    |
| outputDir | 打包出口    |


## 配置项
### 1.1 optimization.splitChunks
> 代码分割 webpack 4.0 删除了 `CommonsChunkPlug`，使用 `SplitChunksPlugin`。

社区还有其他插件和加载器，用于代码拆分

`mini-css-extract-plugin`：对于将CSS从主应用程序中分离出来很有用。

`bundle-loader`：用于拆分代码并延迟加载生成的包。

`promise-loader`：类似于，bundle-loader但使用`Promise`。

#### webpack splitChunks的默认配置
```
optimization: {
  splitChunks: {
    chunks: 'async',
    minSize: 30000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  }
}
```

#### chunks:
all: 不管文件是动态还是非动态载入，统一将文件分离。当页面首次载入会引入所有的包。

async： 将异步加载的文件分离，首次一般不引入，到需要异步引入的组件才会引入。

initial：将异步和非异步的文件分离，如果一个文件被异步引入也被非异步引入，那它会被打包两次（注意和all区别），用于分离页面首次需要加载的包。

#### minSize: 文件最小打包体积，单位byte，默认30000

比如说某个项目下有三个入口文件，a.js和b.js和c.js都是100byte，当我们将minSize设置为301,那么webpack就会将他们打包成一个包，不会将他们拆分成为多个包。

#### automaticNameDelimiter： 连接符，默认～

假设我们生成了一个公用文件名字叫vendor，a.js,和b.js都依赖，最终生成的就是 vendor~a~b.js

#### maxInitialRequests 入口点处的最大并行请求数，默认为3

如果我们设置为1，那么每个入口文件就只会打包成为一个文件

#### maxAsyncRequests 最大异步请求数量，默认5

如果我们设置为1，那么每个入口文件就只会打包成为一个文件

#### minChunks 最少引入的次数
优先级关系
maxInitialRequest < maxAsyncRequests < maxSize < minSize。

#### cacheGroups 定制分割包的规则

test可以配置正则和写入function作为打包规则,其他属性均可继承splitChunks。

priority，设置包的打包优先级。

**cacheGroups配置项**

关键点在priority的设置，vendors>async-commons>commons，我们首先将react,react-dom等优先打包出来，然后再打包公共部分，如果将vendors的优先级设置小于两个Common的优先级，那么react，react-dom将会打包到common包，将不会再生成vendors包。
```
cacheGroups: {
  vendors: { // 基本框架
   chunks: 'all',
   test: /(react|react-dom|react-dom-router|babel-polyfill|mobx)/,
   priority: 100,
   name: 'vendors',
  },
  echartsVenodr: { // 异步加载echarts包
   test: /(echarts|zrender)/,
   priority: 100, // 高于async-commons优先级
   chunks: 'async'
  },
  'async-commons': { // 其余异步加载包
   chunks: 'async',
   minChunks: 2,
   name: 'async-commons',
   priority: 90,
  },
  commons: { // 其余同步加载包
   chunks: 'all',
   minChunks: 2,
   name: 'commons',
   priority: 80,
  },
}
```

#### 异步加载

模块方法的[import()](https://webpack.docschina.org/api/module-methods/#import-) 动态加载模块。 依赖Promise，在低版本浏览器使用 [es6-promise](https://github.com/stefanpenner/es6-promise) 或者 [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) 这样 polyfill 库，来预先填充(shim) Promise 环境。这里使用`es6-promise`作为polyfill。

#### 在html-webpack-plugin.chunks按需写入js。
```
new HtmlWebpackPlugin({
  template: entryDir + '/src/index.html',
  filename: 'index.html',
  chunks: ['commons', 'home'],
  inject: true,
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuites: true
  }
})
```