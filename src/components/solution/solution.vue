<template>
<!--  <div class="goods">
      <list>
          <list-item slot="list-item"></list-item>
      </list>
  </div>-->
  <div class="goods">
    <list :options="options" :beforeSendData="beforeSendData">
      <template slot="list-item" scope="props">
          <list-item slot="list-item" :items="props.items" :who="props.who"></list-item>
      </template>
    </list>
  </div>
</template>

<script>

import $ from 'jquery';
import list from '../common/list.vue';
import listItem from '../solution/list-item.vue';

export default {
  name: 'solution',
  data(){
    return{
      options:{},
      beforeSendData:function() {

      }
    }
  },
  components:{
    list,
    listItem
  },
  created(){

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

body, html{
  height:100%;
}

body{
  overflow: hidden;
}

#app{
  height: 100%;
}

.goods{
  height: 100%;
}

#scroll{
  height: 100%;
  overflow: scroll;
}

</style>
