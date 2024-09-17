import { useState } from 'react'
import blogService from '../services/blogs.js'

const Blog = ({ blog, user, updateBlogLikes }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: likes + 1 }
    const response = await blogService.update(blog.id, updatedBlog)
    setLikes(response.likes)
    updateBlogLikes(response)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p>added by {user.name}</p>
        </div>
      )}
    </div>
  )
}

export default Blog
