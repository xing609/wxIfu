var App = getApp()
var Api = require('../../utils/api.js');
var Req = require('../../utils/req.js');
Page({
  data: {
    pageCount: 1,
    currentPage: 1,
    resultList: []
  },
  
  onLoad: function () {
    
    this.getChatList(this.data.currentPage);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentPage: 1,
      resultList: []
    })
    this.getChatList(1);
  },
  //上拉回调
  onReachBottom: function () {
    var currentPage = this.data.currentPage + 1;
    
    wx.showToast({
      title: 'up' + currentPage + "/" + this.data.pageCount,
    })
    if (currentPage <= this.data.pageCount) {

      this.setData({
        currentPage: currentPage,
      })
      this.getChatList(currentPage);
    }

  },
  getChatList: function (page) {
    var that=this;
    Req.req_post(Api.getChatList({
      token: Api.getToken(),
      page: page
    }), "", function success(res) {
      
      var totalData = null;
      if (res.data.resultList && page != 1 && page <= that.data.pageCount) {
        for (var i in res.data.resultList){
          that.resultList.push(res.data.resultList[i]);
        }
        totalData = that.resultList;
      } else {
        totalData = res.data.resultList;
      }
      that.setData({
        currentPage: res.data.currentPage,
        pageCount: res.data.pageCount,
        resultList: totalData,
      })
      wx.stopPullDownRefresh();
    }, function fail(res) {

    })
  }
})
