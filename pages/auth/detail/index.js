var App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var url;
Page({
  data: {
   upload:false
  },
  onLoad: function (option) {
    url=option.imgUrl;
    this.setData({
      url: url
    })
  },
  btnSubmit(){
    if(this.data.upload){
        return;
    }
    this.uploadAudit();
  },
  //提交认证
  uploadAudit(){
    if (!this.data.url){
      wx.showToast({
        title: '未获取图片地址',
      })
      return
    }
    var that=this;
    Req.req_post(Api.uploadAudit({
      token: Api.getToken(),
      picUrl: this.data.url
    }), "", function success(res) {
      console.log('提交成功：',res.data.model);
      that.setData({
        upload:true
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



