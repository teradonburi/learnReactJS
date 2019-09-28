import React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from '@loadable/component'

const UserPage = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'userpage' */ './components/UserPage'))
const TodoPage = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'todopage' */ './components/TodoPage'))
const NotFound = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'notfound' */ './components/NotFound'))

const App = (): JSX.Element => (
  <Switch>
    <Route exact path="/" component={UserPage} />
    <Route path="/todo" component={TodoPage} />
    {/* それ以外のパス */}
    <Route component={NotFound} />
  </Switch>
)

export default App