<template>
    <div class="calendar-month">
        <div class="calendar-month-header">
            <CalendarDateIndicator :selected-date="selectedDate" class="calendar-month-header-selected-month" />

            <CalendarDateSelector :current-date="today" :selected-date="selectedDate" @dateSelected="selectDate" />
        </div>

        <CalendarWeekdaysHeader />

        <ol class="days-grid">
            <CalendarMonthDayItem v-for="day in days" :key="day.date" :day="day" :is-today="day.date === today" />
        </ol>

        <Button type="button" label="+ Add reminder" @click="showReminderForm" />
        <!-- <ReminderForm v-if="isReminderFormVisible" @cancel="hideReminderForm" :reminder="reminderSample" /> -->
        <ReminderForm v-if="isReminderFormVisible" @cancel="hideReminderForm" />
    </div>
</template >

<script setup >
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import CalendarMonthDayItem from './CalendarMonthDayItem.vue';
import CalendarDateIndicator from './CalendarDateIndicator.vue';
import CalendarDateSelector from './CalendarDateSelector.vue';
import CalendarWeekdaysHeader from './CalendarWeekdaysHeader.vue';
import ReminderForm from './ReminderForm.vue';

import Button from 'primevue/button'

dayjs.extend(weekOfYear);

let selectedDate = ref(dayjs());

const days = computed(() => {
    return [
        ...previousMonthDays.value,
        ...currentMonthDays.value,
        ...nextMonthDays.value,
    ];
});

const today = computed(() => {
    return dayjs().format('YYYY-MM-DD');
});

const month = computed(() => {
    return Number(selectedDate.value.format('M'));
});

const year = computed(() => {
    return Number(selectedDate.value.format('YYYY'));
});

const numberOfDaysInMonth = computed(() => {
    return dayjs(selectedDate.value).daysInMonth();
});

const currentMonthDays = computed(() => {
    return [...Array(numberOfDaysInMonth.value)].map((day, index) => {
        return {
            date: dayjs(
                `${year.value}-${month.value}-${index + 1}`
            ).format('YYYY-MM-DD'),
            isCurrentMonth: true,
        };
    });
});


const previousMonthDays = computed(() => {
    const firstWeekdayOfCurrentMonth = getWeekday(
        currentMonthDays.value[0].date
    );

    const isSunday = (weekday) => weekday === 0;

    const previousMonth = dayjs(`${year.value}-${month.value}-01`).subtract(1, 'month');

    const visibleNumberOfDaysFromPreviousMonth = isSunday(firstWeekdayOfCurrentMonth) ? 0 : firstWeekdayOfCurrentMonth;

    const previousMonthLastSundayDayOfMonth = dayjs(currentMonthDays.value[0].date)
        .subtract(visibleNumberOfDaysFromPreviousMonth, 'day')
        .date();

    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map(
        (day, index) => {
            return {
                date: dayjs(
                    `${previousMonth.year()}-${previousMonth.month() + 1
                    }-${previousMonthLastSundayDayOfMonth + index}`
                ).format('YYYY-MM-DD'),
                isCurrentMonth: false,
            };
        }
    );
});

const nextMonthDays = computed(() => {
    const lastWeekdayOfCurrentMonth = getWeekday(
        `${year.value}-${month.value}-${currentMonthDays.value.length}`
    );

    const nextMonth = dayjs(`${year.value}-${month.value}-01`).add(
        1,
        'month'
    );

    const isSaturday = (weekday) => weekday === 6;


    const visibleNumberOfDaysFromNextMonth = isSaturday(lastWeekdayOfCurrentMonth) ? 0 : 6 - lastWeekdayOfCurrentMonth;

    return [...Array(visibleNumberOfDaysFromNextMonth)].map(
        (day, index) => {
            return {
                date: dayjs(
                    `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1
                    }`
                ).format('YYYY-MM-DD'),
                isCurrentMonth: false,
            };
        }
    );
});

function getWeekday(date) {
    return dayjs(date).day();
};

function selectDate(newSelectedDate) {
    selectedDate.value = newSelectedDate;
};


const isReminderFormVisible = ref(false);

function showReminderForm() {
    isReminderFormVisible.value = true;
}

function hideReminderForm() {
    isReminderFormVisible.value = false;
}

</script>

<style scoped>
.calendar-month-header {
    display: flex;
    justify-content: space-between;
    background-color: var(--white);
    padding: 10px;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
}

.calendar-month {
    position: relative;
    border: 1px solid black;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
}

.days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.days-grid {
    height: 100%;
    position: relative;
    grid-column-gap: var(--grid-gap);
    grid-row-gap: var(--grid-gap);
    background-color: var(--blue-600);
}
</style>
