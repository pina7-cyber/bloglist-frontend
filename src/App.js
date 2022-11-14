import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import Notification from './components/Notification'
import Logout from './components/Logout'
import BlogCreationForm from './components/BlogCreationForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      console.log(returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
      blogCreationRef.current.toggleVisibility()
      setInfoMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author}`
      )
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('bad request')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, blogObject) => {
    const returnedBlog = await blogService.update(id, blogObject)
    setBlogs(
      blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog))
    )
    setInfoMessage(`likes of ${returnedBlog.title} increased`)
    setTimeout(() => {
      setInfoMessage(null)
    }, 5000)
  }

  const removeBlog = async (id, blogObject) => {
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    ) {
      try {
        await blogService.remove(id)
        const index = blogs.indexOf(blogObject)
        blogs.splice(index, 1)
        console.log(index)
        setBlogs(blogs)
        setInfoMessage('blog removed')
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
      } catch (error) {
        const message = error.response.data.error
        setErrorMessage(message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const handleLogin = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setTimeout(() => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
        blogService.setToken(null)
      }, 3600000)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setInfoMessage('successfully logged out')
    setTimeout(() => {
      setInfoMessage(null)
    }, 5000)
  }

  const blogCreationRef = useRef()

  const blogCreationForm = () => {
    return (
      <Togglable buttonLabel='create new Blog' ref={blogCreationRef}>
        <BlogCreationForm create={addBlog} />
      </Togglable>
    )
  }

  console.log(user)

  return (
    <div>
      <Notification errorMessage={errorMessage} infoMessage={infoMessage} />

      {user === null ? (
        <LoginForm login={handleLogin} />
      ) : (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged-in {<Logout handleLogout={handleLogout} />}
          </p>
          {blogCreationForm()}
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                update={updateBlog}
                remove={removeBlog}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
