<template>
    <SlideIn :title="formTitle" @onClickCancel="handleClickCancel" @onClickOk="handleClickOk"
        @onClickClose="handleClickClose">
        <template v-slot:main>
            <form id="myForm" @submit="onSubmit" ref="reminderForm">
                <div class="flex-form">
                    <div>
                        <span class="p-float-label">
                            <InputText id="description" v-bind="description" type="text"
                                :class="{ 'p-invalid': errors.description }" aria-describedby="text-error" />
                            <label for="description">Description</label>
                        </span>
                        <small id="description-error" class="p-error">
                            {{ errors.description }}
                        </small>
                    </div>

                    <div>
                        <span class="p-float-label">
                            <Calendar v-bind="date" showIcon :class="{ 'p-invalid': errors.date }" />
                            <label for="date">Date</label>
                        </span>
                        <small id="date-error" class="p-error">
                            {{ errors.date }}
                        </small>
                    </div>

                    <div>
                        <span class="p-float-label">
                            <Calendar v-bind="time" timeOnly />
                            <label for="time">Time</label>
                        </span>
                        <small id="time-error" class="p-error">
                            {{ errors.time }}
                        </small>
                    </div>

                    <div class="city-select-container">
                        <span class="p-float-label">
                            <CascadeSelect v-bind="city" append-to="self" :class="{ 'p-invalid': errors.city }"
                                :options="countries" optionLabel="cname" optionGroupLabel="name"
                                :optionGroupChildren="['states', 'cities']" style="min-width: 14rem"
                                placeholder="Select a City" aria-describedby="cc-error" />
                            <label for="city">City</label>
                        </span>
                        <small class="p-error" id="city-error">{{ errors.city }}</small>
                    </div>
                </div>

                <div class="color-container">
                    <ColorPicker v-model="colorPicker" append-to="self" @update:model-value="updateColor" />
                    <span class="p-float-label">
                        <InputText disabled id="color" v-bind="color" :class="{ 'p-invalid': errors.color }"
                            aria-describedby="text-error" />
                        <label for="color">Color</label>
                    </span>
                    <small id="color-error" class="p-error">
                        {{ errors.color }}
                    </small>
                </div>

                <button type="submit" ref="submitButton" id="submitButton"></button>
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
                    aria-label="Custom ProgressSpinner" />
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
import InputText from 'primevue/inputtext';
import CascadeSelect from 'primevue/cascadeselect';
import Calendar from 'primevue/calendar';
import ColorPicker from 'primevue/colorpicker';
import ProgressSpinner from 'primevue/progressspinner';
import SlideIn from './SlideIn.vue';
import { useToast } from "primevue/usetoast";
import { useReminderStore } from '../stores/ReminderStore';
import { v4 as uuidv4 } from 'uuid'

dayjs.extend(LocalizedFormat)

const toast = useToast();
const store = useReminderStore()

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
        city: yup.object().required().label('City'),
        color: yup.string().required().label('Color')
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
            city: '',
            color: '000000'
        }
    }

    const date = dayjs();

    return {
        description: '',
        date: date.toDate(),
        time: date.format('HH:mm'),
        city: '',
        color: '000000'
    }
}

const { handleSubmit, resetForm, defineComponentBinds, setFieldValue, errors, values } = useForm({
    validationSchema: schema,
    initialValues: initialValuesReminder()
});

const description = defineComponentBinds('description');
const date = defineComponentBinds('date');
const time = defineComponentBinds('time');
const city = defineComponentBinds('city');
const color = defineComponentBinds('color');

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

const colorPicker = ref(props?.reminder?.color || '000000');

function updateColor(newColor) {
    setFieldValue('color', newColor);
}

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
    if (submitButton.value) {
        submitButton.value.click();
    }
}

const countries = ref([
    {
        name: 'Australia',
        code: 'AU',
        states: [
            {
                name: 'New South Wales',
                cities: [
                    { cname: 'Sydney', countryCode: 'AU', stateCode: 'NSW' },
                    { cname: 'Newcastle', countryCode: 'AU', stateCode: 'NSW' },
                    { cname: 'Wollongong', countryCode: 'AU', stateCode: 'NSW' }
                ]
            },
            {
                name: 'Queensland',
                cities: [
                    { cname: 'Brisbane', countryCode: 'AU', stateCode: 'QLD' },
                    { cname: 'Townsville', countryCode: 'AU', stateCode: 'QLD' }
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
                    { cname: 'São Paulo', countryCode: 'BR', stateCode: 'SP' },
                    { cname: 'Campinas', countryCode: 'BR', stateCode: 'SP' }
                ]
            },
            {
                name: 'Rio de Janeiro',
                cities: [
                    { cname: 'Rio de Janeiro', countryCode: 'BR', stateCode: 'RJ' },
                    { cname: 'Niterói', countryCode: 'BR', stateCode: 'RJ' }
                ]
            },
            {
                name: 'Minas Gerais',
                cities: [
                    { cname: 'Belo Horizonte', countryCode: 'BR', stateCode: 'MG' },
                    { cname: 'Uberlândia', countryCode: 'BR', stateCode: 'MG' }
                ]
            },
            {
                name: 'Bahia',
                cities: [
                    { cname: 'Salvador', countryCode: 'BR', stateCode: 'BA' },
                    { cname: 'Vitória da Conquista', countryCode: 'BR', stateCode: 'BA' }
                ]
            },
            {
                name: 'Paraná',
                cities: [
                    { cname: 'Curitiba', countryCode: 'BR', stateCode: 'PR' },
                    { cname: 'Londrina', countryCode: 'BR', stateCode: 'PR' }
                ]
            },
            {
                name: 'Rio Grande do Sul',
                cities: [
                    { cname: 'Porto Alegre', countryCode: 'BR', stateCode: 'RS' },
                    { cname: 'Pelotas', countryCode: 'BR', stateCode: 'RS' },
                    { cname: 'Caxias do Sul', countryCode: 'BR', stateCode: 'RS' },
                    { cname: 'Santa Maria', countryCode: 'BR', stateCode: 'RS' },
                    { cname: 'Rio Grande', countryCode: 'BR', stateCode: 'RS' },
                    { cname: 'Passo Fundo', countryCode: 'BR', stateCode: 'RS' },
                    { cname: 'Bento Gonçalves', countryCode: 'BR', stateCode: 'RS' },
                    { cname: 'Farroupilha', countryCode: 'BR', stateCode: 'RS' }
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
                    { cname: 'Montreal', countryCode: 'CA', stateCode: 'QC' },
                    { cname: 'Quebec City', countryCode: 'CA', stateCode: 'QC' }
                ]
            },
            {
                name: 'Ontario',
                cities: [
                    { cname: 'Ottawa', countryCode: 'CA', stateCode: 'ON' },
                    { cname: 'Toronto', countryCode: 'CA', stateCode: 'ON' }
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
                    { cname: 'Los Angeles', countryCode: 'US', stateCode: 'CA' },
                    { cname: 'San Diego', countryCode: 'US', stateCode: 'CA' },
                    { cname: 'San Francisco', countryCode: 'US', stateCode: 'CA' }
                ]
            },
            {
                name: 'Florida',
                cities: [
                    { cname: 'Jacksonville', countryCode: 'US', stateCode: 'FL' },
                    { cname: 'Miami', countryCode: 'US', stateCode: 'FL' },
                    { cname: 'Tampa', countryCode: 'US', stateCode: 'FL' },
                    { cname: 'Orlando', countryCode: 'US', stateCode: 'FL' }
                ]
            },
            {
                name: 'Texas',
                cities: [
                    { cname: 'Austin', countryCode: 'US', stateCode: 'TX' },
                    { cname: 'Dallas', countryCode: 'US', stateCode: 'TX' },
                    { cname: 'Houston', countryCode: 'US', stateCode: 'TX' }
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

.city-select-container {
    flex-basis: 100%;
}

#submitButton {
    display: none;
}

.color-container {
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