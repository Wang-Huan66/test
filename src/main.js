import { createApp } from "vue";

import pinia from "@/stores/store"
import "./index.css";
import App from "./App.vue";
import router from "./router";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import './server/mock'
const app = createApp(App);
app.use(pinia).use(router).use(ArcoVue).use(ArcoVueIcon).mount("#app");
