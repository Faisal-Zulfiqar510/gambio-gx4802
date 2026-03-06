<template>
  <section class="listing">
    <ul class="categories">
      <li
          v-for="(category, i) in data"
          class="category"
          :id="`category-${category.id}`"
          :key="i"
      >
        <h2 v-if="category.match" class="title">
          <span>{{ category.match.start }}</span><span class="match">{{
            category.match.match
          }}</span><span>{{ category.match.end }}</span>
        </h2>
        <h2 v-else v-text="category.label" class="title"></h2>

        <ul class="groups">
          <li
              v-for="(group, j) in category.groups"
              class="group"
              :key="`${i}-${j}`"
          >
            <h3 v-if="group.match" class="title">
              <span>{{ group.match.start }}</span><span class="match">{{
                group.match.match
              }}</span><span>{{ group.match.end }}</span>
            </h3>
            <h3 v-else v-text="group.label" class="title"></h3>

            <ul class="configurations">
              <li class="configuration link" v-for="(link, k) in group.links"
                  :key="`${i}-${j}-${k}-${k}`">
								
								<span v-if="link.match" class="label">
									<span class="matches">
										<span>{{ link.match.start }}</span><span class="match">{{
                      link.match.match
                    }}</span><span>{{ link.match.end }}</span>
									</span>
								</span>
                <span v-else class="label">
									{{ link.label }}
								</span>
                <div class="configuration-item">
                  <a
                      :href="prependBaseUrl(link.link)"
                      :target="link.newWindow ? '_blank' : '_self'"
                  >{{ link.buttonText }}</a>
                </div>
              </li>

              <li v-for="(configuration, k) in group.configurations"
                  @mouseenter="hovered = `${i}-${j}-${k}`"
                  @mouseleave="hovered = ''"
                  class="configuration"
                  :key="`${i}-${j}-${k}`"
                :data-title="configuration.label"
              >
								<span v-if="configuration.match" class="label">
									<span class="matches">
										<span>{{ configuration.match.start }}</span><span class="match">{{
                      configuration.match.match
                    }}</span><span>{{ configuration.match.end }}</span>
									</span>
								</span>
                <span v-else-if="configuration.hasMatch" class="label">
                  <span class="matches">
                    <span class="key-match" v-text="configuration.label"></span>
                  </span>
								</span>
                <span v-else v-text="configuration.label" class="label"></span>

                <GxConfigurationItem
                    :configuration="configuration"
                    :txt="txt"
                    @update="$emit('update', $event)"
                />

                <GxConfigurationTooltip
                    v-if="hovered === `${i}-${j}-${k}` && configuration.tooltip !== ''"
                    :configuration="configuration"
                />

              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </section>

  <Teleport to="body">
    <div class="gx-configuration-tooltip-contents">
    </div>
  </Teleport>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Category, Configuration, Group} from '../ConfigurationPage';
import GxConfigurationItem from './GxConfigurationItem.vue';
import GxConfigurationTooltip from './GxConfigurationTooltip.vue';

interface ListingData {
  lastCategoryId: string;
  hovered: string;
}

export default defineComponent({
  name: 'GxConfigurationListing',
  components: {
    GxConfigurationItem,
    GxConfigurationTooltip,
  },
  data(): ListingData {
    return {
      lastCategoryId: '',
      hovered: '',
    }
  },
  props: {
    listing: {
      type: Array,
      required: true,
    },
    category: {
      type: Object,
      required: true
    },
    disableScrollSpy: {
      type: Boolean,
      required: true,
    },
    txt: {
      type: Object,
      required: true
    }
  },
  computed: {
    data() {
      const categories = this.listing as Array<Category>;

      return categories.filter((category: Category) => {
        return category.visible;
      }).map((category: Category) => {
        const groups = category.groups ? category.groups.filter((group: Group) => {
          return group.visible;
        }).map((group: Group) => {
          const configurations = group.configurations
              .filter((configuration: Configuration) => configuration.visible);
          return {...group, configurations};
        }) : null;

        return {...category, groups};
      });
    }
  },
  watch: {
    category(category: Category): void {
      this.lastCategoryId = category.id;
    }
  },
  methods: {
    /**
     * Handles scroll event.
     * If the client clicked on a category and execute the element scrolling, this event handler
     * will be disabled for exactly one second.
     *
     * The handler checks if we scrolled into a new category section.
     * If so, an event is triggered to pick the right category.
     */
    handleScroll(): void {
      if (this.disableScrollSpy) {
        return;
      }

      const els = document.querySelectorAll('.listing .category')
      els.forEach((el) => {
        const categoryId = el.getAttribute('id') as string;
        const elTop = el.getBoundingClientRect().top
        const elBottom = el.getBoundingClientRect().bottom

        if (elTop <= 210 && elBottom >= 0 && this.lastCategoryId !== categoryId) {
          this.lastCategoryId = categoryId;
          this.$emit('scrolledToCategory', categoryId);
        }
      })
    },

    prependBaseUrl: (url: string) => `${window.jsEnvironment.baseUrl}/${url}`
  },
  mounted(): void {
    const container = document.querySelector('.listing-container');

    if (container) {
      container.addEventListener('scroll', this.handleScroll);
    }
  },
  unmounted(): void {
    const container = document.querySelector('.listing-container');

    if (container) {
      container.removeEventListener('scroll', this.handleScroll);
    }
  }
});
</script>

<style lang="scss" scoped>
@import "../styles/listing";
</style>
