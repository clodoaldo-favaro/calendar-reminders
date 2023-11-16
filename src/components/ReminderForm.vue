<template>
    <SlideIn :title="formTitle" @onClickCancel="handleClickCancel" @onClickOk="handleClickOk"
        @onClickClose="handleClickClose">
        <template v-slot:main>
            <form id="myForm" @submit="onSubmit" ref="reminderForm">
                <span class="p-float-label">
                    <InputText id="description" v-bind="description" type="text"
                        :class="{ 'p-invalid': errors.description }" aria-describedby="text-error" />
                    <label for="description">Description</label>
                </span>
                <span class="p-float-label">
                    <Calendar v-bind="date" showIcon :class="{ 'p-invalid': errors.date }" />
                    <label for="date">Date</label>
                </span>
                <span class="p-float-label">
                    <Calendar v-bind="time" timeOnly />
                    <label for="time">Time</label>
                </span>
                <span class="p-float-label">
                    <InputText id="description" v-bind="city" type="text" :class="{ 'p-invalid': errors.city }"
                        aria-describedby="text-error" />
                    <label for="city">City</label>
                </span>
                <ColorPicker v-model="color" />
            </form>
        </template>
    </SlideIn>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup'
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import ColorPicker from 'primevue/colorpicker';
import SlideIn from './SlideIn.vue';

const schema = toTypedSchema(
    yup.object({
        description: yup.string().required().max(30),
        date: yup.date().required(),
        time: yup.string().required(),
        city: yup.string().required(),
        color: yup.string().required()
    })
)

const { handleSubmit, resetForm, defineComponentBinds, errors } = useForm({
    validationSchema: schema
});

const description = defineComponentBinds('description');
const date = defineComponentBinds('date');
const time = defineComponentBinds('time');
const city = defineComponentBinds('city');
const color = defineComponentBinds('color');

const props = defineProps({
    selectedDate: {
        type: Object,
        required: false
    },
    reminder: {
        type: Object,
        required: false
    }
});

const reminderForm = ref(null);

const emit = defineEmits(['confirm', 'cancel']);

const formTitle = computed(() => {
    if (props.reminder) {
        return 'Edit reminder';
    }
    return 'Add a new reminder';
});

const onSubmit = handleSubmit((values) => {
    alert(JSON.stringify(values, null, 2));
    resetForm();
    emit('confirm');
})


function handleClickCancel() {
    emit('cancel');
}

function handleClickClose() {
    emit('cancel');
}

function handleClickOk() {
    debugger;
    if (reminderForm.value) {
        console.log(reminderForm);
        reminderForm.value.submit();
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
    display: flex;
    flex-wrap: wrap;
    row-gap: 32px;
    column-gap: 16px;
    align-items: start;
}
</style>