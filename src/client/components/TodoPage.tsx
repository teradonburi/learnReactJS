import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { AppBar, Toolbar, Button, Card, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { withRouter } from 'react-router-dom'
import { add } from '../modules/user'

// フォームデータの定義をバリデーション付きで行う
const SignupSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('必須項目です'),
  lastname: Yup.string()
    .required('必須項目です'),
  gender: Yup.string()
    .required('必須項目です'),
  email: Yup.string()
    .email('メールアドレスとして認識できません')
    .required('必須項目です'),
})

const FormTextField = ({field, form: { touched, errors }, ...props}): JSX.Element => (
  <TextField
    error={touched[field.name] && !!errors[field.name]}
    variant='outlined'
    helperText={touched[field.name] && errors[field.name]}
    name={field.name}
    value={field.value}
    onChange={field.onChange}
    onBlur={field.onBlur}
    {...props}
  />
)

// Select
const FormSelect = ({label, children, field, form: { touched, errors }, ...props}): JSX.Element => (
  <FormControl error={!!errors[field.name]}>
    <InputLabel>{label}</InputLabel>
    <Select
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      {...props}
    >
      {children}
    </Select>
    <FormHelperText>{touched[field.name] && errors[field.name]}</FormHelperText>
  </FormControl>
)

class TodoPage extends React.Component {

  constructor(props) {
    super(props)
    // sendItemsメソッド内でthisを使えるようにbindする
    this.sendItems = this.sendItems.bind(this)
  }

  sendItems(values): void {
    const user = {
      firstname: values.firstname,
      lastname: values.lastname,
      gender: values.gender,
      email: values.email,
    }
    this.props.add(user).then(() => alert('送信完了'))
  }

  render(): JSX.Element {
    const styles = {
      error: {
        color: red[500],
      },
      select: {
        minWidth: 100,
      },
    }

    return (
      <div>
        <Helmet>
          <title>TODOページ</title>
          <meta name='description' content='TODOページのdescriptionです' />
        </Helmet>
        <AppBar position="static" color="primary">
          <Toolbar>
            TODOページ
            <BackButton>ユーザページへ</BackButton>
          </Toolbar>
        </AppBar>
        <Card style={{padding: 10}}>
          <Formik
            initialValues={{
              firstname: '',
              lastname: '',
              gender: 'male',
              email: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={this.sendItems}
          >
            {({ isSubmitting }): JSX.Element => (
              <Form>
                <div style={{display: 'flex'}}>
                  <div style={{marginRight: 10, marginBottom: 10}}>
                    <Field name="firstname" component={FormTextField} placeholder='姓' />
                  </div>
                  <div>
                    <Field name="lastname" component={FormTextField} placeholder='名' />
                  </div>
                </div>
                <div style={{marginBottom: 10}}>
                  <Field name="gender" component={FormSelect} style={styles.select} label='性別' >
                    <MenuItem value="male">男性</MenuItem>
                    <MenuItem value="female">女性</MenuItem>
                  </Field>
                </div>
                <div style={{marginBottom: 10}}>
                  <Field name="email" type="email" component={FormTextField} placeholder='メールアドレス' />
                </div>
                <Button style={{marginTop: 10}} variant='contained' type="submit" disabled={isSubmitting}>送信</Button>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    )
  }
}


const BackButton = withRouter(({history, location}): JSX.Element => {
  console.log(location)
  // history.goBackはブラウザの戻るボタンと等価（ブラウザ履歴を一つさかのぼる）
  return <Button style={{color: '#fff', position: 'absolute', top: 15, right: 0}} onClick={(): void => history.goBack()}>ユーザページへ</Button>
})


export default connect(
  // propsに受け取るreducerのstate
  null,
  // propsに付与するactions
  { add }
)(TodoPage)
