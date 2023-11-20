import { mount } from '@vue/test-utils'
import Toast from 'primevue/toast'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ReminderForm from '../components/ReminderForm.vue'
import CalendarMonth from '../components/CalendarMonth.vue'
import { createTestingPinia } from '@pinia/testing'
import useReminderStore from '../stores/ReminderStore'
import { flushPromises } from '@vue/test-utils'
import { expect } from 'vitest'

test('calendar appears on screen', async () => {
	const wrapper = mount(CalendarMonth, {
		plugins: [createTestingPinia()],
		global: {
			components: {
				Toast,
			},
			plugins: [ToastService, PrimeVue],
		},
	})

	const daysGrid = wrapper.find('.days-grid')

	expect(daysGrid.exists()).toBe(true)

	const addReminderButton = daysGrid.findComponent({
		ref: 'addReminderButton',
	})
	expect(addReminderButton.exists()).toBe(true)
})

test('reminder form mounts', async () => {
	const wrapper = mount(ReminderForm, {
		plugins: [createTestingPinia()],
		global: {
			components: {
				Toast,
			},
			plugins: [ToastService, PrimeVue],
		},
	})

	const reminderForm = wrapper.find({ ref: 'reminderForm' })
	expect(reminderForm.exists()).toBe(true)
})

test('cand add reminder', async () => {
	const wrapper = mount(ReminderForm, {
		plugins: [createTestingPinia({ stubActions: false })],
		global: {
			components: {
				Toast,
			},
			plugins: [ToastService, PrimeVue],
		},
	})

	const reminderForm = wrapper.find({ ref: 'reminderForm' })
	const reminderDescriptionInput = reminderForm.find('#description')
	expect(reminderDescriptionInput.exists()).toBe(true)
	expect(reminderDescriptionInput.isVisible()).toBe(true)

	const submitButton = reminderForm.find('#submitButton')
	expect(submitButton.exists()).toBe(true)
	expect(submitButton.isVisible()).toBe(true)
	document.getElementById('submitButton').click()

	await flushPromises()

	const descriptionErrorMessage = reminderForm.find('#description-error')
	expect(descriptionErrorMessage.exists()).toBe(true)
	expect(descriptionErrorMessage.isVisible()).toBe(true)
	expect(document.querySelector('#description-error').textContent).toBe(
		'Description is required.'
	)

	await reminderDescriptionInput.setValue('test description')
	await flushPromises()
})
