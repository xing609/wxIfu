var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
const App = getApp()
Page({
  data: {
  },
  onLoad() {
    this.getSpecialty();
  },
  getSpecialty() {
    var that=this;
    Req.req_post(Api.getSpecialtyList({
      token: Api.getToken()
    }), "正在加载", function success(res) {
      that.setData({
        resultList: res.data.resultList
      })
    }, function fail(res) {
    })
  },//进入首页
  btnGoHome() {
    wx.switchTab({
      url: '/pages/index/index?from=login'
    })
  },//检测亚专业是否填写


})