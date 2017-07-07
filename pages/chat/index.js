const App = getApp()
var Api = require('../../utils/api.js');
Page({
    data: {
      indicatorDots: true,
      vertical: false,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      pageCount:0,
      currentPage:0,
      resDesc: null,
      loadingHidden: false,  // loading
      resultList:[]
    },
    getChatList: function () {
      var that = this;
      wx.request({
        method: 'POST',
        url: Api.getChatList({
          token: '689e700378944a8e941eeb9c9e31ac60',
          page:1
        }),
        success: function (res) {
          console.log(res);
          that.setData({
            currentPage: res.data.currentPage,
            pageCount: res.data.pageCount,
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
      this.getChatList();
    }
})