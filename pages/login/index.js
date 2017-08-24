var Api = require('../../utils/api.js');
var Tools = require('../../utils/md5.js');
var Req = require('../../utils/req.js');
const App = getApp()
Page({
  data: {
    userName: "",
    passWord: ""
  },
  onLoad() {
    if (Api.getLoginName()) {
      this.setData({
        userName: Api.getLoginName()
      })
    }
    if (Api.getPsw()) {
      this.setData({
        passWord: Api.getPsw()
      })
    }
  },

  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userPasswordInput: function (e) {
    this.setData({
      passWord: e.detail.value
    })
    console.log(e.detail.value)
  },

  btnLogin() {
    if (!this.data.userName) {
      wx.showToast({
        title: '请输入帐号',
      })
      return;
    }
    if (!this.data.passWord) {
      wx.showToast({
        title: '请输入密码',
      })
      return;
    }
    var that = this;
    Req.req_post(Api.login({
      loginName: this.data.userName,
      password: Tools.hexMD5(this.data.passWord)
    }), "正在登录", function success(res) {
      console.log("---------token-----------" + res.data.token);
      wx.setStorageSync('loginName', that.data.userName);
      wx.setStorageSync('psw', that.data.passWord);
      wx.setStorageSync('user', res.data.model);
      //存用户TOKEN
      wx.setStorageSync('token', res.data.token);

      wx.switchTab({
        url: '/pages/index/index?from=login'
      })
    }, function fail(res) {
    })

    // wx.showNavigationBarLoading() //在标题栏中显示加载
    // var that = this;
    // wx.request({
    //   method: 'POST',
    //   url: Api.login({
    //     loginName: this.data.userName,
    //     password: Tools.hexMD5(this.data.passWord)
    //   }),
    //   success: function (res) {
    //     console.log("---------token-----------" + res.data.token);
    //       wx.setStorageSync('loginName',that.data.userName);
    //       wx.setStorageSync('psw', that.data.passWord);
    //       wx.setStorageSync('user', res.data.model);
    //       //存用户TOKEN
    //       wx.setStorageSync('token', res.data.token);

    //       wx.switchTab({
    //         url: '/pages/index/index?from=login'
    //       })
    //   }
    // })
  }
})