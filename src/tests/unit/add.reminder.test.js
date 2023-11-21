import { mount } from '@vue/test-utils'
import Toast from 'primevue/toast'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ReminderForm from '../../components/ReminderForm.vue'
import { createTestingPinia } from '@pinia/testing'
import useReminderStore from '../../stores/ReminderStore'
import flushPromises from 'flush-promises'
import waitForExpect from 'wait-for-expect'
import { expect } from 'vitest'

test('can add reminder', async () => {
	const wrapper = mount(ReminderForm, {
		plugins: [createTestingPinia()],
		global: {
			components: {
				Toast,
			},
			plugins: [ToastService, PrimeVue],
		},
	})

	const description = wrapper.findComponent({ ref: 'description' })
	await description.setValue('Study for exam')
	description.trigger('change')

	const date = wrapper.findComponent({ ref: 'date' })
	await date.setValue(new Date())

	const time = wrapper.findComponent({ ref: 'time' })
	await time.setValue('12:00')

	const city = wrapper.findComponent({ ref: 'city' })
	await city.setValue({
		cityName: 'San Francisco',
		stateCode: 'CA',
		countryCode: 'US',
	})

	const color = wrapper.findComponent({ ref: 'color' })
	await color.setValue('000000')

	wrapper.find({ ref: 'submitForm' }).trigger('submit')

	await flushPromises()

	await waitForExpect(() => {
		console.log('description', description.element.value)
		expect(wrapper.vm.$slots).toMatchObject({})
	})
})
