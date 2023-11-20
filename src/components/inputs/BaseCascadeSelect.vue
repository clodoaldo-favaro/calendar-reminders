<template>
    <CascadeSelect v-model="value" />
</template>

<script setup>
import { useField } from 'vee-validate';
import CascadeSelect from 'primevue/cascadeselect';

const props = defineProps({
    name: String
});

const { value } = useField(() => props.name);

</script>