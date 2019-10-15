import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { withStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Avatar, Card, CardContent, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import { Email } from '@material-ui/icons'
import { orange } from '@material-ui/core/colors'

import { load } from '../modules/user'

interface Props {
  users;
  theme;
  classes;
  location;
  load;
  history;
}
interface State {
  open;
  user;
}

class UserPage extends React.Component<Props, State> {

  constructor (props) {
    super(props)
    this.state = {
      open: false,
      user: null,
    }
  }

  componentDidMount(): void {
    // user取得APIコールのactionをキックする
    this.props.load()
  }

  handleClickOpen(user): void {
    this.setState({
      open: true,
      user: user,
    })
  }

  handleRequestClose(): void {
    this.setState({ open: false })
  }

  handlePageMove(path: string): void {
    // historyオブジェクトを使うことでページ遷移することが出来る
    this.props.history.push(path)
  }

  render(): JSX.Element {
    const { users, theme, classes, location } = this.props
    const { primary } = theme.palette

    // locationにはページのパス、urlパラメータなどが渡ってくる（パラメータをみて制御したい場合などに使う）
    console.log(location)

    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    console.log(users)
    return (
      <div>
        <Helmet>
          <title>ユーザページ</title>
          <meta name='description' content='ユーザページのdescriptionです' />
        </Helmet>
        <AppBar position='static' color='primary'>
          <Toolbar classes={{root: classes.root}} >
            タイトル
            <Button style={{color: '#fff', position: 'absolute', top: 15, right: 0}} onClick={(): void => this.handlePageMove('/todo')}>TODOページへ</Button>
          </Toolbar>
        </AppBar>
        {/* 配列形式で返却されるためmapで展開する */}
        {users && users.map((user) => {
          return (
            // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
            <Card key={user.email} style={{marginTop: '10px'}}>
              <CardContent className={classes.card} >
                <Avatar src={user.picture.thumbnail} />
                <p style={{margin: 10, color: primary[500]}}>{'名前:' + user.name.first + ' ' + user.name.last} </p>
                <p className={classes.gender}>{'性別:' + (user.gender == 'male' ? '男性' : '女性')}</p>
                <div style={{textAlign: 'right'}} >
                  <Button variant="contained" color='secondary' onClick={(): void => this.handleClickOpen(user)}><Email style={{marginRight: 5, color: orange[200]}}/>Email</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {
          this.state.open &&
          <Dialog open={this.state.open} onClose={(): void => this.handleRequestClose()}>
            <DialogTitle>メールアドレス</DialogTitle>
            <DialogContent>{this.state.user.email}</DialogContent>
          </Dialog>
        }
      </div>
    )
  }
}


export default withStyles((theme) => ({ // classes propsを付与
  root: {
    fontStyle: 'italic',
    fontSize: 21,
    minHeight: 64,
    // 画面サイズがモバイルサイズのときのスタイル
    [theme.breakpoints.down('xs')]: {
      fontStyle: 'normal',
    },
  },
  card: {
    background: '#fff', // props経由でstyleを渡す
  },
  gender: {
    margin: 10,
    color: theme.palette.secondary[500], // themeカラーを参照
  },
}), {withTheme: true})(
  connect(
    // propsに受け取るreducerのstate
    (state: any) => ({
      users: state.user.users,
    }),
    // propsに付与するactions
    { load }
  )(UserPage)
)

