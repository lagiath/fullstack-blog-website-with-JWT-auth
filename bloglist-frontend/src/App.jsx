import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlog from './components/NewBlog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className="success">{message}</div>
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className="error">{message}</div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccess] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      console.log('User found in local storage:', user)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const createBlog = async newBlog => {
    const returnedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(returnedBlog))
    setSuccess(
      `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
    )
    setTimeout(() => {
      setSuccess(null)
    }, 5000)
  }

  const updateBlogLikes = updatedBlog => {
    setBlogs(
      blogs.map(blog => (blog.id === updatedBlog.id ? updatedBlog : blog))
    )
  }

  return (
    <div>
      {user === null ? (
        <>
          <h2>log in to application</h2>
          {errorMessage !== null ? <Error message={errorMessage} /> : null}

          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </>
      ) : (
        <div>
          <h1>blogs</h1>
          {successMessage !== null ? (
            <Notification message={successMessage} />
          ) : null}
          <p>
            {user.name} logged-in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog">
            <NewBlog createBlog={createBlog} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                updateBlogLikes={updateBlogLikes}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
