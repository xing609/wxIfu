const App = getApp()
var Api = require('../../utils/api.js');
var Tools = require('../../utils/md5.js');
Page({
    data: {
        indicatorDots: !1,
        autoplay: !1,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !1,
    },
    onLoad: function () {
      this.login();
    },
    
    onShow() {},
    bindload(e) {
      setTimeout(App.WxService.getStorageSync('token') ? this.login : this.login, 3000)
    },
    goIndex() {
        App.WxService.switchTab({
            url: '/pages/index/index'
        })
    },
    goLogin() {
        App.WxService.redirectTo('/pages/login/index')
    },
    
    // 用户登录
    login: function () {
      var that = this;
      var password = Tools.hexMD5("111111");
      wx.request({
        method: 'POST',
        url: Api.login({
          loginName: 13641809500,
          password: password
        }),
        success: function (res) {
          console.log("---------token-----------" + res.data.token);
          try {
            wx.setStorageSync('user', res.data.model);
            //存用户TOKEN
            wx.setStorageSync('token',res.data.token);
            App.WxService.switchTab({
              url: '/pages/index/index'
            })
          } catch (e) {
          }
        }
      })
    },

})
