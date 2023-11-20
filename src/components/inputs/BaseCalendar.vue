<template>
    <Calendar v-model="value" :time-only="timeOnly" :show-icon="showIcon" aria-describedby="cp-error" />
</template>

<script setup>
import { useField } from 'vee-validate';
import Calendar from 'primevue/calendar';

const props = defineProps({
    name: String,
    timeOnly: Boolean,
    showIcon: Boolean,
});

const { value } = useField(() => props.name);

</script>