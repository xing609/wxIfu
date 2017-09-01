const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var wxbarcode = require("../../../utils/index.js");
var bean;
Page({
  data: {
    template: '',
    status: 0,
    showModal: false,//是否显示弹窗
  },
  getTemplateIntroduce: function (id) {
    var that = this;
    Req.req_post(Api.getTemplateIntroduce(id, {
      token: Api.getToken()
    }), "加载中", function success(res) {
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
    var list = new Array();
    var bean = new Object();
    bean.id = id;
    list.push(bean);
    
    Req.req_post(Api.stopTemplateIntroduce({
      token: Api.getToken(),
      templateIds: JSON.stringify(list)
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
  },
  //加为我的方案
  addMyTemplate(e) {
    var that = this;
    var id = this.data.template.id;
    if (id) {
      var list = new Array();
      var bean = new Object();
      bean.id = id;
      list.push(bean);
      Req.req_post(Api.addMyTemplate({
        token: Api.getToken(),
        templateIds: JSON.stringify(list)
      }), "加载中", function success(res) {
        that.getTemplateIntroduce(id);
        wx.showToast({
          title: '添加成功',
        })
        wx.setStorageSync('hasChange', true);
      }, function fail(res) {
      })
    }
  },
 
  //显示方案二维码弹窗
  showTemplateQr: function (e) {
    if (this.data.status == 0){
      var bean = e.currentTarget.dataset.bean;
      var code = bean.weixinUrl;

      console.log("code----------------------", code);
      if (code != null) {
        wxbarcode.qrcode('qrcode', code, 380, 380);
      }
      this.setData({
        bean: bean,
        showModal: true
      });
    }else{
      wx.showToast({
        title: '请先启用方案才能查看',
      })
    }
    
  },
  //关闭弹窗
  closeDialog: function () {
    this.setData({
      showModal: false
    });
  }
})