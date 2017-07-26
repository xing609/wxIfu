const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
Page({
  data: {
    pageCount: 0,
    currentPage: 0,
    templateGroupId:'',
    resultList: []
  },
  getTemplateCommonList: function (templateGroupId) {
    var that = this;
    Req.req_post(Api.getTemplateCommonList({
      token: Api.getToken(),
      page: 1,
      type:1,
      tempname:'',
      templateGroupId: templateGroupId,
     
    }), "", function success(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        resultList: res.data.resultList
      })
    }, function fail(res) {
    })
  },
  onLoad: function (option) {
    var that = this;
    if(option.title){//设置标题
      wx.setNavigationBarTitle({ title: option.title })
    }
    if (option.templateGroupId){
      that.setData({
        templateGroupId: option.templateGroupId
      })
      this.getTemplateCommonList(option.templateGroupId);
    }
  },
  search() {
    App.WxService.navigateTo('/pages/search/index')
  },
  navigateTo(e) {
    console.log("--------------------templateid=" + e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "/pages/template/templateIntroduce/index?templateId=" + e.currentTarget.dataset.id
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var templateGroupId= this.data.templateGroupId;
    this.getTemplateCommonList(templateGroupId);
  },
})