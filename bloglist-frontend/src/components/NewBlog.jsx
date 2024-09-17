import React, { useState } from 'react'

const NewBlog = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({})

  const handleNewBlog = event => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({})
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:
          <input
            value={newBlog.title}
            onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
          />
        </div>
        <div>
          author:
          <input
            value={newBlog.author}
            onChange={e => setNewBlog({ ...newBlog, author: e.target.value })}
          />
        </div>
        <div>
          url:
          <input
            value={newBlog.url}
            onChange={e => setNewBlog({ ...newBlog, url: e.target.value })}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default NewBlog
