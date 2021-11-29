// 🐨 create and export a React context variable for the AuthContext
// 💰 using React.createContext
import * as React from 'react'
import * as auth from 'auth-provider'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'
import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'

const initialContext = {
  user: {},
  login: () => {},
  register: () => {},
  logout: () => {},
}
const AuthContext = React.createContext(initialContext)

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

const useClient = () => {
  const {user} = useAuth()
  return React.useCallback(
    (endpoint, config) => client(endpoint, {token: user.token, ...config}),
    [user.token],
  )
}

const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error(
      'Stop using AuthContext without using the AuthContext.Provider you fool',
    )
  }
  return context
}

function AuthProvider(props) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    // 🐨 wrap all of this in the AuthContext.Provider and set the `value` to props

    return (
      <AuthContext.Provider
        value={{user, login, register, logout}}
        {...props}
      />
    )
  }
}

export {AuthProvider, useAuth, useClient}
