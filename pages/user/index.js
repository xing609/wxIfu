const App = getApp()
const Api = require('../../utils/api.js');
const Req = require('../../utils/req.js');
Page({
  data: {
    userInfo: {},
    items: [
      {
        icon: '../../assets/images/iconfont-order.png',
        text: '医数值',
        path: ''///pages/ifuvalue/list/index
      },
      {
        icon: '../../assets/images/iconfont-addr.png',
        text: '设置',
        path: ''///pages/address/list/index
      },
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
      case 2:
        App.WxService.makePhoneCall({
          phoneNumber: path
        })
        break
      default:
        App.WxService.navigateTo(path)
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

    // App.getUserInfo()
    //   .then(data => {
    //     console.log(data)
    //     this.setData({
    //       userInfo: data
    //     })
    //   })
  },
  getStorageInfo() {
    App.WxService.getStorageInfo()
      .then(data => {
        console.log(data)
        this.setData({
          'settings[0].path': `${data.currentSize}KB`
        })
      })
  },
  bindtap(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path

    switch (index) {
      case 0:
        App.WxService.showModal({
          title: '友情提示',
          content: '确定要清除缓存吗？',
        })
          .then(data => data.confirm == 1 && App.WxService.clearStorage())
        break
      default:
        App.WxService.navigateTo(path)
    }
  },
  logout() {
    App.WxService.showModal({
      title: '友情提示',
      content: '确定要登出吗？',
    })
      .then(data => {
        this.myLoginOut();
      })
        // App.WxService.removeStorageSync('token')
        // App.WxService.redirectTo('/pages/login/index')})// data.confirm == 1 &&
  },
  goUserInfo() {
    App.WxService.navigateTo('/pages/user/info/index')
  },
  signOut() {
    App.HttpService.signOut()
      .then(data => {
        console.log(data)
        if (data.meta.code == 0) {
          App.WxService.removeStorageSync('token')
          App.WxService.redirectTo('/pages/login/index')
        }
      })
  },
  myLoginOut(){
    Req.req_post(Api.loginOut({
      token: Api.getToken()
    }),"",function success(res){
      console.log("loginout success -------------");
      App.WxService.removeStorageSync('token')
      App.WxService.redirectTo('/pages/login/index')
    },function fail(res){
      console.log("loginout failed -------------");
    })
  }

})