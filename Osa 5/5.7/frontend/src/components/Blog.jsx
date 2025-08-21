import React, { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => setShowDetails(!showDetails)

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
            <button>Like</button>
          </div>
          <div>{blog.author}</div>
        </div>
      )}
    </div>
  )
}

export default Blog