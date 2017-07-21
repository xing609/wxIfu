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
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getChatList();
  },
  //上拉回调
  onReachBottom: function () {
    this.currentPage = this.currentPage + 1;
    this.getChatList();
  },
})

function getChatList(page){
  wx.request({
    method: 'POST',
    url: Api.getChatList({
      token: Api.getToken(),
      page: page
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
          currentPage: 1,
        })
      }, 1500)
    },
    complete: function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  })
}