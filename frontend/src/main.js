import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App)
    // 把Router安装到Vue应用里
    .use(router)
    .mount('#app')
