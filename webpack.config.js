const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const LoadablePlugin = require('@loadable/webpack-plugin')
const loadableBabelPlugin = require('@loadable/babel-plugin')

const getConfig = (target) => {
  const web = target === 'web'

  return {
    target,
    mode: 'development', // 開発モード
    name: target,
    devtool: 'cheap-module-source-map', // ソースマップファイル追加
    entry: `./src/client/main-${target}.js`, // エントリポイントのjsxファイル
    output: {
      path: path.join(path.resolve(__dirname, 'public/dist'), target),
      filename: '[name].js',
      publicPath: `/dist/${target}/`,
      libraryTarget: target === 'node' ? 'commonjs2' : undefined,
    },
    plugins: [
      new webpack.NamedModulesPlugin(), // 名前変更無効プラグイン利用
      new LoadablePlugin(), // Loadableプラグイン
    ],
    externals: target === 'node' ? ['@loadable/component', nodeExternals()] : undefined,
    module: {
      rules: [{
        test: /\.(js|jsx)$/, // 拡張子がjsかjsxで
        exclude: /node_modules/, // node_modulesフォルダ配下は除外
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: web ? 'entry' : undefined,
                  corejs: web ? 'core-js@3' : false,
                  targets: web ? undefined : { node: 'current' },
                  modules: false,
                },
              ],
              '@babel/preset-react',
            ],
            plugins: [
              ['@babel/plugin-proposal-class-properties', { loose: true }], // クラスのdefaultProps、アローファンクション用
              '@babel/plugin-syntax-dynamic-import', // dynamic-importプラグイン
              loadableBabelPlugin, // @loadable/babelプラグイン
            ],
          },
        },
      }],
    },
  }
}

module.exports = [getConfig('web'), getConfig('node')]
