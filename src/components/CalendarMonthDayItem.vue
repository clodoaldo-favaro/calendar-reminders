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
        <p class="show-more">{{ showMoreText }}</p>
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
    return store.getRemindersByDateSortedByTime(props.day.dateJs).slice(0, 2);
})

const showMoreText = computed(() => {
    const remindersCount = store.getRemindersByDateSortedByTime(props.day.dateJs).length;
    if (remindersCount > 2) {
        debugger;
        return `+ ${remindersCount - 2}`;
    }

    return '';
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
    padding: 8px;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100px;
    max-height: 100px;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.show-more {
    position: absolute;
    bottom: -8px;
    font-size: 10px;
    color: var(--blue-400);
}
</style>
