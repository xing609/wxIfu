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
    Req.req_get_html(Api.msPage2, "", function success(res) {
      var data=res.data;
      console.log("html-success-------------" + data);
      WxParse.wxParse('content', 'html', data, that, 5);
      //WxParse.wxParse('article', 'html', data, that, 5);




      var repliesArray = result.replies;
      var l = 100;
      if (repliesArray.length < l) {
        l = repliesArray.length;
      }
      var replyArr = [];
      for (var i = 0; i < l; i++) {
        if (repliesArray[i].content) {
          var c = repliesArray[i].content;
          if (c.length > 0) {
            replyArr.push(repliesArray[i].content);
          }
        }
      }
      /**
      * WxParse.wxParseTemArray(temArrayName,bindNameReg,total,that)
      * 1.temArrayName: 为你调用时的数组名称
      * 3.bindNameReg为循环的共同体 如绑定为reply1，reply2...则bindNameReg = 'reply'
      * 3.total为reply的个数
      */
      console.log('replies:' + replyArr.length);
      if (replyArr.length > 0) {
        for (let i = 0; i < replyArr.length; i++) {
          WxParse.wxParse('reply' + i, 'html', replyArr[i], p);
          if (i === replyArr.length - 1) {
            WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, p)
          }
        }
      }            






    }, function fail(res) {
      
    })
  }
 
})
