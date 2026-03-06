import {createApp} from 'vue';
import GxDashboard from './GxDashboard.vue';

import './styles.scss';
import './styles/dependencies.scss';

const app = createApp(GxDashboard);
app.mount('.gx-vue-dashboard');