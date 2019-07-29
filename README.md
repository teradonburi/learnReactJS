# SSR（サーバサイドレンダリング）
今まではクライアントサイドのみでReactを動かしてきました。(CSR)  
今回はサーバ側でReact Componentのビルドを行い、初回のHTML生成をサーバ側で行います。  
ただし、アプリケーションの複雑性が増すため、以下のケースを除いて安易に導入するべきではありません。  

* OGP用metaタグの切り替え（Twitter、Facebook用）
* 初回の描画が早くなる（特にComponentの量が増えてきた時）
* AMP対応

デメリットとしては、

* アプリケーションの複雑度が増す
* サーバ側のDOMとクライアントサイド側のDOMの一致（初期化時）を強いられる
* 公開ページのルーティングが一致していないといけない（APIアクセス→SSR→CSR(初回以外のルーティングはクライアント側のReact Routerとなるため))

ただし、最近では大規模プロジェクトになるほど（bundleサイズが大きくなるほど）初回レンダリングのメリットが大きいので最初から導入しておくのはありかなとも思っています。  
（逆に大きくなったタイミングでSSRに移行するのはプロジェクト全体の構成を作り直さないといけないため大変）  

# プロジェクト構成
次のようなプロジェクト構成に変更します。  
ソースコードはsrc配下にし、clientとserverに分けます。  
webpackでのビルド結果はpublic/distフォルダ以下に生成されます。  

```
├── README.md
├── babel.server.js
├── favicon.ico
├── index.html
├── nodemon.json
├── package.json
├── public
│   └── dist
│       ├── node
│       └── web
├── src
│   ├── client
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── NotFound.jsx
│   │   │   ├── TodoPage.jsx
│   │   │   └── UserPage.jsx
│   │   ├── main-node.js
│   │   ├── main-web.js
│   │   ├── modules
│   │   │   ├── reducer.js
│   │   │   └── user.js
│   │   └── theme.js
│   └── server
│       └── server.js
├── webpack.config.js
└── yarn.lock
```

# 追加のパッケージをインストール
サーバ用のパッケージとSSR用のパッケージを追加します。  

```
# babel webpack plugin
$ yarn add --dev @babel/cli @babel/plugin-syntax-dynamic-import @loadable/babel-plugin @loadable/webpack-plugin　webpack-node-externals
# HMRをサーバサイドに移行
$ yarn remove webpack-dev-server react-hot-loader
$ yarn add --dev webpack-dev-middleware webpack-hot-middleware
# サーバ用パッケージ
$ yarn add --dev nodemon
$ yarn add express express-favicon
# polyfill
$ yarn add --dev core-js regenerator-runtime
```

package.jsonは次のようになります。  
reactなどのパッケージはバックエンドでも使うためdependenciesに移行します。  

```
{
  "name": "learnreactjs",
  "version": "1.0.0",
  "repository": "https://github.com/teradonburi/learnReactJS.git",
  "author": "teradonburi <daikiterai@gmail.com>",
  "license": "MIT",
  "scripts": {
    "dev": "rm -rf public/dist && nodemon src/server/server.js",
    "lint": "eslint ."
  },
  "devDependencies": {
    "@babel/cli": "^7.5.0",
    "@babel/core": "^7.5.4",
    "@babel/plugin-proposal-class-properties": "^7.5.0",
    "@babel/plugin-syntax-dynamic-import": "^7.2.0",
    "@loadable/babel-plugin": "^5.10.0",
    "@loadable/component": "^5.10.1",
    "@loadable/webpack-plugin": "^5.7.1",
    "axios": "^0.19.0",
    "babel-eslint": "^10.0.2",
    "babel-loader": "^8.0.6",
    "core-js": "^3.1.4",
    "eslint": "^6.0.1",
    "eslint-loader": "^2.2.1",
    "eslint-plugin-react": "^7.14.2",
    "formik": "^1.5.8",
    "nodemon": "^1.19.1",
    "react-helmet": "^5.2.1",
    "redux-devtools": "^3.5.0",
    "redux-thunk": "^2.3.0",
    "regenerator-runtime": "^0.13.2",
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.5",
    "webpack-dev-middleware": "^3.7.0",
    "webpack-hot-middleware": "^2.25.0",
    "webpack-node-externals": "^1.7.2",
    "yup": "^0.27.0"
  },
  "dependencies": {
    "@babel/node": "^7.5.0",
    "@babel/preset-env": "^7.5.4",
    "@babel/preset-react": "^7.0.0",
    "@loadable/server": "^5.9.0",
    "@material-ui/core": "^4.2.0",
    "@material-ui/icons": "^4.2.1",
    "express": "^4.17.1",
    "express-favicon": "^2.0.1",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-redux": "^7.1.0",
    "react-router-dom": "^5.0.1",
    "redux": "^4.0.4"
  }
}
```

# eslintの修正
バックエンドのlintも行うため、.eslintrc.jsのenvにnodejs用の設定も追加します。  

```.eslintrc.js
  'env': {
    'browser': true, // ブラウザ
    'es6': true, // ES6
    'node': true // NodeJS
  },
```

# ビルド設定の修正  
SSRをするにはサーバもReactのJSXをトランスパイルする必要があるためbabel.server.jsを追加します。  

```babel.server.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: false,
        targets: { node: 'current' },
        modules: 'commonjs',
      },
    ],
    '@babel/preset-react',
  ],
}
```

nodemonはサーバ側のスクリプトが修正変更されたときに自動的にサーバを再起動してくれます。  
nodemonの起動設定をnodemon.jsonに記述します。  
babel-nodeにてnode実行前にbabelトランスパイルを行い、nodejsサーバを起動します。 
`--inspect`フラグをつけることでサーバ側スクリプトのデバックをChromeのDevToolsから行うことが出来ます。  

```nodemon.json
{
  "ignore": ["client", "public"],
  "execMap": {
    "js": "babel-node --config-file ./babel.server.js --inspect"
  }
}
```

webpack.config.jsを修正します。  
配列形式でフロントエンド(web)、バックエンド(node)を同時にwebpackビルド行えるように修正します。  
LoadablePlugin、loadableBabelPlugin、nodeExternalsの設定を追加します。  
loadable-componentsのSSR版にてバックエンドでもdynamic importしつつビルドします。  
ビルドのentryポイントをindex.jsからmain-node.js（バックエンド）、main-web.js（フロントエンド）に分離します。  

```webpack.config.js
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

  return {
    target,
    mode: 'development', // 開発モード
    name: target,
    devtool: 'cheap-module-source-map', // ソースマップファイル追加
    entry, // エントリポイントのjsxファイル
    output: {
      path: path.join(path.resolve(__dirname, 'public/dist'), target),
      filename: '[name].js',
      publicPath: `/dist/${target}/`,
      libraryTarget: target === 'node' ? 'commonjs2' : undefined,
    },
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

main-node.jsにて予め、サーバサイドで参照するコンポーネントやライブラリはexportしておきます。  

```main-node.js
export { default } from './App.jsx'
export { default as reducer } from './modules/reducer'
```

# サーバ側の処理
サーバ側の処理です。  
今回、`app.get('*')`ですべてのgetリクエストをSSRで処理します。  
ChunkExtractorにてビルド済み情報から、フロントエンドのAppコンポーネントとreducerを取得します。  
ThemeProviderでMaterial-UIのテーマを挿入、バックエンドでもcreateStoreで初回のレンダリング用にredux storeに初期化パラメータを挿入します。  
ルーティングにはBrowserRouterの代わりにStaticRouterを使う必要があります。  
SSRの特徴としてはReactコンポーネントのcomponentDidMount、componentDidUpdateライフライクルメソッドが呼ばれないことには注意が必要です。  
(componentDidmountは１回目のrenderが終わった後に呼ばれるため)  

```
import path from 'path'
import express from 'express'
import favicon from 'express-favicon'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ChunkExtractorManager, ChunkExtractor } from '@loadable/server'

const app = express()


if (process.env.NODE_ENV !== 'production') {
  const webpackConfig = require('../../webpack.config')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpack = require('webpack')

  // サーバ起動時、src変更時にwebpackビルドを行う
  const compiler = webpack(webpackConfig)

  // バックエンド用webpack-dev-server
  app.use(
    webpackDevMiddleware(compiler, {
      logLevel: 'error',
      publicPath: '/dist/web',
      // dist/web、dist/nodeに書き込むファイルの判定
      writeToDisk(filePath) {
        // ChunkExtractorが対応していないため、hot-updateを作成してもSSR側は修正版の読み込みができない
        const isWrite = (!/dist\/node\/.*\.hot-update/.test(filePath) && /dist\/node\//.test(filePath)) ||
          /loadable-stats/.test(filePath) ||
          /dist\/web\/.*\.hot-update/.test(filePath)
        return isWrite
      },
    }),
  )
  // HMR
  app.use(webpackHotMiddleware(compiler))
}

app.use(express.static(path.join(__dirname, '../../public')))
app.use(favicon(path.join(__dirname, '../../favicon.ico')))

const nodeStats = path.resolve(
  __dirname,
  '../../public/dist/node/loadable-stats.json',
)

const webStats = path.resolve(
  __dirname,
  '../../public/dist/web/loadable-stats.json',
)

// Redux
import { Provider } from 'react-redux'
import { createStore } from 'redux'
// Material-UI SSR
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
// material-ui theme
import theme from '../client/theme'
// StaticRouter
import { StaticRouter } from 'react-router-dom'

app.get(
  '*',
  (req, res) => {
    // webpackビルド完了前にhot-module（HMR）のファイル確認リクエストが来てしまう場合に無効化する
    if (process.env.NODE_ENV !== 'production' && /dist\/web\/.*\.hot-update/.test(req.url)) {
      return res.json(false)
    }

    // ChunkExtractorでビルド済みのチャンク情報を取得
    // loadable-stats.jsonからフロントエンドモジュールを取得する
    const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
    const { default: App, reducer, Helmet } = nodeExtractor.requireEntrypoint()
    const webExtractor = new ChunkExtractor({ statsFile: webStats })

    // 疑似ユーザ作成（本来はDBからデータを取得して埋め込む)
    const users = [{'gender': 'male', 'name': {'first': 'テスト', 'last': '太郎'}, 'email': '', 'picture': {'thumbnail': 'https://avatars1.githubusercontent.com/u/771218?s=460&v=4'}}]
    const initialData = { user: {users} }
    // Redux Storeの作成(initialDataには各Componentが参照するRedux Storeのstateを代入する)
    const store = createStore(reducer, initialData)

    const sheets = new ServerStyleSheets()
    const context = {}

    // SSR
    const html = renderToString(
      sheets.collect(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              <ChunkExtractorManager extractor={webExtractor}>
                <App />
              </ChunkExtractorManager>
            </StaticRouter>
          </Provider>
        </ThemeProvider>
      )
    )

    // Helmetで埋め込んだ情報を取得し、そのページのheaderに追加する
    const helmet =  Helmet.renderStatic()

    // react-routerに無いパスを通るとNotFoundコンポーネントが呼ばれ、contextにパラメータを埋め込む
    // 存在しないリクエストパスはきちんと404レスポンスを返す（SEO的に）
    if (context.is404) {
      return res.status(404).send('Not Found')
    }

    // Material-UIのCSSを作成
    const MUIStyles = sheets.toString()

    res.set('content-type', 'text/html')
    res.send(`<!DOCTYPE html>
<html lang='ja'>
<head>
${webExtractor.getLinkTags()}
${webExtractor.getStyleTags()}
${helmet.title.toString()}
${helmet.meta.toString()}
${helmet.link.toString()}
${helmet.script.toString()}
<meta charset='utf-8' />
<style id='jss-server-side'>${MUIStyles}</style>
<meta name='viewport' content='width=device-width, initial-scale=1' />
</head>
<body>
  <div id="root">${html}</div>
  <script id="initial-data">window.__STATE__=${JSON.stringify(initialData)}</script>
  ${webExtractor.getScriptTags()}
</body>
</html>`)

  },
)
// サーバを起動
app.listen(7070, () => console.log('Server started http://localhost:7070'))
```

`sheets.toString()`することでMaterial-UIのスタイルを取得し、`<style id="jss-server-side">${MUIStyles}</style>`にて埋め込みします。  
（フロントエンドで読み込み完了時にreplaceする）  
SSRレンダリング完了後、`webExtractor.getLinkTags()`でlinkタグ(dynamic import指定したJSスクリプトのprefetch、preload)が返却されます。  
`webExtractor.getStyleTags()`でその他のstyleタグを埋め込みします。  
`helmet.title.toString()`、`helmet.meta.toString()`、`helmet.meta.toString()`、`helmet.script.toString()`でHelmetタグで埋め込んだtitle、meta descriptionなどを埋め込みます。埋め込むタグはHelmetコンポーネントで記述します。（後述）  
`<script id="initial-data">window.__STATE__=${JSON.stringify(initialData)}</script>`でReduxStoreの初期化データをフロントエンドに渡します。  
`webExtractor.getScriptTags()`でwebpackしたjsファイルタグを埋め込みます。  

main-web.jsにCSRの初期化処理を記述します。  
SSR完了後、`webExtractor.getScriptTags()`にて埋め込まれたJSファイルが読み込まれ実行されます。  
Material-UIのテーマ情報はバックエンドと共通化するためtheme.jsに分離しました。MuiThemeProviderではなくThemeProviderを使います。  
バックエンドで埋め込んだid属性initial-data内のRedux Store初期化データをフロントエンドで取得し不要になったDOMを削除します。  
同様にバックエンドで埋め込んだid属性jss-server-side内のMaterial-UI CSSをフロントエンドで削除します。  
（初回レンダリング後はフロントエンドで同様のCSSを生成するため、不要なので）  

```main-web.js
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React  from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/styles'
import { BrowserRouter } from 'react-router-dom'
import { loadableReady } from '@loadable/component'
import client from 'axios'
import thunk from 'redux-thunk'

import App from './App.jsx'
import theme from './theme'
import reducer from './modules/reducer'

// バックエンドで埋め込んだRedux Storeのデータを取得する
const initialData = window.__STATE__ || {}
delete window.__STATE__
const dataElem = document.getElementById('initial-data')
if (dataElem && dataElem.parentNode) dataElem.parentNode.removeChild(dataElem)

// redux-devtoolの設定
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// redux-thunkをミドルウェアに適用
const store = createStore(reducer, initialData, composeEnhancers(applyMiddleware(thunkWithClient)))


function Main() {

  React.useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles) {
      // フロントエンドでもMaterial-UIのスタイルを再生成するため削除する
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])

  return (
    // ThemeProviderにテーマの指定をする
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  )
}

// HMRを有効にする
if (module.hot) {
  module.hot.accept()
}

// HMRするとき、バックエンドとフロントエンドでDOM一致しなくてhydrateだとエラー表示が出るので開発時はrenderの方を使う
const render = module.hot ? ReactDOM.render : ReactDOM.hydrate

// loadableの初期化処理完了時にレンダリング
loadableReady(() => render(<Main />, document.getElementById('root')))
```

# HMR
HMRはwebpack-hot-middlewareにて行います。  
webpack.config.jsにてweb側ビルド時にエントリーポイントに`webpack-hot-middleware/client`を埋め込みます。  
また、webpack.HotModuleReplacementPluginも埋め込みます。  

```
  const entry = web && process.env.NODE_ENV !== 'production' ?
  [
    `./src/client/main-${target}.js`,
    'webpack-hot-middleware/client',
  ] : `./src/client/main-${target}.js`

  const plugins = web && process.env.NODE_ENV !== 'production' ?
  [
      new webpack.NamedModulesPlugin(), // 名前変更無効プラグイン利用
      new LoadablePlugin(), // Loadableプラグイン
      new webpack.HotModuleReplacementPlugin(), // HMR
  ] :
  [
      new webpack.NamedModulesPlugin(), // 名前変更無効プラグイン利用
      new LoadablePlugin(), // Loadableプラグイン
  ]
```

server.jsにてwebpack-dev-middlewareとwebpack-hot-middlewareの設定を行います。(開発時のみ)  
webpack-dev-middlewareはサーバ（再）起動時にwebpackビルドを行います。  
webpack-hot-middlewareはフロントエンドのソースファイル修正時にhot-update.js(json)の形式でチャンクファイルを生成します。  
（フロントエンド側でhot-update.jsonを取得し、修正をリロードします）  
ただし、バックエンド側はChunkExtractorが対応していないため、SSRの反映はされません。  
(明示的にサーバを再起動して再度webpackビルドするまではSSR側は反映されない)  

```server.js
if (process.env.NODE_ENV !== 'production') {
  const webpackConfig = require('../../webpack.config')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpack = require('webpack')

  // サーバ起動時、src変更時にwebpackビルドを行う
  const compiler = webpack(webpackConfig)

  // バックエンド用webpack-dev-server
  app.use(
    webpackDevMiddleware(compiler, {
      logLevel: 'error',
      publicPath: '/dist/web',
      // dist/web、dist/nodeに書き込むファイルの判定
      writeToDisk(filePath) {
        // バックエンド側はhot-updateを作成する必要がないため除外する
        // ChunkExtractorが対応していないため、hot-updateを作成してもSSR側は修正版の読み込みができない
        const isWrite = (!/dist\/node\/.*\.hot-update/.test(filePath) && /dist\/node\//.test(filePath)) ||
          /loadable-stats/.test(filePath) ||
          /dist\/web\/.*\.hot-update/.test(filePath)
        return isWrite
      },
    }),
  )
  // HMR
  app.use(webpackHotMiddleware(compiler))
}


app.get(
  '*',
  (req, res) => {
    // webpackビルド完了前にhot-module（HMR）のファイル確認リクエストが来てしまう場合に無効化する
    if (process.env.NODE_ENV !== 'production' && /dist\/web\/.*\.hot-update/.test(req.url)) {
      return res.json(false)
    }
```

そのため、開発時HMRはSSRとCSRでDOM一致しなくなるので、  
ReactDOM.hydrateだとエラーを吐くため、ReactDOM.renderでレンダリングします。  

```
// HMRを有効にする
if (module.hot) {
  module.hot.accept()
}

// HMRするとき、バックエンドとフロントエンドでDOM一致しなくてhydrateだとエラー表示が出るので開発時はrenderの方を使う
const render = module.hot ? ReactDOM.render : ReactDOM.hydrate

// loadableの初期化処理完了時にレンダリング
loadableReady(() => render(<Main />, document.getElementById('root')))
```

# NotFound処理
NotFound.jsxを修正し、SSR時に来たときに404エラーを返すように修正します。  

```NotFound.jsx
import React from 'react'

export default class NotFound extends React.PureComponent {

  constructor (props) {
    super(props)
    const { staticContext } = props
    if (staticContext) {
      staticContext.is404 = true
    }
  }

  render () {
    return <div>NotFound</div>
  }
}
```

server.jsにてSSR時にStaticRouterにてcontextを渡してNotFoundコンポーネントに到達した場合に  
is404パラメータを埋め込み、明示的に404エラーレスポンスを返します。  

```server.js
const context = {}

// SSR
const html = renderToString(
  sheets.collect(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <ChunkExtractorManager extractor={webExtractor}>
            <App />
          </ChunkExtractorManager>
        </StaticRouter>
      </Provider>
    </ThemeProvider>
  )
)

// react-routerに無いパスを通るとNotFoundコンポーネントが呼ばれ、contextにパラメータを埋め込む
// 存在しないリクエストパスはきちんと404レスポンスを返す（SEO的に）
if (context.is404) {
  return res.status(404).send('Not Found')
}
```

# React HelmetでOGPやメタ情報をページ別に付与する
React Helmetを使うことで  
ページ別のコンポーネントにOGPやメタ情報を付与することができます。  
今回はUserPageにて、titleタグ、meta descriptionを埋め込んでいます。  

```
  <Helmet>
    <title>ユーザページ</title>
    <meta name='description' content='ユーザページのdescriptionです' />
  </Helmet>
```

同様にTodoPageにて、titleタグ、meta descriptionを埋め込んでいます。  

```
  <Helmet>
    <title>TODOページ</title>
    <meta name='description' content='TODOページのdescriptionです' />
  </Helmet>
```


# その他フロントエンドの修正
UserPage.jsxにてMaterial-UIのwithWidthはバックエンドで使えないため、外しています。  
(バックエンドでリクエストが来た時点ではどの端末か判別できない、withWidthはcomponentDidMountのタイミングで判別している)  
代わりにレスポンシブ対応をSSRでもするには`theme.breakpoints.down`を使ってCSSメディアクエリを準備しておくと良いでしょう。  

```
export default withStyles((theme) => ({ // classes propsを付与
  root: {
    fontStyle: 'italic',
    fontSize: 21,
    minHeight: 64,
    // 画面サイズがモバイルサイズのときのスタイル
    [theme.breakpoints.down('xs')]: {
      fontStyle: 'normal',
    },
  },
  card: {
    background: '#fff', // props経由でstyleを渡す
  },
  gender: {
    margin: 10,
    color: theme.palette.secondary[500], // themeカラーを参照
  },
}), {withTheme: true})(
  connect(
    // propsに受け取るreducerのstate
    state => ({
      users: state.user.users,
    }),
    // propsに付与するactions
    { load }
  )(UserPage)
)
```