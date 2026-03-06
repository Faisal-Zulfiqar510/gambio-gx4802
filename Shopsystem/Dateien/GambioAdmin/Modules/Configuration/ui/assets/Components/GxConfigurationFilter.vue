<template>
  <section class="filter">
    <div class="categories">
      <h2 class="title" v-text="txt.categories"></h2>
      <ul class="list">
        <li
            class="item"
            v-for="cat in categories"
            :class="{ selected: isSelected(cat) }"
            @click="selectCategory(cat)"
            :key="cat.id"
        >
					<span v-if="cat.match">
						<span>{{ cat.match.start }}</span><span class="match">{{ cat.match.match }}</span><span>{{
              cat.match.end
            }}</span>
					</span>
          <span v-else>{{ cat.label }}</span>
        </li>
      </ul>
    </div>

    <!--		<div class="tags">-->
    <!--			<h2 class="title" v-text="txt.tags"></h2>-->
    <!--			<ul class="list">-->
    <!--				<li-->
    <!--					class="item"-->
    <!--					v-for="tag in tags"-->
    <!--					v-text="tag.label"-->
    <!--					:class="{ active: selected.tags.includes(tag.id) }"-->
    <!--					@click="toggleTag(tag.id)"-->
    <!--					:key="tag.id"-->
    <!--				></li>-->
    <!--			</ul>-->
    <!--		</div>-->
  </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Category} from '../ConfigurationPage';
import {scrollContainer} from "../configuration_helper";

interface FilterData {
  selected: {
    tags: string[];
  };
}

export default defineComponent({
  name: 'GxConfigurationFilter',

  data(): FilterData {
    return {
      selected: {
        tags: []
      }
    };
  },

  props: {
    listing: {
      type: Array,
      required: true
    },
    tags: {
      type: Array,
      required: true
    },
    category: {
      type: Object,
      required: true
    },
    txt: {
      type: Object,
      required: true,
    }
  },

  computed: {
    categories(): Array<Category> {
      const categories = this.listing as Array<Category>;

      return categories.filter((category: Category) => category.visible);
    }
  },

  methods: {
    isSelected(category: Category): boolean {
      return this.category.id === category.id;
    },
    async selectCategory(category: Category): Promise<void> {
      this.$emit('categorySelected', category);
      const element = document.getElementById(`category-${category.id}`);
      const container = document.querySelector('.listing-container');

      if (element && container) {
        this.$emit('disableScrollSpy');
        await scrollContainer(container as HTMLElement, element as HTMLElement, 500);
        this.$emit('enableScrollSpy');
      }
    },
    toggleTag(tagId: string): void {
      const index = this.selected.tags.indexOf(tagId);

      if (index !== -1) {
        this.selected.tags.splice(index, 1);
      } else {
        this.selected.tags.push(tagId);
      }

      this.$emit("updateTags", this.selected.tags);
    },
  }
});
</script>

<style lang="scss" scoped>
@import "../styles/filter";
</style>
