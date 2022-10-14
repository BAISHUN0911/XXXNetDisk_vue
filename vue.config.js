const { defineConfig } = require('@vue/cli-service')
const productConfig = require("./public/config.json"); // 引入config.json文件
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: "/",
  devServer: {
    host: "127.0.0.1",
    open: true,
    historyApiFallback: true,
    allowedHosts: "all",
    proxy: {
      //配置代理，解决跨域请求后台数据的问题
      "/api": {
        target: productConfig.baseUrl, //后台接口，连接本地服务
        ws: true, //是否跨域
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
})