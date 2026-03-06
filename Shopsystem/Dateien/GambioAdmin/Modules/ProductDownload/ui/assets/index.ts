import { createApp } from "vue";
import ProductDownloads from "./Components/ProductDownloads.vue";

import "./styles.scss";
import "./styles/dependencies.scss";

const app = createApp(ProductDownloads);
app.mount(".gx-vue-downloads");
