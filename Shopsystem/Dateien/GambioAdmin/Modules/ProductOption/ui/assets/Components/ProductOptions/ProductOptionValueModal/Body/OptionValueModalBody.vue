<template>
  <div class="modal-body">
    <form action="" method="post">
      <ul class="nav nav-tabs mb-3" id="editValueTab" role="tablist">
        <li v-for="(language, index) in languages" :key="language" class="nav-item" role="presentation">
          <button
              :id="`${language.code}-value-tab`"
              :class="index === 0 ? 'active' : ''"
              :data-bs-target="`#${language.code}-value-content`"
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

      <div class="tab-content" id="editValueContent">
        <div
            v-for="(language, index) in languages"
            :key="language.code"
            :class="index === 0 ? 'show active' : ''"
            class="tab-pane fade"
            :id="`${language.code}-value-content`"
            role="tabpanel"
            :aria-labelledby="`${language.code}-value-tab`"
        >
          <div class="mb-3">
            <label
                :for="`${language.code}-labelValueInput`"
                class="form-label"
                v-text="translations.value_modal_label"
            ></label>
            <input type="text" class="form-control" :id="`${language.code}-labelValueInput`" v-model="detail.label"/>
            <div class="form-text" v-text="translations.value_modal_label_description"></div>
          </div>

          <div class="mb-3">
            <label
                :for="`${language.code}-value-description`"
                class="form-label"
                v-text="translations.value_modal_description"
            ></label>
            <textarea
                class="form-control"
                :id="`${language.code}-value-description`"
                v-model="detail.description"
            ></textarea>
            <div class="form-text" v-text="translations.value_modal_description_description"></div>
          </div>
        </div>
      </div>

      <hr/>

      <label for="image" class="form-label" v-text="translations.value_modal_image"></label>
      <div class="row g-2 mb-3">
        <div class="col-4">
          <img
              :src="
              optionValue.image
                ? `../images/product_images/option_images/${optionValue.image}`
                : '../GambioAdmin/Modules/Option/ui/assets/Images/invalid_image.png'
            "
              alt=""
              class="img-thumbnail"
          />
        </div>
        <div class="col-8">
          <div
              class="border rounded fst-italic py-1 px-2 mb-2"
              v-text="optionValue.image || translations.value_modal_image_no_file_selected"
          ></div>
          <button
              id="image"
              type="button"
              class="btn btn-success btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#responseFileManagerModal"
              v-text="translations.value_modal_image_select"
          ></button>
          <button type="button" class="btn btn-danger btn-sm ms-2" v-if="optionValue.image" @click="deleteImage">
            <i class="fa fa-remove"></i>
          </button>
          <div class="form-text mt-2 mb-0">
            {{
              optionValue.image ? translations.value_modal_image_selected : translations.value_modal_image_description
            }}
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-6 mb-3">
          <label for="modelNumber" class="form-label" v-text="translations.value_modal_model_number"></label>
          <input type="text" class="form-control" id="modelNumber" v-model="optionValue.modelNumber"/>
          <div class="form-text" v-text="translations.value_modal_model_number"></div>
        </div>

        <div class="col-6 mb-3">
          <label for="stock" class="form-label" v-text="translations.value_modal_stock"></label>
          <input type="number" class="form-control" id="stock" v-model="optionValue.stock"/>
          <div class="form-text" v-text="translations.value_modal_stock_description"></div>
        </div>
      </div>

      <div class="row">
        <div class="col-6 mb-3">
          <label for="weight" class="form-label" v-text="translations.value_modal_weight"></label>
          <div class="input-group">
            <input type="text" class="form-control text-end" id="weight" v-model="optionValue.weight"/>
            <span class="input-group-text">kg</span>
          </div>
          <div class="form-text" v-text="translations.value_modal_weight_description"></div>
        </div>

        <div class="col-6 mb-3">
          <label for="price" class="form-label">
            {{ isGrossAdminActive ? translations.value_modal_gross_price : translations.value_modal_net_price }}
          </label>
          <div class="input-group">
            <input type="text" class="form-control text-end" id="price" v-model="optionValue.price"/>
            <span class="input-group-text">&euro;</span>
          </div>
          <div class="form-text">
            {{ isGrossAdminActive ? translations.value_modal_gross_price : translations.value_modal_net_price }}
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {computed, ref} from "vue";
import {
  Languages,
  OptionValue,
  PageTranslations,
  ResponsiveFileManagerFile,
} from "../../../../scripts/productOptions/types";

export default {
  name: "OptionValueModalBody",

  props: {
    language: {
      required: true,
      type: Object as () => Languages,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    option: {
      required: false,
      type: Object as () => OptionValue,
      default: {},
    },
    responsiveFileManagerFile: {
      required: false,
      type: Object as () => ResponsiveFileManagerFile,
      default: {},
    },
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
  },

  setup(props: any, {emit}: any) {
    let currentTabLanguage = ref(props.languages[0].code);

    const detail = computed(() => {
      return props.option.values[0].details.find((item: any) => item.languageCode === currentTabLanguage.value) ?? null;
    });

    const optionValue = computed(() => props.option.values[0]);

    const changeLanguageTab = (code: string) => (currentTabLanguage.value = code);

    const deleteImage = () => {
      props.option.values[0].image = "";
      emit("imageDeleted");
    };

    return {detail, optionValue, currentTabLanguage, changeLanguageTab, deleteImage};
  },
};
</script>

<style scoped></style>
