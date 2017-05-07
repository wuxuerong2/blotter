<template>
  <div class="goods">

    <blotter
      :columnOpions="blotterOptions.columnOptions"
      :tableData="blotterOptions.tableData"
      :quickFilterOption ="blotterOptions.quickFilterOption"
      :quickFilterData = "blotterOptions.quickFilterData"
      :orderOptions = "blotterOptions.orderOptions"
    >
    </blotter>

    <div>
      <p>quick filter:</p>
      <span>Filter name:</span><input v-model="blotterOptions.quickFilterData.subname">
      <span>Filter age:</span><input v-model="blotterOptions.quickFilterData.subage">
    </div>

    <div>
      <p>order by:</p>
      <button @click="orderByName">Order by name</button>
      <button @click="orderByAge">Order by age</button>
    </div>

    <div>
      <p>update data</p>
      <button @click="updateData">update</button>
    </div>


  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import blotter from '@/components/common/blotter.vue'
/*import VeeValidate from 'vee-validate'

Vue.use(VeeValidate);*/
let COLUMN_OPTION = [

  {
    headTitle:"name",
    type:"DATA",
    field:"name",
    order: true
  },
  {
    headTitle:"CONTEXT_BTN",
    type:"CONTEXT_BTN",
    field:""
  },
  {
    headTitle:"age",
    type:"DATA",
    field:"age",
    order: true
  },
  {
    headTitle:"SELECT",
    type:"SELECT",
    field:"sex",
    options:[
      {
        value: "M",
        text: "Male"
      },
      {
        value: "F",
        text: "Female"
      },
      {
        value: "ALL",
        text: "All"
      }
    ]
  },
  {
    headTitle:"SELECT_GROUP",
    type:"SELECT_GROUP",
    field:"class"
  },
  {
    headTitle:"SELECT_GROUP_MULT",
    type:"SELECT_GROUP_MULT",
    field:"grade"
  },
  {
    headTitle:"SELECT_GROUP_MULT",
    type:"SELECT_GROUP_MULT",
    field:"habit"
  }
];


export default {
  name: 'goods',
  components:{
    blotter
  },
  data: function(){

    return{
      subname:"",
      blotterOptions:{
        columnOptions: COLUMN_OPTION,
        tableData:[],
        quickFilterOption:[
          {
            type: "PART_MATCH",
            field: "name",
            match: "subname"
          },
          {
            type: "FULL_MATCH",
            field: "age",
            match: "subage"
          }
        ],
        quickFilterData:{
          subname:"",
          subage:""
        },
        orderOptions:[
          {
            field:"name",
            order: "des",
            enable: "false"
          },
          {
            field:"age",
            order: "des",
            enable: "false"
          }
        ]
      }
    }
  },
  mounted:function(){

    setTimeout(()=>{

      this.blotterOptions.tableData = [

        {
          name: "Jack",
          age: 15,
          sex: "M",
          class: "class2",
          grade: "A",
          habit: "run"
        },
        {
          name: "JackYY",
          age: 16,
          sex: "M",
          class: "class1",
          grade: "D",
          habit: "swimming"
        },
        {
          name: "Tom",
          age: 23,
          sex: "M",
          class: "class3",
          grade: "C",
          habit: "gym"
        },
        {
          name: "Rose",
          age: 18,
          sex: "F",
          class: "class3",
          grade: "B",
          habit: "swimming"
        },
        {
          name: "Shirley",
          age: 18,
          sex: "F",
          class: "class2",
          grade: "C",
          habit: "gym"
        },
        {
          name: "Ali",
          age: 18,
          sex: "F",
          class: "class2",
          grade: "A",
          habit: "swimming"
        },
        {
          name: "Jennifer",
          age: 18,
          sex: "F",
          class: "class3",
          grade: "B",
          habit: "run"
        }

      ];

    }, 1000);

  },
  methods:{

    orderByName: function(){

      this.blotterOptions.orderOptions.forEach( (value,key) => {
        value.enable = false;
      });

      this.blotterOptions.orderOptions[0].enable = true;
      this.blotterOptions.orderOptions[0].order == "desc" ?  this.blotterOptions.orderOptions[0].order = "asc" : this.blotterOptions.orderOptions[0].order = "desc";

    },

    orderByAge: function(){

      this.blotterOptions.orderOptions.forEach( (value,key) => {
          value.enable = false;
      });

      this.blotterOptions.orderOptions[1].enable = true;
      this.blotterOptions.orderOptions[1].order == "desc" ?  this.blotterOptions.orderOptions[1].order = "asc" : this.blotterOptions.orderOptions[1].order = "desc";

    },

    updateData: function(){

      let tmp = [
        {
          name: "Shinne",
          age: 19,
          sex: "F",
          class: "class3",
          grade: "C",
          habit: "run"
        },
        {
          name: "Aapple",
          age: 18,
          sex: "F",
          class: "class2",
          grade: "A",
          habit: "swimming"
        },
        {
          name: "Jasmine",
          age: 18,
          sex: "F",
          class: "class3",
          grade: "A",
          habit: "run"
        }
      ];

      this.blotterOptions.tableData = this.blotterOptions.tableData.concat(tmp);

    }


  }


}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
