import * as auth from 'auth-provider'

const apiURL = process.env.REACT_APP_API_URL

function client(endpoint, {token, data, ...customConfig} = {}) {
  const headers = {
    Authorization: token ? `Bearer ${token}` : undefined,
    'Content-Type': data ? 'application/json' : undefined,
  }

  const config = {
    method: data ? 'POST' : 'GET',
    headers,
    body: data ? JSON.stringify(data) : undefined,
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      await auth.logout()
      window.location.assign(window.location)
      return Promise.reject()
    }
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}

client('http://example.com/pets', {
  token: 'THE_USER_TOKEN',
  data: {name: 'Fluffy', type: 'cat'},
})

// results in fetch getting called with:
// url: http://example.com/pets
// config:
//  - method: 'POST'
//  - body: '{"name": "Fluffy", "type": "cat"}'
//  - headers:
//    - 'Content-Type': 'application/json'
//    - Authorization: 'Bearer THE_USER_TOKEN'
