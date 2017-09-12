const qiniuUploader = require("../../../utils/qiniuUploader");
//获取应用实例
const App = getApp()
const Api = require('../../../utils/api.js');
const Req = require('../../../utils/req.js');
const Utils = require('../../../utils/util.js');
const Ifu = require('../../../utils/ifu.js');
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
  onShow: function () {
    var hasCommitAuth = wx.getStorageSync('hasCommitAuth');
    if (hasCommitAuth){
        wx.setStorageSync('hasCommitAuth',false);
        wx.switchTab({
          url: '/pages/user/index'
        })
    }
    var chooseType = wx.getStorageSync('chooseType');
    if (chooseType == null) {
      return
    }
    var user = Api.getUser();
    var chooseItem = wx.getStorageSync('chooseItem');
    var that = this;
    if (chooseType == 'chooseHospital') {
      if (chooseItem != null) {
        user.hospitalId = chooseItem.id;
        user.hospital = chooseItem.hospitalName;
        user.department = '';//选择医院后科室相应改变
        user.departmentId = '';
      }
      changeUserData(that, user);
    } else if (chooseType == 'chooseDept') {
      if (chooseItem != null) {
        user.department = chooseItem.departmentName;
        user.departmentId = chooseItem.departmentId;
      }
      changeUserData(that, user);
    } else if (chooseType == 'choosePosition') {
      if (chooseItem != null) {
        user.position = chooseItem.title;
        user.positionId = chooseItem.id;
        user.positionType = chooseItem.positionType;
      }
      changeUserData(that, user);
    } else if (chooseType == 'chooseSpecialty') {
      if (chooseItem != null) {
        user.specialtyName = chooseItem.title;
        user.specialtyId = chooseItem.id;
      }
      changeUserData(that, user);
    }
    wx.setStorageSync('chooseType', '');
  },
  // 认证信息
  clickAuthStatus() {
    wx.navigateTo({
      url: "/pages/auth/result/index?authStatus=" + this.data.strStatus + "&authimage=" + this.data.authimage
    })
  },
  // 姓名修改
  doctorNameInput: function (e) {
    var that = this;
    if (e.detail.value.length < 1) {
      wx.showToast({
        title: '姓名不能为空',
      })
      var user = Api.getUser();
      user.doctorName = e.detail.value;
      that.setData({
        userInfo: user
      })
      return
    }
    if (Utils.checkNumber(e.detail.value)) {
      wx.showToast({
        title: '姓名不能为纯数字',
      })
      return
    }
    var user = Api.getUser();
    user.doctorName = e.detail.value;
    changeUserData(that, user);
  },
  // 亚专业
  clickChildItem(e) {
    var index = e.currentTarget.dataset.index;
    var user = Api.getUser();
    var chooseList =user.templateGroupList;
    for (var i in chooseList){
      var bean = chooseList[i];
        if(i==index){
          if (bean.isSelected){
            bean.isSelected = false;
          }else{
            bean.isSelected = true;
          }
          break;
        }
    }
    var that=this;
    changeUserData(that, user);
  },

  // 简介
  doctorDescInput: function (e) {
    var that = this;
    console.log("doctorDesc:----------", e.detail.value);
    var user = Api.getUser();
    user.doctorDesc = e.detail.value;
    changeUserData(that, user);
  },
  nameAndSexClick() {
    if (!this.data.canEdit) {
      Ifu.callIfuService();
      return;
    }
  },

  // 医院
  jumpToHosptial() {
    if (!this.data.canEdit) {
      Ifu.callIfuService();
      return;
    }
    wx.navigateTo({
      url: "/pages/user/info/city/index"
    })

  },
  // 科室
  jumpToDepart() {
    if (!this.data.canEdit) {
      Ifu.callIfuService();
      return;
    }
    if (this.data.userInfo.hospital == null) {
      wx.showToast({
        title: '请先选择医院',
      })
      return
    } else {
      wx.navigateTo({
        url: "/pages/user/info/hospital/index?from=chooseDept" + "&hospitalId=" + this.data.userInfo.hospitalId
      })
    }

  },
  // 职称
  jumpToPosition() {
    if (!this.data.canEdit) {
      Ifu.callIfuService();
      return;
    }
    wx.navigateTo({
      url: "/pages/user/info/hospital/index?from=choosePosition"
    })
  },
  // 专业
  jumpToSpecialty() {
    if (!this.data.canEdit) {
      Ifu.callIfuService();
      return;
    }
    wx.navigateTo({
      url: "/pages/user/info/hospital/index?from=chooseSpecialty"
    })
  },

  // 提交
  btnSubmit() {
    var user = this.data.userInfo;
    if (user.doctorName == null || user.doctorName.length < 1) {
      wx.showToast({
        title: '请输入姓名',
      })
      return;
    }
    if (user.sex == null || user.sex.length < 1) {
      wx.showToast({
        title: '请选择性别',
      })
      return;
    }
    if (user.hospital == null || user.hospital.length < 1) {
      wx.showToast({
        title: '请选择医院',
      })
      return;
    }
    if (user.department == null || user.department.length < 1) {
      wx.showToast({
        title: '请选择科室',
      })
      return;
    }
    if (user.position == null || user.position.length < 1) {
      wx.showToast({
        title: '请选择职称',
      })
      return;
    }
    if (user.specialtyName == null || user.specialtyName.length < 1) {
      wx.showToast({
        title: '请选择职称',
      })
      return;
    }
    wx.navigateTo({
      url: "/pages/auth/index"
    })
  },
  editUserInfo(that, user) {
    if (user.templateGroupList!=null&&user.templateGroupList.length>0){
      var subTemplateGroupIds = Ifu.getSubTemplateGroupIdsId(user.templateGroupList);
      console.log("subTemplateGroupIds---------", subTemplateGroupIds);
      user.subTemplateGroupIds = subTemplateGroupIds;
    }
    Req.req_post(Api.editUserInfo({
      token: Api.getToken(),
      docBasic: JSON.stringify(user)
    }), "提交中", function success(res) {
      wx.setStorageSync('user', res.data.model);
      that.setData({
        userInfo: res.data.model
      })
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 300
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
    var strStatus;
    pagefrom = option.from;
    strStatus = option.strStatus;
    if (pagefrom == 'userinfo') {
      title = "个人信息"
      showBtn = false;
    } else if (pagefrom == 'edit') {
      title = "个人信息"
      showBtn = false;
    } if (pagefrom == 'auth') {
      title = "认证"
      showBtn = true;
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    switch (strStatus) {
      case '已认证':
        canEdit = false;
        break;
      case '认证失败':
        canEdit = true;
        break
      case '未认证':
        canEdit = true;
        break;
      case '认证中':
        canEdit = false;
        break
    }
    that.setData({
      strStatus: strStatus,
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
function hasAuth() {
  var flag = false;
  if (!this.data.canEdit) {
    wx.showModal({
      title: '修改认证信息，请联系客服',
      content: '400-618-2535',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-618-2535'
          })
        }
      }
    })
    return
  } else {
    flag = true;
  }
  return flag;
}



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
  that.editUserInfo(that, user);
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
          changeUserData(that, user);
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






