// detail.js
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
const App = getApp()
var customerId;
var customerExtHosp;
Page({
  data: {
    customer: {},
    hiddenBottom: false,
    resultList: []
  },
  onLoad: function (option) {
    var that = this;

    console.log(option.customerId + "/" + option.customerExtHosp + "/" + option.from);
    if (option.from == "newCustomer") {//新病人
      that.setData({
        hiddenBottom: false
      })
      wx.showToast({
        title: 'new',
      })
    } else {
      that.setData({
        hiddenBottom: true
      })
    }
    if (option.customerId) {
      this.getCustomerInfo(option.customerId, option.customerExtHosp);
      customerId = option.customerId;
      customerExtHosp = option.customerExtHosp;
      that.getTemplateIng(customerId);
    }

  }, //打电话
  callMobile() {
    if (this.data.customer.mobile) {
      wx.makePhoneCall({
        phoneNumber: this.data.customer.mobile
      })
    }
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
  //备注
  customerAliasInput: function (e) {
    var customer = this.data.customer;
    customer.customerAlias = e.detail.value;
    this.setData({
      customer: customer
    })
    this.editCustomerMark();
  },
  // 住院号
  customerCodeInput: function (e) {
    var customer = this.data.customer;
    customer.customerCode = e.detail.value;
    this.setData({
      customer: customer
    })
    this.editCustomerMark();
  },
  // 床位号
  bedNoInput: function (e) {
    var customer=this.data.customer;
    customer.bedNo = e.detail.value;
    this.setData({
      customer: customer
    })
    this.editCustomerMark();
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
      that.setData({
        customer: res.data.model
      })
    }, function fail(res) {

    })
  },
  //修改信息
  editCustomerMark: function () {
    var that = this;
    var customerAlias='';
    var customerCode='';
    var bedNo='';
    if (!customerExtHosp) {
      customerExtHosp = "";
    }
    Req.req_post(Api.editCustomerMark({
      token: Api.getToken(),
      customerExtHosp: customerExtHosp,
      customerAlias: that.data.customer.customerAlias,
      customerCode: that.data.customer.customerCode,
      bedNo: that.data.customer.bedNo
    }), "加载中", function success(res) {
       
    }, function fail(res) {

    })
  },
  //图片预览
  previewImage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var picArray = e.currentTarget.dataset.imgurl;
    console.log(picArray + "/" + index);
    if (picArray) {
      var urlArray = new Array();
      for (var i in picArray) {
        urlArray.push(picArray[i].url);
        console.log("url------" + picArray[i].url);
      }
      wx.previewImage({
        //当前显示下表
        current: urlArray[index],
        //数据源
        urls: urlArray
      })
    }
  }
  ,
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
    var realName = this.data.customer.customerName;
    wx.navigateTo({
      url: "/pages/chat/detail/index?customerId=" + customerId + "&realName=" + realName
    })
  },
  //分配方案
  sendTemplate() {
    wx.navigateTo({
      url: "/pages/template/mytemplate/index?from=sendTemplate"
    })
  },
})