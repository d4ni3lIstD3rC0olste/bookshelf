// 🐨 you'll need to import React and ReactDOM up here
import Dialog from '@reach/dialog'
import * as React from 'react'
import ReactDOM from 'react-dom'
import '@reach/dialog/styles.css'

// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo'

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')

function LoginForm({onSubmit, buttonText, onClose}) {
  const handleSubmit = event => {
    event.preventDefault()
    const {username, password} = event.target.elements

    onSubmit({
      username: username.value,
      password: password.value,
    })
  }
  return (
    <div>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
        </div>
        <button type="submit">{buttonText}</button>
      </form>
    </div>
  )
}

function App() {
  const [openModal, setOpenModal] = React.useState('none')
  function login(formData) {
    console.log('login', formData)
  }

  function register(formData) {
    console.log('register', formData)
  }

  return (
    <div>
      <Logo />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => setOpenModal('login')}>Login</button>
        <button onClick={() => setOpenModal('register')}>Register</button>
      </div>
      <Dialog
        isOpen={openModal === 'login'}
        onDismiss={() => setOpenModal('none')}
      >
        <LoginForm
          onSubmit={login}
          buttonText="Login"
          onClose={() => setOpenModal('none')}
        />
      </Dialog>
      <Dialog
        isOpen={openModal === 'register'}
        onDismiss={() => setOpenModal('none')}
      >
        <LoginForm
          onSubmit={register}
          buttonText="Register"
          onClose={() => setOpenModal('none')}
        />
      </Dialog>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
