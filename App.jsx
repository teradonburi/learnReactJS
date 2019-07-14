/*globals module: false */
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import NotFound from './NotFound.jsx'
import UserPage from './UserPage.jsx'
import TodoPage from './TodoPage.jsx'

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