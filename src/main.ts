import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import router from './router/index.ts';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';

const pinia = createPinia();

createApp(App).use(router).use(pinia).use(TDesign).mount('#app');
