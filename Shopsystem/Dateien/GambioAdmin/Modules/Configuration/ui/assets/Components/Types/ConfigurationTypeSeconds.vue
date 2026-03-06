<template>
  <div class="seconds-input">
    <input @input="update" v-model.number="daysInput" v-if="showDays" type="number" min="0">
    <span class="delimiter">:</span>
    <input @input="update" v-model.number="hoursInput" v-if="showHours" type="number" min="0" max="23">
    <span class="delimiter">:</span>
    <input @input="update" v-model.number="minutesInput" v-if="showMinutes" type="number" min="0" max="59">
    <span class="delimiter">:</span>
    <input @input="update" v-model.number="secondsInput" type="number" min="0" max="59">
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'ConfigurationTypeDropdown',
  data() {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  },
  props: {
    configuration: {
      type: Object,
      required: true,
    }
  },
  computed: {
    showDays(): boolean {
      return this.isDaysType();
    },
    showHours(): boolean {
      return this.isDaysType() || this.isHoursType();
    },
    showMinutes(): boolean {
      return this.isDaysType() || this.isHoursType() || this.isMinutesType();
    },
    secs(): number {
      return parseInt(this.configuration.value, 10);
    },
    daysInput: {
      get: function() {
        return this.getDays();
      },
      set: function(newValue: number) {
        this.days = newValue;
      }
    },
    hoursInput: {
      get: function() {
        return this.getHours();
      },
      set: function(newValue: number) {
        this.hours = newValue;
      }
    },
    minutesInput: {
      get: function() {
        return this.getMinutes();
      },
      set: function(newValue: number) {
        this.minutes = newValue;
      }
    },
    secondsInput: {
      get: function() {
        return this.getSeconds();
      },
      set: function(newValue: number) {
        this.seconds = newValue;
      }
    }
  },
  methods: {
    update(): void {
      let seconds = this.seconds;
      seconds += this.minutes * 60;
      seconds += this.hours * 60 * 60;
      seconds += this.days * 60 * 60 * 24;

      this.$emit('update', {
        key: this.configuration.key,
        value: seconds
      })
    },
    isDaysType(): boolean {
      return this.configuration.type.params.interval === 'days';
    },
    isHoursType(): boolean {
      return this.configuration.type.params.interval === 'hours';
    },
    isMinutesType(): boolean {
      return this.configuration.type.params.interval === 'minutes';
    },
    getDays(): number {
      if (this.isDaysType()) {
        return Math.floor(this.secs / (3600 * 24));
      }

      return 0;
    },
    getHours(): number {
      if (this.isDaysType()) {
        return Math.floor(this.secs % (3600 * 24) / 3600);
      }

      if (this.isHoursType()) {
        return Math.floor(this.secs / 3600);
      }

      return 0;
    },
    getMinutes(): number {
      if (this.isDaysType()) {
        return Math.floor(this.secs % 3600 / 60);
      }

      if (this.isHoursType()) {
        const hours = Math.floor(this.secs / 3600);
        return Math.floor((this.secs - (hours * 3600)) / 60);
      }

      if (this.isMinutesType()) {
        return Math.floor(this.secs / 60);
      }

      return 0;
    },
    getSeconds(): number {
      if (this.isDaysType()) {
        return Math.floor(this.secs % 60);
      }

      if (this.isHoursType()) {
        const hours = Math.floor(this.secs / 3600);
        const minutes = Math.floor((this.secs - (hours * 3600)) / 60);
        return this.secs - (hours * 3600) - (minutes * 60);
      }

      if (this.isMinutesType()) {
        const minutes = Math.floor(this.secs / 60);
        return this.secs - minutes * 60;
      }

      return this.secs;
    }
  },
  mounted(): void {
    this.days = this.getDays();
    this.hours = this.getHours();
    this.minutes = this.getMinutes();
    this.seconds = this.getSeconds();
  }
});
</script>

<style lang="scss" scoped>
@import "input";

.seconds-input {
  display: flex;
  width: 100%;

  input {
    width: 17%;
    flex: 1 1 auto;
  }

  .delimiter {
    width: 4%;
    margin: auto;
    flex: 1 1 auto;
    text-align: center;
  }
}
</style>
