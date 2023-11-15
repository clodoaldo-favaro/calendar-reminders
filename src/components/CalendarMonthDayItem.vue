<template>
    <li class="calendar-day" :class="{
        'calendar-day--not-current': !day.isCurrentMonth,
        'calendar-day--today': isToday,
        'calendar-day--weekend': isWeekend
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

const SATURDAY = 6;
const SUNDAY = 0;

const isWeekend = computed(() => {
    return [SATURDAY, SUNDAY].includes(dayjs(props.day.date).day());
})

</script>

<style scoped>
.calendar-day {
    position: relative;
    min-height: 100px;
    font-size: 16px;
    background-color: #fff;
    color: var(--gray-800);
    padding: 5px;
    cursor: pointer;
}

.calendar-day>span {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 4px;
    width: var(--day-label-size);
    height: var(--day-label-size);
}

.calendar-day--not-current {
    background-color: var(--gray-100);
    color: var(--gray-300);
}

.calendar-day--today>span::before {
    content: '';
    position: absolute;
    left: -4px;
    border-radius: 100%;
    background-color: transparent;
    width: var(--day-label-size);
    height: var(--day-label-size);
    border: 2px solid var(--purple-200);
    padding: 2px;
}

.calendar-day--weekend>span {
    color: var(--blue-400);
}
</style>
