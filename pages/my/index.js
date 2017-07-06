var app = getApp()
Page( {
  data: {
    userInfo: {},
    projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
    userListInfo: [ {
      icon: '../../images/ic_ifu_value.png',
      text: '医数值',
      isunread: true,
      unreadNum: 10
    }, {
        icon: '../../images/ic_setting.png',
        text: '设置',
        isunread: false,
        unreadNum: 2
      }, {
        icon: '../../images/ic_feedback.png',
        text: '意见反馈',
      }, {
        icon: '../../images/ic_contact_us.png',
        text: '联系我们'
      }, {
        icon: '../../images/ic_about_us.png',
        text: '关于医数'
      }]
  },

  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
      that.setData( {
        userInfo: userInfo
      })
    })
  }
})