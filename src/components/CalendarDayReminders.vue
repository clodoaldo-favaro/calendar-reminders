<template>
    <SlideIn :title="label" hideFooter="true" @onClickClose="handleClickClose">
        <template v-slot:main>
            <h2>Reminders</h2>
            <ol class="reminders">
                <li v-for="reminder in reminders" :key="reminder.id">
                    <div>
                        <span>
                            {{ dayjs(reminder.date).format('HH:mm') }}
                        </span>
                        <span :style="{ color: `#${reminder.color}` }">
                            {{ reminder.description }}
                        </span>
                    </div>
                    <div>
                        <Button @click="openReminderFormWithSelectedReminder(reminder)" icon="pi pi-pencil"
                            aria-label="Edit" outlined severity="info" text title="Edit" />

                        <Button @click="removeReminder(reminder.id)" icon="pi pi-trash" aria-label="Delete" outlined
                            severity="danger" text title="Delete" />

                    </div>
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
import Button from "primevue/button";

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

function removeReminder(reminderId) {
    debugger;
    store.removeReminder(reminderId);
}


function showReminderForm() {
    isReminderFormVisible.value = true;
}

function hideReminderForm() {
    isReminderFormVisible.value = false;
}

const label = computed(() => {
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
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
    padding: 16px;
    border-radius: var(--border-radius);
}

ol li>div {
    display: flex;
    align-items: center;
}

ol li>div:first-child {
    gap: 8px;
}

ol li:nth-child(2n + 1) {
    background-color: var(--gray-050);
}

ol li div:first-child span:first-child {
    color: var(--gray-600);
    font-weight: normal;
}
</style>