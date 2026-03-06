<template>
  <div class="mb-3">
    <label class="form-label" for="collectionName">Name:</label>
    <input class="form-control" id="collectionName" v-model.trim="collectionName" @blur="inputBlur" />
  </div>
</template>

<script lang="ts">
import { computed } from "vue";

export default {
  name: "AttachImageEditCollectionName",

  props: {
    name: {
      required: true,
      type: String,
    },
  },

  setup(props: any, { emit }: any) {
    function inputBlur(event: FocusEvent) {
      const element = event.currentTarget as HTMLInputElement;

      if (element.value.length > 0) {
        element.classList.remove("is-invalid");
      } else {
        element.classList.add("is-invalid");
      }

      emit("update-valid-state", element.value.length > 0);
    }

    const collectionName = computed({
      get: () => {
        if (props.name) {
          const element = document.getElementById("collectionName") as HTMLFormElement;

          if (element) {
            if (props.name.length > 0) {
              element.classList.remove("is-invalid");
            } else {
              element.classList.add("is-invalid");
            }

            emit("update-valid-state", element.value.length > 0);
          }
        }

        return props.name;
      },
      set: (value) => emit("value-changed", value),
    });

    return { collectionName, inputBlur };
  },
};
</script>
