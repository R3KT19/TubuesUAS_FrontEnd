import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import router from "./router";
import axios from 'axios';

Vue.config.productionTip = false;

Vue.prototype.$http= axios; // code standar untuk menggunakan axios
Vue.prototype.$api='https://apipaw.batararaja.com/api'; // link backend
                      
                     
new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');