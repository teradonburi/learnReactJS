/*globals module: false */
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import loadable from '@loadable/component'

const UserPage = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'userpage' */ './components/UserPage'))
const TodoPage = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'todopage' */ './components/TodoPage'))
const NotFound = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'notfound' */ './components/NotFound'))

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={UserPage} />
      <Route path="/todo" component={TodoPage} />
      {/* それ以外のパス */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default hot(module)(App)