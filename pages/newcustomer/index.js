var App = getApp()
var Api = require('../../utils/api.js');
var Req = require('../../utils/req.js');
import {$wuxPrompt } from '../../components/wux'
Page({
  data: {
    pageCount: 0,
    currentPage: 0,
    resDesc: null,
    resultList: []
  },
  onPullDownRefresh: function () {
    this.getNewCustomer();
  },
  getNewCustomer: function () {
    var that = this;
    Req.req_post(Api.getNewCustomer({
      token: Api.getToken(),
      status: 0,
      page: 1
    }), "", function success(res) {
      if(res.data.resultList!=null&&res.data.resultList.length>0){
        $wuxPrompt.init('msg3', {
          icon: '../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).hide();
        console.log("hasdata-----------");
      }else{
        $wuxPrompt.init('msg3', {
          icon: '../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).show();
        console.log("nodata-----------");
      }
      that.setData({
        currentPage: res.data.currentPage,
        pageCount: res.data.pageCount,
        resultList: res.data.resultList
      })
      wx.stopPullDownRefresh();
    }, function fail(res) {

    })
  },
  onLoad: function () {
    var that = this;
    this.getNewCustomer();
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