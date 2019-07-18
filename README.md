# リリースビルド設定
リリースビルド設定です。  
本番ビルドはmodeを'production'にする必要があります。(minify、tree shakingなどを行う)  
また、optimization設定をすることで大きいライブラリなどを別チャンクファイルに分離し、読み込みの最適化をすることが出来ます。  
エクスポートされるライブラリファイルをreact.jsとcore.jsに分離しました。  
(core.jsの方はプロジェクト内で使っているライブラリに応じて調整する必要があります)  
また、devtool設定にてsourcemapファイルを.mapファイルとしてエクスポートするようにします。  

```
const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const LoadablePlugin = require('@loadable/webpack-plugin')
const loadableBabelPlugin = require('@loadable/babel-plugin')
const production = process.env.NODE_ENV === 'production'

const getConfig = (target) => {
  const web = target === 'web'

  const entry = web && !production ?
  [
    `./src/client/main-${target}.js`,
    'webpack-hot-middleware/client',
  ] : `./src/client/main-${target}.js`

  const plugins = web && !production ?
  [
      new webpack.NamedModulesPlugin(), // 名前変更無効プラグイン利用
      new LoadablePlugin(), // Loadableプラグイン
      new webpack.HotModuleReplacementPlugin(), // HMR
  ] :
  [
      new webpack.NamedModulesPlugin(), // 名前変更無効プラグイン利用
      new LoadablePlugin(), // Loadableプラグイン
  ]

  const optimization = production ?
  {
    splitChunks: {
      cacheGroups: {
        react: {
          test: /react/,
          name: 'react',
          chunks: 'all',
        },
        core: {
          test: /redux|core-js|jss|history|matarial-ui|lodash|moment|prefixer|axios/,
          name: 'core',
          chunks: 'all',
        },
      },
    },
  } : undefined

  return {
    target,
    mode: production ? 'production' : 'development', // 開発モード
    name: target,
    devtool: production ? 'source-map' : 'cheap-module-source-map', // ソースマップファイル追加
    entry, // エントリポイントのjsxファイル
    output: {
      path: path.join(path.resolve(__dirname, 'public/dist'), target),
      filename: production ? '[name]-bundle-[chunkhash:8].js' : '[name].js',
      publicPath: `/dist/${target}/`,
      libraryTarget: target === 'node' ? 'commonjs2' : undefined,
    },
    optimization,
    plugins,
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
```

package.jsonにてリリースビルドのスクリプト`build`、サーバ本番モード実行のスクリプト`prod`  
mapファイル削除のスクリプト`rmmap`を追加します。  
本番サーバではwebpack-dev-middlewareでビルドする必要がないため  
NODE_ENV=productionモードでbabel-nodeで起動します。  
(nodemonも本番サーバのソースコードを普通は直接編集しないので不要)  

```
  "scripts": {
    "dev": "rm -rf public/dist && nodemon src/server/server.js",
    "build": "rm -rf public/dist && NODE_ENV=production webpack",
    "prod": "NODE_ENV=production babel-node --config-file ./babel.server.js src/server/server.js",
    "rmmap": "rm -rf public/dist/node/*.map public/dist/web/*.map",
    "lint": "eslint ."
  },
```

リリースビルド＆本番サーバ起動は次のようになります。  

```
# リリースビルド
$ yarn build
# mapファイルを削除（今回は消していますが、デバッグには必要になるため、適宜別の場所に移動するなりしてください）
$ yarn rmmap
# サーバを本番モードで起動
$ yarn prod
```

mapファイルがない状態でChrome DevToolsなどを開き、ソースコードを見るとminifyされていることがわかります。  