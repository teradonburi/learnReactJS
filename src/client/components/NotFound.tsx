import { com } from '../../../types/interface'
import React from 'react'

export default class NotFound extends React.PureComponent {

  constructor (props: {staticContext? : com.router.StaticRouterContextEx}) {
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

