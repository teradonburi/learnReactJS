import React from 'react'

export default class NotFound extends React.PureComponent {

  constructor (props: {staticContext? : any}) {
    super(props)
    const { staticContext } = props
    if (staticContext) {
      staticContext.is404 = true
    }
  }

  render(): JSX.Element {
    return <div>NotFound</div>
  }
}

