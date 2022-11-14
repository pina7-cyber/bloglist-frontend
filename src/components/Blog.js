import { useState } from 'react'

const Blog = ({ blog, user, update, remove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const buttonStyle = {
    backgroundColor: 'blue',
  }

  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const showWhenOwner = {
    display: user.username === blog.user.username ? '' : 'none',
  }

  const buttonLabel = visible ? 'hide' : 'view'

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const likeBlog = () => {
    update(blog.id, { ...blog, likes: blog.likes + 1 })
  }

  const removeBlog = () => {
    remove(blog.id, blog)
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}{' '}
        <button id='toggle-button' onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className='togglableContent'>
        <div>{blog.url}</div>
        <div>
          {blog.likes} <button id='like-button' onClick={likeBlog}>like</button>
        </div>
        <div>{blog.creator}</div>
        <div style={showWhenOwner}>
          <button id='delete-button' style={buttonStyle} onClick={removeBlog}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
