import React from 'react'

export default class Child extends React.Component {

  // onRef propsをデフォルト定義しておく
  static defaultProps = {
    onRef: () => {},
  }

  // DOMレンダリング完了後のコールバック
  componentDidMount() {
    this.props.onRef(this)
  }

  // コンポーネントが破棄される直前のコールバック
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  message = (text) => {
    alert(text)
  }

  render() {
    // 何もレンダリングしない場合はnullを返す
    return null
  }
}