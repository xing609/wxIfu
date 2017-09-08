const qiniuUploader = require("../../../utils/qiniuUploader");
//获取应用实例
const App = getApp()
const Api = require('../../../utils/api.js');
const Req = require('../../../utils/req.js');
var pagefrom;
Page({
  data: {
    uptoken: '',
    canEdit: true,
    showBtn: false,
    sexList: [
      {
        id: '0',
        text: '男',
        selected: false
      },
      {
        id: '1',
        text: '女',
        selected: false
      }],
    userInfo: {}
  },
  // 性别选择
  radioSexChange: function (e) {
    var id = e.currentTarget.dataset.id;

    console.log("单选：", id);
    var that = this;
    if (id != null) {
      this.setSex(id);
      var user = Api.getUser();
      user.sex = id;
      changeUserData(that, user);
    }
  },
  setSex(id) {
    if (id == '0') {
      this.setData({
        'sexList[0].selected': true
      })
    } else {
      this.setData({
        'sexList[1].selected': true
      })
    }
  },
  // 姓名修改
  doctorNameInput: function (e) {
    var that = this;
    if (e.detail.value) {
      this.setData({
        doctorName: e.detail.value
      })
      var user = Api.getUser();
      user.doctorName = e.detail.value;
      changeUserData(that, user);
    }
  },
  // 医院
  jumpToHosptial() {
    if (this.data.canEdit) {
      wx.navigateTo({
        url: "/pages/user/info/city/index"
      })
    }

  },
  // 科室
  jumpToDepart() {
    if (!this.data.canEdit) {
      return
    }
    if (this.data.userInfo.hospital == null) {
      wx.showToast({
        title: '请先选择医院',
      })
      return
    }

  },
  // 职称
  jumpToPosition() {

  },
  // 专业
  jumpToSpecialty() {

  },

  // 提交
  btnSubmit() {
    wx.navigateTo({
      url: "/pages/auth/index"
    })
  },
  editUserInfo(that, user) {
    Req.req_post(Api.editUserInfo({
      token: Api.getToken(),
      docBasic: user
    }), "提交中", function success(res) {
      wx.setStorageSync('user', res.data.model);
      that.setData({
        userInfo: res.data.model
      })
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1000
      });
    }, function fail(res) {
    });
  },
  getUserInfo(that) {
    Req.req_post(Api.getUserInfo({
      token: Api.getToken()
    }), "加载中", function success(res) {
      wx.setStorageSync('user', res.data.model);
      that.setData({
        userInfo: res.data.model
      })
      if (res.data.model != null) {
        console.log("sex----id=", res.data.model.sex);
        that.setSex(res.data.model.sex);
      }
    }, function fail(res) {

    })
  },

  //事件处理函数
  onLoad: function (option) {
    console.log('onLoad')
    var that = this;
    var title = "个人信息";
    var canEdit;
    var showBtn;
    pagefrom = option.from;
    if (pagefrom == 'userinfo') {
      title = "个人信息"
      canEdit = false;
      showBtn = false;
    } else if (pagefrom == 'edit') {
      title = "个人信息"
      canEdit = true;
      showBtn = false;
    } if (pagefrom == 'auth') {
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
    that.getUserInfo(that);
  },
  didPressChooesImage: function () {
    var that = this;
    didPressChooesImage(that);
  }
},
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

function changeUserData(that, user) {

  that.setData({
    userInfo: user
  });
  wx.setStorageSync('user', user);
  that.editUserInfo(that, JSON.stringify(user));
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
          that.changeUserData(user);
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
}






