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
  return (dispatch) => {
    // 疑似ユーザ作成（本来はサーバ送信＆DB保存）
    const data = {"results":[{"gender":user.gender,"name":{"first":user.firstname,"last":user.lastname},"email":user.email,"picture":{"thumbnail":"https://avatars1.githubusercontent.com/u/771218?s=460&v=4"}}]}
    const results = data.results[0]
    dispatch({ type: ADD, results })
    return Promise.resolve()
  }
}
```

TodoPage.jsxでフォーム入力してユーザを追加出来るように修正します。  
Material-UIと組み合わせる場合はwrapしたコンポーネントを作成します。(今回の例だとFormTextFieldコンポーネント、FormSelectコンポーネント)  

```TodoPage.jsx
import React from 'react'
import { connect } from 'react-redux'
import { AppBar, Toolbar, Button, Card, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { withRouter } from 'react-router-dom'
import { add } from './user'

// フォームデータの定義をバリデーション付きで行う
const SignupSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('必須項目です'),
  lastname: Yup.string()
    .required('必須項目です'),
  gender: Yup.string()
    .required('必須項目です'),
  email: Yup.string()
    .email('メールアドレスとして認識できません')
    .required('必須項目です'),
})

// フォーム用TextField
const FormTextField = ({field, form: { touched, errors }, ...props}) => (
  <TextField 
    error={touched[field.name] && !!errors[field.name]} 
    variant='outlined'
    helperText={touched[field.name] && errors[field.name]} 
    name={field.name}
    value={field.value}
    onChange={field.onChange}
    onBlur={field.onBlur}
    {...props}
  />
)

// フォーム用Select
const FormSelect = ({label, children, field, form: { touched, errors }, ...props}) => (
  <FormControl error={!!errors[field.name]}>
    <InputLabel>{label}</InputLabel>
    <Select
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      {...props}
    >
      {children}
    </Select>
    <FormHelperText>{touched[field.name] && errors[field.name]}</FormHelperText>
  </FormControl>
)

class TodoPage extends React.Component {

  constructor(props) {
    super(props)
    // sendItemsメソッド内でthisを使えるようにbindする
    this.sendItems = this.sendItems.bind(this)
  }

  sendItems(values) {
    const user = {
      firstname: values.firstname,
      lastname: values.lastname,
      gender: values.gender,
      email: values.email
    }
    this.props.add(user).then( () => alert('送信完了')) 
  }

  render () {
    const styles = {
      error: {
        color: red[500],
      },
      select: {
        minWidth: 100,
      }
    }

    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            TODOページ
            <BackButton>ユーザページへ</BackButton>
          </Toolbar>
        </AppBar>
        <Card style={{padding:10}}>
          <Formik
            initialValues={{
              firstname: '',
              lastname: '',
              gender: 'male',
              email: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={this.sendItems}
          >
            {({ isSubmitting }) => (
              <Form>
                <div style={{display: 'flex'}}>
                  <div style={{marginRight: 10, marginBottom: 10}}>
                    <Field name="firstname" component={FormTextField} placeholder='姓' />
                  </div>
                  <div>
                    <Field name="lastname" component={FormTextField} placeholder='名' />
                  </div>
                </div>
                <div style={{marginBottom: 10}}>
                  <Field name="gender" component={FormSelect} style={styles.select} label='性別' >
                    <MenuItem value="male">男性</MenuItem>
                    <MenuItem value="female">女性</MenuItem>
                  </Field>
                </div>
                <div style={{marginBottom: 10}}>
                  <Field name="email" type="email" component={FormTextField} placeholder='メールアドレス' />
                </div>
                <Button style={{marginTop:10}} variant='contained' type="submit" disabled={isSubmitting}>送信</Button>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    )
  }
}

TodoPage = connect(
  // propsに受け取るreducerのstate
  null,
  // propsに付与するactions
  { add }
)(TodoPage)

let BackButton = ({history, location}) => {
  console.log(location)
  // history.goBackはブラウザの戻るボタンと等価（ブラウザ履歴を一つさかのぼる）
  return <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> history.goBack()}>ユーザページへ</Button>
}

// Router直下でないコンポーネントでもwithRouterでwrapすることでhistory, locationを参照することができる
BackButton = withRouter(BackButton)

export default TodoPage
```

yupでフォームデータのデータ型とvalidation定義を行うことが出来ます。  
今回の場合、すべて文字列なのでYup.string()でデータ型を定義します。  
requiredで必須属性を指定します。引数はエラー時のメッセージとなります。  
emailはメールフォーマットのバリデーションチェックを行います。 
作成したスキーマはFormikのvalidationSchema属性に指定します。  
FormikのinitialValuesにはフォームデータの初期値を指定します。  

```
import * as Yup from 'yup'

// フォームデータの定義をバリデーション付きで行う
const SignupSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('必須項目です'),
  lastname: Yup.string()
    .required('必須項目です'),
  gender: Yup.string()
    .required('必須項目です'),
  email: Yup.string()
    .email('メールアドレスとして認識できません')
    .required('必須項目です'),
})

class TodoPage extends React.Component {

  render () {
    return (
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          gender: 'male',
          email: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={this.sendItems}
      >
        {({ isSubmitting }) => (
          <Form>
            (...略)
          </Form>
        )}
      </Formik>
    )
  }
}
```

Material-UIの入力コンポーネントをFormikに紐付けるには次のようにwrapしたコンポーネント作成します。  
field、formのpropsは後述のFieldコンポーネントから渡ってきます。  
touched[field.name]でそのコンポーネントに一度でもフォーカスを当てたか判別できます。  
errors[field.name]が存在するとき、そのフォーム欄でエラーが発生しています。  
fieldのpropsに関してはそのまま渡します。  
field.nameにはフォームの識別nameが入っています。  
field.valueにはフォームの値が入っています。  
field.onChangeにはフォーム入力欄の値変更時のハンドラが入ってきます。  
field.onBlurにはフォーム入力欄のフォーカスが外れたときのハンドラが入ってきます。  

```
// フォーム用TextField
const FormTextField = ({field, form: { touched, errors }, ...props}) => (
  <TextField 
    error={touched[field.name] && !!errors[field.name]} 
    variant='outlined'
    helperText={touched[field.name] && errors[field.name]} 
    name={field.name}
    value={field.value}
    onChange={field.onChange}
    onBlur={field.onBlur}
    {...props}
  />
)

// フォーム用Select
const FormSelect = ({label, children, field, form: { touched, errors }, ...props}) => (
  <FormControl error={!!errors[field.name]}>
    <InputLabel>{label}</InputLabel>
    <Select
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      {...props}
    >
      {children}
    </Select>
    <FormHelperText>{touched[field.name] && errors[field.name]}</FormHelperText>
  </FormControl>
)
```

FormikのFieldコンポーネントのcomponentにて先程wrapしたコンポーネントを渡します。  
その他のpropsは...propsの引数としてそのまま渡ります。  

```
  // フォームテキストフィールド
  <Field name="firstname" component={FormTextField} placeholder='姓' />
  // フォームセレクタ
  <Field name="gender" component={FormSelect} style={styles.select} label='性別' >
    <MenuItem value="male">男性</MenuItem>
    <MenuItem value="female">女性</MenuItem>
  </Field>
```

フォームのsubmitボタンでsubmitとしたとき、にsendItemsメソッドが呼ばれます。  
valuesには各フォーム入力欄の値が渡ってきます。  
この値をreduxのactionsのaddに送信することでredux storeにユーザが追加されます。  

```
  sendItems(values) {
    const user = {
      firstname: values.firstname,
      lastname: values.lastname,
      gender: values.gender,
      email: values.email
    }
    this.props.add(user).then( () => alert('送信完了')) 
  }

  render () {
    return (
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          gender: 'male',
          email: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={this.sendItems}
      >
```

# Appendix
他のFormデータバリデーション系のライブラリに[Redux-Form](https://github.com/erikras/redux-form)があります。  
Formikに関してはReduxに依存していないため、Reduxの作者のDan先生もFormikをおすすめしています。(一過姓のフォームデータをReduxで管理する必要はないという考えのため)  
一応、Material-UIと組み合わせた事例があるのでもしRedux-Formをお使いの方はこちらも参考になると思います。  
[ReduxFormとMaterial-UIでモダンなフォームを作る(MUI v3版)](https://qiita.com/teradonburi/items/94e16ddac481a01f210e)