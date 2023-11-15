<template>
    <li class="calendar-day" :class="{
        'calendar-day--not-current': !day.isCurrentMonth,
        'calendar-day--today': isToday
    }">
        <span>{{ label }}</span>
    </li>
</template>

<script setup>
import dayjs from "dayjs";
import { computed } from "vue";

const props = defineProps({
    day: {
        type: Object,
        required: true
    },

    isCurrentMonth: {
        type: Boolean,
        default: false
    },

    isToday: {
        type: Boolean,
        default: false
    }
});

const label = computed(() => {
    return dayjs(props.day.date).format("D");
});

</script>

<style scoped>
.calendar-day {
    position: relative;
    min-height: 100px;
    font-size: 16px;
    background-color: #fff;
    color: var(--grey-800);
    padding: 5px;
}

.calendar-day>span {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 2px;
    width: var(--day-label-size);
    height: var(--day-label-size);
}

.calendar-day--not-current {
    background-color: var(--grey-100);
    color: var(--grey-300);
}

.calendar-day--today>span {
    color: #fff;
    border-radius: 9999px;
    background-color: var(--grey-800);
}
</style>
