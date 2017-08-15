var App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var totalData = [];
Page({
  data: {
    pageCount: 1,
    currentPage: 1,
    toId:"",
    resultList: []
  },
  onLoad: function (option) {
    if (option.customerId){
      this.setData({
        toId: option.customerId
      })
      this.getChatDetail(this.data.currentPage);
    }
    if(option.realName){
      wx.setNavigationBarTitle({
        title: option.realName
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentPage: 1,
      resultList: []
    })
    this.getChatDetail(1);
  },
  //上拉回调
  onReachBottom: function () {
    var currentPage = this.data.currentPage + 1;
    if (currentPage <= this.data.pageCount) {
      this.setData({
        currentPage: currentPage,
      })
      this.getChatDetail(currentPage);
    }
  },
  getChatDetail: function (page) {
    var that = this;
    Req.req_post(Api.chatDetail({
      token: Api.getToken(),
      toId: that.data.toId,
      page: page
    }), "", function success(res) {
      if (page != 1 && page <= that.data.pageCount) {
        if (res.data.resultList) {
          for (var i in res.data.resultList) {
            totalData.push(res.data.resultList[i])
          }
        }
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
  },
  navigateTo(e) {
    wx.navigateTo({
      url: "/pages/chat/detail/index?customerId=1"
    })
  },
})
