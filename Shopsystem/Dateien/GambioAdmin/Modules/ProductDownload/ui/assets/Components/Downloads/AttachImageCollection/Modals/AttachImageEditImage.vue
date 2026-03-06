<template>
  <ul class="nav nav-tabs mb-3" id="attachImageTab" role="tablist">
    <li v-for="language in languages" :key="language" class="nav-item" role="presentation">
      <button
        :id="`${language.code}-tab`"
        :class="{ active: currentTabLanguage === language.code }"
        :data-bs-target="`#${language.code}`"
        data-bs-toggle="tab"
        :aria-controls="language.code"
        @click="changeLanguageTab(language.code)"
        class="nav-link"
        type="button"
        role="tab"
        v-html="language.icon"
      ></button>
    </li>
  </ul>

  <div class="tab-content row" id="attachImageContent">
    <div class="col-4 d-flex align-items-center justify-content-center">
      <img class="image" :src="image.url" :alt="altTitle.text" />
    </div>
    <div
      v-for="language in languages"
      :key="language.code"
      :class="currentTabLanguage === language.code ? 'show active' : ''"
      class="tab-pane fade col-8"
      :id="language.code"
      role="tabpanel"
      :aria-labelledby="`${language.code}-tab`"
    >
      <div class="mb-3">
        <label :for="`${language.code}-labelInput`" class="form-label">
          {{ translations.value_modal_label }} <span class="text-danger">*</span>
        </label>
        <input
          type="text"
          class="form-control"
          :id="`${language.code}-labelInput`"
          v-model="title.text"
          @blur="inputBlur"
        />
        <div class="form-text" v-text="translations.value_modal_label_description" />
      </div>
      <div class="mb-3">
        <label :for="`${language.code}-description`" class="form-label">
          {{ translations.value_modal_description }} <span class="text-danger">*</span>
        </label>
        <input
          type="text"
          class="form-control"
          :id="`${language.code}-description`"
          v-model="altTitle.text"
          @blur="inputBlur"
        />
        <div class="form-text" v-text="translations.value_modal_description_description" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Language, PageTranslations } from "../../../../scripts/downloads/types";
import { computed, ComputedRef, onMounted, onUpdated, ref } from "vue";
import { Image, ImageTitle } from "../../../../scripts/downloads/types";

export default {
  name: "AttachImageEditImage",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    languages: {
      required: true,
      type: Array as () => Language[],
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    image: {
      required: true,
      type: Object as () => Image,
    },
  },

  setup(props: any, { emit }: any) {
    const currentTabLanguage = ref(props.activeLanguage);

    const validState = new Map();

    const title: ComputedRef<ImageTitle> = computed(() => {
      return props.image.titles.find((item: any) => item.languageCode === currentTabLanguage.value) ?? null;
    });

    const altTitle: ComputedRef<ImageTitle> = computed(() => {
      return props.image.altTitles.find((item: any) => item.languageCode === currentTabLanguage.value) ?? null;
    });

    function labelFocus() {
      const labelInput = document.getElementById(`${currentTabLanguage.value}-labelInput`);

      if (labelInput) {
        labelInput.focus();
      }
    }

    function changeLanguageTab(code: string) {
      currentTabLanguage.value = code;
      setTimeout(labelFocus);
    }

    function checkValidState() {
      let valid: boolean = true;

      if (validState.size > 0) {
        validState.forEach((element) => {
          valid = valid && !!element;
        });
      } else {
        valid = false;
      }

      return valid;
    }

    function inputBlur(event: FocusEvent) {
      const element = event.currentTarget as HTMLInputElement;

      if (element.value.length > 0) {
        validState.set(element, true);
        element.classList.remove("is-invalid");
      } else {
        validState.set(element, false);
        element.classList.add("is-invalid");
      }

      emit("update-valid-state", checkValidState());
    }

    function validate() {
      validState.clear();

      props.languages.forEach((language: Language) => {
        validState.set(
          document.getElementById(language.code + "-labelInput"),
          props.image.titles.find((item: ImageTitle) => item.languageCode === language.code)?.text.length > 0
        );
        validState.set(
          document.getElementById(language.code + "-description"),
          props.image.altTitles.find((item: ImageTitle) => item.languageCode === language.code)?.text.length > 0
        );
      });

      emit("update-valid-state", checkValidState());
    }

    onMounted(() => {
      validate();
      labelFocus();
    });

    onUpdated(() => {
      validate();
    });

    return { title, altTitle, currentTabLanguage, changeLanguageTab, inputBlur, validState };
  },
};
</script>

<style lang="scss" scoped>
#attachImageContent {
  img {
    max-width: 140px;
  }
}
</style>
