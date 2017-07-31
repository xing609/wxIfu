const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');

Page({
  data: {
    template: {},
    customer: {},
    startPoint: "",
    pointId: "",
    startDate: "",
    endDate: "",
    date: '',

  },
  onLoad: function (option) {
    this.getCustomerInfo();
    var nowDate = this.getNowFormatDate();
    console.log("-----------------------nowDate----" + nowDate);

    Date.prototype.addDay = function (num) { if (!isNaN(num)) this.setDate(this.getDate() + parseInt(num)); return this; }//给日期原型加个方法
    var endDate = new Date();//创建日期实例
    endDate.addDay(30);//调用原型方法加30天

    console.log("endDATE---------"+endDate);

    var endDate =
      this.setData({
        startDate: nowDate,
        endDate: endDate,
        date: nowDate
      })
    this.getTemplateDetail(option.templateId);
  },


  //取患者信息
  getCustomerInfo: function () {
    var that = this;
    var customerId = Api.getCustomerId();
    var doctorId = Api.getUser().id;
    Req.req_post(Api.getCustomerInfo(customerId, {
      token: Api.getToken(),
      doctorId: doctorId,
      customerId: customerId

    }), "", function success(res) {
      that.setData({
        customer: res.data.model
      })
    }, function fail(res) {
    })
  },
  /**
   * 监听日期picker选择器
   */
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  //取方案详情
  getTemplateDetail: function (templateid) {
    var that = this;
    Req.req_post(Api.getTemplateDetail(templateid, {
      token: Api.getToken()
    }), "", function success(res) {
      that.setData({
        template: res.data.model,
        startPoint: res.data.model.startPoint,
        pointId: res.data.model.pointQuantity
      })
    }, function fail(res) {
    })
  },
  send() {
    this.sendTemplate();
  },

  //选择节点
  choosePoint() {
    var templatePointList = this.data.template.templatePointList;
    console.log("-----------节点长度：" + templatePointList.length);
    var array = new Array();
    for (var i in templatePointList) {
      array.push(templatePointList[i].pointName);
      if (i == 5) {
          break;
      }
    }

    var that = this;
    wx.showActionSheet({
      itemList: array,
      success: function (res) {
        console.log(res.tapIndex)
        that.setData({
          startPoint: templatePointList[res.tapIndex].pointName,
          pointId: templatePointList[res.tapIndex].id
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //分配方案
  sendTemplate: function () {
    var customer = this.data.customer;
    var template = this.data.template;
    var time = this.data.date + " 00:00:00";
    var pointId = this.data.pointId;
    var that = this;
    Req.req_post(Api.sendTemplate({
      token: Api.getToken(),
      customerId: Api.getCustomerId(),
      customerName: customer.customerName,
      templateId: template.id,
      templateName: template.templateName,
      pointId: pointId,
      firstPointStartTime: time,
      oldTemplateId: ""
    }), "", function (res) {
      wx.showToast({
        title: '分配成功！',
        icon: 'success',
        duration: 2000
      });
      //返回
      wx.navigateBack ({
      })
    }, function fail(res) {
    })
  },

  //yyyy-MM-dd HH:MM:SS
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    //+ " " + date.getHours() + seperator2 + date.getMinutes()+ seperator2 + date.getSeconds();
    return currentdate;
  }

})