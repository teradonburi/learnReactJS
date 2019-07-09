import React from 'react'

const SuperButton = ({ onClick, children }) => {
  const onClickFifth = (e => {
    // ワンクリックで５回クリック
    for (const _ of [0, 1, 2, 3, 4]) onClick(e)
  })
  return <button onClick={onClickFifth}>{children}</button>
}

const MultiCounter = () => {
  const [state, setState] = React.useState({count: 0})

  return (
    <div>
      <div>カウント：{state.count}</div>
      {/* 値による変更(非推奨)、連続でレンダリングが走った場合にレンダリングの回数に合わせて、正しくインクリメントされない */}
      {/* SuperButtonに渡しているstateはMultiCounterがレンダリングされたときのstateのため、5回連続で呼び出されてもcountは1だけ増えます */}
      <SuperButton onClick={() => setState({count: state.count + 1})}>値による変更+5（動作しない）</SuperButton>
      {/* 関数形式でパラメータの更新をすることもできる（推奨） */}
      {/* この場合は更新された値が都度引数として渡ってくるため、正常に+5される */}
      <SuperButton onClick={() => setState(state => ({count: state.count + 1}))}>関数形式でのパラメータ変更+5</SuperButton>
    </div>
  )
}

export default MultiCounter