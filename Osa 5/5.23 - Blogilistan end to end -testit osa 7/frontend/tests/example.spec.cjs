const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test',
        username: 'test',
        password: 'password'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('http://localhost:5173')

      await page.getByRole('button', { name: 'login' }).click()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('wronguser')
      await page.getByLabel('password').fill("wrongpw")
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.notification')
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('test')
      await page.getByLabel('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      const uniqueTitle = `a blog created by playwright ${Date.now()}`

      await page.getByRole('button', { name: 'New blog' }).click()
      await page.getByTestId('blog-title').fill(uniqueTitle)
      await page.getByTestId('blog-author').fill('Playwright Author')
      await page.getByTestId('blog-url').fill('http://playwright.com')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.locator('.blog').filter({ hasText: uniqueTitle})).toBeVisible()
      })

    test('blog can be liked', async ({ page }) => {
      await page.getByText('view').first().click()

      const likesTextBefore = await page.getByText(/Likes/).textContent()
      const likesBefore = Number(likesTextBefore.replace(/[^0-9]/g, ''))

      await page.getByRole('button', { name: 'Like' }).first().click()
      await page.waitForTimeout(500)
      
      const likesTextAfter = await page.getByText(/Likes/).textContent()
      const likesAfter = Number(likesTextAfter.replace(/[^0-9]/g, ''))
      expect(likesAfter).toBe(likesBefore + 1)
      })

    test('blog author can remove blog', async ({ page }) => {
      const uniqueTitle = `a blog created by playwright ${Date.now()}`

      await page.getByRole('button', { name: 'New blog' }).click()
      await page.getByTestId('blog-title').fill(uniqueTitle)
      await page.getByTestId('blog-author').fill('Playwright Author')
      await page.getByTestId('blog-url').fill('http://playwright.com')
      await page.getByRole('button', { name: 'Create' }).click()

      page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm')
      await dialog.accept()

      await page.getByRole('button', { name: 'Remove' }).click()

      await expect(page.locator('.blog').filter({ hasText: uniqueTitle})).toBeVisible()
      })
    })

    test('only the user who added the blog sees the remove button', async ({ page }) => {
      const uniqueTitle = `a blog created by playwright 1 ${Date.now()}`

      await page.getByRole('button', { name: 'New blog' }).click()
      await page.getByTestId('blog-title').fill(uniqueTitle)
      await page.getByTestId('blog-author').fill('Author1')
      await page.getByTestId('blog-url').fill('http://playwright1.com')
      await page.getByRole('button', { name: 'Create' }).click()

      await page.getByText('Logout').click()

      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('someguy')
      await page.getByLabel('password').fill('1234')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByText(uniqueTitle).click()
      const blog = await page.getByText(uniqueTitle).locator('..')
      await blog.getByText('View').click()
      await expect(page.getByText('Remove')).not.toBeVisible()

      await page.getByText('Logout').click()

      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('test')
      await page.getByLabel('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await blog.getByText('View').click()
      await expect(page.getByText('Remove')).toBeVisible()
    })
  })

  test('blogs are ordered by likes, most liked first', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const blogElements = await page.locator('.blog').all()

    const likes = []
    for (const blog of blogElements) {
      const likeText = await blog.locator('.likes-count').textContent()
      likes.push(Number(likeText))
    }

    for (let i = 0; i < likes.length - 1; i++) {
      expect(likes[i]).toBeGreaterThanOrEqual(likes[i + 1])
    }
  })
})