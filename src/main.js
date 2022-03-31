import { createApp, reactive, ref } from "vue";
import App from "./App.vue";
import router from "./router/index";
import http from "./plugins/index";

import "./assets/css/normalize.css";
import "./assets/css/base.less";

// 导入字体图片样式
import "./assets/fonts/iconfont.css";

const app = createApp(App);
const recents = reactive(JSON.parse(localStorage.getItem("recents")) || []);
const user = reactive(JSON.parse(localStorage.getItem("user")))
app.use(router);
app.use(http);
app.mount("#index");
app.provide("recents", recents);
app.provide("user", user);
