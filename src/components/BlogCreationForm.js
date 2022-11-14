import { useState } from 'react'

const Input = ({ name, value, handleBlogInput }) => {
  return (
    <div>
      {name}
      <input type='text' value={value} id={name} onChange={handleBlogInput} />
    </div>
  )
}

const BlogCreationForm = ({ create }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  const addBlog = (event) => {
    event.preventDefault()
    create({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    })

    setNewBlog({
      title: '',
      author: '',
      url: '',
    })
  }

  const handleBlogInput = (event) => {
    if (event.target.id === 'title') {
      setNewBlog({ ...newBlog, title: event.target.value })
    }
    if (event.target.id === 'author') {
      setNewBlog({ ...newBlog, author: event.target.value })
    }
    if (event.target.id === 'url') {
      setNewBlog({ ...newBlog, url: event.target.value })
    }
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <Input
          name='title'
          value={newBlog.title}
          handleBlogInput={handleBlogInput}
        />
        <Input
          name='author'
          value={newBlog.author}
          handleBlogInput={handleBlogInput}
        />
        <Input
          name='url'
          value={newBlog.url}
          handleBlogInput={handleBlogInput}
        />
        <button id='create-button' type='submit'>create</button>
      </form>
    </>
  )
}

export default BlogCreationForm
