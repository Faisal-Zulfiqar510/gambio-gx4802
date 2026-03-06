<template>
  <div class="custom-tooltip custom-tooltip-top" :class="{ show: show }">
    <div class="custom-tooltip-arrow" />

    <div class="custom-tooltip-inner">
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Tooltip",

  props: {
    text: {
      required: true,
      type: String,
    },
    show: {
      required: true,
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-tooltip {
  position: absolute;
  right: 0;

  margin: 0;

  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  text-decoration: none;
  text-shadow: none;
  text-transform: none;
  letter-spacing: normal;
  word-break: normal;
  word-spacing: normal;
  white-space: normal;
  line-break: auto;
  font-size: 0.875rem;
  word-wrap: break-word;

  min-width: 250px;
  height: 100%;

  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s;

  &.show {
    opacity: 1;
    transition: opacity 0.3s;
    z-index: 1080;
  }

  .custom-tooltip-arrow {
    position: absolute;
    display: block;
    right: 3rem;
    margin-left: -0.2rem;

    &::before {
      position: absolute;
      content: "";
      border-color: transparent;
      border-style: solid;
    }
  }

  .custom-tooltip-inner {
    padding: 0.25rem 0.5rem;
    color: #fff;
    text-align: center;
    background-color: #000;
    border-radius: 0.25rem;

    position: absolute;
    bottom: 7px;
    min-width: inherit;
  }
}

.custom-tooltip-top {
  top: -40px;
  padding: 0.4rem 0;

  .custom-tooltip-arrow {
    bottom: 6px;

    &::before {
      top: -1px;
      border-width: 0.4rem 0.4rem 0;
      border-top-color: #000;
    }
  }
}
</style>
