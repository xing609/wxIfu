const App = getApp()
var Api = require('../../../utils/api.js');
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    pageCount: 0,
    currentPage: 0,
    resDesc: null,
    loadingHidden: false,  // loading
    resultList: []
  },
  getMyTemplateList: function () {
    var that = this;
    wx.request({
      method: 'POST',
      url: Api.getMyTemplateList({
        token: Api.getToken(),
        page: 1,
        tempname:"",
        type:0,
        page:0	
      }),
      success: function (res) {
        console.log(res);
        that.setData({
          resultList: res.data.resultList
        })
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
      }
    })
  },
  onLoad: function () {
    var that = this;
    this.getMyTemplateList();
  },
  search() {
    App.WxService.navigateTo('/pages/search/index')
  },
  navigateTo(e) {
    console.log("--------------------templateid="+e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "/pages/template/confirmTemplate/index?templateId=" + e.currentTarget.dataset.id 
    })
  }
})