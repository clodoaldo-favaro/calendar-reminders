import { defineStore } from 'pinia'

export const useReminderStore = defineStore('reminders', {
	state: () => {
		return {
			reminders: [],
			selectedDate: null,
		}
	},
	getters: {
		getRemindersByDateSortedByTime: (state) => {
			return (date) => {
				return state.reminders
					.filter((reminder) => {
						return (
							reminder.date.getDate() === date.getDate() &&
							reminder.date.getMonth() === date.getMonth() &&
							reminder.date.getFullYear() === date.getFullYear()
						)
					})
					.sort((reminderA, reminderB) => {
						if (reminderA.date < reminderB.date) {
							return -1
						}

						if (reminderA.date > reminderB.date) {
							return 1
						}

						const descriptionA = reminderA.toUpperCase()
						const descriptionB = reminderB.toUpperCase()

						if (descriptionA < descriptionB) {
							return -1
						}

						if (descriptionA > descriptionB) {
							return 1
						}

						return 0
					})
			}
		},
	},

	actions: {
		addReminder(reminder) {
			this.reminders.push(reminder)
		},
		removeReminder(reminderId) {
			const reminderIndex = this.reminders.findIndex(
				(reminder) => reminder.id === reminderId
			)

			if (reminderIndex > -1) {
				this.reminders = this.reminders.filter(
					(reminder) => reminder.id != reminderId
				)
			}
		},
	},
})
