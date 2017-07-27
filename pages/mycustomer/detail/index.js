// detail.js
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
const App = getApp()

Page({
  data: {
    customer: {},
    resultList: [],
    customerId:'',
    customerExtHosp:''
  },

  onLoad: function (option) {
    var that=this;
    console.log(option.customerId + "/" + option.customerExtHosp);
    if (option.customerId) {
      this.getCustomerInfo(option.customerId, option.customerExtHosp);
      //this.getTemplateIng(option.customerId);
      console.log("存选中患者id------------" + option.customerId);
      //存选中患者id
      wx.setStorageSync('customerId', option.customerId);
      that.setData({
        customerId: option.customerId,
        customerExtHosp: option.customerExtHosp
      })
    }
  },
  //分配方案
  sendTemplate() {
    wx.navigateTo({
      url: "/pages/template/mytemplate/index"
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var customerId = this.data.customerId;
    var customerExtHosp = this.data.customerExtHosp;
    this.getCustomerInfo(customerId, customerExtHosp);
  },
  //取患者信息
  getCustomerInfo: function (id, customerExtHosp) {
    var that = this;
    if (!customerExtHosp){
      customerExtHosp="";
    }
    Req.req_post(Api.getCustomerInfo(id, {
      token: Api.getToken(),
      customerExtHosp: customerExtHosp
    }), "", function success(res) {
      that.setData({
        customer: res.data.model
      })
      that.getTemplateIng(id);
    }, function fail(res) {

    })
  },
  //进行中的方案
  getTemplateIng: function (customerId) {
    var that = this;
    Req.req_post(Api.getTemplateIng({
      token: Api.getToken(),
      customerId: customerId
    }), "加载中", function success(res) {
         that.setData({
           resultList: res.data.resultList
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    }, function fail(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    })
   
  },

})