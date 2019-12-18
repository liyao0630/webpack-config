const merge = require('webpack-merge')
const package = require("./package.json");
const configKey = package.configKey

const baseConfig = merge(require('./build/webpack.base.config'),
    require(`./config/webpack.base.config.${configKey}`))

const devConfig = require('./build/webpack.dev.config')
const proConfig = require('./build/webpack.pro.config')

module.exports = (env, argv) => {
    let config = argv.mode === 'development' ? devConfig : proConfig;
    return merge(baseConfig, config);
};