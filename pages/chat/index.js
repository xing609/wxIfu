const App = getApp()
var Api = require('../../utils/api.js');
Page({
  data: {
    pageCount: 1,
    currentPage: 1,
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
    this.onLoad();
  },
  //上拉回调
  onReachBottom: function () {
    this.currentPage = this.currentPage + 1;
    this.getChatList();
  },
})
function getChatList(page){
  Req.req_post(Api.getChatList({
    token: Api.getToken(),
    page: page
  }), "", function success(res) {
    console.log(res);
    that.setData({
      currentPage: res.data.currentPage,
      pageCount: res.data.pageCount,
      resultList: res.data.resultList,
    })
    wx.stopPullDownRefresh();
  }, function fail(res) {

  })
}