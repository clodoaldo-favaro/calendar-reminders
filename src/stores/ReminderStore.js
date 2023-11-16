import { defineStore } from 'pinia'

export const useReminderStore = defineStore('reminders', {
	state: () => {
		return {
			reminders: [],
			selectedDate: null,
		}
	},
	getters: {
		getRemindersByDateSortedByTime() {
			return this.reminders
				.filter((reminder) => {
					return (
						reminder.getDate() === this.selectedDate.getDate() &&
						reminder.getMonth() === this.selectedDate.getMonth() &&
						reminder.getFullYear() ===
							this.selectedDate.getFullYear()
					)
				})
				.sort((reminderA, reminderB) => {
					const dateCompare = reminderA.date - reminderB.date
					if (dateCompare != 0) {
						return dateCompare
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
