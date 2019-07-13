# Formikでのフォームバリデーションとフォーム送信

[Formik](https://github.com/jaredpalmer/formik)を使うことでFormのデータのバリデーションチェックができます。  
さらに[yup](https://github.com/jquense/yup)を使うことでバリデーション付きのフォームデータのスキーマ定義が出来ます。  

```
$ yarn add --dev formik yup --ignore-engines
```

reducer/user.jsに入力データ追加用のactionを追加します。（ADD）  
本来はサーバ送信＆DB保存ですが、今回はReduxのstoreに追加しているだけです。  

```user.js
// reducerで受け取るaction名を定義
const LOAD = 'user/LOAD'
const ADD = 'user/ADD'

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
        users: state.users ? state.users : action.results
      }
    case ADD:
      // ユーザ一覧末尾にユーザを追加する
      return {
        users: state.users ? [...state.users, action.results] : [action.results]
      }
    default:
      // 初期化時はここに来る（initialStateのオブジェクトが返却される）
      return state
  }
}

// actionの定義
export function load() {
  // clientはaxiosの付与したクライアントパラメータ
  // 非同期処理をPromise形式で記述できる
  return (dispatch, getState, client) => {
    return client
      .get('https://randomuser.me/api')
      .then(res => res.data)
      .then(data => {
        const results = data.results
        // dispatchしてreducer呼び出し
        dispatch({ type: LOAD, results })
      })
  }
}

export function add(user) {
  // ユーザを追加
  return (dispatch, getState, client) => {
    // 疑似ユーザ作成（本来はサーバ送信＆DB保存）
    const data = {"results":[{"gender":user.gender,"name":{"first":user.firstname,"last":user.lastname},"email":user.email,"picture":{"thumbnail":"https://avatars1.githubusercontent.com/u/771218?s=460&v=4"}}]}
    const results = data.results[0]
    dispatch({ type: ADD, results })
    return Promise.resolve()
  }
}
```