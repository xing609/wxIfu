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
      var data=res.data.toString();
      console.log("html-success-------------" + data);
      WxParse.wxParse('article', 'html', data, that, 5);
    }, function fail(res) {
      console.log("html---------------" + res);
    })
  }
 
})
