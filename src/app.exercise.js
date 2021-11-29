/** @jsx jsx */
import {jsx} from '@emotion/core'

import {AuthProvider, useAuth} from 'context/auth-context'
import {AuthenticatedApp} from 'authenticated-app'
import {UnauthenticatedApp} from 'unauthenticated-app'

function App() {
  const {user} = useAuth()
  return (
    <AuthProvider>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </AuthProvider>
  )
}

export {App}
