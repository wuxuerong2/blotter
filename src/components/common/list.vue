<template>

  <div id="wrapper" ref="wrapperRef">
    <div id="scroller" ref="scrollerRef">
      <div :class="{'pullDown':'pullDownCls','loading':'loadingCls','flip':'flipCls'}" ref="pullDownRef">
        <span class="pullDownIcon">&nbsp;</span>
        <span class="pullDownLabel">{{pullDownLabel}}</span>
      </div>
      <slot name="list-item" :items="items" :who="who"></slot>
      <div class="pullUp" ref="pullUpRef">
        <span class="pullUpIcon" v-show="pullUpLabelShow">&nbsp;</span>
        <span class="pullUpLabel" v-show="pullUpLabelShow">Loading...</span>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">

  import $ from 'jquery';
  require("../../lib/scroll/iscroll.js");


  export default {
    props:{
      beforeSendData:{
        type: Function,
        default: () => {}
      },
      processData:{
        type: Function,
        default: () => {}
      }
    },
    data(){
    return{
      items:[],
      who:"",
      pullDownCls:true,
      loadingCls: false,
      flipCls: false,
      pullDownLabel: "下拉刷新",
      pullUpLabelShow: false
    }
  },
  mounted(){

    //this.init();
    let _this = this;

    let items_per_page = 5;//每页最多显示的条数
    let scroll_in_progress = false;
    let myScroll,pullUpEl,pullDownEl,pullDownOffset,pullUpOffset;


    load_content();

    /*
     *   加载列表内容
     * */
    function load_content (refresh, next_page) {

      // This is a DEMO function which generates DEMO content into the scroller.
      // Here you should place your AJAX request to fetch the relevant content (e.g. $.post(...))

      console.log(refresh, next_page);

      //首次加载
      if (!refresh) {

      }
      //刷新,清空数据
      else if (refresh && !next_page) {
        _this.items.length = 0;
      }
      //加载下一页
      else if (refresh && next_page) {

      }

      //发送Ajax请求到后台请求数据
      let getData = new Promise( (resolve,reject) => {

        setTimeout(function(){

          $.ajax({
            type:"POST",
            url:'/api/getBoardList',
            success:function(data){
              _this.items = _this.items.concat(data);
              resolve();
            },
            error:function(data){
              reject();
            }
          });

        },2000);


      });

      getData.then(function(data){

        //是否需要刷新数据（包括刷新和加载更多）
        if (refresh) {

          myScroll.refresh();

          //下拉回调函数
          pullActionCallback();

        } else {

          if (myScroll) {
            myScroll.destroy();
            $(myScroll.scroller).attr('style', ''); // Required since the styles applied by IScroll might conflict with transitions of parent layers.
            myScroll = null;
          }

          trigger_myScroll();

        }

      });


    };

    /*
     *   初始化Iscroll插件
     * */
    function trigger_myScroll(offset) {

      pullDownEl = _this.$refs.pullDownRef;

      //获取下拉提示框的位置
      if (pullDownEl) {
        pullDownOffset = pullDownEl.offsetHeight;
      } else {
        pullDownOffset = 0;
      }

      //获取上拉提示框的位置
      pullUpEl = _this.$refs.pullUpRef;
      if (pullUpEl) {
        pullUpOffset = pullUpEl.offsetHeight;
      } else {
        pullUpOffset = 0;
      }

      //内容是否只有一页
      if ( _this.items.length < items_per_page) {

        //当内容只有一页时隐藏上/下拉提示框
        $('#wrapper .pullDown').hide();
        $('#wrapper .pullUp span').hide();
        offset = 0;

      }
      // offset参数为空时
      else if (!offset) {
        offset = pullUpOffset;
      }

      myScroll = new IScroll('#wrapper', {
        probeType:2,
        tap:true,
        click:false,
        mouseWheel:true,
        scrollbars:true,
        fadeScrollbars:true,
        interactiveScrollbars:false,
        keyBindings:false,
        deceleration:0.0002,
        startY:(parseInt(offset)*(-1))
      });

      /*
      *   处理滚动开始事件
      * */
      myScroll.on('scrollStart', function () {
        scroll_in_progress = true;
      });

      /*
       *   处理滚动结束事件
       * */
      myScroll.on('scrollEnd', function () {

        setTimeout(function() {
          scroll_in_progress = false;
        }, 100);

        //数据总条数大于一页最大显示的条数
        if ( _this.items.length >= items_per_page) {

          //下拉到顶
          if ( this.y <= 0 && this.y > -40 ){

            _this.flipCls = false;
            _this.pullDownCls = true;
            _this.loadingCls = true;

            _this.pullDownLabel  = '加载中...';
            this.minScrollY = 0;

            //下拉到顶处理函数
            pullDownAction();

          }

          // 判断是否上拉到底，是否需要继续加载更多数据
          pullActionDetect.check(0);

        }

      });

      //容器一开始是向右偏移-9999px，用来隐藏下拉到顶提示框
      setTimeout(function() {
        _this.$refs.wrapperRef.style.left = 0
      }, 100);

    }

    /*
    *
    * */
    function pullDownAction() {

      load_content('refresh');
      $('#wrapper > #scroller > ul').data('page', 1);

      // Since "topOffset" is not supported with iscroll-5
      _this.$refs.scrollerRef.style.top = 0;

    }

    function pullUpAction(callback) {

      if ($('#wrapper > #scroller > ul').data('page')) {
        var next_page = parseInt($('#wrapper > #scroller > ul').data('page'), 10) + 1;
      } else {
        var next_page = 2;
      }
      load_content('refresh', next_page);
      $('#wrapper > #scroller > ul').data('page', next_page);

      if (callback) {
        callback();
      }

    }

    /*
     *   下拉回调函数
     * */
    function pullActionCallback() {

      //下拉提示框显示样式更新
      if (pullDownEl && _this.loadingCls == true ) {

        _this.flipCls = false;
        _this.pullDownCls = true;
        _this.loadingCls = false;

        _this.pullDownLabel = '下拉刷新';

        //向下滚动，隐藏下拉刷新提示框
        myScroll.scrollTo(0, parseInt(pullUpOffset)*(-1), 200);

      } else if (pullUpEl && _this.loadingCls == true) {

        _this.pullUpLabelShow = false;

      }

    }

    var pullActionDetect = {
      count:0,
      limit:10,
      check:function(count) {
        if (count) {
          pullActionDetect.count = 0;
        }
        // Detects whether the momentum has stopped, and if it has reached the end - 200px of the scroller - it trigger the pullUpAction
        setTimeout(function() {
          if (myScroll.y <= (myScroll.maxScrollY + 200) && pullUpEl && _this.loadingCls !== true ) {
            _this.pullUpLabelShow = true;
            pullUpAction();
          }
          else if (pullActionDetect.count < pullActionDetect.limit) {
            pullActionDetect.check();
            pullActionDetect.count++;
          }
        }, 200);
      }
    }



    //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

  },
  methods:{

    init(){
      this.getData();
    }

  }
  }

</script>

<style type="text/css">

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  html {
    -ms-touch-action: none;
  }

  body,ul,li {
    padding: 0;
    margin: 0;
    border: 0;
  }

  body {
    font-size: 12px;
    font-family: ubuntu, helvetica, arial;
    overflow: hidden; /* this is important to prevent the whole page to bounce */
  }

  #header {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    line-height: 45px;
    background: #CD235C;
    padding: 0;
    color: #eee;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
  }

  #footer {
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 48px;
    background: #444;
    padding: 0;
    border-top: 1px solid #444;
  }

  #wrapper {
    position: absolute;
    z-index: 1;
    top: 45px;
    bottom: 48px;
    left:-9999px; /* Not a must - can be 0 - but it makes the appearance of the content a bit nicer */
    width: 100%;
    background: #ccc;
    overflow: hidden;
  }

  #scroller {
    position: absolute;
    z-index: 1;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    width: 100%;
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-text-size-adjust: none;
    -moz-text-size-adjust: none;
    -ms-text-size-adjust: none;
    -o-text-size-adjust: none;
    text-size-adjust: none;
  }

  #scroller ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    text-align: left;
  }

  #scroller li {
    padding: 0 10px;
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #fff;
    background-color: #fafafa;
    font-size: 14px;
  }

  .pullDownLabel, .pullUpLabel {color:#999}
  .pullDown, .pullUp {background:#fff;height:40px;line-height:40px;font-weight:bold;font-size:0.8em;color:#888}
  .pullDown .pullDownIcon, .pullUp .pullUpIcon {display:block;float:left;opacity:0.4;width:40px;height:40px;-webkit-background-size:40px 80px;-ms-background-size:40px 80px; background-size:40px 80px;-webkit-transition-property:-webkit-transform;-ms-transition-property:-webkit-transform;-webkit-transition-duration:250ms;-ms-transition-duration:250ms}
  .pullDown .pullDownIcon {-webkit-transform:rotate(0deg) translateZ(0);-ms-transform:rotate(0deg) translateZ(0)}
  .pullUp .pullUpIcon  {-webkit-transform:rotate(-180deg) translateZ(0);-ms-transform:rotate(-180deg) translateZ(0)}
  .pullDown.flip .pullDownIcon {-webkit-transform:rotate(-180deg) translateZ(0);-ms-transform:rotate(-180deg) translateZ(0)}
  .pullUp.flip .pullUpIcon {-webkit-transform:rotate(0deg) translateZ(0);-ms-transform:rotate(0deg) translateZ(0)}
  .pullDown.loading .pullDownIcon, .pullUp.loading .pullUpIcon {background-position:0 100%;-webkit-transform:rotate(0deg) translateZ(0);-ms-transform:rotate(0deg) translateZ(0);-webkit-transition-duration:0ms;-ms-transition-duration:0ms;-webkit-animation-name:loading;-ms-animation-name:loading;-webkit-animation-duration:1s;-ms-animation-duration:1s;-webkit-animation-iteration-count:infinite;-ms-animation-iteration-count:infinite;-webkit-animation-timing-function:linear;-ms-animation-timing-function:linear}

  @-webkit-keyframes loading {
    from {-webkit-transform:rotate(0deg) translateZ(0)}
    to {-webkit-transform:rotate(360deg) translateZ(0)}
  }
  @-ms-keyframes loading {
    from {-ms-transform:rotate(0deg) translateZ(0)}
    to {-ms-transform:rotate(360deg) translateZ(0)}
  }


</style>
