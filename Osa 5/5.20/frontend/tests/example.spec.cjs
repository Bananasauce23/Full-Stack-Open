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
      await page.goto('http://localhost:5173')

      await page.getByLabel('username').fill('test')
      await page.getByLabel('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByText('view').first().click()

      const likesTextBefore = await page.getByText(/Likes/).textContent()
      const likesBefore = Number(likesTextBefore.replace(/[^0-9]/g, ''))

      await page.getByRole('button', { name: 'Like' }).first().click()
      await page.waitForTimeout(500)
      
      const likesTextAfter = await page.getByText(/Likes/).textContent()
      const likesAfter = Number(likesTextAfter.replace(/[^0-9]/g, ''))
      expect(likesAfter).toBe(likesBefore + 1)
      })
    })
})