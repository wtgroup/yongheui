/**
 * 打总包?
 * 引用此模块, 即将本UI库所有组件全量全局注册了.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const PRODUCTION = process.env.PRODUCTION;
const projectName = 'yongheui'

const libMode = process.env.LIBMODE
const isFullMode = libMode === 'full'
let externals = [
  {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
    },
  },
]
if (!isFullMode) {
  externals.push({
    '@popperjs/core': '@popperjs/core',
    'async-validator': 'async-validator',
    'mitt': 'mitt',
    'normalize-wheel': 'normalize-wheel',
    'resize-observer-polyfill': 'resize-observer-polyfill',
  },
  /^dayjs.*/,
  /^lodash.*/)
}

const config = {
  mode: 'production',
  entry: path.resolve(__dirname, '../packages/' + projectName + '/index.ts'),
  output: {
    path: path.resolve(__dirname, '../lib'),
    publicPath: '/',
    filename: isFullMode ? 'index.full.js' : 'index.js',
    libraryTarget: 'umd',
    library: 'yongheui',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /ant.*\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /ant.*\.less$/,
        ...(PRODUCTION ? {
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader?importLoaders=1', /*'postcss-loader',*/ {loader: 'less-loader', options: {lessOptions: {javascriptEnabled: true}}}]
          })
        } : {
          use: ["style-loader", {loader: 'css-loader', options: {sourceMap: true}}, /*"postcss-loader",*/ {loader: 'less-loader', options: {lessOptions: {javascriptEnabled: true}}}]
        } )
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  externals,
  plugins: [
    new VueLoaderPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
}

module.exports = config
