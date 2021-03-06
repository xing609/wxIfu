const App = getApp()
var Api = require('../../utils/api.js');
var Req = require('../../utils/req.js');
Page({
  data: {
    resultList: []
  },
  getTemplateGroupList: function () {
    var that = this;
    Req.req_post(Api.getTemplateGroupList({
      token: Api.getToken(),
      page: 1,
      specialtyId:''
    }), "", function success(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        resultList: res.data.resultList
      })
    }, function fail(res) {
    })
  },
  onLoad: function () {
    var that = this;
    this.getTemplateGroupList();
  },
  search() {
    App.WxService.navigateTo('/pages/search/index')
  },
  navigateTo(e) {
    console.log("--------------------templateGroupId=" + e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "/pages/template/templateChild/index?templateGroupId=" + e.currentTarget.dataset.id+"&title="+e.currentTarget.dataset.title
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.getTemplateGroupList();
  },
})