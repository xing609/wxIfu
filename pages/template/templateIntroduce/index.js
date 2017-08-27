const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var bean;
Page({
  data: {
    template: '',
    status: 0

  },
  getTemplateIntroduce: function (id) {
    var that = this;
    Req.req_post(Api.getTemplateIntroduce(id, {
      token: Api.getToken()
    }), "加载中", function success(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        template: res.data.model,
        status: res.data.model.status
      })
    }, function fail(res) {
    })
  },

  stop: function () {
    var that = this;
    var id = this.data.template.id;
    Req.req_post(Api.stopTemplate({
      token: Api.getToken(),
      templateIds: id
    }), "加载中", function success(res) {
      that.setData({
        status: 1
      })
      wx.showToast({
        title: '停用方案成功',
      })
      wx.setStorageSync('hasChange', true);
    }, function fail(res) {
    })
  },
  start: function () {
    var that = this;
    var id = this.data.template.id;
    Req.req_post(Api.startTemplate({
      token: Api.getToken(),
      templateIds: id
    }), "加载中", function success(res) {
      that.setData({
        status: 0
      })
      wx.showToast({
        title: '启用方案成功',
      })

      wx.setStorageSync('hasChange', true);
    }, function fail(res) {
    })
  },
  onLoad: function (option) {
    var that = this;
    this.getTemplateIntroduce(option.templateId);
  },
  //停用
  stopTemplate() {
    if (this.data.status == 0) {
      this.stop();
    } else {
      this.start();
    }
  },
  //进入方案详情
  jumpToTemplateDetail() {
    wx.navigateTo({
      url: "/pages/template/detail/index?templateId=" + this.data.template.id + "&from=introduce"
    })
  }
})