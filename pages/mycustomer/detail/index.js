// detail.js
var Api = require('../../../utils/api.js');
const App = getApp()

Page({
  data: {
    customer: {},
    resultList: [],
  },

  onLoad: function (option) {
    console.log(option.customerId + "/" + option.customerExtHosp);
    if (option.customerId) {
      this.getCustomerInfo(option.customerId, option.customerExtHosp);
      this.getTemplateIng(option.customerId);
      console.log("存选中患者id------------" + option.customerId);
      //存选中患者id
      wx.setStorageSync('customerId',option.customerId);
    }
  },
  //分配方案
  sendTemplate() {
    var id=11;
    wx.navigateTo({
      url: "/pages/template/mytemplate/index?customerId=" +id
    })
  },
 
  //取患者信息
  getCustomerInfo: function (id, customerExtHosp) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      method: 'POST',
      url: Api.getCustomerInfo(id, {
        token: Api.getToken(),
        customerExtHosp: customerExtHosp
      }),
      success: function (res) {
        console.log(res);
        that.setData({
          customer: res.data.model
        })
      }, complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  //进行中的方案
  getTemplateIng: function (customerId) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      method: 'POST',
      url: Api.getTemplateIng({
        token: Api.getToken(),
        customerId: customerId
      }),
      success: function (res) {
        console.log(res);
        that.setData({
          resultList: res.data.resultList
        })
      }, complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

})