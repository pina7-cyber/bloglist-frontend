import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ login }) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  })

  const handleLoginInput = (event) => {
    if (event.target.id === 'username') {
      setLoginData({ ...loginData, username: event.target.value })
    }
    if (event.target.id === 'password') {
      setLoginData({ ...loginData, password: event.target.value })
    }
  }

  const handleLogin = (event) => {
    event.preventDefault()

    login({
      username: loginData.username,
      password: loginData.password,
    })

    setLoginData({
      username: '',
      password: '',
    })
  }

  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type='text'
            value={loginData.username}
            onChange={handleLoginInput}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type='password'
            value={loginData.password}
            onChange={handleLoginInput}
          />
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    </>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
}

export default LoginForm
