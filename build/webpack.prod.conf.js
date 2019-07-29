const base = require('./webpack.base.conf.js')
const merge = require('webpack-merge')

const config = merge(base, {
    mode: 'production',
    optimization: {
      minimize: true
    },
    externals: ['react', 'react-dom'],
})

module.exports = config