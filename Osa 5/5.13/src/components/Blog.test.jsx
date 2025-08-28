import React from 'react'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
    const blog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 2,
        user: {
            username: 'testuser',
            name: 'Test User'
        }
    }

    test('renders title', () => {
        render(<Blog blog={blog}/>)

        expect(screen.getByText((content) => content.includes('Test Title'))).toBeDefined()
        expect(screen.queryByText('http://testurl.com')).toBeNull()
        expect(screen.queryByText('2')).toBeNull()
    })
})