import { useState, useEffect, useRef } from 'react'
import './index.css'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      showNotification('Wrong username or password')
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`A new blog ${blogObject.title} by ${blogObject.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      showNotification('Blog couldn\'t be added, make sure all sections are filled')
    }
  }

  const showNotification = (message, duration = 4000) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLike = (updatedBlog) => {
    const original = blogs.find(blog => blog.id === updatedBlog.id)
    if (original && typeof updatedBlog.user === 'string') {
      updatedBlog.user = original.user
    }
    setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
  }

  const handleRemove = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        {user && BlogForm()}
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      <p>{user.name} logged in
        <button onClick={handleLogout}>Logout</button></p>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} onLike={handleLike} user={user} removeBlog={handleRemove}/>
      )}

      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    </div>
  )
}

export default App