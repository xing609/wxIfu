const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var actionType = 'send';
var endDate;
var nowDate;
var template;
var currentPointName;//当前节点
var currentPointDate;//节点日期
var time;
Page({
  data: {
    template: {},
    customer: {},
    startPoint: "",
    pointId: "",
    startDate: "",
    endDate: "",
    date: '',
    actionType: 'send',
    currentPointName: "",
    currentPointDate: '',
  },
  onLoad: function (option) {
    actionType = option.actionType;
    if (!actionType) {
      return;
    }
    if (option.template) {
      template = JSON.parse(option.template);
    }
    this.getCustomerInfo();
    var title = "分配方案"
    if (actionType == 'send') {
      title = "分配方案";
      nowDate = this.getNowFormatDate();
      Date.prototype.addDay = function (num) { if (!isNaN(num)) this.setDate(this.getDate() + parseInt(num)); return this; }//给日期原型加个方法
      endDate = new Date();//创建日期实例
      endDate.addDay(30);//调用原型方法加30天

      this.getTemplateDetail(option.templateId);
    } else if (actionType == 'stop') {
      title = "终止方案";
      var pointInfo = this.getPointInfoByTemplate(template);
      if (pointInfo) {
        currentPointName = pointInfo.currentPointName;
        currentPointDate = pointInfo.currentPointDate;
      }
    } else if (actionType == 'resetting') {
      nowDate = this.getNowFormatDate();
      Date.prototype.addDay = function (num) { if (!isNaN(num)) this.setDate(this.getDate() + parseInt(num)); return this; }//给日期原型加个方法
      endDate = new Date();//创建日期实例
      endDate.addDay(30);//调用原型方法加30天
      title = "重置方案";
      var pointInfo = this.getPointInfoByTemplate(template);
      if (pointInfo) {
        currentPointName = pointInfo.currentPointName;
        currentPointDate = pointInfo.currentPointDate;
      }

      this.getTemplateDetail(template.templateId);

    } else if (actionType == 'replace') {
      title = "替换方案";
    }

    this.setData({
      template: template,
      endDate: endDate,
      date: nowDate,
      actionType: actionType,
      currentPointDate: currentPointDate,
      currentPointName: currentPointName
    })
    wx.setNavigationBarTitle({
      title: title,
    })

  },

  //取节点信息
  getPointInfoByTemplate(template) {
    var that = this;
    if (!template) {
      return null;
    }
    var pointlist = template.templatePointList;
    if (!pointlist) {
      return null;
    }
    var currentPointId = 0;
    var currentPoint = ""; // 当前节点
    var currentPointDate = ""; // 当前节点日期
    var maxSize = pointlist.length;
    var unStartPoint = new Object(); // 未开始节点
    for (var i = 0; i < maxSize; i++) {
      var each = pointlist[i];
      var pointStatus = each.pointStatus;
      var currentTime = each.pointDate;
      if (pointStatus == 1) {
        // 获取当前节点和节点日期
        currentPoint = each.pointName;
        if (i == maxSize - 1) {
          // 如果当前节点是最后一个节点的话,则只显示当前节点的时间
          currentPointDate = that.getPointDate(currentTime) + " 开始";
        } else {
          // 否则显示当前节点时间到下一个节点的时间
          var nextTime = pointlist[i + 1].pointDate;
          currentPointDate = that.getPointDate(currentTime) + "--" + that.getPointDate(nextTime);
        }
      } else if (pointStatus == 0) {
        // 未开始节点
        if (!currentPoint && !currentPointDate) {
          // 当没有当前节点时
          if (null == unStartPoint) {
            // 获取第一个未开始的节点
            unStartPoint = each;
            if (i == maxSize - 1) {
              currentPointDate = that.getPointDate(currentTime) + " 开始";
            } else {
              var nextTime = pointlist[i + 1].pointDate;
              currentPointDate = that.getPointDate(currentTime) + "--" + that.getPointDate(nextTime);
            }
            currentPoint = unStartPoint.pointName;
            currentPointId = unStartPoint.id;
          }
        }
      }
    }
    //如果没有当前节点,同时也没有未开始的节点
    if (!currentPoint && !unStartPoint) {
      // 则直接获取最后一个节点
      var firstPoint = pointlist[pointlist.length - 1];
      currentPoint = firstPoint.pointName;
      currentPointDate = that.getPointDate(firstPoint.pointDate) + " 开始";
      currentPointId = firstPoint.id;
    }
    if (!currentPoint && !currentPointDate) {
      return null;
    }
    var point = new Object();
    point.currentPointName = currentPoint;
    point.currentPointDate = currentPointDate;
    point.currentPointId = currentPointId;
    return point;
  },
  //格式化日期
  getPointDate(pointDate) {
    if (pointDate && pointDate.indexOf("-") >= 0) {
      pointDate = pointDate.replace("-", "/");
    }
    return pointDate;
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
    if (actionType == 'send') {
      this.sendTemplate();
    } else if (actionType == 'stop') {
      this.stopTemplate();
    } else if (actionType == 'resetting') {
      this.resettingTemplate();
    } else if (actionType == 'replace') {

    }

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
    time = this.data.date + " 00:00:00";
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
    }), "加载中", function (res) {
      wx.showToast({
        title: '分配成功！',
        icon: 'success',
        duration: 2000
      });
      wx.setStorageSync('sendStatus', true);
      //返回
      wx.navigateBack({
      })
    }, function fail(res) {
    })
  },
  //终止方案
  stopTemplate: function () {
    var that = this;
    Req.req_post(Api.stopTemplate({
      token: Api.getToken(),
      customerExtHospId: that.data.template.customerExtHospitalId
    }), "加载中", function (res) {
      wx.showToast({
        title: '终止成功！',
        icon: 'success',
        duration: 2000
      });
      wx.setStorageSync('sendStatus', true);
      //返回
      wx.navigateBack({
      })
    }, function fail(res) {
    })
  },
  //重置方案
  resettingTemplate: function () {
    var that=this;
    time = that.data.date + " 00:00:00";
    Req.req_post(Api.resettingTemplate({
      token: Api.getToken(),
      pointId:that.data.template.id,
      pointName: that.data.startPoint,
      firstPointStartTime: time,
      customerExtHospId: that.data.template.customerExtHospitalId
    }), "加载中", function (res) {
      wx.showToast({
        title: '重置成功！',
        icon: 'success',
        duration: 2000
      });
      wx.setStorageSync('sendStatus', true);
      //返回
      wx.navigateBack({
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