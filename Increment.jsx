import React from 'react'

const reducer = (initialState = {count: 0}, action) => {
  switch (action.type) {
    case 'increment':
      // stateの値を更新する
      return {
        count: action.count
      }
    default: 
      return initialState
  }
}

// 独自のReact Contextを作成
const CounterContext = React.createContext()
const DispatchContext = React.createContext()

const Increment = () => {
  // const [stateの値, dispatch関数] = React.useReducer(reducer関数, stateの初期値)
  // dispatch関数経由でreducer関数を呼び出し、stateの値を更新します。
  // reducer関数にてstateの値が更新されると再度Incrementコンポーネントがレンダリングされます。
  const [state, dispatch] = React.useReducer(reducer, {count: 0})

  // React.useMemoを使うことで変数をメモ化する
  // 第２引数を[state.count]とすることで再レンダリングの際にstate.countの変更がない場合に変数を再生成せずに使い回す
  const count = React.useMemo(() => state.count + [1, 2, 3, 4, 5].reduce((sum, current) => sum + current, 0), [state.count])
  // const count = state.count + [1, 2, 3, 4, 5].reduce((sum, current) => sum + current, 0) 
  // のように書くこともできるがIncrementがレンダリングされる度にreduce処理がされるためパフォーマンスが下がる

  // React.useCallbackを使うことで関数をメモ化する
  // 第２引数を[state]とすることで再レンダリングの際にstateの変更がない場合に関数を再生成せずに使い回す
  const updateCount = React.useCallback(() => dispatch({type: 'increment', count: state.count + 1}), [state])
  // const updateCount = () => dispatch({type: 'increment', count: state.count + 1}) 
  // のように書くこともできるがIncrementがレンダリングされる度に関数が再生成されるためパフォーマンスが下がる

  return (
    // Context.Providerを使うことで配下のコンポーネントはuseContextもしくはContext.Consumerでパラメータを参照できるようにする
    <CounterContext.Provider value={count}>
      <DispatchContext.Provider value={updateCount}>
        <Preview />
        <div>
          <IncrementButton />
          <span>useContext版</span>
        </div>
        <div>
          <IncrementButtonLegacy />
          <span>Context.Consumer版</span>
        </div>
      </DispatchContext.Provider>
    </CounterContext.Provider>
  )
}

const IncrementButton = () => {
  // Context.Providerで定義したvalueを取得する
  const value = React.useContext(DispatchContext)

  return (
    <button onClick={value}>+</button>
  )
}

const IncrementButtonLegacy = () => {
  return (
    // Context.Consumerを使ったvalueの取得
    <DispatchContext.Consumer>
      {value => (
        <button onClick={value}>+</button>
      )}
    </DispatchContext.Consumer>
  )
}

const Preview = () => {
  const value = React.useContext(CounterContext)

  return (
    <b>{value}</b>
  )
}

export default Increment