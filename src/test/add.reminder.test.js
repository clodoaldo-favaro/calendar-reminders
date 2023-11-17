import { mount } from '@vue/test-utils'
import Toast from 'primevue/toast'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { useToast } from 'primevue/usetoast'
import ReminderForm from '../components/ReminderForm.vue'
import { createTestingPinia } from '@pinia/testing'
import useReminderStore from '../stores/ReminderStore'

test('add reminder to store when form is submitted', async () => {
	const wrapper = mount(ReminderForm, {
		globals: {
			plugins: [createTestingPinia()],
		},
	})

	const input = wrapper.findComponent('#description')

	expect(input.exists()).toBe(true)
})
