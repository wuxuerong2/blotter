<template>

  <popup v-model="loginDialogShowGetter" height="100%">
    <group label-width="4.5em" label-margin-right="2em" label-align="right">
      <x-input placeholder="用户名" v-model="account"  v-vld="account" rules='[{"rule":"length","options":{"min":3,"max":10}}]' field="account"></x-input>
      <x-input title="密码" type="password" placeholder="必填" v-model="password" v-vld="password" rules='["require","numberOnly"]' field="password"></x-input>
      <x-input title="确认密码" type="password" placeholder="必填" v-model="confirm" v-vld="confirm" rules='["equal"]' field="confirm" :equal="password"></x-input>
    </group>
    <x-button type="primary" @click.native="login">登陆</x-button>
    <p>密码有误{{errors.has("password")}}</p>
    <p>账号有误{{errors.has("account")}}</p>
    <p>两次输入密码不对{{errors.has("confirm")}}</p>
    <p>{{errors.value}}</p>
  </popup>

</template>

<script>

import Vue from 'vue'
import { Popup,Group,XInput,XButton } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import vld from '../../directive/validate.js'


Vue.use(vld);


export default {
  name: "loginDialog",
  data(){
    return{
      password:"",
      account:"",
      confirm:""
    }
  },
  components:{
    Popup,
    Group,
    XInput,
    XButton
  },
  computed:{
    ...mapGetters([
        'loginDialogShowGetter'
    ])
  },
  methods:{
    login(){
        this.authorityAction((new Date()).getTime());
        this.loginDialogShowAction(false);
        this.$router.push({ path: this.previousUrlGetter() })
    },
    ...mapActions([
      'authorityAction',
      'loginDialogShowAction',
    ]),
  ...mapGetters([
      'previousUrlGetter'
    ])
  },
  mounted(){

  }
}

</script>

<style>
</style>
