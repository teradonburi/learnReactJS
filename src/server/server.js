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
    const { default: App, reducer } = nodeExtractor.requireEntrypoint()
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

    // react-routerに無いパスを通るとNotFoundコンポーネントが呼ばれ、contextにパラメータを埋め込む
    // 存在しないリクエストパスはきちんと404レスポンスを返す（SEO的に）
    if (context.is404) {
      return res.status(404).send('Not Found')
    }

    // Material-UIのCSSを作成
    const MUIStyles = sheets.toString()

    res.set('content-type', 'text/html')
    res.send(`<!DOCTYPE html>
<html>
<head>
${webExtractor.getLinkTags()}
${webExtractor.getStyleTags()}
<style id="jss-server-side">${MUIStyles}</style>
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
