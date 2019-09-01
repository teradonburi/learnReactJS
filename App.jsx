import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useActions from './useActions'
import { load } from './user'

function useUserHook() {
  const users = useSelector(state => state.user.users)
  const [loadUser] = useActions([load])
  console.log(users)

  useEffect(() => {
    loadUser()
  }, [])
  return users
}

function App() {
  const users = useUserHook()

  return (
    <div>
      {users.map((user) => (
        // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
        <div key={user.email}>
          <img src={user.picture.thumbnail} />
          <p>名前:{user.name.first + ' ' + user.name.last}</p>
          <p>性別:{user.gender}</p>
          <p>email:{user.email}</p>
        </div>
      ))}
    </div>
  )
}

// connectでwrap
export default App
