<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h2>
            <slot name="header"/>
          </h2>
          <div class="close-btn">
            <i class="fas fa-times" @click="$emit(ModalEvent.Close)"></i>
          </div>
        </div>

        <div class="modal-body">
          <slot name="body"/>
        </div>

        <div class="modal-footer">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ModalEvent} from "../../scripts/overview/event";

export default defineComponent({
  name: "Modal",

  emits: [ModalEvent.Close],

  setup() {
    return {ModalEvent};
  },
});
</script>

<style lang="scss">
.modal-mask {
  user-select: text;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;

  .modal-container {
    width: 50rem;
    margin: 0 auto;
    background-color: #FFFFFF;
    border-radius: 0.25rem;
    transition: all 0.3s ease;
    border: 1px solid #CCCCCC;

    .modal-header {
      display: flex;
      flex-direction: row;
      padding: 5px 25px;
      align-items: center;
      border-bottom: 1px solid #E7E7E7;

      h2 {
        width: percentage(11/12);
        font-size: 1.5em;
        line-height: 1.33;
        font-weight: 500;
      }

      .close-btn {
        width: percentage(1/12);
        font-size: 18px;
        text-align: right;

        i {
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          position: relative;
          z-index: 9999;
          color: rgb(17, 17, 17);

          &:hover {
            color: rgb(0, 0, 0);
          }
        }
      }
    }

    .modal-body {
      height: auto;
    }

    .modal-footer {
      border-top: 1px solid #E7E7E7;
      padding: 20px;
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
</style>