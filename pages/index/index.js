var Api = require('../../utils/api.js');
var Tools = require('../../helpers/Md5.js');
var Req = require('../../utils/req.js');
const App = getApp()
//获取应用实例
var arr_name = ["我的病人", "我的方案", "我的多中心项目", "待完成医用量表", "已收到量表", "未按时提交量表",]
var file = "../../pages/list/list"

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    //loadingHidden: false,  // loading
    model: {},
    images:[
      {
        id: "1",
        url:'http://www.ifuifu.com/i/up_clinic_banner1.jpg'
      }, {
        id: "2",
        url: 'http://www.ifuifu.com/i/up_clinic_banner2.jpg'
      }, {
        id: "3",
        url: 'http://www.ifuifu.com/i/up_clinic_banner3.jpg'
      }
    ],
    items: [{
      id: "1",
      num: 0,
      text: arr_name[0],
      path: '../mycustomer/index'
    }, {
      id: "2",
      num: 0,
      text: arr_name[1],
      path: '../template/mytemplate/index'
    }, {
      id: "3",
      num: 0,
      text: arr_name[2],
      path: ''
    }, {
      id: "4",
      num: 0,
      text: arr_name[3],
      path: '../index/doctorwrite/index'
    }, {
      id: "5",
      num: 0,
      text: arr_name[4],
      path: '../index/receive/index'
    }, {
      id: "6",
      num: 0,
      text: arr_name[5],
      path: '../index/nosubimt/index'
    }]
  },
  onLaunch: function () {
    var that = this;
    // wx.login({
    //   success: function (res) {
    //     if (res.code) {
    //       //发起网络请求
    //       console.log("-----------res.code=" + res.code);
    //       that.getSessionKey(res.code);
    //     } else {
    //       console.log('获取用户登录态失败！' + res.errMsg)
    //     }
    //   }
    // });
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    console.log("test onReady");
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    console.log("test onShow");
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
    console.log("test onHide");
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
    console.log("test onUnload");
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
    console.log("test onPullDownRefresh");
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
    console.log("test onReachBottom");
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '301助手分享', // 分享标题
      desc: '这是一个小而美的301助手小程序，请奔走相告！', // 分享描述
      path: 'pages/index/index' // 分享路径
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getHomeNum();
  },

  //主菜单跳转
  navigateTo(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path

    switch (0) {
      case 3:
        console.log("即将启用");
        break
      default:
        wx.navigateTo({
          url: path
        })
    }
  },
  // 用户登录
  login() {
    var that = this;
    Req.req_post(Api.login({
      loginName: Api.account,
      password: Tools.hexMD5(Api.psw)
    }), "", function success(res) {
      wx.setStorageSync('user', res.data.model);
      //存用户TOKEN
      wx.setStorageSync('token', res.data.token);
      that.getHomeNum();
    }, function fail(res) {
    })
  },

  getHomeNum() {
    var that = this;
    Req.req_post(Api.getHomeNum({
      token: Api.getToken()
    }), "", function success(res) {
      console.log(res);
      that.setData({
        model: res.data.model
      })
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, function fail(res) {
    })
  },

  onLoad() {
    var that = this;
    //this.login();
    //调用应用实例的方法获取全局数据
    // App.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          console.log("-----------res.code=" + res.code);
          that.getSessionKey(res.code);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  //code 换取 session_key
  getSessionKey (js_code) {
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + Api.getAppId
      +'&secret=97d950ac223a5eea24526a34155a9382&js_code=' + js_code 
      + '&component_appid=' + Api.getCompnentAppId+'&grant_type=authorization_code',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        var openid = res.data.openid;
        wx.checkSession({
          success: function () {
            console.log("session 未过期，并且在本生命周期一直有效");
            wx.getUserInfo({
              success: function (res) {
                console.log("-------res==" + res);
                var userInfo = res.userInfo;
                that.login();
                //that.thirdLogin(openid, JSON.stringify(userInfo));
              }
            })

          },
          fail: function () {
            //登录态过期
            //wx.login() //重新登录
            console.log("session 登录态过期");
          }
        })
      }
    })
  },

  // type;//接口类型（0:金蝶 1：微信）
  thirdLogin(openId, userInfo) {
    Req.req_post(Api.thirdLogin({
      userType: 2,
      openId: openId,
      type: 1,
      
      userInfo: userInfo
    }), "", function success(res) {
      console.log("第三方登录成功：" + res);

    }, function fail(res) {
    })
  },
  jumpMyQrIndex() {
    wx.navigateTo({
      url: '/pages/index/myqr/index',
    })
  },
  jumpIfuValueIndex() {
   // App.WxService.navigateTo('/pages/index/ifuvalue/index')
  },
  jumpTemplateQrIndex() {
   wx.navigateTo({
     url: '/pages/index/templateqr/index',
   })
  },
  jumpTemplateGroup() {
    wx.navigateTo({
      url: '/pages/template/index',
    })
  }


})

