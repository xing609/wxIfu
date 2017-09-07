const App = getApp()
const Api = require('../../utils/api.js');
const Req = require('../../utils/req.js');
Page({
  data: {
    userInfo: {},
 
    settings: [
      {
        icon: '../../assets/images/userinfo/ic_contact_us.png',
        text: '联系我们',
        path: '400-618-2535',
      },
      {
        icon: '../../assets/images/userinfo/i_setting.png',
        text: '清除缓存',
        path: '0.0KB'
      },
      {
        icon: '../../assets/images/userinfo/ic_about_us.png',
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
    this.getAuditStatus();
    this.getUserInfo();
  },
  // navigateTo(e) {
  //   const index = e.currentTarget.dataset.index
  //   const path = e.currentTarget.dataset.path

  //   switch (index) {
  //     case 0:
  //       wx.makePhoneCall({
  //         phoneNumber: path
  //       })
  //       break
  //     default:
  //       wx.navigateTo({
  //         url: path,
  //       })
  //   }
  // },
  getUserInfo() {
    var userInfo = Api.getUser();
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      return
    }
  },
  getStorageInfo() {
    var that = this;
    wx.getStorageInfo({
      success: function (res) {
        that.setData({
          'settings[1].path': `${res.currentSize}KB`
        })
      },
    })
  },
  // 获取认证状态
  getAuditStatus() {
    var that = this;
    Req.req_post(Api.getAuditStatus({
      token: Api.getToken()
    }), "", function success(res) {
      that.setData({
        auditStatus: res.data.model.status
      })
      wx.setStorageSync('auditStatus', res.data.model.status);
    }, function fail(res) {
    })
  },
  //快速认证
  quickAuth(){
    wx.navigateTo({
      url: '/pages/user/info/index?from=auth'
    })
  },
  bindtap(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path
    var that = this;
    switch (index) {
      case 0:
        wx.makePhoneCall({
          phoneNumber: path
        })
        break
      case 1:
        wx.showModal({
          title: '友情提示',
          content: '确定要清除缓存吗？',
          success: function (res) {
            if (res.confirm) {
              that.setData({
                'settings[1].path': `0KB`
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
    var that = this;
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
    var pagefrom='userinfo';//查看
    if (this.data.auditStatus==0){
      pagefrom = 'userinfo';
    }else {//编辑
      pagefrom = 'edit';
    }
    wx.navigateTo({
      url: '/pages/user/info/index?from='+pagefrom
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
        url: '/pages/login/index'
      })
    }, function fail(res) {
      console.log("loginout failed -------------");
    })
  }

})