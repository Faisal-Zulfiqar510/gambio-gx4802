<template>
  <div class="configuration-page-container" :style="pageStyles">
    <div class="configuration-page">
      <div class="page-title">
        <h1 class="title" v-text="txt.title"></h1>
      </div>
      <div class="search-container">
        <GxConfigurationSearch
            :txt="txt"
            @query="updateSearchQuery"
        />
      </div>
      <div class="filter-container" v-if="!isLoading">
        <GxConfigurationFilter
            :listing="listing"
            :tags="tags"
            :category="category"
            :txt="txt"
            @disableScrollSpy="disableScrollSpy = true"
            @enableScrollSpy="disableScrollSpy = false"
            @updateTags="updateTags"
            @categorySelected="updateCurrentCategory"
        />
      </div>
      <div class="listing-container" v-if="!isLoading">
        <GxConfigurationListing
            :listing="listing"
            :category="category"
            :disable-scroll-spy="disableScrollSpy"
            :txt="txt"
            @scrolledToCategory="updateCurrentCategoryById"
            @update="trackChanges"
        />
      </div>
      <div v-else class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
    </div>

    <Teleport to=".bottom-save-bar">
      <button class="btn btn-primary"
              :disabled="noChanges"
              @click="save">{{ txt.save }}
      </button>
    </Teleport>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import GxConfigurationSearch from './Components/GxConfigurationSearch.vue';
import GxConfigurationFilter from './Components/GxConfigurationFilter.vue';
import GxConfigurationListing from './Components/GxConfigurationListing.vue';
import ConfigurationPage, {Category, ConfigItem, Configuration, Group, Link, PageFilter} from './ConfigurationPage';
import {
  configKeyMatches,
  containsValidConfig,
  getDeepCopy,
  searchAndTagFilter,
  showCategory,
  showConfiguration,
  showGroup, showLink,
  tagFilter
} from './configuration_helper';
import {MENU_TOGGLED} from 'layout/events';
import InfoBox from 'core/InfoBox';

const infoBox = InfoBox.create();

export default defineComponent({
  name: 'GxConfiguration',
  components: {
    GxConfigurationSearch,
    GxConfigurationFilter,
    GxConfigurationListing,
  },
  data(): ConfigurationPage {
    return {
      isLoading: false,
      tags: [],
      data: [],

      filter: {
        searchQuery: '',
        tags: []
      },
      changes: {},
      category: {},
      disableScrollSpy: false,
      txt: window.jsEnvironment.vuePage.translations,

      pageStyles: {
        width: '0',
        height: '0',
      }
    }
  },
  computed: {
    noChanges(): boolean {
      return Object.keys(this.changes).length === 0 || !containsValidConfig(this.changes);
    },
    searchQuery(): string {
      return this.filter.searchQuery.toLowerCase();
    },
    listing(): Array<Category> {
      const isEmptySearch = this.searchQuery === '';
      const filter = isEmptySearch
          ? tagFilter(this.filter.tags)
          : searchAndTagFilter(this.searchQuery, this.filter.tags);

      return this.listingFilter(filter);
    },
  },
  methods: {
    /**
     * Filters the data set based on the given filter.
     */
    listingFilter(filter: PageFilter): Array<Category> {
      const copy = getDeepCopy(this.data);

      copy.forEach((category: Category) => {
        if (filter.validate(category)) {
          showCategory(category);
        }

        category.groups.forEach((group: Group) => {
          if (filter.validate(group)) {
            showGroup(group);
          }

          group.links.forEach((link: Link) => {
            if (filter.validate(link)) {
              showLink(link);
            }
          });

          group.configurations.forEach((configuration: Configuration) => {
            if (filter.validate(configuration) || (window.jsEnvironment.environment === 'development'
                && configKeyMatches(configuration, this.searchQuery))) {
              showConfiguration(configuration);
            }
          });
        });
      });

      return copy;
    },

    async save(): Promise<void> {
      const url = `${window.jsEnvironment.baseUrl}/admin/api/configurations`;
      const body = new FormData;

      for (let key in this.changes) {
        const configValue = this.changes[key];
        if (configValue !== null) {
          const value = typeof configValue === 'boolean' ? configValue.toString() : configValue;

          if (typeof value === 'object') {
            for (const [languageCode, languageValue] of Object.entries(value)) {
              body.append(`configurations[${key}][${languageCode}]`, languageValue as string);
            }
          } else {
            body.append(`configurations[${key}]`, value);
          }
        }
      }
      const response = await fetch(url, {
        method: 'post',
        body
      });
      if (!response.ok) {
        const failed = `Request failed (${response.statusText} - ${response.status})`;
        const msg = `${failed}. Could not save configurations.`
        throw new Error(msg);
      }

      infoBox.notifySuccess();
      this.changes = {};
    },
    updateSearchQuery(query: string): void {
      this.filter.searchQuery = query;
    },
    updateTags(tags: string[]): void {
      this.filter.tags = tags;
    },
    updateCurrentCategory(category: Category): void {
      this.category = category;
    },
    updateCurrentCategoryById(categoryId: string): void {
      this.listing.forEach((category: Category) => {
        if (category.id === categoryId.substring(9)) {
          this.updateCurrentCategory(category);
        }
      });
    },
    trackChanges(item: ConfigItem): void {
      this.changes[item.key] = item.value;
    },
    resize(): void {
      const container = document.getElementById('gx-main');
      if (container) {
        this.pageStyles.height = container.offsetHeight + 'px';
        this.pageStyles.width = container.offsetWidth + 'px';
      }
    },
    async fetch(): Promise<void> {
      this.isLoading = true;
      const url = `${window.jsEnvironment.baseUrl}/admin/configurations/data`;
      const response = await fetch(url);
      const json = await response.json();

      this.tags = json.tags;
      this.data = json.data;
      this.isLoading = false;
    }
  },

  async mounted(): Promise<void> {
    this.resize();
    window.addEventListener(MENU_TOGGLED, this.resize);
    window.addEventListener('resize', this.resize);

    await this.fetch();
  },
  beforeUnmount() {
    window.removeEventListener(MENU_TOGGLED, this.resize);
  }
});
</script>

<style lang="scss" scoped>
@import "styles/page";

button.btn-primary {
  background-color: $gambio-blue;
  border-color: #000609;
  color: #FFFFFF;
  display: inline-block;
  margin-bottom: 0;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 12px;
  line-height: 1.42857;
  border-radius: 2px;
  user-select: none;

  &:disabled {
    cursor: not-allowed;
    filter: alpha(opacity=65);
    opacity: 0.65;
    box-shadow: none;
  }
}
</style>
