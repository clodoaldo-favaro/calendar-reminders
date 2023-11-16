<template>
    <div>
        <h2>Add new reminder</h2>
        <form @submit.prevent="onSubmit">
            <span class="p-float-label">
                <InputText id="description" v-bind="description" type="text" :class="{ 'p-invalid': errors.description }"
                    aria-describedby="text-error" />
                <label for="description">Description</label>
            </span>
            <Calendar v-bind="date" showIcon />

            <Button type="button" label="Cancel" @click="handleCancelClick" />
            <Button type="submit" label="Confirm" />

        </form>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup'
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';

const schema = toTypedSchema(
    yup.object({
        description: yup.string().required().max(30),
        date: yup.date().required(),
    })
)

const { handleSubmit, resetForm, defineComponentBinds, errors } = useForm({
    validationSchema: schema
});

const description = defineComponentBinds('description');
const date = defineComponentBinds('date');



const props = defineProps({
    selectedDate: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['confirm', 'cancel']);

const selectedMonth = computed(() => {
    return props.selectedDate.format("MMMM YYYY");
});

const onSubmit = handleSubmit((values) => {
    //TODO Save to Pinia
    debugger;
    console.log(values);
    resetForm();
    emit('confirm');
})


function handleCancelClick() {
    emit('cancel');
}

</script>

<style scoped>
.calendar-date-indicator {
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-00);
}
</style>