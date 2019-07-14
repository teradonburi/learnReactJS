/*globals module: false */
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import loadable from '@loadable/component'

const UserPage = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'userpage' */ './UserPage.jsx'))
const TodoPage = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'todopage' */ './TodoPage.jsx'))
const NotFound = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'notfound' */ './NotFound.jsx'))

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={(props) => <UserPage {...props} bgcolor='#a0f0a0' />} />
      <Route path="/todo" component={TodoPage} />
      {/* それ以外のパス */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default hot(module)(App)