<template>
  <div id="app">

    <tab>
      <tab-item selected>
        <router-link to="/goods" class="router-tap">维修案例展示</router-link>
      </tab-item>
      <tab-item>
        <router-link to="/solution" class="router-tap">常见问题自助解决</router-link>
      </tab-item>
      <tab-item>
        <router-link to="/seller" class="router-tap">吴师傅</router-link>
      </tab-item>
    </tab>
    <router-view @hello="hear"></router-view>

    <login-dialog :loginDialogShow="loginDialogShow"></login-dialog>

  </div>
</template>

<script>

import { Tab, TabItem } from 'vux'
import loginDialog from './components/common/login.vue'

export default {

  components:{
    Tab,
    TabItem,
    loginDialog
  },
  data(){
    return{
      loginDialogShow: false
    }
  },
  methods:{
    hear(){
      console.log("child say hello to parent");
    }
  },
  mounted(){
    this.$on("hello", ()=>{
      console.log("hear hello on mounted");
    });
  },
  name: 'app'

}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}

.router-tap{
  display: block;
  width: 100%;
  height: 100%;
}

</style>
