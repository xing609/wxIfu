// detail.js
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
const App = getApp()
var customerId;
var customerExtHosp;
Page({
  data: {
    customer: {},
    resultList: []
  },
  onLoad: function (option) {
    var that = this;
    console.log(option.customerId + "/" + option.customerExtHosp);
    if (option.customerId) {
      this.getCustomerInfo(option.customerId, option.customerExtHosp);
      customerId = option.customerId;
      customerExtHosp = option.customerExtHosp;
    }
  },

  //取患者信息
  getCustomerInfo: function (id, customerExtHosp) {
    var that = this;
    if (!customerExtHosp) {
      customerExtHosp = "";
    }
    Req.req_post(Api.getCustomerInfo(id, {
      token: Api.getToken(),
      customerExtHosp: customerExtHosp
    }), "加载中", function success(res) {
      that.setData({
        customer: res.data.model
      })
    }, function fail(res) {

    })
  },

  //图片预览
  previewImage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var picArray = e.currentTarget.dataset.imgurl;
    console.log(picArray + "/" + index);
    if (picArray) {
      var urlArray = new Array();
      for(var i in picArray){
        urlArray.push(picArray[i].url);
        console.log("url------" + picArray[i].url);
      }
      wx.previewImage({
        //当前显示下表
        current: urlArray[index],
        //数据源
        urls: urlArray
      })
    }
  }

})