<template>
    <SlideIn :title="Reminders" @onClickCancel="handleClickCancel" @onClickOk="handleClickOk"
        @onClickClose="handleClickClose">
        <template v-slot:main>
            <h2>{{ label }}</h2>
            <ol>
                <li v-for="reminder in reminders" :key="reminder.id">
                    <span :style="{ color: `#${reminder.color}` }">
                        {{ reminder.description }}
                    </span>
                    <span>
                        {{ reminder.date }}
                    </span>
                </li>
            </ol>
        </template>
    </SlideIn>
</template>

<script setup>
import dayjs from "dayjs";
import { computed } from "vue";
import { useReminderStore } from "../stores/ReminderStore";

const emit = defineEmits(['confirm', 'cancel']);
const store = useReminderStore();

const props = defineProps({
    day: {
        type: Object,
        required: true
    }
});

const label = computed(() => {
    debugger;
    return dayjs(props.day.date).format("YYYY MMMM DD dddd");
});

const reminders = computed(() => {
    return store.getRemindersByDateSortedByTime(props.day.dateJs);
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