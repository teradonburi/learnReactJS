import React from 'react'
import Child from './Child.jsx'

// 子コンポーネント
const TextInput = (props) => {
  return <input ref={props.inputRef} />
}

const MyButton = (props) => {
  return <button onClick={() => props.handleClick('call from child')} >親呼び出し</button>
}

export default class App extends React.Component {

  constructor (props) {
    super(props)
    // createRefでref変数作成
    this.upload = React.createRef()
    this.done = React.createRef()
  }

  // アップロードされたファイルの処理
  handleUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = e => {
      alert(e.target.result)
    }
    e.target.value = null

    // currentプロパティ経由で生のHTMLElementを操作できる
    this.done.current.style.display = ''
  }

  // フォーカス
  focusInput = () => {
    this.input.focus()
  }

  // 入力連動
  changeInput = () => {
    this.textInput.value = this.input.value
  }

  handleClick = () => {
    alert('parent')
  }

  render () {
    return (
      <div>
        <p>別のDOMからref参照でクリックイベント処理をキックする例:</p>
        <input type='file' ref={this.upload} style={{display: 'none'}} onChange={this.handleUpload} />
        <button onClick={() => this.upload.current.click()}>アップロード</button>
        <div ref={this.done} style={{display: 'none'}}>アップロード完了</div>
        <div>
          <p>refsを仲介しないで変数に格納する例:</p>
          <input type="text" ref={(input) => { this.input = input }} onChange={this.changeInput} />
          <button onClick={this.focusInput}>入力フォーカス</button>
        </div>
        <p>子コンポーネントのref参照を取得し、入力連動させる例:</p>
        <TextInput inputRef={el => this.textInput = el} />
        <p>親コンポーネントのメソッドを呼び出す例:</p>
        <MyButton handleClick={this.handleClick} />
        <p>子コンポーネントのメソッドを呼び出す例:</p>
        <button onClick={() => this.child && this.child.message('call from parent')}>子呼び出し</button>
        <Child onRef={(ref) => this.child = ref} />
      </div>
    )
  }
}