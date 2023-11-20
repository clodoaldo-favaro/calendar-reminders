import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import './style.css'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)
app.use(pinia)

app.component('ConfirmDialog', ConfirmDialog)
app.component('Toast', Toast)

app.mount('#app')
