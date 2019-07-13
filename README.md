# ReactRouterで画面遷移と遷移履歴の管理

React Routerを使うと擬似的な画面遷移を行うことができます。  
下記コマンドでreact-router-domをインストールします。  

```
$ yarn add --dev react-router-dom --ignore-engines
```

webpack.config.jsonのdevServerにhistoryApiFallbackをtrueにします。  
後で使うhistory APIのブラウザリロード時に対応します。

```webpack.config.js
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    historyApiFallback: true, // history APIが404エラーを返す時、index.htmlに遷移(ブラウザリロード時など) 
```

App.jsxにてルーティングの指定をします。  
今回は  

* ユーザページ
* TODOページ
* NotFoundページ

を作成します。  
ルーティングをするためにはBrowserRouterコンポーネントで全体を囲みます。  

```App.js
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import NotFound from './NotFound.jsx'
import UserPage from './UserPage.jsx'
import TodoPage from './TodoPage.jsx'

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={UserPage} />
          <Route path="/todo" component={TodoPage} /> 
          {/* それ以外のパス */}
          <Route component={NotFound} />　
        </Switch>
      </BrowserRouter>
    )
  }
}

export default hot(module)(App)
```

Switchコンポーネントで対象のパスをグルーピングします。
exactはパスの完全一致指定です。この指定がないと/todoでもUserPageのコンポネントがレンダリングされてしまいます。
`/`や`/todo`以外のときはパス未指定のNotFoundコンポーネントが呼ばれます。

```NotFound.jsx
import React from 'react'

const NotFound = () => <div>NotFound</div>

export default NotFound
```

UserPage.jsxです。  
ほぼ変わりませんがヘッダー部分にTodoリストページに遷移するためのhandlePageMoveメソッドを追加しています。  

```UserPage.jsx
// 略

export default class UserPage extends React.Component {

  // 略

  handlePageMove(path) {
    this.props.history.push(path)
  }
  
  render () {
    const { users, theme, classes, width, location  } = this.props
    const { primary } = theme.palette

    // locationにはページのパス、urlパラメータなどが渡ってくる（パラメータをみて制御したい場合などに使う）
    console.log(location)

    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    // console.log(users)
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar classes={{root: classes.root}}>
            ユーザページ({ width === 'xs' ? 'スマホ' : 'PC'})
            <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> this.handlePageMove('/todo')}>TODOページへ</Button>
          </Toolbar>
        </AppBar>
        {/* 略 */}
      </div>
    )
  }
}
```

Router直下のコンポーネントはprops.match、props.location、props.historyが使えるようになります。  
historyオブジェクトにて画面遷移ができるようになります。  
また、遷移履歴もhistoryオブジェクトで一元管理されているため、ブラウザバックなども有効に働きます。  
URL部分を取得したい場合はprops.matchを使います。  

```
  handlePageMove(path) {
    // historyオブジェクトを使うことでページ遷移することが出来る
    this.props.history.push(path)
  }
```

TodoPage.jsxにはヘッダー部分にユーザページへ戻るリンクがあります。  
Router直下でないコンポーネントでもwithRouterでwrapすることでhistory, locationを参照することができます  

```TodoPage.jsx
import React from 'react'
import { AppBar, Toolbar, Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'

class TodoPage extends React.Component {

  render () {
    
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            TODOページ
            <BackButton>ユーザページへ</BackButton>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

let BackButton = ({history, location}) => {
  console.log(location)
  // history.goBackはブラウザの戻るボタンと等価（ブラウザ履歴を一つさかのぼる）
  return <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> history.goBack()}>ユーザページへ</Button>
}

// Router直下でないコンポーネントでもwithRouterでwrapすることでhistory, locationを参照することができる
BackButton = withRouter(BackButton)

export default TodoPage
```