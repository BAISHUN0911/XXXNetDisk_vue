import Vue from 'vue'
import App from './App.vue'
import router from './router'     //引入router文件夹
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./router/before";
import uploader from 'vue-simple-uploader'
import all from '@/libs/globalFunction'

Vue.use(ElementUI);
Vue.use(uploader);
Vue.use(all);

Vue.config.productionTip = false

new Vue({
  router,       //使用
  store,
  render: h => h(App)
}).$mount('#app')
