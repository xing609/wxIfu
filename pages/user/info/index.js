const qiniuUploader = require("../../../utils/qiniuUploader");
//获取应用实例
const App = getApp()
const Api = require('../../../utils/api.js');
const Req = require('../../../utils/req.js');
var pagefrom;
Page({
  data: {
    uptoken: '',
    canEdit:false,
    showBtn:false,
    sexList: [
      {
        id: '1',
        text: '男',
        selected:false
      },
      {
        id: '2',
        text: '女',
        selected: false
      }],
    userInfo: {}
  }, 
  // 提交
  btnSubmit() {
    wx.navigateTo({
      url: "/pages/auth/index"
    })
  },
  //事件处理函数
  onLoad: function (option) {
    console.log('onLoad')
    var that = this;
    var title="个人信息";
    var canEdit;
    var showBtn;
    pagefrom=option.from;
    if(pagefrom=='userinfo'){
      title = "个人信息"
      canEdit=false;
      showBtn=false;
    }else if(pagefrom=='edit'){
      title = "个人信息"
      canEdit = true;
      showBtn = false;
    }if (pagefrom=='auth'){
      title = "认证"
      canEdit = true;
      showBtn = true;
    }
    wx.setNavigationBarTitle({
      title: title,
    })

    that.setData({
      canEdit: canEdit,
      showBtn: showBtn
    })
    getUserInfo(that);
  },
  didPressChooesImage: function () {
    var that = this;
    didPressChooesImage(that);
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

function getUserInfo(that) {
  Req.req_post(Api.getUserInfo({
    token: Api.getToken()
  }), "加载中", function success(res) {
    wx.setStorageSync('user', res.data.model);
    that.setData({
      userInfo: res.data.model
    })
  }, function fail(res) {

  })
}


function didPressChooesImage(that, uptoken) {
  // 微信 API 选文件
  wx.chooseImage({
    count: 1,
    success: function (res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      getQiNiuToken(that, filePath);
    }
  })
}

function getQiNiuToken(that, imgUrl) {
  Req.req_post(Api.getQiNiuToken({
    token: Api.getToken()
  }), "", function success(res) {
    that.setData({
      uptoken: res.data.model.token
    })
    initQiniu(res.data.model.token);
    qiniuUploader.upload(imgUrl, (res) => {
      if (res.resCode == '0000') {
        if (res.model.url) {
          var user = Api.getUser();
          user.face = res.model.url;
          that.setData({
            'imageURL': res.imageURL,
            userInfo: user
          });
          console.log("face-------------" + user.face + "/");
          //重新刷新缓存用户数据
          wx.setStorageSync('user', user);
          //开始修改
          editUserInfo(that, JSON.stringify(user));
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

  //修改用户信息
  function editUserInfo(that, user) {
    Req.req_json(Api.editUserInfo({
      token: Api.getToken(),
      docBasic: user
    }),"提交中", function success(res) {
      wx.setStorageSync('user', res.data.model);
      that.setData({
        userInfo: res.data.model
      })
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 1000
      });
    }, function fail(res) {
    });
  }
 


}






