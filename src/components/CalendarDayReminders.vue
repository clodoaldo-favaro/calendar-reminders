<template>
    <SlideIn :title="label" @onClickCancel="handleClickCancel" @onClickOk="handleClickOk" @onClickClose="handleClickClose">
        <template v-slot:main>
            <h2>Reminders</h2>
            <ol class="reminders">
                <li v-for="reminder in reminders" :key="reminder.id"
                    @click="openReminderFormWithSelectedReminder(reminder)">
                    <span>
                        {{ dayjs(reminder.date).format('HH:mm') }}
                    </span>
                    <span :style="{ color: `#${reminder.color}` }">
                        {{ reminder.description }}
                    </span>
                </li>
            </ol>
        </template>
    </SlideIn>

    <ReminderForm v-if="isReminderFormVisible" @cancel="hideReminderForm" @confirm="hideReminderForm"
        :selected-date="props.selectedDate" :reminder="selectedReminder" />
</template>

<script setup>
import dayjs from "dayjs";
import { computed, ref } from "vue";
import { useReminderStore } from "../stores/ReminderStore";
import SlideIn from "./SlideIn.vue";
import ReminderForm from "./ReminderForm.vue";

const emit = defineEmits(['confirm', 'cancel']);
const store = useReminderStore();

const props = defineProps({
    selectedDate: {
        type: Date,
        required: true
    }
});

const selectedReminder = ref(null);
const isReminderFormVisible = ref(false);

function openReminderFormWithSelectedReminder(reminder) {
    selectedReminder.value = reminder;
    showReminderForm();

}

function showReminderForm() {
    isReminderFormVisible.value = true;
}

function hideReminderForm() {
    isReminderFormVisible.value = false;
}

const label = computed(() => {
    debugger;
    const date = dayjs(props.selectedDate);
    return date.format("YYYY MMMM, DD - dddd");
});

const reminders = computed(() => {
    debugger;
    return store.getRemindersByDateSortedByTime(props.selectedDate);
})

function handleClickCancel() {
    emit('cancel');
}

function handleClickClose() {
    emit('cancel');
}

function handleClickOk() {

}



</script>

<style scoped>
h2 {
    font-size: 16px;
    color: var(--gray-600);
}

ol {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

ol li {
    display: flex;
    gap: 16px;
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
    padding: 16px;
    border-radius: var(--border-radius);
}

ol li:nth-child(2n + 1) {
    background-color: var(--gray-100);
}

ol li span:first-child {
    color: var(--gray-600);
}
</style>