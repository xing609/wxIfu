var Api = require('../../utils/api.js');
var Tools = require('../../utils/md5.js');
var Req = require('../../utils/req.js');
var Util = require('../../utils/util.js');
import { $wuxCountDown } from '../../components/wux'
const App = getApp()
Page({
  data: {
  },
  onLoad() {

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
    Req.req_post(Api.sendVerfication({
      loginName: this.data.mobile,
      userType: 2,
      codeType: '',
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
    var that=this;
    Req.req_post(Api.userRegister({
      loginName: that.data.mobile,
      password: Tools.hexMD5(that.data.passWord),
      checkCode: that.data.code
    }), "正在提交", function success(res) {
      console.log("---------token-----------" + res.data.token);
      wx.setStorageSync('loginName', that.data.mobile);
      wx.setStorageSync('psw', that.data.passWord);
      wx.setStorageSync('user', res.data.model);
      wx.setStorageSync('token', res.data.token);
      wx.showToast({
        title: '注册成功！',
      })
      wx.navigateTo({
        url: '/pages/register/specialty/index'
      })
       

    }, function fail(res) {
    })
   
  }

})