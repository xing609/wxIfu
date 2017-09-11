const App = getApp()
var Api = require('../../../../utils/api.js');
var Req = require('../../../../utils/req.js');
import { $wuxPrompt } from '../../../../components/wux'
import { $wuxDialog } from '../../../../components/wux'
var groupId;
var showType;
Page({
  data: {
    page: 1,
    resultList: []
  },
  prompt() {
    const that = this
    var content;
    if (showType == 'chooseDept') {
      content = '请输入科室名称';
    } else if (showType == 'chooseHospital') {
      content = '请输入医院名称';

    } else if (showType == 'choosePosition') {
      content = '请输入职称';
    }

    const alert = (content) => {
      $wuxDialog.alert({
        title: '提示',
        content: content,
      })
    }

    $wuxDialog.prompt({
      title: '提示',
      content: content,
      fieldtype: 'text',
      // password: !0,
      defaultText: '',
      placeholder: '请输入1-16个字符',
      maxlength: 16,
      onConfirm(e) {
        const value = that.data.$wux.dialog.prompt.response
        var o = new Object();
        console.log("showType-----------", showType);
        if (showType == 'chooseDept') {
          if (value == null) {
            wx.showToast({
              title: '请输入科室名称',
            })
            return
          }
          if (value != null && value.length < 2) {
            wx.showToast({
              title: '科室名称不能少于2个字',
            })
            return
          }
          o.departmentName = value;
          o.departmentId = '999';
        } else if (showType == 'chooseHospital') {

          if (value == null) {
            wx.showToast({
              title: '请输入医院名称',
            })
            return
          }
          if (value != null && value.length < 2) {
            wx.showToast({
              title: '医院名称不能少于2个字',
            })
            return
          }
          o.hospitalName = value
          o.id = '999';
        } else if (showType == 'choosePosition') {
          if (value == null) {
            wx.showToast({
              title: '请输入职称',
            })
            return
          }
          if (value != null && value.length < 2) {
            wx.showToast({
              title: '职称不能少于2个字',
            })
            return
          }
          o.title = value;
          o.id = '999';
          o.positionType = '0';
        }
        wx.setStorageSync('chooseType', showType);
        wx.setStorageSync('chooseItem', o);
        wx.setStorageSync('chooseClose', true);
        wx.navigateBack({

        })
      },
    })
  },
  onLoad: function (option) {
    var title;

    if (option.from == 'chooseDept') {
      title = '选择科室';
      this.setData({
        hospitalId: option.hospitalId,
        showType: option.from
      })
      this.getDeptList();
    } else if (option.from == 'chooseHospital') {

      var bean = JSON.parse(option.bean);
      title = bean.name;
      this.setData({
        areaId: bean.id,
        showType: option.from
      })
      this.getHosptialList();
    } else if (option.from == 'choosePosition') {
      title = '选择职称';
      this.setData({
        showType: option.from
      })
      this.getPositionList();
    } else if (option.from == 'chooseSpecialty'){
      title = '专业方向';
      this.setData({
        showType: option.from
      })
      this.getDoctorSpecialtyList();
    }
    showType = option.from;
    if (title != null) {
      wx.setNavigationBarTitle({
        title: title
      })
    }
  },
  // 获取医院列表
  getHosptialList: function () {
    var that = this;
    Req.req_post(Api.getHosptialList({
      token: Api.getToken(),
      areaId: that.data.areaId,
      page: that.data.page
    }), "加载中", function success(res) {
      that.initSuccess(res);
    }, function fail(res) {
    })
  },
  // 获取科室列表
  getDeptList: function () {
    var that = this;
    Req.req_post(Api.getDeptList({
      token: Api.getToken(),
      hospitalId: that.data.hospitalId,
      upDepId: '0'
    }), "加载中", function success(res) {
      that.initSuccess(res);
    }, function fail(res) {
    })
  },
  // 获取职称列表
  getPositionList: function () {
    var that = this;
    Req.req_post(Api.getPositionList({
      token: Api.getToken(),
    }), "加载中", function success(res) {
      that.initSuccess(res);
    }, function fail(res) {
    })
  },
  // 获取专业方向
  getDoctorSpecialtyList:function(){
    var that = this;
    Req.req_post(Api.getDoctorSpecialtyList({
      token: Api.getToken(),
      parentId:''
    }), "加载中", function success(res) {
      that.initSuccess(res);
    }, function fail(res) {
    })
  },

  initSuccess(res) {
    var that = this;
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    // 添加自定义
    var showType = this.data.showType;
    var list = res.data.resultList;
    if (showType != null && showType == 'chooseDept' || showType == 'chooseHospital' || showType == 'choosePosition') {
      var o = new Object();
      if (showType == 'chooseDept') {
        o.departmentName = "自定义";
        o.departmentId = '999';
      } else if (showType == 'chooseHospital') {
        o.hospitalName = '自定义'
        o.id = '999';
      } else if (showType == 'choosePosition') {
        o.title = '自定义';
        o.id = '999';
        o.positionType = '0';
      }
      list.push(o);

    }
    that.setData({
      resultList: list
    })
    if (res.data.resultList.length > 0) {
      $wuxPrompt.init('msg3', {
        icon: '../../../../assets/images/iconfont-empty.png',
        text: '暂时没有相关数据',
      }).hide();
    } else {
      $wuxPrompt.init('msg3', {
        icon: '../../../../assets/images/iconfont-empty.png',
        text: '暂时没有相关数据',
      }).show();
    }
  },
  navigateTo(e) {
    var item = e.currentTarget.dataset.item;
    var index = e.currentTarget.dataset.index;
    if (item != null) {
      if (index == this.data.resultList.length - 1) {
        this.prompt();
      } else {
        wx.setStorageSync('chooseType', this.data.showType);
        wx.setStorageSync('chooseItem', item);
        wx.setStorageSync('chooseClose', true);
        wx.navigateBack({

        })
      }
    }

  },
  navigateChildTo(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    that.setData({//默认选中第一个
      'currentChildItem': id
    })
    // wx.navigateTo({
    //   url: "/pages/template/templateIntroduce/index?templateId=" + e.currentTarget.dataset.id
    // })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.getHosptialList();
  },
})