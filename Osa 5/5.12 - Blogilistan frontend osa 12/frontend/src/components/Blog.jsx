import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onLike, user = null, removeBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => setShowDetails(!showDetails)

  const handleLike = async () => {
    const updatedBlog = {
      user: typeof blog.user === 'object' ? blog.user.id : blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    onLike(returnedBlog)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id, user.token)
      removeBlog(blog.id)
    }
  }

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? 'Hide' : 'View'}
        </button>
      </div>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            Likes {blog.likes}
            <button onClick={handleLike}>Like</button>
          </div>
          <div>{blog.author}</div>
          {blog.user && user && (
            (typeof blog.user === 'object'
              ? blog.user.username === user.username
              : blog.user === user.id
            ) && (
              <button onClick={handleDelete}>Remove</button>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default Blog