<template>
    <SlideIn :title="formTitle" @onClickCancel="handleClickCancel" @onClickOk="handleClickOk"
        @onClickClose="handleClickClose">
        <template v-slot:main>
            <form id="myForm" @submit.prevent="onSubmit" ref="reminderForm">
                <div class="flex-form">
                    <div>
                        <span class="p-float-label">
                            <BaseInputText id="description" name="description" ref="description"
                                :class="{ 'p-invalid': errors.description }" aria-describedby="description-error" />
                            <label for="description">Description</label>
                        </span>
                        <small id="description-error" class="p-error">
                            {{ errors.description }}
                        </small>
                    </div>

                    <div>
                        <span class="p-float-label">
                            <BaseCalendar id="date" name="date" ref="date" showIcon :class="{ 'p-invalid': errors.date }"
                                aria-describedby="date-error" />
                            <label for="date">Date</label>
                        </span>
                        <small id="date-error" class="p-error">
                            {{ errors.date }}
                        </small>
                    </div>

                    <div>
                        <span class="p-float-label">
                            <BaseCalendar id="time" name="time" ref="time" timeOnly :class="{ 'p-invalid': errors.time }"
                                aria-describedby="time-error" />
                            <label for="time">Time</label>
                        </span>
                        <small id="time-error" class="p-error">
                            {{ errors.time }}
                        </small>
                    </div>

                    <div class="city-select-wrapper">
                        <span class="p-float-label">
                            <BaseCascadeSelect id="city" name="city" ref="city" append-to="self"
                                :class="{ 'p-invalid': errors.city }" :options="countries" optionLabel="cityName"
                                optionGroupLabel="name" :optionGroupChildren="['states', 'cities']" style="min-width: 14rem"
                                placeholder="Select a City" aria-describedby="city-error" />
                            <label for="city">City</label>
                        </span>
                        <small id="city-error" class="p-error">{{ errors.city }}</small>
                    </div>
                </div>

                <div class="color-input-wrapper">
                    <label for="color">Reminder color</label>
                    <BaseColorPicker id="color" name="color" ref="color" append-to="self" aria-describedby="color-error" />
                    <small id="color-error" class="p-error">
                        {{ errors.color }}
                    </small>
                </div>
            </form>

            <div v-if="weatherInfo && !isLoadingWeatherInfo" class="weather-info">
                <h2>Weather</h2>
                <div class="weather-summary">
                    <h3>{{ weatherInfo.weather[0].main }}</h3>
                    <img :src="`http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}.png`" />
                </div>
                <div class="weather-details">
                    <span>Temperature: {{ weatherInfo.main.temp }}{{ tempUnit }}</span>
                    <span>Feels like: {{ weatherInfo.main.feels_like }}{{ tempUnit }}</span>
                    <span>Humidity: {{ weatherInfo.main.humidity }}%</span>
                    <span>Wind: {{ weatherInfo.wind.speed }}{{ speedUnit }}</span>
                </div>
            </div>
            <div class="loading-weather-info" v-if="isLoadingWeatherInfo">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" animationDuration=" .5s"
                    aria-label="Loading weather info" />
                <span>Loading weather info...</span>
            </div>
        </template>
    </SlideIn>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup'
import BaseColorPicker from './inputs/BaseColorPicker.vue';
import BaseInputText from './inputs/BaseInputText.vue';
import BaseCalendar from './inputs/BaseCalendar.vue';
import BaseCascadeSelect from './inputs/BaseCascadeSelect.vue';
import ProgressSpinner from 'primevue/progressspinner';
import SlideIn from './SlideIn.vue';
import { useToast } from "primevue/usetoast";
import { useReminderStore } from '../stores/ReminderStore';
import { v4 as uuidv4 } from 'uuid'

dayjs.extend(LocalizedFormat)

const toast = useToast();
const store = useReminderStore()
const reminderForm = ref<HTMLFormElement | null>(null);

function showSuccessToast() {
    const detail = props.reminder ? 'Reminder updated' : 'Reminder added';
    toast.add({ severity: 'success', summary: 'Success', detail, life: 3000 })
}

const schema = toTypedSchema(
    yup.object({
        description: yup.string().required().max(30).label('Description'),
        date: yup.date().required().label('Date'),
        time: yup.lazy(value => {
            if (typeof value === 'string') {
                return yup.string().required().label('Time').min(4).matches(/(\d){1,2}:(\d){2}/, 'Hour must have this pattern "00:00"');
            }

            return yup.mixed().required();
        }),
        city: yup.lazy(value => {
            if (typeof value === 'string') {
                return yup.string().required().label('City');
            }

            return yup.object({
                cityName: yup.string().required().label('City'),
                countryCode: yup.string().required().label('Country Code'),
                stateCode: yup.string().required().label('State Code')
            })
        }),
        color: yup.string().required().matches(/^([0-9a-f]{6})$/i).label('Color')
    })
)

const props = defineProps({
    selectedDate: {
        type: Date,
        required: false
    },
    reminder: {
        type: Object,
        required: false
    }
});

function initialValuesReminder() {
    if (props.reminder) {
        const reminder = props.reminder;
        const date = dayjs(props.reminder.date);

        return {
            description: reminder.description,
            date: date.toDate(),
            time: date.format('HH:mm'),
            city: reminder.city,
            color: reminder.color
        }
    }

    if (props.selectedDate) {
        let date = dayjs(props.selectedDate);
        const dateNow = new Date();
        date = date.set('hours', dateNow.getHours()).set('minutes', dateNow.getMinutes());

        return {
            description: '',
            date: date.toDate(),
            time: date.format('HH:mm'),
            city: ''
        }
    }

    const date = dayjs();

    return {
        description: '',
        date: date.toDate(),
        time: date.format('HH:mm'),
        city: ''
    }
}

const { handleSubmit, resetForm, errors, values } = useForm({
    validationSchema: schema,
    initialValues: initialValuesReminder()
});

const weatherInfo = ref(null);
const isLoadingWeatherInfo = ref(false);

const tempUnit = computed(() => {
    return navigator.language === 'en-US' ? 'ºF' : 'ºC';
});

const speedUnit = computed(() => {
    return navigator.language === 'en-US' ? 'mph' : 'km/h';
});

onMounted(async () => {
    if (values.date && values.city) {
        isLoadingWeatherInfo.value = true;
        weatherInfo.value = await store.getWeatherInfo(values.city, values.date);
        isLoadingWeatherInfo.value = false;
    }
})

watch([() => values.date, () => values.city], async ([newDate, newCity]) => {
    if (newDate && newCity) {
        isLoadingWeatherInfo.value = true;
        weatherInfo.value = await store.getWeatherInfo(newCity, newDate);
    } else {
        weatherInfo.value = null;
    }
    isLoadingWeatherInfo.value = false;
});

const submitButton = ref<HTMLButtonElement | null>(null);


const emit = defineEmits(['confirm', 'cancel']);

const formTitle = computed(() => {
    if (props.reminder) {
        return 'Edit reminder';
    }
    return 'Add a new reminder';
});

const onSubmit = handleSubmit((values) => {
    let date = dayjs(values.date);
    let time = values.time;

    if (typeof time === 'string') {
        time = time.split(':');
        date = date.set('hours', parseInt(time[0])).set('minutes', parseInt(time[1]));
    } else if (time instanceof Date) {
        date = date.set('hours', time.getHours()).set('minutes', time.getMinutes());
    }

    const reminder = {
        id: '',
        description: values.description,
        date: date.toDate(),
        city: values.city,
        color: values.color
    };

    if (!props.reminder) {
        reminder.id = uuidv4();
        store.addReminder(reminder);
    } else {
        store.updateReminder(props.reminder.id, reminder);
    }

    resetForm();
    showSuccessToast();
    emit('confirm');
})

function handleClickCancel() {
    emit('cancel');
}

function handleClickClose() {
    emit('cancel');
}

function handleClickOk() {
    reminderForm.value?.requestSubmit();
}

const countries = ref([
    {
        name: 'Australia',
        code: 'AU',
        states: [
            {
                name: 'New South Wales',
                cities: [
                    { cityName: 'Sydney', countryCode: 'AU', stateCode: 'NSW' },
                    { cityName: 'Newcastle', countryCode: 'AU', stateCode: 'NSW' },
                    { cityName: 'Wollongong', countryCode: 'AU', stateCode: 'NSW' }
                ]
            },
            {
                name: 'Queensland',
                cities: [
                    { cityName: 'Brisbane', countryCode: 'AU', stateCode: 'QLD' },
                    { cityName: 'Townsville', countryCode: 'AU', stateCode: 'QLD' }
                ]
            }
        ]
    },
    {
        name: 'Brazil',
        code: 'BR',
        states: [
            {
                name: 'São Paulo',
                cities: [
                    { cityName: 'São Paulo', countryCode: 'BR', stateCode: 'SP' },
                    { cityName: 'Campinas', countryCode: 'BR', stateCode: 'SP' }
                ]
            },
            {
                name: 'Rio de Janeiro',
                cities: [
                    { cityName: 'Rio de Janeiro', countryCode: 'BR', stateCode: 'RJ' },
                    { cityName: 'Niterói', countryCode: 'BR', stateCode: 'RJ' }
                ]
            },
            {
                name: 'Minas Gerais',
                cities: [
                    { cityName: 'Belo Horizonte', countryCode: 'BR', stateCode: 'MG' },
                    { cityName: 'Uberlândia', countryCode: 'BR', stateCode: 'MG' }
                ]
            },
            {
                name: 'Bahia',
                cities: [
                    { cityName: 'Salvador', countryCode: 'BR', stateCode: 'BA' },
                    { cityName: 'Vitória da Conquista', countryCode: 'BR', stateCode: 'BA' }
                ]
            },
            {
                name: 'Paraná',
                cities: [
                    { cityName: 'Curitiba', countryCode: 'BR', stateCode: 'PR' },
                    { cityName: 'Londrina', countryCode: 'BR', stateCode: 'PR' }
                ]
            },
            {
                name: 'Rio Grande do Sul',
                cities: [
                    { cityName: 'Porto Alegre', countryCode: 'BR', stateCode: 'RS' },
                    { cityName: 'Pelotas', countryCode: 'BR', stateCode: 'RS' },
                    { cityName: 'Caxias do Sul', countryCode: 'BR', stateCode: 'RS' },
                    { cityName: 'Santa Maria', countryCode: 'BR', stateCode: 'RS' },
                    { cityName: 'Rio Grande', countryCode: 'BR', stateCode: 'RS' },
                    { cityName: 'Passo Fundo', countryCode: 'BR', stateCode: 'RS' },
                    { cityName: 'Bento Gonçalves', countryCode: 'BR', stateCode: 'RS' },
                    { cityName: 'Farroupilha', countryCode: 'BR', stateCode: 'RS' }
                ]
            }
        ]
    },
    {
        name: 'Canada',
        code: 'CA',
        states: [
            {
                name: 'Quebec',
                cities: [
                    { cityName: 'Montreal', countryCode: 'CA', stateCode: 'QC' },
                    { cityName: 'Quebec City', countryCode: 'CA', stateCode: 'QC' }
                ]
            },
            {
                name: 'Ontario',
                cities: [
                    { cityName: 'Ottawa', countryCode: 'CA', stateCode: 'ON' },
                    { cityName: 'Toronto', countryCode: 'CA', stateCode: 'ON' }
                ]
            }
        ]
    },
    {
        name: 'United States',
        code: 'US',
        states: [
            {
                name: 'California',
                cities: [
                    { cityName: 'Los Angeles', countryCode: 'US', stateCode: 'CA' },
                    { cityName: 'San Diego', countryCode: 'US', stateCode: 'CA' },
                    { cityName: 'San Francisco', countryCode: 'US', stateCode: 'CA' }
                ]
            },
            {
                name: 'Florida',
                cities: [
                    { cityName: 'Jacksonville', countryCode: 'US', stateCode: 'FL' },
                    { cityName: 'Miami', countryCode: 'US', stateCode: 'FL' },
                    { cityName: 'Tampa', countryCode: 'US', stateCode: 'FL' },
                    { cityName: 'Orlando', countryCode: 'US', stateCode: 'FL' }
                ]
            },
            {
                name: 'Texas',
                cities: [
                    { cityName: 'Austin', countryCode: 'US', stateCode: 'TX' },
                    { cityName: 'Dallas', countryCode: 'US', stateCode: 'TX' },
                    { cityName: 'Houston', countryCode: 'US', stateCode: 'TX' }
                ]
            }
        ]
    }
]);


</script>

<style scoped>
.calendar-date-indicator {
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-00);
}

form {
    margin-top: 32px;
}

.flex-form {
    display: flex;
    flex-wrap: wrap;
    row-gap: 32px;
    column-gap: 16px;
    align-items: start;
}

.city-select-wrapper {
    flex-basis: 100%;
}

.color-input-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 32px;
}

.weather-info {
    margin-top: 12px;
    background-color: var(--gray-200);
    padding: 8px 16px;
    border-radius: var(--border-radius);
    color: var(--gray-600);
}

.loading-weather-info {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    align-items: center;
}

.weather-info h2 {
    margin: 0;
    font-size: 24px;
}

.weather-summary {
    display: flex;
    align-items: center;
    gap: 8px;
}

.weather-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>