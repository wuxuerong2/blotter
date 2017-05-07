// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import FastClick from 'fastclick'
import store from './store/index.js'
import VueRouter from 'vue-router'
import App from './App'

//组件引入
import Home from './components/HelloFromVux'
import goods from './components/goods'
const solution = resolve => require.ensure([],() => resolve(require("./components/solution/solution")), "/solution");


import seller from './components/seller'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: Home
},{
  path: '/goods',
  component: goods
}, {
  path: '/solution',
  component: solution
}, {
  path: '/seller',
  component: seller,
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  }
}]

const router = new VueRouter({
    routes
})

router.beforeEach( (to, from, next)=>{

  //路由不需要验证
  if( !to.meta.requireAuth ){
    next();
    return;
  }

  let token = store.state.common.token;

  //判断token是否过期，距离上次更新token是否在5分钟内
  if( (new Date()).getTime() - token >  300000 ){

      store.state.common.loginDialogShow = true;
      store.state.common.previousUrl = to.path;

  }else{
      next();
  }

});

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
let app = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')
