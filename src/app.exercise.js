/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
// 🐨 you're going to need this:
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {client} from 'utils/api-client'
import {useAsync} from './utils/hooks'
import {FullPageSpinner} from 'components/lib'
import * as colors from 'styles/colors'

const getUser = async () => {
  const token = await auth.getToken()
  if (token) {
    // we're logged in! Let's go get the user's data:
    const data = await client('me', {token})
    return data.user
  } else {
    // we're not logged in. Show the login screen
    return Promise.reject()
  }
}

function App() {
  // 🐨 useState for the user

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  const {data, error, isIdle, isLoading, isSuccess, isError, run, setData} =
    useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }
  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }
  if (isSuccess) {
    return data ? (
      <AuthenticatedApp user={data} logout={logout} />
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    )
  }
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
