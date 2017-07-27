var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
const App = getApp()
Page({
  data: {
    bg: '',
    trumpArr: [],
    template: ''
  },

  onLoad: function (option) {
    console.log("接收：" + option.customerId + "/" + option.exthospitalId);
    if (!option.customerId && !option.exthospitalId) {
      return
    }
    this.getCustomerTemplateInfo(option.customerId, option.exthospitalId);
    // let _this = this;
    // let param = {
    //   API_URL: 'http://mobile.api.hunantv.com/channel/getWPDetail',
    //   data: {}
    // };

    // newData.result(param).then(data => {

    //   let datas = data.data.data;

    //   this.setData({
    //     trumpArr: data.data.data,
    //     bg: datas[0].picUrl
    //   })

    // }).catch(e => {

    //   this.setData({
    //     loadtxt: '数据加载异常',
    //     loading: false
    //   })

    // })

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
  },

  changeSwiper: function (e) {

    let _this = this;
    let index = e.detail.current;

    this.setData({
      //bg: _this.data.trumpArr[index].picUrl
      bg: 'http://www.ifuifu.com/i/up_clinic_banner2.jpg'
    })
  }

})