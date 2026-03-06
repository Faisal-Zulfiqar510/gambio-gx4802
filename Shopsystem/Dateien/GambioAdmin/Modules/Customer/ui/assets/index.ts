import { createApp } from "vue";
import Overview from "./Components/Overview.vue";
import Profile from "./Components/Profile.vue";

import "./styles/dependencies.scss";
import "./styles.scss";

createApp(Overview).mount("#overview");
createApp(Profile).mount("#profile");
