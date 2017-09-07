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

  },
  
  register() {
    wx.navigateTo({
      url: '/pages/register/index?&from=register'
    })
  },
  // 忘记密码
  forGetPsw() {
    wx.navigateTo({
      url: '/pages/register/index?&from=forgetpsw'
    })
  },
  //  登录
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
      wx.setStorageSync('token', res.data.token);
      wx.setStorageSync('homeRefresh', true);
      wx.setStorageSync('hasNewMess', true);
      
      if (res.data.model.specialtyName == null) {//检测用户亚专业是否填写
        console.log("------------------填写亚专业");
        wx.navigateTo({
          url: '/pages/register/specialty/index',
        })
      } else {
        wx.switchTab({
          url: '/pages/index/index?from=login'
        })
      }
    }, function fail(res) {
    })
  }
})