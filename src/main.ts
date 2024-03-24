import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import router from './router/index.ts';
import './style.css';
import App from './App.vue';

createApp(App).use(router).use(TDesign).mount('#app');
