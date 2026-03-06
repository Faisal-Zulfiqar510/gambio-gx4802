import {createApp} from 'vue';
// import { TooltipPlugin } from 'bootstrap-vue';
import GxConfiguration from './GxConfiguration.vue';

import './styles/dependencies.scss';

const app = createApp(GxConfiguration);
app.mount('.gx-vue');
