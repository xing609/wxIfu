const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({
  data: {
    resultList: []
  },
  onLoad: function (option) {
    if (option.nodeId != null) {
      var that = this;
      this.getUrl(that, option.nodeId);
    }
  },

  getUrl: function (that, nodeId) {
    Req.req_post(Api.getKnowsDetail(nodeId, {
      token: Api.getToken(),
    }), "加载中", function success(res) {
      if (res.data.model) {
        var content = res.data.model.content;
        var contentType = parseInt(res.data.model.contentType);
        if (content) {
          switch (contentType) {
            case 0://纯文本
              WxParse.wxParse('article', 'html', content, that, 5);
              console.log("contentType-----文本-------" + res.data.model.contentType);
              wx.showToast({
                title: '纯文本',
              })
              break;
            case 1://链接
              wx.showToast({
                title: '链接',
              })
              console.log("contentType-----链接-------" + res.data.model.contentType);
              that.getHtmlContent(content, that);
              break;
            case 2://膝关节须知
              wx.showToast({
                title: '膝关节链接',
              })
              // content = content + "&doctorId=" + UserData.instance().getDocotrId() +
              //   "&noteId=" + noteId + "&pointId=" + params.getPointId() + "&customerExtHosp=" + customerExtHospId;
              that.getHtmlContent(content, that);
              break;
          }
        }
        if (res.data.model.title) {
          wx.setNavigationBarTitle({
            title: res.data.model.title,
          })
        }
      }
    }, function fail(res) {
    })
  },
  // 获取html内容
  getHtmlContent: function (url, that) {
    //var url ="https://www.ifuifu.com/up_clinic";
    //var url ="https://ms.ifuifu.com/Index/detail/id/2747";
    //var url ="https://ms.ifuifu.com/Index/detail/id/5825";
    //var url ="https://mp.weixin.qq.com/s?__biz=MzI5MTA0NzExNA==&mid=2650961056&idx=1&sn=1258be34beb948c78fd84e768f2c1e49&chksm=f7e04705c097ce13b6b8645368f909ec4bab28d1bed427c39f14f76a4d78f44ace8718feec37&mpshare=1&scene=23&srcid=08174JojcRMVz38oPlxy4YMO#rd";
    //var url ="https://mp.weixin.qq.com/s?__biz=MzAwMzU1NjkxNQ==&mid=401971566&idx=6&sn=960fe14d513abb88a7540a325e836169";
    if (!url) {
      return
    }
    if (url.indexOf("http:") >= 0) {
      url = url.replace('http:', 'https:');
    }

    wx.request({
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log("--------------------------------------------html-success-------------" + res.data);
        if (res.data) {
          WxParse.wxParse('article', 'html', res.data, that, 5);
        }
      }
    })

  }

})
