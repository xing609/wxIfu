var Api = require('../../utils/api.js');
var Tools = require('../../helpers/Md5.js');
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
    items: [{
      id: "1",
      num: 0,
      text: arr_name[0],
      path: '/pages/mycustomer/index'
    }, {
      id: "2",
      num: 0,
      text: arr_name[1],
      path: '/pages/template/mytemplate/index'
    }, {
      id: "3",
      num: 0,
      text: arr_name[2],
      path: ''
    }, {
      id: "4",
      num: 0,
      text: arr_name[3],
      path: '/pages/index/doctorwrite/index'
    }, {
      id: "5",
      num: 0,
      text: arr_name[4],
      path: '/pages/index/receive/index'
    }, {
      id: "6",
      num: 0,
      text: arr_name[5],
      path: '/pages/index/nosubimt/index'
    }]
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
  onPullDownRefresh:function(){
    this.getHomeNum();
  },

//上拉回调
  onReachBottom: function () {
   
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
        App.WxService.navigateTo(path)
    }
  },
  // 用户登录
  login: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
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
          wx.setStorageSync('token', res.data.token);
          
          //同步操作先取token
          wx.request({
            method: 'POST',
            url: Api.getHomeNum({
              token: Api.getToken()
            }),
            success: function (res) {
              console.log("homenum--------------"+res);
              that.setData({
                model: res.data.model
              })
             
            },
            complete: function () {
              // complete
              wx.hideNavigationBarLoading() //完成停止加载
              wx.stopPullDownRefresh() //停止下拉刷新
            }
          })
        } catch (e) {
        }
      }
    })
  },
  getHomeNum: function () {
    var that = this;
    wx.request({
      method: 'POST',
      url: Api.getHomeNum({
      token: Api.getToken()
      }),
      success: function (res) {
        console.log(res);
        that.setData({
          model: res.data.model
        })
        // setTimeout(function () {
        //   that.setData({
        //     loadingHidden: true
        //   })
        // }, 1500)
      }, complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  //sliderList
  getSliderList: function () {
    var that = this;
    wx.request({
      url: 'http://huanqiuxiaozhen.com/wemall/slider/list',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          images: res.data
        })
      }
    })
  },

  onLoad: function () {
    this.login();
   // this.getHomeNum();
    this.getSliderList();
    //调用应用实例的方法获取全局数据
    App.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

  },

  jumpMyQrIndex() {
    App.WxService.navigateTo('/pages/index/myqr/index')
  },
  jumpIfuValueIndex() {
    App.WxService.navigateTo('/pages/index/ifuvalue/index')
  },
  jumpTemplateQrIndex() {
    App.WxService.navigateTo('/pages/index/templateqr/index')
  }
})
