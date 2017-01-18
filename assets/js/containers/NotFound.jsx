import React from 'react'
import { Link } from 'react-router'

const NotFound = () => {
  return (
    <div className="container">
      <h1>404 m8</h1>
      <Link to={ '/' }>Return home</Link>
    </div>
  )
}

export default NotFound
