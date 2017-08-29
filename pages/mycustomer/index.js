var App = getApp()
var Api = require('../../utils/api.js');
var Req = require('../../utils/req.js');
import { $wuxPrompt } from '../../components/wux'
Page({
  data: {
    pageCount: 0,
    currentPage: 0,
    newCustomerNum: 0,
    resultList: []
  },
  onPullDownRefresh:function(){
    this.onLoad();
  },
  getMyCustomerList: function () {
    var that = this;
    Req.req_post(Api.getMyCustomerList({
      token: Api.getToken(),
      page: 0,
      status: 1
    }), "加载中", function success(res) {
      if(res.data.resultList.length>0){
        $wuxPrompt.init('msg3', {
          icon: '../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).hide();
      }else{
        $wuxPrompt.init('msg3', {
          icon: '../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).show();
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
  //新病人数量
  getNewCustomer: function () {
    var that = this;
    Req.req_post(Api.getNewCustomer({
      token: Api.getToken(),
      status: 0,
      page: 1
    }), "", function success(res) {
      console.log(res);
      that.setData({
        newCustomerNum: res.data.resultList.length
      })
      wx.stopPullDownRefresh();
    }, function fail(res) {

    })
  },
  onLoad: function () {
    var that = this;
    this.getMyCustomerList();
    this.getNewCustomer();
  },
  search() {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },
  navigateTo(e) {
    wx.navigateTo({
      url: "/pages/mycustomer/detail/index?customerId=" + e.currentTarget.dataset.customerId + "&customerExtHosp=" + e.currentTarget.dataset.id
    })
  },
  //新病人
  jumpToNewCustomer() {
    wx.navigateTo({
      url: "/pages/newcustomer/index"
    })
  }
})