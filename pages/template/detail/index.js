var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
const App = getApp()
Page({
  data: {
    template: ''
  },
  onLoad: function (option) {
    console.log("接收：" + option.customerId + "/" + option.exthospitalId);
    if (!option.customerId && !option.exthospitalId) {
      return
    }
    this.getCustomerTemplateInfo(option.customerId, option.exthospitalId);
  },
  getCustomerTemplateInfo: function (customerId, customerExtHosp) {
    var that = this;
    Req.req_post(Api.getCustomerTemplateInfo({
      token: Api.getToken(),
      customerId: customerId,
      customerExtHosp: customerExtHosp
    }), "", function success(res) {
      console.log(res);
      that.setData({
        template: res.data.model
      })
      if (res.data.model.templateName) {
        wx.setNavigationBarTitle({
          title: res.data.model.templateName,
        })
      }

    }, function fail(res) {
    })
  }

})