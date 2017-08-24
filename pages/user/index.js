const App = getApp()
const Api = require('../../utils/api.js');
const Req = require('../../utils/req.js');
Page({
  data: {
    userInfo: {},
    items: [
      {
        icon: '../../assets/images/iconfont-kefu.png',
        text: '医数值',
        path: ''///pages/ifuvalue/list/index
      },
      // {
      //   icon: '../../assets/images/iconfont-addr.png',
      //   text: '设置',
      //   path: ''///pages/address/list/index
      // },
      {
        icon: '../../assets/images/iconfont-kefu.png',
        text: '联系我们',
        path: '400-618-2535',
      }
    ],
    settings: [
      {
        icon: '../../assets/images/iconfont-clear.png',
        text: '清除缓存',
        path: '0.0KB'
      },
      {
        icon: '../../assets/images/iconfont-about.png',
        text: '关于医数',
        path: '/pages/about/index'
      },
    ]
  },
  onLoad() {
    this.getUserInfo()
    this.getStorageInfo()
  },
  //修改头像时即时更新
  onShow: function () {
    this.getUserInfo();
  },
  navigateTo(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path

    switch (index) {
      case 1:
        wx.makePhoneCall({
          phoneNumber: path
        })
        break
      default:
        wx.navigateTo({
          url: path,
        })
    }
  },
  getUserInfo() {
    var userInfo = Api.getUser();
    // const userInfo = App.globalData.userInfo
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      return
    }
  },
  getStorageInfo() {
    var that=this;
    wx.getStorageInfo({
      success: function(res) {
        that.setData({
          'settings[0].path': `${res.currentSize}KB`
        })
      },
    })

  },
  bindtap(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path
    var that = this;
    switch (index) {
      case 0:
        wx.showModal({
          title: '友情提示',
          content: '确定要清除缓存吗？',
          success: function (res) {
            if (res.confirm) {
              that.setData({
                'settings[0].path': `0KB`
              })
            }
          }
        })

        break
      default:
       wx.navigateTo({
         url: path,
       })
    }
  },
  logout() {
    var that=this;
    wx.showModal({
      title: '友情提示',
      content: '确定要登出吗？',
      success: function (res) {
        if (res.confirm) {
          that.myLoginOut();
        }
      }
    })
  },
  goUserInfo() {
    wx.navigateTo({
      url: '/pages/user/info/index'
    })
  },
  signOut() {
    
    // App.HttpService.signOut()
    //   .then(data => {
    //     console.log(data)
    //     if (data.meta.code == 0) {
    //       wx.removeStorageSync('token')
    //       wx.redirectTo('/pages/login/index')
    //     }
    //   })
  },
  myLoginOut() {
    Req.req_post(Api.loginOut({
      token: Api.getToken()
    }), "正在退出", function success(res) {
      console.log("loginout success -------------");
      wx.removeStorageSync('token')
      wx.redirectTo({
        url:'/pages/login/index'})
    }, function fail(res) {
      console.log("loginout failed -------------");
    })
  }

})