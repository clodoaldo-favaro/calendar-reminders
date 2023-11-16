<template>
    <Teleport to="body" :disabled="!teleportToBody">
        <Transition name="slide" appear>
            <div class="SlideIn" role="dialog" v-bind="attrs">
                <header class="SlideIn-header">
                    <slot name="header">
                        <h1 class="SlideIn-title">{{ title }}</h1>
                        <Button v-if="hasClose" @click="$emit('onClickClose')" class="SlideIn-close" icon="pi pi-times" text
                            rounded aria-label="Close" />
                    </slot>
                </header>
                <main class="SlideIn-content">
                    <slot></slot>
                    <slot name="main"></slot>
                </main>
                <footer v-show="!hideFooter" class="SlideIn-footer">
                    <slot name="footer">
                        <Button outlined v-show="!hideCancelButton" @click="$emit('onClickCancel')"
                            :disabled="disableCancelButton" ref='cancelButton' :label="textCancelButton" />
                        <Button v-show="!hideOkButton" @click="$emit('onClickOk')" :disabled="disableOkButton"
                            :label="textOkButton" ref="okButton" />
                    </slot>
                </footer>
            </div>
        </Transition>
        <div v-if="showOverlay || !persistent" class="Overlay" @click="persistent || $emit('onClickClose')"></div>
    </Teleport>
</template> 

<script setup>
import Button from 'primevue/button';
defineEmits(['onClickCancel', 'onClickOk', 'onClickClose']);
defineProps({
    showOverlay: {
        type: Boolean,
        default: true
    },

    hasClose: {
        type: Boolean,
        default: true
    },

    attrs: Object,

    title: String,

    hideOkButton: Boolean,

    disableOkButton: Boolean,

    textOkButton: {
        type: String,
        default: 'Confirm'
    },

    hideCancelButton: Boolean,

    disableCancelButton: Boolean,

    textCancelButton: {
        type: String,
        default: 'Cancel'
    },

    teleportToBody: {
        type: Boolean,
        default: true
    },

    hideFooter: Boolean,

    persistent: {
        type: Boolean,
        default: true
    }
});
</script>

<style scoped>
.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.8s cubic-bezier(0.28, 0.61, 0, 1);
}

.SlideIn {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0%;
    left: auto;
    width: 45%;
    min-width: 450px;
    border-radius: 0;
    height: auto;
    padding: 12px 28px;
    background: var(--white);
    color: var(--gray-600);
    z-index: 101;
}

.SlideIn .SlideIn-header {
    display: flex;
    justify-content: space-between;
    z-index: 1;
    margin-bottom: 8px;
}

.SlideIn .SlideIn-header .SlideIn-title {
    margin: 0;
    white-space: nowrap;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    font-size: 20px;
    color: var(--gray-600);
}

.SlideIn-close {
    padding: 8px;
    font-size: 24px;
    height: fit-content;
    cursor: pointer;
    position: absolute;
    margin-top: 0;
    top: 4px;
    right: 8px;
}

.SlideIn-close.p-button.p-button-text {
    color: var(--gray-600);
}

.SlideIn .SlideIn-content {
    border: none;
    background-color: var(--white);
    color: var(--gray-400);
    height: calc(100% - 164px);
    overflow-y: auto;
    max-height: none;
    min-width: 90px;
    position: relative;
    zoom: 1;
    box-shadow: none;
    margin-right: auto;
    margin-left: auto;
}

.SlideIn .SlideIn-footer {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    padding: 24px 36px;
    background-color: var(--white);
    box-shadow: 0px 0px 5px #00000054;
    opacity: 1;
    color: var(--gray-400);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 24px;
}

.Overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: none rgb(51, 51, 51);
    opacity: 0.3;
}

@media screen and (max-width: 850px) {

    .slide-enter-from,
    .slide-leave-to {
        transform: translateY(100%);
    }

    .SlideIn {
        top: 5%;
        width: 100%;
        min-width: auto;
        padding: 5px 14px;
    }

    .SlideIn .SlideIn-content {
        overflow-y: auto;
        overflow-x: clip;
    }
}
</style>

	