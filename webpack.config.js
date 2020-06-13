

var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  //...
    mode: 'development',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve('src/index.html')
        })
    ],
    resolve: {
        extensions: ['.js']
    },
    externals: ["fs"],
  devServer: {
    compress: false,
    port: 9000,
  }
};