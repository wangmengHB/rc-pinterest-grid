const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.conf.js')
const path = require('path');

const config = merge(base, {
  entry: {
    'pinterest-grid': path.resolve(__dirname, '../src/demo.tsx')
  },
  mode: 'development',
  watch: true,
  devtool: 'none',
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: false, 
    compress: true,
    host: '0.0.0.0',
    port: 8081,
    useLocalIp: true,
    open: true,
    overlay: { 
        warnings: false, 
        errors: true 
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Pinterest Grid Demo'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = config