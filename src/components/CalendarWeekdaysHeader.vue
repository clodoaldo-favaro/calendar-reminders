<template>
    <ol>
        <li v-for="weekday in weekdays" :key="weekday">{{ weekday }}</li>
    </ol>
</template>

<script setup>
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
</script>

<style scoped>
ol {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background-color: var(--blue-400);
}

li {
    text-align: center;
    padding: 5px;
    font-weight: bold;
    color: var(--white);
}
</style>
