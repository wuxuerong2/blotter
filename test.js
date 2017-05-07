var error = true;
function test(){
  //promise处理异步函数的回调，这里简单的用一个error代表正确结果和非预期结果的判断条件
  var promise = new Promise(function(resolve,reject){
    setTimeout(function(){
      if(!error){
        resolve("没错");
      }else{
        reject("有错");
      }
    },100)
  });
  //test函数内部处理非预期结果。
  promise.catch(function(error){
    console.log("失败了:"+error);
  });return promise
}
test().then(function(str){
  console.log("成功了:"+str);
}).catch(function(str){
  console.log("成功了!!:"+str);
  Promise.resolve("AAAAA");
}).then(function(str){
  console.log("成功了~~~~~~~~:"+str);
});
