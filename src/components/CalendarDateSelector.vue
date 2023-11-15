<template>
    <div class="calendar-date-selector">
        <span @click="selectPrevious">
            <ph-caret-left :size="32" :weight="'bold'"></ph-caret-left>
        </span>
        <span @click="selectCurrent" class="select-current">Current</span>
        <span @click="selectNext">
            <ph-caret-right :size="32" :weight="'bold'"></ph-caret-right>
        </span>
    </div>
</template>

<script setup>
import dayjs from "dayjs";
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";


const props = defineProps({
    currentDate: {
        type: String,
        required: true
    },

    selectedDate: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['dateSelected']);


function selectPrevious() {
    let newSelectedDate = dayjs(props.selectedDate).subtract(1, "month");
    emit("dateSelected", newSelectedDate);
}

function selectCurrent() {
    let newSelectedDate = dayjs(props.currentDate);
    emit("dateSelected", newSelectedDate);
}

function selectNext() {
    let newSelectedDate = dayjs(props.selectedDate).add(1, "month");
    emit("dateSelected", newSelectedDate);
}

</script>

<style scoped>
.calendar-date-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    color: var(--gray-800);
}

.calendar-date-selector span.select-current {
    margin-top: -8px;
}

span svg {
    color: var(--gray-400);
}

span svg:hover {
    background-color: var(--gray-100);
    border-radius: 6px;
}

.calendar-date-selector>* {
    cursor: pointer;
    user-select: none;
}
</style>
