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