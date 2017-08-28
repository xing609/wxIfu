// detail.js
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
const App = getApp()
var customerId;
var realName;
var customerExtHosp;
Page({
  data: {
    customer: {},
    resultList: [],
    customerId: '',
    doctorId: '',
  },

  onShow:function(){
    if (wx.getStorageSync('sendStatus')) {
      this.getCustomerInfo(customerId, customerExtHosp);
    }
  },
  
  onLoad: function (option) {
    console.log(option.customerId + "/" + option.customerExtHosp);
    if (option.customerId) {
      this.getCustomerInfo(option.customerId, option.customerExtHosp);
      //存选中患者id
      wx.setStorageSync('customerId', option.customerId);
      customerId = option.customerId;
      customerExtHosp = option.customerExtHosp;
    }
  },
  //分配方案
  sendTemplate() {
    wx.navigateTo({
      url: "/pages/template/mytemplate/index?from=sendTemplate"
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.getCustomerInfo(customerId, customerExtHosp);
  },
  //取患者信息
  getCustomerInfo: function (id, customerExtHosp) {
    var that = this;
    if (!customerExtHosp) {
      customerExtHosp = "";
    }
    Req.req_post(Api.getCustomerInfo(id, {
      token: Api.getToken(),
      customerExtHosp: customerExtHosp
    }), "加载中", function success(res) {
      realName = res.data.model.customerName;
      that.setData({
        doctorId: Api.getUser().id,
        customer: res.data.model
      })
      wx.setStorageSync('sendStatus', false);
      customerExtHosp = res.data.model.id;
      that.getTemplateIng(id);
    }, function fail(res) {

    })
  },
  //进行中的方案
  getTemplateIng: function (customerId) {
    var that = this;
    Req.req_post(Api.getTemplateIng({
      token: Api.getToken(),
      customerId: customerId
    }), "加载中", function success(res) {
      that.setData({
        resultList: res.data.resultList
      })
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, function fail(res) {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  //打电话
  callMobile() {
    if (this.data.customer.mobile) {
      wx.makePhoneCall({
        phoneNumber: this.data.customer.mobile
      })
    }
  },
  //进入方案
  navigateTo(e) {
    let that = this;
    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    //如果按下时间大于350为长按  
    var bean = JSON.stringify(e.currentTarget.dataset.bean);
    if (touchTime > 350) {
      var dialogArray = new Array();
      dialogArray.push("重置方案");
      dialogArray.push("替换方案");
      dialogArray.push("终止方案");
      var actionType;
      wx.showActionSheet({
        itemList: dialogArray,
        success: function (res) {
          switch (res.tapIndex) {
            case 0:
              actionType ="resetting";
              break;
            case 1:
              actionType="replace";
              break;
            case 2:
              actionType="stop";
              break;
          }
          if(actionType){
            wx.navigateTo({
              url: "/pages/template/confirmTemplate/index?template=" + bean + "&actionType=" + actionType
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    } else {
      var doctorId = e.currentTarget.dataset.doctorid;
      if (doctorId) {
        if (doctorId == this.data.doctorId) {
          wx.navigateTo({
            url: "/pages/template/detail/index?customerId=" + customerId + "&exthospitalId=" + e.currentTarget.dataset.exthospitalid + "&from=customer"
          })
        } else {
          wx.showToast({
            title: '无限查看此方案',
          })
        }
      }
    }
  },
  //进入病程录
  jumpToRecord(e) {
    var doctorId = e.currentTarget.dataset.doctorid;
    if (doctorId) {
      if (doctorId == this.data.doctorId) {
        wx.navigateTo({
          url: "/pages/mycustomer/record/index?customerId=" + customerId + "&templateId=" + e.currentTarget.dataset.templateid
        })
      } else {
        wx.showToast({
          title: '无限查看此方案',
        })
      }
    }
  },
  //更多信息
  jumpToCustomerInfo() {
    if (!customerExtHosp) {
      customerExtHosp = this.data.customer.id;
    }
    wx.navigateTo({
      url: "/pages/mycustomer/customerinfo/index?customerId=" + customerId + "&customerExtHosp=" + customerExtHosp
    })
  },
  //屏蔽
  btnShield() {
    var isblock = this.data.customer.isBlocked;
    var blockType = isblock ? "unblock" : "block";
    var bean = this.data.customer;
    var that = this;
    Req.req_post(Api.btnShield({
      token: Api.getToken(),
      type: blockType,
      customerId: customerId
    }), "加载中", function success(res) {
      bean.isBlocked = !isblock;
      that.setData({
        customer: bean
      })
      if (!isblock) {
        wx.showToast({
          title: '已屏蔽',
        })
      } else {
        wx.showToast({
          title: '取消屏蔽',
        })
      }

    }, function fail(res) {

    })
  },
  //加标
  btnMark() {
    var ismark = this.data.customer.mark;
    var markType = ismark ? false : true;
    var bean = this.data.customer;
    var that = this;
    Req.req_post(Api.btnRemark({
      token: Api.getToken(),
      mark: markType,
      customerExtHosp: that.data.customer.id
    }), "加载中", function success(res) {
      bean.mark = !ismark;
      that.setData({
        customer: bean
      })
      if (!ismark) {
        wx.showToast({
          title: '已加标',
        })
      } else {
        wx.showToast({
          title: '取消标记',
        })
      }
    }, function fail(res) {

    })
  },
  //聊天
  goChat() {
    wx.navigateTo({
      url: "/pages/chat/detail/index?customerId=" + customerId + "&realName=" + realName
    })
  },
  //按下事件开始  
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
  },

})