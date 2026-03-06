<template>
  <button type="button" :class="classes" :aria-label="ariaLabel">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Button",

  props: {
    ariaLabel: {
      required: false,
      default: "",
    },
    type: {
      required: false,
      type: String,
      default: "primary",
    },
    size: {
      required: false,
      type: String,
    },
  },

  setup(props) {
    const { type, size } = props;

    const classes = ref({
      btn: true,
      "btn-primary": type === "primary",
      "btn-secondary": type === "secondary",
      "btn-success": type === "success",
      "btn-danger": type === "danger",
      "btn-warning": type === "warning",
      "btn-muted": type === "muted",
      "btn-sm": size === "sm",
      "btn-lg": size === "lg",
    });

    return { classes };
  },
});
</script>

<style lang="scss" scoped>
.btn {
  font-size: 12px !important;
}

.btn-success {
  color: #ffffff !important;

  &:disabled {
    color: #ffffff !important;
  }

  &:hover {
    color: #ffffff;
  }
}

.btn-danger {
  color: #ffffff;

  &:disabled {
    color: #ffffff !important;
  }

  &:hover {
    color: #ffffff;
  }
}
</style>