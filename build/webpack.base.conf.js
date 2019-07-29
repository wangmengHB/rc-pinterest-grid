const path = require('path')


module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        'common-util': path.resolve(__dirname, '../src/index')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/',
        libraryTarget: 'umd',
        library: 'CommonUtil'
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
    },
    module: {
        rules: [
          {
            test: /\.(js|ts|jsx|tsx)$/,
            include: [
              path.resolve(__dirname, '../src')
            ],
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: 'ts-loader',
              }
            ]
          },
          {
            test: /\.less$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true,
                }
              }
            ]
          }
        ]
    },
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}