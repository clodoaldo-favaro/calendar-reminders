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
		updateReminder(reminderId, reminderData) {
			debugger
			const reminderIndex = this.reminders.findIndex(
				(reminder) => reminder.id === reminderId
			)

			if (reminderIndex > -1) {
				this.reminders[reminderIndex] = {
					...reminderData,
					id: reminderId,
				}
				console.log(this.reminders[reminderIndex])
			}
		},
		removeReminder(reminderId) {
			debugger
			const reminderIndex = this.reminders.findIndex(
				(reminder) => reminder.id === reminderId
			)

			if (reminderIndex > -1) {
				this.reminders = this.reminders.filter(
					(reminder) => reminder.id != reminderId
				)
			}
		},
		async getWeatherInfo(city, date) {
			debugger
			let url

			if (city.countryCode === 'US') {
				url = `https://api.openweathermap.org/data/2.5/forecast?q=${city.cname},${city.stateCode},${city.countryCode}`
			} else {
				url = `https://api.openweathermap.org/data/2.5/forecast?q=${city.cname},${city.countryCode}`
			}

			url += '&appid=4d75313d4c53abfca0f9e78c3888260b'

			const weatherData = await fetch(url)
			const weatherDataJson = await weatherData.json()

			if (weatherDataJson.cod === '200') {
				return weatherDataJson.list.filter((weatherData) => {
					const weatherDataDate = new Date(weatherData.dt * 1000)
					return (
						weatherDataDate.getDate() === date.getDate() &&
						weatherDataDate.getMonth() === date.getMonth() &&
						weatherDataDate.getFullYear() === date.getFullYear()
					)
				})
			} else {
				return null
			}
		},
	},
})
