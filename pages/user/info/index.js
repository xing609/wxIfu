const qiniuUploader = require("../../../utils/qiniuUploader");
//获取应用实例
const App = getApp()
const Api = require('../../../utils/api.js');
Page({
  data: {
    imageObject: {},
    uptoken: '',
    userInfo: {}
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    getUserInfo(that);
  },
  didPressChooesImage: function () {
    var that = this;
    didPressChooesImage(that);
  }
});
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

function getUserInfo(that) {
  wx.request({
    method: 'POST',
    url: Api.getUserInfo({
      token: Api.getToken()
    }),
    success: function (res) {
      wx.setStorageSync('user', res.data.model);
      that.setData({
        userInfo: res.data.model
      })
      setTimeout(function () {
        that.setData({
          loadingHidden: true
        })
      }, 1500)
    }
  })
}


function didPressChooesImage(that, uptoken) {
  // 微信 API 选文件
  wx.chooseImage({
    count: 1,
    success: function (res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      wx.showLoading({
        title: '上传中...',
      })
      getQiNiuToken(that,filePath);
    }
  })
}

function getQiNiuToken(that, imgUrl) {
  wx.request({
    method: 'POST',
    url: Api.getQiNiuToken({
      token: Api.getToken()
    }),
    success: function (res) {
      console.log("---------token-----------" + res.data.model.token);
      that.setData({
        uptoken: res.data.model.token
      })
      initQiniu(res.data.model.token);
      qiniuUploader.upload(imgUrl, (res) => {
        if(res.resCode=='0000'){
          if(res.model.url){
            var user = Api.getUser();
            user.face = res.model.url;
            that.setData({
              'imageURL': res.imageURL,
               userInfo: user
            });
            console.log("face-------------" + user.face + "/");
            //重新刷新缓存用户数据
            wx.setStorageSync('user',user);
            //开始修改
            editUserInfo(that, JSON.stringify(user));
          }
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
         
        }else{
          wx.showToast({
            title: '上传失败',
            icon: 'success',
            duration: 1000
          });
        }
        
      }, (error) => {
        console.log('error: ' + error);
      })
    }
  })


  //修改用户信息
  function editUserInfo(that, user) {
    wx.request({
      dataType: JSON,
      method: 'POST',
      url: Api.editUserInfo({
        token: Api.getToken(),
        docBasic: user
      }),
      success: function (res) {
        wx.setStorageSync('user', res.data.model);
        that.setData({
          userInfo: res.data.model
        })
        
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 1000
        });
        console.log("uploadface---------------ok");
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    })
  };


}






