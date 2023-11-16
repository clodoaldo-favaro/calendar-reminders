<template>
    <li class="calendar-day" :class="{
        'calendar-day--not-current': !day.isCurrentMonth,
        'calendar-day--today': isToday,
        'calendar-day--weekend': isWeekend
    }">
        <span>{{ label }}</span>
        <ol class="reminders-small">
            <li v-for="reminder in reminders" :key="reminder.id">
                <span :style="{ color: `#${reminder.color}` }">
                    {{ reminder.description }}
                </span>
            </li>
        </ol>
    </li>
</template>

<script setup>
import dayjs from "dayjs";
import { computed } from "vue";
import { useReminderStore } from "../stores/ReminderStore";

const store = useReminderStore();

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

const reminders = computed(() => {
    return store.getRemindersByDateSortedByTime(props.day.dateJs);
})

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
    overflow: hidden;
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
    display: block;
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

ol.reminders-small {
    margin-top: 32px;
    font-size: 12px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
