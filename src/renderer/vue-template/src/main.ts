import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import { themeConfig } from '../config/primevue.config';

createApp(App).use(PrimeVue, themeConfig).mount('#app');
