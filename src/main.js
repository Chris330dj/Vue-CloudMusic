import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import './common/styles/index.styl'
import pinyin from 'js-pinyin'

/* eslint-disable no-used-vars */
// 规避es6语法检查
// import VConsole from 'vconsole'
// var vConsole = new VConsole();
// console.log('test')

fastclick.attach(document.body);

Vue.use(VueLazyLoad, {
    loading: require('common/images/default.png')
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})