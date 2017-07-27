var App = getApp();
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var app = getApp()
Page({
  data: {
    hasNotice:false,
    resultList:'',
  },
  onLoad: function () {
    console.log('onLoad')
    this.unSurveyCustomers();
  },
  onPullDownRefresh:function(){
    this.unSurveyCustomers();
  },
   unSurveyCustomers:function(){
     var that=this;
     Req.req_post(Api.unSurveyCustomers({
       token: Api.getToken()
     }), "", function success(res) {
        that.setData({
          resultList: res.data.resultList
        })
        var title = "未按时提交的量表（"+res.data.total+"）";
        wx.setNavigationBarTitle({ title:title})
        wx.stopPullDownRefresh();
        that.setData({
          model: res.data.model
        })
     }, function fail(res) {
     })
  },
   navigateTo(e) {
     console.log("jump--customerId=" + e.currentTarget.dataset.customerId);
     wx.navigateTo({
       url: "/pages/mycustomer/detail/index?customerId=" + e.currentTarget.dataset.customerId
     })
   },
   //批量提醒
    notice(){
      var that=this;
      var hasNotice=this.data.hasNotice;
      if (hasNotice){
           return;
      }
      Req.req_post(Api.batchSendMsg({
        token: Api.getToken()
      }), "", function success(res) {
        that.setData({
          hasNotice: true
        })
      }, function fail(res) {
      })
   }
})  