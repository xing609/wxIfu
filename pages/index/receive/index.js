var App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
Page({
  data: {
    pageCount: 0,
    currentPage: 0,
    resultList: []
  },
  onPullDownRefresh:function(){
    this.receiveSurvey();
  },
  receiveSurvey: function () {
    var that = this;
    Req.req_post(Api.receiveSurvey({
      token: Api.getToken(),
      page: 1,
    }), "", function success(res) {
      console.log(res);
      that.setData({
        resultList: res.data.resultList
      })
      var title = "已收到的量表（" + res.data.total + "）";
      wx.setNavigationBarTitle({ title: title })
      wx.stopPullDownRefresh();
    }, function fail(res) {

    })
  },
  onLoad: function () {
    var that = this;
    this.receiveSurvey();
  },
  navigateTo(e) {
    wx.navigateTo({
      url: "/pages/mycustomer/detail/index?customerId=" + e.currentTarget.dataset.customerId + "&customerExtHosp=" + e.currentTarget.dataset.id
    })
  }
})