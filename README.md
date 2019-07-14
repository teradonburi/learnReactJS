# Material-UIでモダンな画面を作る
[マテリアルデザイン](https://material.io/guidelines/)はGoogleが提唱するデザインフォーマットです。  
フラットデザインに現実の物理要素（影やフィードバック）を持たせたようなデザインです。  
Androidアプリでの全面的な利用など最近のアプリケーションのデザインは大体マテリアルデザインでできています。  
  
ReactJSではマテリアルデザインを踏襲した[Material-UI](https://material-ui.com/)というライブラリがあります。    
Material-UIのパッケージをインストールします。  

```
$ yarn add --dev @material-ui/core @material-ui/icons --ignore-engines
```

index.jsxにmaterial-uiのテーマの指定をします。  
createMuiThemeでテーマを作成し、  
MuiThemeProviderでテーマを全体に指定します。  

```index.jsx
import React  from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
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

// Material-UIテーマを上書きする
const theme = createMuiTheme({
  // カラーパレット
  palette: {
    type: 'light',
    // メインカラー
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
      A100: '#82b1ff',
      A200: '#448aff',
      A400: '#2979ff',
      A700: '#2962ff',
      contrastDefaultColor: 'light', // 対象色のデフォルト色をlightテーマにする
    },
    // アクセントカラー
    secondary: {
      50: '#fce4ec',
      100: '#f8bbd0',
      200: '#f48fb1',
      300: '#f06292',
      400: '#ec407a',
      500: '#e91e63',
      600: '#d81b60',
      700: '#c2185b',
      800: '#ad1457',
      900: '#880e4f',
      A100: '#ff80ab',
      A200: '#ff4081',
      A400: '#f50057',
      A700: '#c51162',
      contrastDefaultColor: 'light', // 対象色のデフォルト色をlightテーマにする
    },
  },
  // レスポンシブレイアウト用の指定
  'breakpoints': {
    'keys': [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ],
    'values': {
      'xs': 360, // スマホ用
      'sm': 768, // タブレット用
      'md': 992, // PC用
      'lg': 1000000000, 
      'xl': 1000000000,
    },
  },
  // Material-UIコンポーネントのclassのstyleを上書きする
  overrides: {
    MuiButton: {
      root: {
        // ボタン内アルファベット文字を大文字変換しない
        textTransform: 'none',
      },
    },
  },
})

ReactDOM.render(
  // MuiThemeProviderにテーマの指定をする
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App bgcolor='#a0f0a0' />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)
```

ユーザを取得したApp.jsxをmaterial-uiで書き直します。

```App.jsx
import React from 'react'
import { connect } from 'react-redux';
import { load } from './user'

import { withTheme, withStyles } from '@material-ui/core/styles'
import { AppBar,Toolbar, Avatar, Card, CardContent, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import { Email } from '@material-ui/icons'
import withWidth from '@material-ui/core/withWidth'
import { orange } from '@material-ui/core/colors'

class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      open:false,
      user:null,
    }
  }

  componentDidMount() {
    // user取得APIコールのactionをキックする
    this.props.load()
  }

  handleClickOpen (user) {
    this.setState({
      open: true,
      user: user,
    })
  }

  handleRequestClose () {
    this.setState({ open: false })
  }

  render () {
    const { users, theme, classes, width } = this.props
    const { primary } = theme.palette

    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    console.log(users)
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar classes={{root: classes.root}} >
            タイトル({ width === 'xs' ? 'スマホ' : 'PC'})
          </Toolbar>
        </AppBar>
        {/* 配列形式で返却されるためmapで展開する */}
        {users && users.map((user) => {
          return (
            // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
            <Card key={user.email} style={{marginTop:'10px'}}>
              <CardContent className={classes.card} >
                <Avatar src={user.picture.thumbnail} />
                <p style={{margin:10, color:primary[500]}}>{'名前:' + user.name.first + ' ' + user.name.last} </p>
                <p className={classes.gender}>{'性別:' + (user.gender == 'male' ? '男性' : '女性')}</p>
                <div style={{textAlign: 'right'}} >
                  <Button variant="contained" color='secondary' onClick={() => this.handleClickOpen(user)}><Email style={{marginRight: 5, color: orange[200]}}/>Email</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {
          this.state.open &&
          <Dialog open={this.state.open} onClose={() => this.handleRequestClose()}>
            <DialogTitle>メールアドレス</DialogTitle>
            <DialogContent>{this.state.user.email}</DialogContent>
          </Dialog>
        }
      </div>
    )
  }
}

// width propsを付与
export default withWidth()(
// theme propsを付与
withTheme(
// classes propsを付与
withStyles((theme) => ({ 
  root: {
    fontStyle: 'italic',
    fontSize: 21,
    minHeight: 64,
    // 画面サイズがモバイルサイズのときのスタイル
    [theme.breakpoints.down('xs')]: {
      fontStyle: 'normal',
    }
  },
  card: {
    background: props => `${props.bgcolor}` // props経由でstyleを渡す
  },
  gender: {
    margin: 10,
    color: theme.palette.secondary[500], // themeカラーを参照
  }
}))(
// connectでwrap
connect(
  // propsに受け取るreducerのstate
  state => ({
    users: state.user.users
  }),
  // propsに付与するactions
  { load }
)(App)
)))
```

Material-UIの各コンポーネントに関しては  
公式：[Material-UI](https://material-ui.com/)のComponents Demoに各種コンポーネントのデモがあるので、それを見たほうが理解できると思います。  

# テーマ
Material-UIではマテリアルデザインガイドに沿った  
[色パレット](https://material-ui.com/style/color/)や[テーマ](https://material-ui.com/customization/themes/)の指定を行います。  
デフォルトではlightテーマとdarkテーマが用意されていますが、  
サービスによってテーマ色を変えたいという要望は普通なのでカラーパレットを上書きします。  
独自に色作るときは、色の濃淡も規則性があるのでGeneratorを使って生成したほうが[マテリアルデザインガイド通り](https://material.io/guidelines/style/color.html#color-color-system)なので無難です。  
[MATERIAL DESIGN PALETTE GENERATOR](http://mcg.mbitson.com/#!?mcgpalette0=%233f51b5)を使うと指定色ベースで作ってくれます。  
  

```index.js
const theme = createMuiTheme({
  // カラーパレット
  palette: {
    type: 'light',
    // メインカラー
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
      A100: '#82b1ff',
      A200: '#448aff',
      A400: '#2979ff',
      A700: '#2962ff',
      contrastDefaultColor: 'light', // 対象色のデフォルト色をlightテーマにする
    },
    // アクセントカラー
    secondary: {
      50: '#fce4ec',
      100: '#f8bbd0',
      200: '#f48fb1',
      300: '#f06292',
      400: '#ec407a',
      500: '#e91e63',
      600: '#d81b60',
      700: '#c2185b',
      800: '#ad1457',
      900: '#880e4f',
      A100: '#ff80ab',
      A200: '#ff4081',
      A400: '#f50057',
      A700: '#c51162',
      contrastDefaultColor: 'light', // 対象色のデフォルト色をlightテーマにする
    },
  },
})
```

利用側では、  
withThemeを使うとprops.themeが使えるようになります。  
カラーパレットからcommon,primary,secondary,grey,errorなどが使えます。  
color属性を持っている[Button](https://material-ui.com/demos/buttons/)等のコンポーネントは'primary'、'secondary'、'default'、'inherit'などで背景色指定することもできます

```App.js
import { withTheme } from '@material-ui/core/styles'

class App extends React.Component {
  render () {
    const { theme } = this.props
    const { primary, secondary } = theme.palette

    return (
      <div>
        <p style={{margin:10, color:primary[500]}}>名前</p>
        <p style={{margin:10, color:seconary[500]}}>性別</p>
        <Button variant="raised" color='secondary'>Email</Button>
      </div>
    )
  }
}

export default class withTheme(App) // theme propsを付与
```

# レスポンシブレイアウト対応
withWidthを使えば,  
widthのpropsが画面サイズに合わせて渡ってきます。  
- [Hidden](https://material-ui.com/layout/hidden/)

`xs < sm < md < lg < xl`の順に横幅の大きさが大きいです。  
index.jsのcreateMuiThemeのbreakpointsにて上書きしています。  
md以上は変える必要性があまりない気がしているので大きい値で返ってこないようにしています。  

```index.jsx
const theme = createMuiTheme({
  // レスポンシブレイアウト用の指定
  'breakpoints': {
    'keys': [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ],
    'values': {
      'xs': 360, // スマホ用
      'sm': 768, // タブレット用
      'md': 992, // PC用
      'lg': 1000000000, 
      'xl': 1000000000,
    },
  },
})
```

withWidthでコンポーネントをwrapすることで  
this.props.widthが参照できるようになります。  
ブラウザの画面サイズを変えることでxs, sm, mdに変わり、再度renderが呼ばれます。  

```App.jsx
import withWidth from '@material-ui/core/withWidth'

class App extends React.Component {
  render () {
    const { width } = this.props

    return (
        <AppBar>
          <Toolbar >
            タイトル({ width === 'xs' ? 'スマホ' : 'PC'})
          </Toolbar>
        </AppBar>
    )
  }
}

export default class withWidth()(App) // width propsを付与
```

# Material UIコンポーネントstyleのオーバライド
Material UIのコンポーネントのスタイルも基本的にはstyle属性で記述できるのですが、稀にstyleが効かない場合があります。  
その場合はMaterial-UIコンポーネント自体のclass styleを上書きします。  
コンポーネント全体を上書きしたい場合はテーマのoverrideにstyleを書きます。  

```index.jsx
const theme = createMuiTheme({
  // Material-UIコンポーネントのclassのstyleを上書きする
  overrides: {
    MuiButton: {
      root: {
        // ボタン内アルファベット文字を大文字変換しない
        textTransform: 'none',
      },
    },
  },
})
```

withStylesでwrapすることでclassesのpropsを参照できるようになります。  
Material UIコンポーネント自体のスタイルを上書きしたい場合やDOMにclass属性を割り当てたいときに使います。  
上書き対象となるMaterial UIコンポーネントのclasses属性に指定します。  
withStyles内部でthemeも参照できるため、themeのカラーパレットを参照したり、  
`theme.breakpoints.down`を使うことでメディアクエリのような、画面サイズを変更したときのスタイルをclass属性で定義することが出来ます。  

```App.jsx
import { withStyles } from '@material-ui/core/styles'

class App extends React.Component {
  render() {
    const { classes } = this.props

    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar classes={{root: classes.root}} >
            タイトル
          </Toolbar>
        </AppBar>
        <Card key={user.email} style={{marginTop:'10px'}}>
          <CardContent className={classes.card} >
            <p className={classes.gender}>{'性別:' + (user.gender == 'male' ? '男性' : '女性')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default class withStyles((theme) => ({ // classes propsを付与
  root: {
    fontStyle: 'italic',
    fontSize: 21,
    minHeight: 64,
    // 画面サイズがモバイルサイズのときのスタイル
    [theme.breakpoints.down('xs')]: {
      fontStyle: 'normal',
    }
  },
  card: {
    background: props => `${props.bgcolor}` // props経由でstyleを渡す(Material-UI v4の新機能)
  },
  gender: {
    margin: 10,
    color: theme.palette.secondary[500], // themeカラーを参照
  }
}))(App)
```

また、Material-UI v4からprops経由でstyleを渡すことが出来るようになりました。  
今回の例だとbgcolorはAppコンポーネントのpropsとしてindex.jsxから渡しています。  

```
  <App bgcolor='#a0f0a0' />
```

## withStylesでwithThemeを同時に付与する
withStylesの第２引数のoptionに`{withTheme: true}`を渡すことで  
withThemeでwrapしなくてもthemeのpropsをコンポーネントに付与することが出来ます。  

```
class App extends React.Component {

  render () {
    const { theme, classes } = this.props
    const { primary } = theme.palette

    return <div />
  }
}

export default class withStyles((theme) => ({ // classes propsを付与
  
}, {withTheme: true}))(App)
```

# アイコン
Material UIのアイコンに関しては下記ページのアイコンが使えます。  
[Material icons](https://material.io/tools/icons/?style=baseline)
  
今回はメールのアイコンを使っています。  
emailというアイコン名になっているので、  
次のように先頭大文字でメールアイコンを読み込みできます。  

```App.jsx
import { Email } from '@material-ui/icons'

export default class App extends React.Component {
  render() {
    return <Email/>
  }
}
```

# テーマ外の色を使う
アイコン色など、テーマ外の色をピンポイントで使いたい場合もあると思います。  
その場合は、`@material-ui/core/colors`をimportすることで直接定義色を参照できます。  
ちなみに、アイコンの背景色はcolorsで変更できます。  

```
import { orange } from '@material-ui/core/colors'

export default class App extends React.Component {
  render() {
    return <Email style={{color: orange[200]}} />
  }
}
```
