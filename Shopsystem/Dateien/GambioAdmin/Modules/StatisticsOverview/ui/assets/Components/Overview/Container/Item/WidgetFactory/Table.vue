<template>
  <table class="table table-hover table-bordered table-responsive-sm">
    <thead>
    <tr>
      <th v-for="column in columns">
        <div>
          {{ column.label }}
        </div>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row in widget.data.rows">
      <td v-for="column in columns">
          <span>
            {{ row[column.field] }}
          </span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {TableData, Widget} from "../../../../../scripts/overview/type";

async function objectHash(object: object): Promise<string> {
  const json = JSON.stringify(object);
  const encodedJson = new TextEncoder().encode(json);
  const encodedHash = await crypto.subtle.digest("SHA-256", encodedJson);
  const encodedHashView = new Uint8Array(encodedHash);

  return Array.from(encodedHashView).map(character => character.toString(16).padStart(2, "0")).join("");
}

export default defineComponent({
  name: "Table",

  props: {
    widget: {
      required: true,
      type: Object as () => Widget,
    }
  },

  setup(props) {
    return {
      columns: computed(() =>
          (props.widget.data as TableData).columns.map(({title: label, field}) => ({
            label,
            field,
          }))
      ),
      key: computed(async () => {
        return await objectHash(props.widget.data);
      }),
    };
  },
});
</script>

<style lang="scss" scoped>
.table {
  margin: 0;
  border: none;
  border-collapse: collapse;
  text-align: left;
  width: 100%;
}

thead tr th {
  white-space: nowrap;
  background: #FFFFFF;
  color: #333333;
  border: none;
  border-bottom: 3px solid #000000;
  padding: 12px;
  width: auto;

  .asc {
    background: none;
  }
}

tbody {
  > :nth-child(even) {
    background: #EFEFEF;
  }

  tr {
    border: none;

    td {
      white-space: nowrap;
      border: none;
      padding: 12px;
    }
  }
}

.row {
  margin: 0;

  &:last-child {
    display: none;
  }
}
</style>