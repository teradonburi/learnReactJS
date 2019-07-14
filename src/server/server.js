import path from 'path'
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ChunkExtractorManager, ChunkExtractor } from '@loadable/server'

const app = express()

app.use(express.static(path.join(__dirname, '../../public')))

if (process.env.NODE_ENV !== 'production') {
  const webpackConfig = require('../../webpack.config')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpack = require('webpack')

  const compiler = webpack(webpackConfig)

  app.use(
    webpackDevMiddleware(compiler, {
      logLevel: 'silent',
      publicPath: '/dist/web',
      writeToDisk(filePath) {
        return /dist\/node\//.test(filePath) || /loadable-stats/.test(filePath)
      },
    }),
  )
}


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
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
// Material-UI SSR
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
// material-ui theme
import theme from '../client/theme'
// StaticRouter
import { StaticRouter } from 'react-router-dom'

app.get(
  '*',
  (req, res) => {
    const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
    const { default: App, reducer } = nodeExtractor.requireEntrypoint()

    const webExtractor = new ChunkExtractor({ statsFile: webStats })


    // 疑似ユーザ作成（本来はDBからデータを取得して埋め込む)
    const initialData = { user: {} }
    // Redux Storeの作成(initialDataには各Componentが参照するRedux Storeのstateを代入する)
    const store = createStore(reducer, initialData, applyMiddleware(thunk))

    const sheets = new ServerStyleSheets()
    const context = {}

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
  ${webExtractor.getScriptTags()}
</body>
</html>`)

  },
)

// eslint-disable-next-line no-console
app.listen(9000, () => console.log('Server started http://localhost:9000'))
