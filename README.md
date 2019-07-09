# Reduxによる状態制御
props経由にデータを渡したり、親コンポーネントのイベントメソッドを指定することで  
子コンポーネントへのデータ伝達や親コンポーネントのコールバック呼び出しが可能です。  
ただし、アプリケーション全体のデータ（DBのデータ）をpropsでバケツリレーのように受け渡したりするのは非効率な上に、  
親コンポーネントのstateに子コンポーネントが影響する構造は全体のstateが把握できなくなり不具合の原因になります。  

![Reactのデータフロー](https://github.com/teradonburi/learnReactJS/blob/ReactRedux/dataflow.png)

そこでReduxを用いることでアプリケーション全体の状態を管理し、  
イベントコールバック→一元管理されたストアのパラメータ更新→描画反映  
といったことが楽になります。  
（類似のフレームワークにfluxがあります。）  
参考：[ToDoアプリで学ぶReact/Redux入門/vtecx2_lt2](https://speakerdeck.com/nishina555/vtecx2-lt2)  
参考：[Redux入門【ダイジェスト版】10分で理解するReduxの基礎](https://qiita.com/kiita312/items/49a1f03445b19cf407b7)  
参考：[React+Redux入門](https://qiita.com/erukiti/items/e16aa13ad81d5938374e)  
SPAなReactJSと特に相性が良いです。  
  
Reduxは次の思想で設計されています。  

1. ストアがいっぱいあると不整合が起きるのでビューに使うコンポーネントから分離して１つのストアに格納する
2. ストアの状態を更新するためには決められたアクション経由で行う
3. Stateの変更を行うReducerはシンプルな関数(Pure関数)にする

ReactとReduxを連動させるためにはreact-reduxのnpmパッケージを使います。
action呼び出し→reducer→コンポーネント再描画の一方通行のフロー制御に関しては  
react-reduxのconnectを使うことで実現できます。  
[ReactとReduxを結ぶパッケージ「react-redux」についてconnectの実装パターンを試す](https://qiita.com/MegaBlackLabel/items/df868e734d199071b883)  

追加で下記のRedux関連のパッケージをインストールします。  

```
$ yarn add --dev redux redux-devtools redux-thunk react-redux --ignore-engines
```

react-reduxを実際に使う場面は通信（アプリケーションデータ）や画面遷移周りだと思います。  
redux-thunkを使うとaction部分の処理を非同期にできます。  
  
通信用のライブラリ（axios）をインストールします  

```
$ yarn add --dev axios --ignore-engines
```

user.jsにuser情報を取得するactionとreducerを記述します。  
Random User Generatorで生成した疑似ユーザ情報をAPIで取得するactionを作成します。  
redux-thunkを使うとaction部分を非同期で記述できます。  

```user.js
// reducerで受け取るaction名を定義
const LOAD = 'user/LOAD'

// 初期化オブジェクト
const initialState = {
  users: null,
}

// reducerの定義（dispatch時にコールバックされる）
export default function reducer(state = initialState, action = {}){
  // actionの種別に応じてstateを更新する
  switch (action.type) {
    case LOAD:
      return {
        users:action.results,
      }
    default:
      // 初期化時はここに来る（initialStateのオブジェクトが返却される）
      return state
  }
}

// actionの定義
export function load() {
  // clientはaxiosの付与したクライアントパラメータ（後述）
  // 非同期処理をPromise形式で記述できる
  return (dispatch, getState, client) => {
    return client
      .get('https://randomuser.me/api/')
      .then(res => res.data)
      .then(data => {
        const results = data.results
        // dispatchしてreducer呼び出し
        dispatch({ type: LOAD, results })
      })
  }
}
```

reducer.jsに読み込むreducerを記述します

```reducer.js
import { combineReducers } from 'redux'
// 作成したuserのreducer
import user from './user'

// 作成したreducerをオブジェクトに追加していく
// combineReducersで１つにまとめてくれる
export default combineReducers({
  user,
})
```

index.jsxにてReduxのstoreを作成し  
storeにreducerを適応します。  
redux-thunkミドルウェアを適応することで  
actionにaxiosオブジェクトが引数として渡るようになります。  

```index.jsx
import React  from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import client from 'axios'
import thunk from 'redux-thunk'

import App from './App'
import reducer from './reducer'

// redux-devtoolの設定
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// redux-thunkをミドルウェアに適用
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunkWithClient)))

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
)
```

App.jsでuser情報取得のactionをキック、reducer経由でのstate更新を行います。

```App.jsx
import React from 'react'
import { connect } from 'react-redux';
import { load } from './user'

class App extends React.Component {

  componentDidMount() {
    // user取得APIコールのactionをキックする
    this.props.load()
  }

  render () {
    const { users } = this.props
    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    console.log(users)
    return (
      <div>
          {/* 配列形式で返却されるためmapで展開する */}
          {users && users.map((user) => {
            return (
                // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
                <div key={user.email}>
                  <img src={user.picture.thumbnail} />
                  <p>名前:{user.name.first + ' ' + user.name.last}</p>
                  <p>性別:{user.gender}</p>
                  <p>email:{user.email}</p>
                </div>
            )
          })}
      </div>
    )
  }
}

// connectでwrap
export default connect(
  // propsに受け取るreducerのstate
  state => ({
    users: state.user.users
  }),
  // propsに付与するactions
  { load }
)(App)
```

このようにコンポーネントで管理したくないビジネスロジックデータはReduxで管理します。

# Redux-devtoolsについて
[Redux-devtoolのプラグイン拡張](https://github.com/zalmoxisus/redux-devtools-extension)を使うと  
Reduxのstoreの状態やaction履歴について可視化できます。  
[Chrome　Addon](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)を追加後、localhostサーバ上で動かすと確認できます。  
webpack-dev-serverを用いるとwebpackとlocalhostサーバの起動を同時に行うことができます。  
webpack-dev-serverの詳細な設定はReact Hot Loaderの項にて説明します。  

```
$ yarn add --dev webpack-dev-server
$ npx webpack-dev-server
Project is running at http://localhost:8080/
```

