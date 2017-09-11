var App = getApp()
var Api = require('../../utils/api.js');
var Req = require('../../utils/req.js');
var util = require('../../utils/util.js');
var totalData = [];
Page({
  data: {
  },
  onLoad: function () {
  },

  onShow: function () {//检测是否有发送新消息
    var hasMess = wx.getStorageSync('hasNewMess');
    if (hasMess) {
      this.onLoad();
    }
  },
  //拍照
  didPressChooesImage() {
    var that = this;
    // 微信 API 选文件
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        wx.navigateTo({
          url: "/pages/auth/detail/index?imgUrl=" + filePath
        })
      }
    })
  },

  callMobile() {
    wx.makePhoneCall({
      phoneNumber: '400-618-2535'
    })

  }
})
