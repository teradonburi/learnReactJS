import React from 'react'
import Logger from './Logger.jsx'

class App extends React.Component {

  render () {
    return (
      <div>{this.props.inject}</div>
    )
  }
}

// HOCでAppコンポーネントをWrapする
export default Logger('Hello World!', 'render log')(App)
