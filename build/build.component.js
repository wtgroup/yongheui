/* eslint-disable */
/* 各个字模块单独打包 index.js */
const pkg = require('../package.json')
const path = require('path')
const { getPackages } =  require('@lerna/project')
const css = require('rollup-plugin-css-only')
// const less = require('rollup-plugin-less');
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const vue = require('rollup-plugin-vue')
const rollup = require('rollup')
const typescript = require('rollup-plugin-typescript2')
const babel = require('rollup-plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const { noElPrefixFile } = require('./common')

const deps = Object.keys(pkg.dependencies)

const runBuild = async () => {
  let index = 0
  const pkgs = await getPackages()
  const inputs = pkgs
    .map(pkg => pkg.name)
    .filter(name =>
      name.includes('@yongheui') &&
      !name.includes('utils'),
    ).slice(process.argv[2], process.argv[3])

  build(inputs[index])

  async function build(name) {
    if (!name) return
    const inputOptions = {
      input: path.resolve(__dirname, `../packages/${name.split('@yongheui/')[1]}/index.ts`),
      plugins: [
        nodeResolve(),
        css(),
        vue({
          target: 'browser',
          css: false,
        }),
        // 支持 tsx 解析
        babel({
          // presets: ["@vue/babel-preset-jsx"],
          extensions: [".ts", ".js", ".tsx"],
          runtimeHelpers: true,
          // exclude: /node_modules/,
          exclude: 'node_modules/**',
        }),
        commonjs(),
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              declaration: false,
            },
            'exclude': [
              'node_modules',
              '__tests__',
            ],
          },
          abortOnError: false,
        }),
      ],
      external(id) {
        // /*not antd*/
        // if ( /^@?ant-design/.test(id) ) {
        //   return false;
        // }

        return /^vue/.test(id)
          || /^@yongheui/.test(id)
          || deps.some(k => new RegExp('^' + k).test(id));
      },
    }
    const getOutFile = () => {
      const compName = name.split('@yongheui/')[1]
      if(noElPrefixFile.test(name)) {
        return `lib/${compName}/index.js`
      }
      return `lib/y-${compName}/index.js`
    }
    const outOptions = {
      format: 'es',
      file: getOutFile(),
      paths(id) {
        if (/^@yongheui/.test(id)) {
          if (noElPrefixFile.test(id)) return id.replace('@yongheui', '..')
          return id.replace('@yongheui/', '../y-')
        }
      },
    }

    const bundle = await rollup.rollup(inputOptions)
    console.log(name, 'done')
    await bundle.write(outOptions)
    index++
    if (index < inputs.length) {
      await build(inputs[index])
    }
  }
}

runBuild()
