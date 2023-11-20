<template>
    <InputText v-model="value" aria-describedby="cp-error" />
</template>

<script setup>
import { useField } from 'vee-validate';
import InputText from 'primevue/inputtext';

const props = defineProps({
    name: String
});

const { value } = useField(() => props.name);

</script>