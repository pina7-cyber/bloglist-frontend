import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreationForm from './BlogCreationForm'

test('new Blog: event handler is called properly', async () => {
  const user = userEvent.setup({})
  const addBlog = jest.fn()
  const container = render(<BlogCreationForm create={addBlog}/>).container

  const title = container.querySelector('#title')
  const author = container.querySelector('#author')
  const url = container.querySelector('#url')

  await user.type(title, 'a new blog...')
  await user.type(author, 'nice author')
  await user.type(url, 'www.blog.de')

  const button = screen.getByText('create')
  await user.click(button)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('a new blog...')
  expect(addBlog.mock.calls[0][0].author).toBe('nice author')
  expect(addBlog.mock.calls[0][0].url).toBe('www.blog.de')
})