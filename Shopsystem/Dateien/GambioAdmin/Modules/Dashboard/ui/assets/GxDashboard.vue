<template>
  <div id="message-stack">
    <div :key="key" v-for="(messageTypes, key) in messages">
      <div v-for="message in messageTypes">
        <div class="alert alert-dismissible fade show" :class="`alert-${key}`" v-if="!message.hidden" role="alert">
          <div v-html="message.message"></div>
          <a class="btn btn-sm btn-default" :href="message.link.url" v-if="message.link" v-html="message.link.text"></a>
          <button
            type="button"
            class="btn btn-sm btn-close"
            data-dismiss="alert"
            aria-label="Close"
            @click="dismissedHandler(message)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dashboard, { DashboardMessageResponse, dismissPayload, Message } from "./Dashboard";

export default defineComponent({
  name: " GxDashboard",
  data(): Dashboard {
    return {
      additionalClasses: [],
      messages: {},
      size: 0,
      customerId: null,
    };
  },

  mounted: function () {
    this.fetchMessageData();
  },

  methods: {
    async fetchMessageData(): Promise<void> {
      const urlParams: URLSearchParams = new URLSearchParams(window.location.search);

      let url = `${window.jsEnvironment.baseUrl}/admin/admin.php?do=SecurityCheckAjax/Messages`;

      const installerKey = "installerdeletionstatus";

      if (urlParams.has(installerKey)) {
        url += `&${installerKey}=${urlParams.get(installerKey)}`;
      }

      const response: Response = await fetch(url);

      if (!response.ok) {
        throw Error("Request failed");
      }

      const json = (await response.json()) as DashboardMessageResponse;
      this.setMessageData(json);
    },

    setMessageData(data: DashboardMessageResponse) {
      this.additionalClasses = data.additionalClasses;
      this.messages = data.messages;
      this.size = data.size;
      this.customerId = data.customer_id;
    },

    /**
     * @todo use new service once a new message stack has been created
     * @param {Message} message
     */
    async dismissedHandler(message: Message): Promise<void> {
      message.hidden = true;

      if (message.user_config_key.length > 0 && message.user_config_value.length > 0 && this.customerId !== null) {
        const url = `${window.jsEnvironment.baseUrl}/admin/admin.php?do=UserConfiguration/set`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: `userId=${this.customerId}&configurationKey=${message.user_config_key}&configurationValue=${message.user_config_value}`,
        });

        if (!response.ok) {
          throw Error("Could not update user configuration");
        }

        const payload: dismissPayload = await response.json();

        if (!payload.success) {
          throw Error("Could not update user configuration");
        }
      }
    },
  },
});
</script>

<style lang="scss">
#message-stack {
  .message-action-btn {
    margin-top: 0.5rem;
    text-transform: capitalize;
  }

  .alert {
    > .close {
      cursor: pointer;
    }

    > a {
      &.btn {
        margin: 12px 0 0;
        font-size: 0.8rem;
      }

      &.btn-default {
        color: #666;
        background-color: #f8f9fa;
        border-color: #f8f9fa;

        &:hover {
          background-color: #e2e6ea;
          border-color: #dae0e5;
        }
      }
    }
  }
}
</style>
