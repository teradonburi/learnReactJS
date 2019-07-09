import React from 'react'

const TextArea = () => {
  // React.useRef(currentプロパティ初期値)でref参照を生成する
  const textareaRef = React.useRef(null)
  // React.useLayoutEffectレンダリング結果が描画される前にコールバックの処理が走る
  // React.useEffectだとレンダリング処理の後に実行されるため、表示が一瞬見えてしまう
  // React.useLayoutEffectはレンダリングをブロッキングするためパフォーマンス的には良くないことに注意
  React.useLayoutEffect(() => {
    // currentにはHTMLElementオブジェクトが入っている
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.value = 'てきすと'
    }
  }, [])

  // React.useImperativeHandleはref参照のcurrentプロパティ配下に対して独自メソッドを付与することができる
  const methodRef = React.useRef()
  React.useImperativeHandle(methodRef, () => ({
    blur() {
      textareaRef.current.value = '変更されました'
    },
  }))

  // ref属性でtextarea DOMのref参照を取得する
  return <textarea ref={textareaRef} onBlur={() => methodRef.current.blur()}/>
}

export default TextArea