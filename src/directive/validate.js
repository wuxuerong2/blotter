let validator = {};

class Verify{

  constructor(options){

      let _this = this;
      this.fields = {};
      this.rules = {};
      this.params = {};
      this.errors = {
        value: "",
        has(name, rule){

          //组件created阶段，指令还没编译，这时this.fields还没初始化，这时默认没有错误
          if( typeof _this.fields[name] == "undefined" ){
            return false;
          }

          if( typeof rule == "undefined"){
            return _this.fields[name]["all"];
          }else{
            return _this.fields[name][rule];
          }

        }
      };

  }

  registerField(name, rules){

    //注册节点
    typeof this.fields[name] == "undefined" ? this.fields[name] = {} : true;
    this.fields[name]["all"] = false;
    rules.forEach( (value, key) => {

      //rules带参数
      if(typeof value == "object"){
        this.fields[name][value.rule] = false;
        //记录调用参数
        this.params[name] = {};
        this.params[name][value.rule]= {};
        this.params[name][value.rule]["options"] = value.options;
      }else{
        this.fields[name][value] = false;
      }

    });

  }

  registerRules(name, fn){
    this.rules[name] = fn;
  }

  checkRules(name, value, compare){

    //生成所需要的验证规则的promise链
    let promiseList = new Array();

    Object.keys(  this.fields[name] ).forEach( (key, i) => {

        if( key == "all" ){
          return;
        }

        //调用验证方法时是否需要传递参数
        if( typeof this.params[name] !== "undefined" ){
          promiseList.push(this.rules[key](value, this.params[name][key]["options"]), compare);
        }else{
           promiseList.push(this.rules[key](value, compare));
        }

    });

    Promise.all(promiseList).then(()=>{

      Object.keys(  this.fields[name] ).forEach( (key, i) => {
        this.fields[name][key] = false;
      });
      this.errors.value == true ? this.errors.value = false : this.errors.value = true;

    }, rule => {

      this.fields[name]["all"] = true;
      this.fields[name][rule] = true;
      this.errors.value == true ? this.errors.value = false : this.errors.value = true;

    });

  }

}


let verify = new Verify();
/*
*   验证规则注册
* */
verify.registerRules("numberOnly", function(value){

  return new Promise(function(resolve, reject){

    if( isNaN(value) ){
      reject("numberOnly");
    }else{
      resolve();
    }

  })

});

verify.registerRules("require", function(value){

  return new Promise(function(resolve, reject){

    if( value.trim().length == 0 ){
      reject("require");
    }else{
      resolve();
    }

  })

});

verify.registerRules("length", function(value,options){

  return new Promise(function(resolve, reject){

    if( value.trim().length > options.min && value.trim().length < options.max){
      resolve();
    }else{
      reject("length");

    }

  })

});

verify.registerRules("equal", function(value, compare){

  return new Promise(function(resolve, reject){

    if( value ==  compare ){
      resolve();
    }else{
      reject("equal");

    }

  })

});


validator.install = function(Vue, options){

    Vue.mixin({

      beforeCreate(){

        //监听vierify.errors变化，实现数据绑定
        Vue.util.defineReactive(this, 'errors', verify.errors);

      }

    });

    Vue.directive("vld",{

      bind(el, binding, vnode){

        let rules = JSON.parse( el.getAttribute("rules") );
        let name = el.getAttribute("field");
        verify.registerField(name, rules);

      },
      inserted(el, binding, vnode){

      },
      update(el, binding, {context}){

        //数据没有变化不作处理
        if( binding.value == binding.oldValue ){
            return;
        }

        let config = JSON.parse( el.getAttribute("rules") );
        let name = el.getAttribute("field");
        let equal = el.getAttribute("equal");
        verify.checkRules(name, binding.value,equal);

      }
    })
}

export default validator;
