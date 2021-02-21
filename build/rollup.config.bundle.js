/**
 * monoresp 每个子模块单独打包成一个目录, 排除 vue ,
 * 最后结果貌似只有 .d.ts
 */

// import vue from 'rollup-plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import pkg from '../package.json'
// import babel from 'rollup-plugin-babel';
const deps = Object.keys(pkg.dependencies)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vue = require('rollup-plugin-vue')
const babel = require('rollup-plugin-babel')

const projectName = 'yongheui'

export default [
  {
    input: path.resolve(__dirname, `../packages/${projectName}/index.ts`),
    output: {
      format: 'es',
      file: 'lib/index.esm.js',
    },
    plugins: [
      terser(),
      vue({
        target: 'browser',
        css: false,
        exposeFilename: false,
      }),
      nodeResolve(),
      babel({
        // presets: ["@vue/babel-preset-jsx"],
        // babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', ".ts", ".tsx",],
        runtimeHelpers: true,
        // exclude: /node_modules/,
        // exclude: 'node_modules/**',
      }),
      // commonjs({
      //   exclude: /.*\.vue$/,
      // }),
      commonjs(),
      typescript({
        tsconfigOverride: {
          'include': [
            'packages/**/*',
            'typings/vue-shim.d.ts',
          ],
          'exclude': [
            'node_modules',
            'packages/**/__tests__/*',
          ],
        },
        abortOnError: true,
      }),
    ],
    external(id) {
      return /^vue/.test(id)
        || deps.some(k => new RegExp('^' + k).test(id))
    },
  },
]
