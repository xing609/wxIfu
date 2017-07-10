var Api = require('../../utils/api.js');
const App = getApp()
//获取应用实例
var arr_name = ["我的病人", "我的方案", "我的多中心项目", "待完成医用量表", "已收到量表", "未按时提交量表",]
var file = "../../pages/list/list"
var token = "689e700378944a8e941eeb9c9e31ac60"

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false,  // loading
    model: {},
    items: [{
      id: "1",
      num: 0,
      text: arr_name[0],
    }, {
      id: "2",
      num: 0,
      text: arr_name[1]
    }, {
      id: "3",
      num: 0,
      text: arr_name[2]
    }, {
      id: "4",
      num: 0,
      text: arr_name[3]
    }, {
      id: "5",
      num: 0,
      text: arr_name[4]
    }, {
      id: "6",
      num: 0,
      text: arr_name[5]
    }]
  },


  getHomeNum: function () {
    var that = this;
    wx.request({
      method: 'POST',
      url: Api.getHomeNum({
        token: '689e700378944a8e941eeb9c9e31ac60'
      }),
      success: function (res) {
        console.log(res);
        that.setData({
          model: res.data.model
        })
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
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
    console.log('onLoad')
    this.getHomeNum();
    this.getSliderList();
    //调用应用实例的方法获取全局数据
    App.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

  }
})
