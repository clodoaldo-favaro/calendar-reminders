<template>
    <ColorPicker v-model="value" aria-describedby="cp-error" />
</template>

<script setup>
import { useField } from 'vee-validate';
import ColorPicker from 'primevue/colorpicker';

const props = defineProps({
    name: String
});

const { value } = useField(() => props.name);

</script>