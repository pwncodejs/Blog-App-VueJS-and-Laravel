import './bootstrap';

import { createPinia } from "pinia";
import route from "./router";
import App from "./App.vue";
import { createApp } from "vue";
import piniaPersist from 'pinia-plugin-persist'

const app = createApp(App);

const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia);
app.use(route);

app.mount("#app");
