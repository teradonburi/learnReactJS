import React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from '@loadable/component'

const UserPage = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'userpage' */ './components/UserPage.jsx'))
const TodoPage = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'todopage' */ './components/TodoPage.jsx'))
const NotFound = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'notfound' */ './components/NotFound.jsx'))

const App = () => (
  <Switch>
    <Route exact path="/" component={UserPage} />
    <Route path="/todo" component={TodoPage} />
    {/* それ以外のパス */}
    <Route component={NotFound} />
  </Switch>
)

export default App