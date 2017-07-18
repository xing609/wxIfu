const App = getApp()
var Api = require('../../utils/api.js');
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    pageCount: 1,
    currentPage: 1,
    resDesc: null,

    hidden: false,
    hasMore: false,
    hasRefesh: false,
    resultList: []
  },
  getChatList: function () {
    var that = this;
    wx.request({
      method: 'POST',
      url: Api.getChatList({
        token: Api.getToken(),
        page: 1
      }),
      success: function (res) {
        console.log(res);
        that.setData({
          currentPage: res.data.currentPage,
          pageCount: res.data.pageCount,
          resultList: res.data.resultList,
        })
        setTimeout(function () {
          that.setData({
            hidden: true,
          })
        }, 1500)
      }
    })
  },
  onLoad: function () {
    var that = this;
    this.getChatList();
  },
  //加载更多
  loadMore: function (e) {
    var that = this;
    this.currentPage = this.currentPage+1;
  
    if (!this.data.hasMore) return
    wx.request({
      method: 'POST',
      url: Api.getChatList({
        token: Api.getToken(),
        page: currentPage
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
            hidden: true,
          })
        }, 1500)
      }
    })
  },

  //刷新处理
  refesh: function (e) {
    var that = this;
    that.setData({
      hasRefesh: true,
    });

    wx.request({
      method: 'POST',
      url: Api.getChatList({
        token: Api.getToken(),
        page: 1
      }),
      success: function (res) {
        console.log(res);
        that.setData({
          currentPage: res.data.currentPage,
          pageCount: res.data.pageCount,
          resultList: res.data.resultList,
        })
        setTimeout(function () {
          that.setData({
            hidden: true,
            hasRefesh: false,
            currentPage:1,
          })
        }, 1500)
      }
    })
  },


})