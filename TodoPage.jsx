import React from 'react'
import { AppBar, Toolbar, Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'

class TodoPage extends React.Component {

  render () {
    
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            TODOページ
            <BackButton>ユーザページへ</BackButton>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

let BackButton = ({history, location}) => {
  console.log(location)
  // history.goBackはブラウザの戻るボタンと等価（ブラウザ履歴を一つさかのぼる）
  return <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> history.goBack()}>ユーザページへ</Button>
}

// Router直下でないコンポーネントでもwithRouterでwrapすることでhistory, locationを参照することができる
BackButton = withRouter(BackButton)

export default TodoPage