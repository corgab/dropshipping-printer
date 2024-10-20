import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './routes';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; // js

createApp(App).use(router).mount('#app');
