# 追加プラグインインストール

後述のdefaultPropsを使うためにtransform-class-propertiesプラグインをダウンロードします。

```
$ yarn add --dev @babel/plugin-proposal-class-properties --ignore-engines
```

webpack.config.jsにてpluginsを追加します。

```
options: {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }], // 追加
  ],
}
```

# サンプル

Reactの基本的なルールを覚えつつ簡単なアプリケーションを作ってみましょう。  
クリックしたらカウントアップするボックスのコンポーネントを作ってみます。  
まずボックスのコンポーネントを作ります。(Rect.js)  

```Rect.jsx
import React from 'react'
import NumberPlate from './NumberPlate.jsx'

export default class Rect extends React.Component {

  // デフォルト属性値
  static defaultProps = {
    num: 0,
    bgcolor: '#808080',
  }

  constructor (props) {
    super(props)
    // ステートオブジェクト
    this.state = { num : this.props.num }
    console.log('constructor')
  }

  // レンダリング完了時に１度のみ呼ばれるライフサイクルメソッド
  // apiコールなどの処理を行う
  componentDidMount() {
    console.log('componentDidMount')
  }

  // propsやstateの変更時に再度render関数を呼ぶか判定する
  // default trueを返す（いかなるpropsやstateの変更時にもrender関数を呼ぶ）
  shouldComponentUpdate() {
    console.log('shouldComponentUpdate')
    return true
  }

  // state, propsが変更された際に呼ばれるライフサイクルメソッド
  // 変更時に合わせて処理をしたい場合にオーバライドする
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate', prevState)
  }

  // componentが使わなくなって破棄される(Unmount)直前によばれるライフサイクルメソッド
  // 後処理などを行う
  componentWillUnmount() {
    console.log('componentWillUnmount')
  }

  // カウントアップ
  countUp () {
    // setStateメソッドでステートオブジェクトのパラメータを更新→renderメソッドが呼ばれ、再描画される
    this.setState({ num : this.state.num + 1 })
  }

  render (props) {
    // propsに属性値が渡ってくる
    const { bgcolor } = this.props

    // CSS スタイルはキャメルケースでプロパティを書く
    const rectStyle = {
      background: bgcolor,
      display: 'table-cell',
      border: '1px #000 solid',
      fontSize: 20,
      width: 30,
      height: 30,
      textAlign: 'center',
      verticalAlign: 'center',
    }

    // DOMが複数行になる場合は()で囲む
    // 返却する最上位のDOMは１つのみ
    // JSX内のブロック{}はJS式が評価される
    return (
      <div style={rectStyle} onClick={(e) => this.countUp()}>
        <NumberPlate><i>{this.state.num}</i></NumberPlate>
      </div>
    )
  }
}
```

ボックスの数字を表示するNumberPlateコンポーネントを作成します。

```NumberPlate.jsx
import React from 'react'

const NumberPlate = (props) => {
  return <span style={{ color: '#eeeeee' }}>{props.children}</span>
}

export default NumberPlate
```

App.jsxではRectコンポーネントを読み込んで表示します。   

```App.jsx
import React from 'react'
import Rect from './Rect'

export default class App extends React.Component {

  render () {
    return (
      <div>
        <Rect />
        <Rect num={1} bgcolor='#e02020' />
        <Rect num={2} bgcolor='#20e020' />
        <Rect num={3} bgcolor='#2020e0' />
      </div>
    )
  }
}
```

# Reactコンポーネントのライフサイクルについて

![lifecycle](./lifecycle.jpeg)

コンポーネントは生成されてから画面遷移時等で破棄されるまでライフサイクルを持ちます。  
ライフサイクルの特定のタイミングで呼ばれるライフサイクルメソッドが存在し、オーバライドすることで特定のタイミングで処理を実行することができます。  
よく使うライフサイクルメソッドとしては描画時に呼ばれるrenderメソッドは必須なのでまず抑えておいてください  
通信処理でデータ取得してレンダリングする際はcomponentDidMountを使います。  
propsやstateが変更され、再レンダリングが必要な場合はcomponentShouldUpdateが呼ばれます。再レンダリングする（render関数を呼ぶ）にはtrue、しない場合はfalseを戻り値として返します（default true）  
propsやstateの変更をみて、さらに何か処理したい場合には  componentDidUpdateをオーバライドします。(初回レンダリング時は呼ばれません)  
画面遷移などでコンポーネントが破棄される時に後処理をする場合はcomponentWillUnmount内で行います。  
  
constructor > render > componentDidMount > shouldComponentUpdate > componentDidUpdate > componentWillUnmount
の順番にライフサイクルメソッドが呼ばれます。  

```Rect.jsx
  // レンダリング完了時に１度のみ呼ばれるライフサイクルメソッド
  // apiコールなどの処理を行う
  componentDidMount() {
    console.log('componentDidMount')
  }

  // propsやstateの変更時に再度render関数を呼ぶか判定する
  // default trueを返す（いかなるpropsやstateの変更時にもrender関数を呼ぶ）
  shouldComponentUpdate() {
    console.log('shouldComponentUpdate')
    return true
  }

  // state, propsが変更された際に呼ばれるライフサイクルメソッド
  // 変更時に合わせて処理をしたい場合にオーバライドする
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate', prevState)
  }

  // componentが使わなくなって破棄される(Unmount)直前によばれるライフサイクルメソッド
  // 後処理などを行う
  componentWillUnmount() {
    console.log('componentWillUnmount')
  }

```
  
shouldComponentUpdateに関してはレンダリングの最適化に関わるところですが、  
内容が少し上級者向けのため、React Reduxの項目を習得した後で読むと良いと思います。  
参考：[お前らのReactは遅い](https://qiita.com/teradonburi/items/5b8f79d26e1b319ac44f#sfc-vs-reactmemo-vs-purecomponent)

# Stateless Functional Componentについて
reactをimportするだけで関数もReactのコンポーネントになります。  
この場合、renderメソッドのみ実装されたコンポーネントになります。  
後述のstateがない場合はStateless Functional Componentにしたほうがライフサイクルの負荷がないため、  
こちらを積極的に使っていきましょう。  

```NumberPlate.jsx
import React from 'react'

// Stateless Functional Component
// renderのみが実装されたReact ComponentでReactライブラリをimportすることで自動的にComponentとして判別してくれる
// 通常のReact Componentと違いライフサイクルのコールバックのオーバヘッドがないため、軽量
const NumberPlate = (props) => {
  return <span style={{ color: '#eeeeee' }}>{props.children}</span>
}

export default NumberPlate

// 処理自体はこれと同じ
// export default class NumberPlate extends React.Component {
//   render (props) {
//     return <span style={{ color: '#eeeeee' }}>{props.children}</span>
//   }
// }
```

# 属性値について

新規に作成したRectコンポーネントには通常のDOMと
同様に属性値を定義することができます。

```App.jsx
<Rect num={1} bgcolor='#e02020' />
```

独自に定義したプロパティはpropsオブジェクト内に格納されてRectコンポーネントに渡ってきます。  
生成時(constructor時点)に入っているため、this.propsで参照するか、各種ライフサイクルメソッドの引数から参照します。  

```Rect.jsx
render () {
  // propsに属性値が渡ってくる
  const { bgcolor } = this.props
```

defaultPropsを使うことで属性値がない場合のデフォルトの属性値を指定することができます。  

```
  // デフォルト属性値
  static defaultProps = {
    num: 0,
    bgcolor: '#808080',
  }
```

入れ子にした要素はprops.childrenとしてDOM子要素が渡ります。  
下の例だとNumberPlate内部のiタグを含んだ子要素が入ります。  

```
  {/* 呼び出し側 */}
  <NumberPlate><i>{this.state.num}</i></NumberPlate>
  {/* 呼び出され側(NumberPlateのprops.childrenにNumberPlateのDOM子要素が渡る) */}
  <span>{props.children}</span>
```

# CSS Styleについて

JSX内でスタイルを渡すにはキャメルケースで書く必要があります。  
babelでCSSに変換してもらいます。  
例えば、font-sizeを適応したい場合はfontSizeと記述する必要があります。  

```Rect.jsx
  // CSS スタイルはキャメルケースでプロパティを書く
  const rectStyle = {
    background: bgcolor,
    display: 'table-cell',
    border: '1px #000 solid',
    fontSize: 20,
    width: 30,
    height: 30,
    textAlign: 'center',
    verticalAlign: 'center',
  }
```

JSX内で{}した箇所にはJSを書くことができます。  
今回はJSのスタイルオブジェクトを渡しています。  

```Rect.jsx
  <div style={rectStyle} />
```

次のようにインラインで直接CSSスタイル指定することも可能です。  

```
  <span style={{ color: '#eeeeee' }}>
```

# イベントハンドリングについて

基本的なaddEventListenerのイベントハンドリングが使えます。  
公式：[SyntheticEvent](https://reactjs.org/docs/events.html)  
ただし書き方はon(イベント名)のキャメルケース表記になります。  
例えば、clickイベントはonClickでイベントハンドリングを行います。  

```
  <div onClick={() => this.countUp()}>
```

# コンポーネントのstateについて

コンポーネント内部で状態を保持したい場合は  
stateオブジェクトという特殊なオブジェクトを定義します。  
中身のパラメータに関しては自由に入れて構いません。  
今回はクリックしたときに数字をカウントアップしたいため  
numberパラメータを保持するようにしました。  

```Rect.jsx
  // ステートオブジェクト
  this.state = { number : this.props.num }
```

イベントハンドリングとnumberオブジェクトの更新に関して記述した箇所が次の箇所になります。  
Reactにはstateオブジェクトのパラメータを更新させるために  
setStateメソッドが用意されています。  
クリックされてsetStateメソッドが呼び出されるとstateオブジェクトのパラメータを更新し  
renderメソッドを呼び出します（再描画される）。  

```Rect.jsx

  // カウントアップ
  countUp (num) {
    // ステートオブジェクトのパラメータを更新→renderメソッドが呼ばれ、再描画される
    this.setState({ number : num + 1 })
  }

  render () {
     return (
      {/* クリックイベントバインディング */}
      <div onClick={(e)=> this.countUp(this.state.number)}>
     )
  }
```

renderメソッド内でsetStateメソッドを直接呼び出してはいけません。  
render→setState→renderと無限ループになるからです。  

クラスメソッドのイベントバインディングには何種類か方法があります。  
詳しくは[Reactをes6で使う場合のbindの問題](https://qiita.com/cubdesign/items/ee8bff7073ebe1979936)を参照

例えば、次のようにメソッドをクラスにbindする方法もあります。  

```Rect.jsx
import React from 'react'

export default class Rect extends React.Component {

  constructor (props) {
    super(props)
    // ステートオブジェクト
    this.state = { num : this.props.num }
    this.countUp = this.countUp.bind(this) // bind
  }

  // カウントアップ
  countUp () {
    // ステートオブジェクトのパラメータを更新→renderメソッドが呼ばれ、再描画される
    this.setState({ num : this.state.num + 1 })
  }

  render () {

    return (
      {/* クリックイベントバインディング */}
      <div onClick={this.countUp}>
        <span>{this.state.num}</span>
      </div>
    )
  }
}
```


# コンポーネント(DOM)のループ(map)
liタグなどのような同じコンポーネント(DOM)が並んでいて  
属性値が違う場合はユニークなkey指定でmapを回すことで連続描画できます。  

```App.jsx
render () {

  const rects = [
    {key: 'rect_1', num: 1, bgcolor: '#e02020'},
    {key: 'rect_2', num: 2, bgcolor: '#20e020'},
    {key: 'rect_3', num: 3, bgcolor: '#2020e0'},
  ]

  return (
    <div>
      { rects.map((r) => <Rect key={r.key} num={r.num} bgcolor={r.bgcolor} />) }
    </div>
  )
}
```

keyを1,2,3のような単純なindexにしてはいけないのは、  
動的なDOM操作をする時、ユニークなキーでない場合、Reactの挙動がおかしくなるからです。  
下記のサンプルの挙動がわかりやすいです  
実践ではDBのユニークキーなどを割り当てると良いでしょう。  

参考：[Index as a key is an anti-pattern](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)


# 配列でのDOM返し(ReactJS v16)
ReactJS v16から配列形式のrender DOM返却ができるようになりました。  
参考：[Arrays in React 16 and the necessity of keys](https://medium.com/reactnative/arrays-in-react-16-and-the-necessity-of-keys-c62e7adb4206)
  
これにより、renderの最上位DOMが必ず１つであるという制約がなくなります。  
ただし、この場合、keyが必須です。  

```App.jsx
render () {

  return [
    <Rect key='rect_1' num={1} bgcolor='#e02020' />,
    <Rect key='rect_2' num={2} bgcolor='#20e020' />,
    <Rect key='rect_3' num={3} bgcolor='#2020e0' />,
  ]
}
```

さらに短く書く場合は次のように書けます。

```App.jsx
render () {

  const rects = [
    {key: 'rect_1', num: 1, bgcolor: '#e02020'},
    {key: 'rect_2', num: 2, bgcolor: '#20e020'},
    {key: 'rect_3', num: 3, bgcolor: '#2020e0'},
  ]

  return rects.map((r) => <Rect key={r.key} num={r.num} bgcolor={r.bgcolor} />)
}
```

# React.FragmentでのDOM返し(ReactJS v16.2)
React v16.2からReact.Fragmentという機能が追加されました。  
配列同様にFragment部分のDOMはレンダリングされません。  
配列の場合はkeyが必要でしたが、Fragmentの場合はkeyが不要です。  

```App.jsx
import React from 'react'
import Rect from './Rect'

export default class App extends React.Component {

  render () {
    return (
      <React.Fragment>
        <Rect />
        <Rect num={1} bgcolor='#e02020' />
        <Rect num={2} bgcolor='#20e020' />
        <Rect num={3} bgcolor='#2020e0' />
      </React.Fragment>
    )
  }
}
```

Fragmentは`<>{children}</>`のような省略記法があります。  

```App.jsx
import React from 'react'
import Rect from './Rect'

export default class App extends React.Component {

  render () {
    return (
      <>
        <Rect />
        <Rect num={1} bgcolor='#e02020' />
        <Rect num={2} bgcolor='#20e020' />
        <Rect num={3} bgcolor='#2020e0' />
      </>
    )
  }
}
```