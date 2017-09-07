var Api = require('../../utils/api.js');
var Tools = require('../../utils/md5.js');
var Req = require('../../utils/req.js');
var Util = require('../../utils/util.js');
import { $wuxCountDown } from '../../components/wux'
const App = getApp()
var pagefrom = 'register';
Page({
  data: {
    btnContent: '注册'
  },
  onLoad(option) {
    pagefrom = option.from;
    var content;
    if (pagefrom == 'register') {
      wx.setNavigationBarTitle({
        title: "注册新帐号",
      })
      content = '注册';
    } else if (pagefrom == 'forgetpsw') {
      wx.setNavigationBarTitle({
        title: "忘记密码",
      })
      content = '确认';
    }
    this.setData({
      btnContent: content
    })
  },

  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      passWord: e.detail.value
    })
  },
  againPasswordInput: function (e) {
    this.setData({
      againPassWord: e.detail.value
    })
  },
  //获取验证码
  vcode() {
    if (!Util.isMobile(this.data.mobile)) {
      return
    }
    if (this.c2 && this.c2.interval) return !1
    this.sendVerfication();
    this.c2 = new $wuxCountDown({
      date: +(new Date) + 60000,
      onEnd() {
        this.setData({
          c2: '获取验证码',
        })
      },
      render(date) {
        const sec = this.leadingZeros(date.sec, 2) + ' 秒 '
        date.sec !== 0 && this.setData({
          c2: sec,
        })
      },
    })
  },
  //发送验证码 
  sendVerfication() {
    var codeType = '';
    if (pagefrom == 'register') {
      codeType = '';
    } else if (pagefrom == 'forgetpsw') {
      codeType = '1';
    }
    Req.req_post(Api.sendVerfication({
      loginName: this.data.mobile,
      userType: 2,
      codeType: codeType,
    }), "正在加载", function success(res) {
      wx.showToast({
        title: '验证码已发送',
      })

    }, function fail(res) {

    })

  },
  // 注册
  btnRegister() {
    if (!Util.isMobile(this.data.mobile)) {
      return
    }
    if (this.data.code == null) {
      wx.showToast({
        title: '请输入验证码',
      })
      return
    }
    if (this.data.code != null && this.data.code.length < 4) {
      wx.showToast({
        title: '请输入正确的验证码',
      })
      return
    }
    if (this.data.passWord == null) {
      wx.showToast({
        title: '请输入密码',
      })
      return
    }
    if (this.data.passWord != null && this.data.passWord.length < 6) {
      wx.showToast({
        title: '请输入至少6位密码',
      })
      return
    }
    if (this.data.againPassWord == null) {
      wx.showToast({
        title: '请输入确认密码',
      })
      return
    }
    if (this.data.againPassWord != null && this.data.againPassWord.length < 6) {
      wx.showToast({
        title: '请输入至少6位确认密码',
      })
      return
    }

    if (this.data.againPassWord != this.data.passWord) {
      wx.showToast({
        title: '确认密码输入不一致',
      })
      return
    }
    var that = this
    if (pagefrom == 'register') {
      Req.req_post(Api.userRegister({
        loginName: that.data.mobile,
        password: Tools.hexMD5(that.data.passWord),
        checkCode: that.data.code
      }), "正在提交", function success(res) {
        that.jumptoPage(res);
      }, function fail(res) {
      })
    } else if (pagefrom == 'forgetpsw') {
      Req.req_post(Api.findPassWord({
        loginName: that.data.mobile,
        password: Tools.hexMD5(that.data.passWord),
        checkCode: that.data.code
      }), "正在提交", function success(res) {
        that.jumptoPage(res);
      }, function fail(res) {
      })
    }
  },
  jumptoPage(res) {
    var url;
    var hint;
    var path;
    var that = this;
    if (pagefrom == 'register') {
      wx.setStorageSync('loginName', that.data.mobile);
      wx.setStorageSync('psw', that.data.passWord);
      wx.setStorageSync('user', res.data.model);
      wx.setStorageSync('token', res.data.token);
      hint = '注册成功！';
      path = '/pages/register/specialty/index';
    } else if (pagefrom == 'forgetpsw') {
      wx.setStorageSync('loginName', that.data.mobile);
      wx.setStorageSync('psw', that.data.passWord);
      hint = '设置成功，请重新登录！'
      path = '/pages/login/index';
    }
    wx.showToast({
      title: hint,
    })
    wx.navigateTo({
      url: path
    })
  }

})