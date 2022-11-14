import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Test Title',
  author: 'nice author',
  creator: 'musti',
  url: 'www.niceauthor.de',
  likes: 1,
  user: {
    username: 'musti',
    name: 'Max Mustermann',
    id: '6366c6edf6d2a3366569e968'
  },
  id: '6366c770f6d2a3366569e96c'
}

const user = userEvent.setup({
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ…zMzh9.2rQzfYu8uC9WLH1RVO71b-8UpXPciWR1onf0CKnWNSM',
  username: 'musti',
  name: 'Max Mustermann'
})

test('by default, renders title/author and not url/likes', () => {

  const container = render(<Blog blog={blog} user={user}/>).container

  const title = screen.getByText('Test Title', { exact: false })
  const author = screen.getByText('nice author', { exact: false })
  expect(title).toBeDefined()
  expect(author).toBeDefined()

  const div = container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
  expect(div).toHaveTextContent('www.niceauthor.de')
  expect(div).toHaveTextContent(1)
})

test('url and likes are shown when the view button is clicked', async () => {

  const container = render(<Blog blog={blog} user={user}/>).container

  const buttonBefore = screen.getByText('view')
  await user.click(buttonBefore)

  const div = container.querySelector('.togglableContent')
  expect(div).not.toHaveStyle('display: none')
  expect(div).toHaveTextContent('www.niceauthor.de')
  expect(div).toHaveTextContent(1)
  const buttonAfter = screen.getByText('hide')
  expect(buttonAfter).toBeDefined()
})

test('if like button clicked twice, the event handler is called twice', async () => {

  const mockHandler = jest.fn()
  render(<Blog blog={blog} user={user} update={mockHandler}/>)

  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
