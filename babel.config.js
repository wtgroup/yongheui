module.exports = {
  // ATTENTION!!
  // Preset ordering is reversed, so `@babel/typescript` will called first
  // Do not put `@babel/typescript` before `@babel/env`, otherwise will cause a compile error
  // See https://github.com/babel/babel/issues/12066
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@vue/babel-plugin-jsx',
    '@babel/proposal-class-properties',
    '@babel/transform-runtime',
    'lodash',
    // ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": true }, "antd"], // `style: true` 会加载 less 文件
    // ? 开启按需引入, 却导致完整引入时, yongheui 未定义 ?
    // [
    //   "import",
    //   { "libraryName": "yongheui", "libraryDirectory": "lib",
    //     customStyleName: (name) => {
    //       // 由于 customStyleName 在配置中被声明的原因，`style: true` 会被直接忽略掉，
    //       // 如果你需要使用 scss 源文件，把文件结尾的扩展名从 `.css` 替换成 `.scss` 就可以了
    //       return `yongheui/lib/theme-default/${name}.css`;
    //     },
    //   },
    //   "yongheui"
    // ]
  ],
  overrides: [
    {
      test: /\.vue$/,
      plugins: [
        '@babel/transform-typescript',
        'transform-vue-jsx',
      ],
    },
  ],
  env: {
    utils: {
      ignore: [
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
      presets: [
        [
          '@babel/env',
          {
            loose: true,
            modules: false,
          },
        ],
      ],
      plugins: [
        [
          'babel-plugin-module-resolver',
          {
            root: ['yongheui'],
            alias: {
              '@yongheui': 'yongheui/lib',
            },
          },
        ],
      ],
    },
  },
}
