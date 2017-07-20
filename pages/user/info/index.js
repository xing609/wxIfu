const App = getApp()
const Api = require('../../../utils/api.js');

Page({
  data: {
    userInfo: {}
  },
  onLoad() {
    this.getUserInfo()
  },
  getUserInfo() {
    var that = this;
    wx.request({
      method: 'POST',
      url: Api.getUserInfo({
        token: Api.getToken()
      }),
      success: function (res) {
        wx.setStorageSync('user', res.data.model);
        that.setData({
          userInfo: res.data.model
        })
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
      }
    })
  }
})