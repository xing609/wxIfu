// pages/mycustomer/index.js
const App = getApp()
var Api = require('../../utils/api.js');
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
  getMyCustomerList: function () {
    var that = this;
    wx.request({
      method: 'POST',
      url: Api.getMyCustomerList({
        token: Api.getToken(),
        page: 0,
        status:	1
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