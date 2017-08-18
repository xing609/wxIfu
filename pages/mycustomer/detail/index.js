// detail.js
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
const App = getApp()
var customerId;
var customerExtHosp;
Page({
  data: {
    customer: {},
    resultList: [],
    customerId:'',
    doctorId:'',
    customerExtHosp:'',
  },

  onLoad: function (option) {
    console.log(option.customerId + "/" + option.customerExtHosp);
    if (option.customerId) {
      this.getCustomerInfo(option.customerId, option.customerExtHosp);
      //存选中患者id
      wx.setStorageSync('customerId', option.customerId);
      customerId = option.customerId;
      customerExtHosp =option.customerExtHosp;
    }
  },
  //分配方案
  sendTemplate() {
    wx.navigateTo({
      url: "/pages/template/mytemplate/index?from=sendTemplate"
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
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
    }), "加载中", function success(res) {
      that.setData({
        doctorId:Api.getUser().id,
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
        wx.hideNavigationBarLoading() 
        wx.stopPullDownRefresh() 
    }, function fail(res) {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh() 
    })
  },
  //进入方案
  navigateTo(e) {
    var doctorId = e.currentTarget.dataset.doctorid;
    if (doctorId){
      if (doctorId == this.data.doctorId){
        wx.navigateTo({
          url: "/pages/template/detail/index?customerId=" + customerId + "&exthospitalId=" + e.currentTarget.dataset.exthospitalid
        })
      }else{
        wx.showToast({
          title: '无限查看此方案',
        })
      }
    }
  },
  //进入病程录
  jumpToRecord(e){
    var doctorId = e.currentTarget.dataset.doctorid;
    if (doctorId) {
      if (doctorId == this.data.doctorId) {
        wx.navigateTo({
          url: "/pages/mycustomer/record/index?customerId=" + customerId + "&templateId=" + e.currentTarget.dataset.templateid
        })
      } else {
        wx.showToast({
          title: '无限查看此方案',
        })
      }
    }
  },
  //更多信息
  jumpToCustomerInfo(){
    wx.navigateTo({
      url: "/pages/mycustomer/customerinfo/index?customerId=" + customerId + "&customerExtHosp=" + customerExtHosp
    })
  },
  //屏蔽
  btnShield(){
    var isblock = this.data.customer.isBlocked;
    var blockType = isblock ? "unblock":"block";
    var bean = this.data.customer;
    var that = this;
    Req.req_post(Api.btnShield({
      token: Api.getToken(),
      type: blockType,
      customerId: customerId
    }), "加载中", function success(res) {
      bean.isBlocked=!isblock;
      that.setData({
        customer: bean
      })
      if (!isblock){
        wx.showToast({
          title: '已屏蔽',
        })
      }else{
        wx.showToast({
          title: '取消屏蔽',
        })
      }
     
    }, function fail(res) {
      
    })
  },
  //加标
  btnMark() {
    var ismark = this.data.customer.mark;
    var markType = ismark ? false : true;
    var bean = this.data.customer;
    var that = this;
    Req.req_post(Api.btnRemark({
      token: Api.getToken(),
      mark: markType,
      customerExtHosp: customerExtHosp
    }), "加载中", function success(res) {
      bean.mark = !ismark;
      that.setData({
        customer: bean
      })
      if (!ismark) {
        wx.showToast({
          title: '已加标',
        })
      } else {
        wx.showToast({
          title: '取消标记',
        })
      }
    }, function fail(res) {

    })
  }

})