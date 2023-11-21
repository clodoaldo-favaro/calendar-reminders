// @ts-check
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	await page.goto('/')
	await page.getByLabel('+ Add reminder').click()
})

test('can add reminder to calendar', async ({ page }) => {
	await page.getByLabel('Description').fill('Study for the test')
	await page.getByText('Select a City').click()
	await page.getByLabel('United States').click()
	await page.getByLabel('California').click()
	await page.getByLabel('San Francisco').click()
	await page.locator('.p-colorpicker-preview').click()
	await page.locator('.p-colorpicker-color').click()
	await page.getByRole('main').click()

	await page.getByLabel('Confirm').click()

	await expect(page.getByText('Study for the test')).toBeVisible()
})

test('show success toast', async ({ page }) => {
	await page.getByLabel('Description').fill('Study for the test')
	await page.getByText('Select a City').click()
	await page.getByLabel('United States').click()
	await page.getByLabel('California').click()
	await page.getByLabel('San Francisco').click()
	await page.locator('.p-colorpicker-preview').click()
	await page.locator('.p-colorpicker-color').click()
	await page.getByRole('main').click()

	await page.getByLabel('Confirm').click()

	await expect(page.getByText('Reminder added')).toBeVisible()
})
