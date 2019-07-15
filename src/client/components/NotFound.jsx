import React from 'react'

export default class NotFound extends React.PureComponent {

  constructor (props) {
    super(props)
    const { staticContext } = props
    if (staticContext) {
      staticContext.is404 = true
    }
  }

  render () {
    return <div>NotFound</div>
  }
}

