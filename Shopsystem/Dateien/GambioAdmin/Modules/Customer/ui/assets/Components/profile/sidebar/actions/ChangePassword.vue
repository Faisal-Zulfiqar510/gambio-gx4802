<template>
  <Modal
    id="change-password"
    :active="isChanging"
    :is-saving="loading"
    v-on:close:modal="handleOnClose"
    @save="savePassword">
    <template #title>
      {{ translations.profile_change_password }}
    </template>
    <template #content>
      <label for="password" class="form-label">{{ translations.profile_new_password }} <span class="text-danger">*</span></label>
      <div class="input-group">
        <input
          v-model="newPassword"
          :type="visibility ? 'text' : 'password'"
          id="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          :placeholder="translations.profile_password"
          :aria-label="translations.profile_password"
          aria-describedby="view-password"
          autocomplete="off" />
        <button
          :title="!visibility ? translations.profile_password_show : translations.profile_password_hide"
          @click="visibility = !visibility"
          class="btn btn-outline-primary"
          id="view-password"
          type="button">
          <i class="fa" :class="visibility ? 'fa-eye-slash' : 'fa-eye'" aria-hidden="true"></i>
        </button>
        <button
          :title="translations.profile_password_generate"
          @click="generatePassword"
          class="btn btn-outline-primary"
          id="generate-password"
          type="button">
          <i class="fa fa-repeat" aria-hidden="true"></i>
        </button>
      </div>
      <div :class="{ 'd-block': errors.password }" id="view-password-feedback" class="invalid-feedback" v-text="errors.password"></div>
    </template>
  </Modal>
</template>

<script>
import {defineComponent, onMounted, reactive, ref, toRefs} from "vue";
import Modal from "../../../shared/Modal.vue";
import CustomerId from "../../../../../services/model/CustomerId";
import changeCustomerPassword from "../../../../../services/use-cases/changeCustomerPassword";
import InfoBox from "core/InfoBox";
import {configurations, TOGGLE_LOADING_EVENT, translations} from "../../../../scripts/data";

export default defineComponent({
  name: "ChangePassword",
  components: {
    Modal,
  },
  props: {
    customerId: Number,
    isChanging: Boolean,
    loading: Boolean
  },
  setup(props, {emit}) {
    const validationErrors = reactive({
      hasErrors: false,
      errors: {}
    });

    const visibility = ref(false);
    const newPassword = ref('');

    const generatePassword = () => {
      let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let passwordLength = 12;
      let password = "";

      for (let i = 0; i <= passwordLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber +1);
      }

      newPassword.value = password;
      visibility.value = true;
    }

    const customerId = new CustomerId(props.customerId);
    async function savePassword() {
      emit(TOGGLE_LOADING_EVENT, true);

      validate(newPassword.value);

      if (!validationErrors.hasErrors) {

        await changeCustomerPassword(customerId, newPassword.value);

        emit('toggle:change-password');

        (InfoBox.create()).notifySuccess();

        emit('update:customer');
      }

      emit(TOGGLE_LOADING_EVENT, false);
    }

    function validate(password) {
      validationErrors.errors = {};

      if (!password.length) {
        validationErrors.errors['password'] = translations.profile_error_password_empty;
      }

      validationErrors.hasErrors = Object.keys(validationErrors.errors).length !== 0;
    }

    onMounted(() => {
      generatePassword();
    });

    function handleOnClose() {
      emit('toggle:change-password');
      generatePassword();
    }

    return { visibility, newPassword, ...toRefs(validationErrors), generatePassword, savePassword, handleOnClose, translations };
  }
});
</script>

<style lang="scss" scoped>
.btn-star {
  .fa {
    &-star {
      display: none;
      color: #fdc300;
     }
  }

  &:hover {
    .fa {
      &-star-o {
        display: inline-block;
        color: #fdc300;
      }
    }
  }

  &.is-starred {
    text-shadow: 0 0 1px rgba(#000, .2);
    .fa {
      &-star {
        display: inline-block;
      }
      &-star-o {
        display: none;
      }
    }
  }
}
</style>