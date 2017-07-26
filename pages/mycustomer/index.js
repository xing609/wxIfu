var App = getApp()
var Api = require('../../utils/api.js');
var Req = require('../../utils/req.js');
Page({
  data: {
    pageCount: 0,
    currentPage: 0,
    resDesc: null,
    resultList: []
  },
  getMyCustomerList: function () {
    var that = this;
    Req.req_post(Api.getMyCustomerList({
      token: Api.getToken(),
      page: 0,
      status: 1
    }), "", function success(res) {
      console.log(res);
      that.setData({
        currentPage: res.data.currentPage,
        pageCount: res.data.pageCount,
        resultList: res.data.resultList
      })
    }, function fail(res) {
     
    })
  },
  onLoad: function () {
    var that = this;
    this.getMyCustomerList();
  },
  search() {
    App.WxService.navigateTo('/pages/search/index')
  },
  navigateTo(e) {
    wx.navigateTo({
      url: "/pages/mycustomer/detail/index?customerId=" + e.currentTarget.dataset.customerId + "&customerExtHosp=" + e.currentTarget.dataset.id
    })
  }
})