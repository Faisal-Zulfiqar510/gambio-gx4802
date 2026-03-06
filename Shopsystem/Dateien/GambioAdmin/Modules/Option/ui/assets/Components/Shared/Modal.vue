<template>
  <div class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h5 class="modal-title">
          <slot name="header" />
        </h5>
        <button type="button" class="btn-close" @click="$emit(ModalEvent.Close)" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <slot name="body" />
      </div>

      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { ModalEvent } from "../../scripts/option/event";

const emits = defineEmits<{
  (e: ModalEvent.Close): void;
}>();

const modalActiveClass = "modal-open";
const body = document.getElementsByTagName("body")[0];

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === "Escape") {
    emits(ModalEvent.Close);
  }
}

onMounted(() => {
  body.addEventListener("keydown", closeOnEscape);
  body.classList.add(modalActiveClass);
});

onUnmounted(() => {
  body.removeEventListener("keydown", closeOnEscape);
  body.classList.remove(modalActiveClass);
});
</script>

<style lang="scss">
body.modal-open {
  overflow: hidden;
  padding-right: 15px;
}

.modal-mask {
  display: flex;
  align-items: center;
  user-select: text;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s ease;

  .modal-container {
    width: 100%;
    max-width: 500px;
    margin: 1.75rem auto;
    background-color: #ffffff;
    border-radius: 0.25rem;
    transition: all 0.3s ease;
    border: 1px solid #cccccc;

    position: relative;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-clip: padding-box;
    outline: 0;

    .modal-header {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
      border-radius: calc(0.3rem - 1px) calc(0.3rem - 1px) 0 0;

      .modal-title {
        margin-bottom: 0;
        line-height: 1.5;
      }
    }

    .modal-body {
      position: relative;
      flex: 1 1 auto;
      padding: 1rem;
      height: 100%;
      max-height: calc(100vh - 190px);
      overflow-y: auto;
    }

    .modal-footer {
      border-top: 1px solid #e7e7e7;
      padding: 0.75rem;
      display: flex;
      flex-wrap: wrap;
      flex-shrink: 0;
      align-items: center;
      justify-content: flex-end;
    }
  }

  &.modal-large {
    .modal-container {
      max-width: 900px;
    }
  }

  &.modal-body-plain {
    .modal-body {
      padding: 0;
    }
  }
}
</style>
