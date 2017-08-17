const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({
  data: {
    resultList: []
  },
  onLoad: function () {
    var that=this;
    this.getHtmlContent(that);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad();
  }, 
  getHtmlContent: function(that) {
    //var url ="https://www.ifuifu.com/up_clinic";
    //var url ="https://ms.ifuifu.com/Index/detail/id/2747";
    var url ="https://ms.ifuifu.com/Index/detail/id/5825";
    //var url ="https://mp.weixin.qq.com/s?__biz=MzI5MTA0NzExNA==&mid=2650961056&idx=1&sn=1258be34beb948c78fd84e768f2c1e49&chksm=f7e04705c097ce13b6b8645368f909ec4bab28d1bed427c39f14f76a4d78f44ace8718feec37&mpshare=1&scene=23&srcid=08174JojcRMVz38oPlxy4YMO#rd";
    //var url ="https://mp.weixin.qq.com/s?__biz=MzAwMzU1NjkxNQ==&mid=401971566&idx=6&sn=960fe14d513abb88a7540a325e836169";
    Req.req_get_html(url, "", function success(res) {
      var data=res.data;

      console.log("--------------------------------------------html-success-------------" + data);
      if(data){
       
        WxParse.wxParse('article', 'html', data, that, 5);
      }
     
   
    }, function fail(res) {
      
    })
  }
 
})
