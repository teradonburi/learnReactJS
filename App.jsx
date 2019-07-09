import React from 'react'
import Counter from './Counter.jsx'
import MultiCounter from './MultiCounter.jsx'
import Timer from './Timer.jsx'
import Increment from './Increment.jsx'
import TextArea from './TextArea.jsx'

export default class App extends React.Component {

  render () {
    return (
      <div>
        <h1>useStateのサンプル</h1>
        <Counter />
        <MultiCounter />
        <hr/>
        <h1>useEffectのサンプル</h1>
        <Timer />
        <hr/>
        <h1>useRef+useLayoutEffect+useImperativeHandleのサンプル</h1>
        <TextArea />
        <hr/>
        <h1>useReducer+useContextのサンプル</h1>
        <Increment />
      </div>
    )
  }
}