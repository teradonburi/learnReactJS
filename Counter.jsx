import React from 'react'

const Counter = () => {
  // const [stateの値, state更新関数] = React.useState(state初期値)
  // stateの値、state更新関数の変数名は必ずしもstate, setStateにする必要はないが、わかりやすさのために今回はこう書いた
  const [state, setState] = React.useState({count: 0})

  return (
    <p>
      <button onClick={() => setState({count: state.count - 1})}>-</button>
      <b>{state.count}</b>
      <button onClick={() => setState({count: state.count + 1})}>+</button>
    </p>
  )
}

export default Counter