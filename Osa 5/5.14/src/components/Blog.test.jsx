import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

    test('url, likes and user are shown after clicking View button', async () => {
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

        render(<Blog blog={blog}/>)

        const user = userEvent.setup()
        const button = screen.getByText('View')
        await user.click(button)

        screen.getByText('http://testurl.com')
        const likesElements = screen.getAllByText((content, element) =>
            element.textContent && element.textContent.replace(/\s+/g, ' ').includes('Likes 2')
        )
        expect(likesElements.length).toBeGreaterThan(0)
        
        screen.getByText('Test Author')
    })
})