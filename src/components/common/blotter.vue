<template>

  <div>
    <table>

      <!--table header-->
      <thead>
        <tr>
          <th v-for="key in columnOpions">

            <!--- SELCT -->
            <select v-if="key.type == 'SELECT' " @change="selctColumn(key.field)" >
              <option v-for="opt in key.options" :value="opt.value">{{opt.text}}</option>
            </select>

            <!--- SELCT_GROUP -->
            <select v-if="key.type == 'SELECT_GROUP' " @change="selctColumn(key.field)" >
              <option value="ALL">all</option>
              <option v-for="opt in selectGroup(key.field)" :value="opt">{{opt}}</option>
            </select>

            <!--SELECT_GOUP_MULT--->
            <form v-if="key.type == 'SELECT_GROUP_MULT' " >
              <label  v-for="opt in selectGroup(key.field)"><input :name="opt" type="checkbox" value="opt" v-model="selectMulti[key.field][opt].checked" />{{opt}}</label>
            </form>

            <!--- CONTEXT_BTN -->
            <span v-if="key.type == 'CONTEXT_BTN' "></span>

            <!--- DATA -->
            <span v-if="key.type == 'DATA' ">{{key.headTitle}}</span>

            <span v-if=" key.order == true " @click="sortBy(key.field)">!</span>

          </th>
        </tr>
      </thead>

      <!---Only used to trigger computed function tableDatas-->
      <span v-for="item in tableDatas" style="display: none"></span>

      <!--table body-->
      <tr v-for="item in dataList">
        <th v-for="columnField in columnOpions">
          <a v-if=" columnField.type == 'CONTEXT_BTN' ">@</a>
          <span v-if="columnField.type == 'DATA' ">{{item[columnField.field]}}</span>
          <span v-if="columnField.type == 'SELECT' ">{{item[columnField.field]}}</span>
          <span v-if="columnField.type == 'SELECT_GROUP' ">{{item[columnField.field]}}</span>
          <span v-if="columnField.type == 'SELECT_GROUP_MULT' ">{{item[columnField.field]}}</span>
        </th>
      </tr>

    </table>


  </div>



</template>

<script>

  import _ from "lodash"

  //Register Filter Function
  let filterFn = {

    PART_MATCH: function(inputArray, field, match){


      //stop filer if filter criteria is empty
      if( match.length == 0 ){
        return inputArray;
      }

      let resultArray = new Array();
      inputArray.forEach( (value,key) => {

        if( value[field].indexOf(match) > -1 ){
          resultArray.push(value);
        }

      });

      return resultArray;

    },

    FULL_MATCH: function(inputArray, field, match){

      //stop filer if filter criteria is empty
      if( match.length == 0 ){
        return inputArray;
      }

      let resultArray = new Array();
      inputArray.forEach( (value,key) => {

        if( value[field] == match ){
          resultArray.push(value);
        }

      });

      return resultArray;

    },

    SELECT: function(inputArray, field, match){

      //stop filer if filter criteria is empty
      if( match.length == 0 ){
        return inputArray;
      }

      let resultArray = new Array();
      inputArray.forEach( (value,key) => {

        if( value[field] == match ){
          resultArray.push(value);
        }

      });

      return resultArray;

    },

    SELECT_GROUP_MULT: function(inputArray, field, match){

      let filetrList = new Array();
      let resultArray = new Array();
      for( let key in match ){

        if( match[key].checked ){
          filetrList.push(key);
        }

      }

      //no selected item , no need to filter
      if( filetrList.length == 0 ){
        return inputArray;
      }

      inputArray.forEach( (value,key) => {

        if( filetrList.indexOf(value[field]) > - 1 ){
          resultArray.push(value);
        }

      });

      return resultArray;

    }

  };

  export default {
    props:["columnOpions","tableData","quickFilterOption","quickFilterData","orderOptions"],
    data:function(){

      return{
        dataList: [],//display table data
        fieldOrder:{},//store order criteria trigger by click table header
        filerCriteria:[],
        orderCriteria:[],
        selectMulti:{}
      }

    },
    computed:{
      tableDatas: function(){

        //Dynamic create selectMulti according to columnOpions
        let dataObject = {};
        let tmpArray = [];
        this.columnOpions.forEach( (value,key) => {

          if( value.type == "SELECT_GROUP_MULT" ){

            dataObject[value.field] = {};

            //scan the full list data to find out allvalue for value.field to gengerate unique value selectMulti[field.name].xxxx items.
            this.tableData.forEach( (value1, key1) => {
              tmpArray.push(value1[value.field]);
            });

            _.uniq(tmpArray);

            tmpArray.forEach( (value2, key2) => {
                dataObject[value.field][value2] = {};
                dataObject[value.field][value2].checked = false;
            });

          }

        });

        this.$set(this.$data, 'selectMulti', dataObject);




        this.dataList = this.tableData;

      }
    },
    watch:{

      //filer criteria pass from parent component
      quickFilterData:{
        handler: function(){

          this.quickFilterOption.forEach((value, key) =>
          {

            this.registerFilter(value.type, value.field, this.quickFilterData[value.match])

          });

          this.filerColumn();

        },
        deep: true
      },

      //filer order pass from parent component
      orderOptions:{
        handler: function(){

          this.orderOptions.some( (value, key) => {

            //reorder trigger by parent component
            if( value.enable == true ){
              this.registerOrder(value.field, value.order);
              return true;
            }

          });

          this.orderColumn();

        },
        deep: true
      },

      //monitor SELECT_GROUP_MULT changing
      selectMulti: {
        handler: function(){

          //register filter criteria
          for( let key  in this.selectMulti ){

            //watch function will be called when this.selectMulti.key is created but this.selectMulti[key] is still empty!
            if( !_.isEmpty(this.selectMulti[key]) ){
              this.registerFilter("SELECT_GROUP_MULT", key, this.selectMulti[key]);
            }

          }

          //prevernt to call  this.filerColumn() before all the table data is ready
          if( this.dataList.length > 0){
            this.filerColumn();
          }

        },
        deep: true
      }


    },
    methods:{

      //All filter actions will be concentrated here
      filerColumn: function(){

        let tmpTableData = this.tableData;

        this.filerCriteria.forEach((value, key) =>
        {
          tmpTableData  = filterFn[value.type](tmpTableData, value.field, value.match);
        });


         this.dataList = tmpTableData;

      },

      //register filter criteria or update match criteria
      registerFilter: function(type, field, match){

        let registed = false;
        let registedIndex = -1;

        this.filerCriteria.some( (value,key) => {

          if( value.type == type && value.field == field ){
            registed = true;
            registedIndex = key;
            return true;
          }

        });

        //already registerd
        if(registed){

          //update the match
          this.filerCriteria[registedIndex]['match'] = match;

        }else{

          let tmpFilterOpt = {
            type: type,
            field: field,
            match:match
          };

          this.filerCriteria.push(tmpFilterOpt);

        }

      },

      //All order actions will be concentrated here
      orderColumn: function(){

        //Order data, only support single order criteria
        this.dataList = _.orderBy( this.dataList,[this.orderCriteria[0].field], [this.orderCriteria[0].order] );

      },

      //register order criteria, the register criteria will be place in first position in the array when this function call
      registerOrder: function(field, order){

        let registed = false;
        let registedIndex = -1;
        order == "undefined" ? order  = "desc" : true;

        this.orderCriteria.some( (value,key) => {

          if( value.field == field ){
            registed = true;
            registedIndex = key;
            return true;
          }

        });

        //already registerd
        if(registed){

          //auto switch between desc and asc
          if( this.orderCriteria[registedIndex]['order'] == "desc" || this.orderCriteria[registedIndex]['order'] == "asc" ){
            this.orderCriteria[registedIndex]['order'] == "desc" ? this.orderCriteria[registedIndex]['order'] = "asc" : this.orderCriteria[registedIndex]['order'] = "desc";
          }else{
            this.orderCriteria[registedIndex]['order'] = order;
          }

          //put the new register order criteria into first position in the this.orderCriteria， because only first criteria will be handled
          let tmpCriteria = this.orderCriteria[registedIndex];
          this.orderCriteria.unshift(tmpCriteria);
          _.pullAt( this.orderCriteria, ( registedIndex + 1 ) );

        }else{

          let tmpOrderOpt = {
            field: field,
            order:order
          };

          this.orderCriteria.push(tmpOrderOpt);

        }

      },

      //reoreder rows by clicking column header
      sortBy: function(field){

        this.registerOrder(field, "desc");
        this.orderColumn();

      },

      //filter rows by selecting criteria im column header
      selctColumn: function(field){

        let selectedVal = event.target.options[event.target.selectedIndex].value;

        //special handle to select all items
        selectedVal == "ALL" ? selectedVal = "" : true ;

        this.registerFilter("SELECT",field,selectedVal);
        this.filerColumn();

      },

      //generate type == "SELECT_GROUP" column header
      selectGroup: function(field){

        let resultArray = new Array();
        this.dataList.forEach( (value, key)=>{
          resultArray.push( value[field] );
        });


        return _.uniq(resultArray);

      },




    }

  }


</script>

<style>

  thead{
    background-color: #0BB20C;
  }

  th{
    border: 1px solid #000000;
  }

</style>
