var App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
const qiniuUploader = require("../../../utils/qiniuUploader");
var url;
Page({
  data: {
    upload: false
  },
  onLoad: function (option) {
    url = option.imgUrl;
    this.setData({
      url: url
    })
  },
  btnSubmit() {
    if(this.data.upload){
      return
    }
    // 交给七牛上传
    var that = this;
    if (url == null) {
      wx.showToast({
        title: '未获取到图片地址',
      })
      return
    }
    this.getQiNiuToken(that, url, 1);
  },

  getQiNiuToken(that, imgUrl, type) {
    Req.req_post(Api.getQiNiuToken({
      token: Api.getToken()
    }), "", function success(res) {
      that.setData({
        uptoken: res.data.model.token
      })
      initQiniu(res.data.model.token, type);
      qiniuUploader.upload(imgUrl, (res) => {
        if (res.resCode == '0000') {
          if (res.model.url) {
            console.log("图片地址：-------------" + res.model.url);
            that.uploadAudit();
          }
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'success',
            duration: 1000
          });
        }

      }, (error) => {
        console.log('error: ' + error);
      })
    }, function fail(res) {

    })
  },

  //提交认证
  uploadAudit() {
    if (!this.data.url) {
      wx.showToast({
        title: '未获取图片地址',
      })
      return
    }
    var that = this;
    Req.req_post(Api.uploadAudit({
      token: Api.getToken(),
      picUrl: this.data.url
    }), "提交中", function success(res) {
      console.log('提交成功：', res.data.model);
      that.setData({
        upload: true
      })
      wx.showToast({
        title: '提交成功',
      })
    }, function fail(res) {

    })
  },
  //图片预览
  previewImage: function (e) {
    var that = this;
    if (url) {
      var picArray = new Array();
      picArray.push(url);
      wx.previewImage({
        current: picArray[0],
        urls: picArray
      })
    }
  }
}
);


// 初始化七牛相关参数
function initQiniu(upToken) {
  var options = {
    region: 'ECN', // 华东区 /uptoken
    uptokenURL: 'https://qiniu.ifuifu.com',
    uptoken: upToken,
    domain: 'http://qiniu.ifuifu.com/img/origin',
    shouldUseQiniuFileName: true
  };
  qiniuUploader.init(options);
}


