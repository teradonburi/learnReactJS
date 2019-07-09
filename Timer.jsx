import React from 'react'

const Timer = () => {
  const [state, setState] = React.useState({count: 0})

  // レンダリングされた後に第１引数の関数がコールバックされる。パラメータが変更され、再レンダリングされた後でも呼ばれる
  // ライフサイクルメソッドのcomponentDidMount, componentDidUpdateに相当する
  // 第２引数は配列の値が前回と変わったときのみ第１引数の関数をコールバックされる(※空の配列[]を指定すると一度のみコールバックされる)
  // 省略した場合はレンダリングの度に第１引数の関数がコールバックされる
  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setState(state => ({count: state.count + 1}))
    }, 1000)

    // 戻り値にはクリーンアップ関数を指定（省略可）
    // 指定すると次回のコールバックが呼ばれる前にクリーンアップ関数が呼ばれます
    // また、componentWillUnmount時にもクリーンアップ関数が呼ばれます
    return () => clearTimeout(timerId)
  }, [state])

  return (
    <h1>カウント：{state.count}</h1>
  )
}

export default Timer