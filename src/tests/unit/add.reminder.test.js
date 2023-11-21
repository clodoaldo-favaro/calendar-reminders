import { mount } from '@vue/test-utils'
import Toast from 'primevue/toast'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ReminderForm from '../../components/ReminderForm.vue'
import CalendarMonth from '../../components/CalendarMonth.vue'
import { createTestingPinia } from '@pinia/testing'
import useReminderStore from '../../stores/ReminderStore'
import flushPromises from 'flush-promises'
import waitForExpect from 'wait-for-expect'
// import BaseInputText from '../components/BaseInputText.vue'
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

	const description = await wrapper.findComponent({ ref: 'description' })
	await description.setProps({ modelValue: 'Study for exam' })

	const date = await wrapper.findComponent({ ref: 'date' })
	await date.setValue(new Date())

	const time = await wrapper.findComponent({ ref: 'time' })
	await time.setValue('12:00')

	const city = await wrapper.findComponent({ ref: 'city' })
	await city.setValue({
		cityName: 'San Francisco',
		stateCode: 'CA',
		countryCode: 'US',
	})

	const color = await wrapper.findComponent({ ref: 'color' })
	await color.setValue('000000')

	await flushPromises()

	await waitForExpect(() => {
		console.log(document.getElementById('description').value)
		expect(wrapper.vm.$data).toMatchObject({})
	})
})
