var Api = require('../../utils/api.js');
var Tools = require('../../helpers/Md5.js');
const App = getApp()
Page({
	data: {
		logged: !1
	},
    onLoad() {},
    onShow() {
    	const token =wx.getStorageSync('token')
    	this.setData({
    		logged: !!token
    	})
    	token && setTimeout(this.goIndex, 1500)
    },
    login() {
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
              wx.switchTab({
                url: '/pages/index/index'
              })
            } catch (e) {
            }
          }
        })
    },
    goIndex() {
    	wx.switchTab({
    		url: '/pages/index/index'
    	})
    }
})