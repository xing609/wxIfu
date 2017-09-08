var App = getApp()
var Api = require('../../utils/api.js');
var Req = require('../../utils/req.js');
var util = require('../../utils/util.js');

var totalData = [];
Page({
  data: {
  
  },
  onLoad: function () {
   
  },
  
  onShow: function () {//检测是否有发送新消息
    var hasMess = wx.getStorageSync('hasNewMess');
    if (hasMess) {
      this.onLoad();
    }
  },
  //拍照
  didPressChooesImage() {
    var that = this;
    // 微信 API 选文件
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        // 交给七牛上传
        that.getQiNiuToken(that, filePath, 1);
      }
    })
  },
  getQiNiuToken(that, imgUrl, type) {
    Req.req_post(Api.getQiNiuToken({
      token: Api.getToken()
    }), "", function success(res) {
      that.setData({
        uptoken: res.data.model.token
      })
      that.initQiniu(res.data.model.token, type);
      qiniuUploader.upload(imgUrl, (res) => {
        if (res.resCode == '0000') {
          if (res.model.url) {

            console.log("图片地址：-------------" + res.model.url);
            //that.sendChatMess(2, res.model.url);
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
  
  getChatList: function (page) {
    var that = this;
    Req.req_post(Api.getChatList({
      token: Api.getToken(),
      page: page
    }), "", function success(res) {
      
      that.setData({
        currentPage: res.data.currentPage,
        pageCount: res.data.pageCount,
        resultList: totalData,
      })
      wx.stopPullDownRefresh();
    }, function fail(res) {

    })
  },

  callMobile(){
      wx.makePhoneCall({
        phoneNumber: '400-618-2535'
      })
    
  },

  navigateTo(e) {
    var item = e.currentTarget.dataset.item
    if (item.unReadChatNums > 0) {
      wx.setStorageSync('hasNewMess', true);
    }
    wx.navigateTo({
      url: "/pages/chat/detail/index?customerId=" + item.id + "&realName=" + item.realName
    })
  }
})
