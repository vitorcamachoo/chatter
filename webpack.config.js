const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('webpack-html-plugin');

const srcPath = path.join(__dirname, '/src');
const distPath = path.join(__dirname, '/dist');

const watch = process.argv.includes('--watch');
const production = process.argv.includes('--prod');

module.exports = {
  watch,
  cache: !production,
  devtool: '#cheap-module-eval-source-map',
  context: srcPath,
  entry: {
    app: './index.js',
  },
  output: {
    path: distPath,
    filename: '[name].bundle.js',
  },
  resolve: {
    modules: ["node_modules"],
  },

  module: {
    rules:[
      { test: /\.(html)$/, use: 'html-loader' }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      title:'Chatter App', 
      filename: 'index.html',
      inject: true,
      template: path.join(srcPath, 'index.html'),
    })]
};