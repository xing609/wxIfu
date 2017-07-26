const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
Page({
  data: {
    template:''
  },
  getTemplateIntroduce: function (id) {
    var that = this;
    Req.req_post(Api.getTemplateIntroduce(id,{
      token: Api.getToken()
    }), "", function success(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        template: res.data.model
      })
    }, function fail(res) {
    })
  },
  onLoad: function (option) {
    var that = this;
    this.getTemplateIntroduce(option.templateId);
  }
})