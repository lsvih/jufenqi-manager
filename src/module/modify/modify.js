import Vue from 'vue'
import App from './app'
import vueTap from 'v-tap'

Vue.use(vueTap)

Vue.filter('num2str',{
  read:function(e){
    return String(e)
  },
  write:function(e){
    return Number(e)
  }
})
/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
