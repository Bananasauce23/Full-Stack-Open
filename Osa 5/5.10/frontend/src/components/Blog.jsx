import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onLike }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => setShowDetails(!showDetails)

  const handleLike = async () => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    onLike(returnedBlog)
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
        </div>
      )}
    </div>
  )
}

export default Blog