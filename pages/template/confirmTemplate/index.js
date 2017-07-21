const App = getApp()
var Api = require('../../../utils/api.js');

Page({
  data:{
    template: {},
    customer: {},
    date: '2017-07-21',
  },
  onLoad: function (option) {
    console.log("收到------------" + option.templateId);
    this.getCustomerInfo();
    this.getTemplateDetail(option.templateId);
  },
  //取患者信息
  getCustomerInfo: function () {
    var that = this;
    var customerId = Api.getCustomerId();

    console.log("Api.getCustomerId()--------------------"+customerId);
    var doctorId=Api.getUser().id;
    wx.showNavigationBarLoading();
    wx.request({
      method: 'POST',
      url: Api.getCustomerInfo(customerId,{
        token: Api.getToken(),
        doctorId: doctorId,
        customerId: customerId
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
 
//取方案详情
getTemplateDetail:function(templateid){
  var that=this;
  wx.showNavigationBarLoading();
  wx.request({
    method: 'POST',
    url: Api.getTemplateDetail(templateid, {
      token: Api.getToken(),
    }),
    success: function (res) {
      console.log(res);
      that.setData({
        template: res.data.model
      })
    }, complete: function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  })
}

})