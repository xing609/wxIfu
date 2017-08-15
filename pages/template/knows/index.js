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
   
    Req.req_get_html(Api.msPage, "", function success(res) {
      var data=res.data;
      console.log("html-success-------------" + data);
      WxParse.wxParse('article', 'html', data, that, 5);
    }, function fail(res) {
      console.log("html---------------" + res);
    })


    // wx.request({
    //   url: Api.msPage,
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: function (res) {
    //     var data = res.data;
    //     if (data) {
    //       var newsDetail = JSON.parse(res);
    //       WxParse.wxParse('article', 'html', newsDetail, that, 5);
    //     } else {
    //       console.log("数据拉取失败");
    //     }
    //   },
    //   fail: function (error) {
    //     console.log("数据拉取失败");
    //   }
    // })

  }
 
})
