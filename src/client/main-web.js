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

// redux-devtoolの設定
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// redux-thunkをミドルウェアに適用
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunkWithClient)))


function Main() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
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
