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

                    <div>
                        <span class="p-float-label">
                            <InputText id="city" v-bind="city" :class="{ 'p-invalid': errors.city }"
                                aria-describedby="text-error" />
                            <label for="city">City</label>
                        </span>
                        <small id="city-error" class="p-error">
                            {{ errors.city }}
                        </small>
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
        </template>
    </SlideIn>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup'
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import ColorPicker from 'primevue/colorpicker';
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
        city: yup.string().required().label('City'),
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

const { handleSubmit, resetForm, defineComponentBinds, setFieldValue, errors } = useForm({
    validationSchema: schema,
    initialValues: initialValuesReminder()
});

const description = defineComponentBinds('description');
const date = defineComponentBinds('date');
const time = defineComponentBinds('time');
const city = defineComponentBinds('city');
const color = defineComponentBinds('color');

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
    debugger;
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

#submitButton {
    display: none;
}

.color-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 32px;
}
</style>