var App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var Ifu = require('../../../utils/ifu.js');

Page({
  data: {
    upload: false
  },
  onLoad: function (option) {
    this.getAuditStatus();
  },
  btnSubmit() {
    if (this.data.upload) {
      return;
    }
    this.uploadAudit();
  },
  // 获取认证状态
  getAuditStatus() {
    var that = this;
    Req.req_post(Api.getAuditStatus({
      token: Api.getToken()
    }), "加载中", function success(res) {
      var strStatus = Ifu.authStatus(res.data.model.status);
      wx.setNavigationBarTitle({
        title: strStatus,
      })
      var authimage = res.data.model.image;
      console.log("authimg-----------", authimage);
      that.setData({
        authStatus: res.data.model.status,
        strStatus: strStatus,
        authimage: authimage
      })
      wx.setStorageSync('auditStatus', res.data.model.status);
    }, function fail(res) {
    })
  },
  //提交认证
  uploadAudit() {
    if (!this.data.url) {
      wx.showToast({
        title: '未获取图片地址',
      })
      return
    }
    var that = this;
    Req.req_post(Api.uploadAudit({
      token: Api.getToken(),
      picUrl: this.data.url
    }), "", function success(res) {
      console.log('提交成功：', res.data.model);
      that.setData({
        upload: true
      })
      wx.showToast({
        title: '提交成功',
      })
    }, function fail(res) {

    })
  },
  callMobile() {
    wx.makePhoneCall({
      phoneNumber: '400-618-2535'
    })

  },
  //图片预览
  previewImage: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    if (url) {
      var picArray = new Array();
      picArray.push(url);
      wx.previewImage({
        current: picArray[0],
        urls: picArray
      })
    }
  }
}
);



