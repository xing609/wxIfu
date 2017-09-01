const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var util = require('../../../utils/util.js');
import { $wuxPrompt } from '../../../components/wux'
var frompage;//哪个页面进入
var linkId;
var linkPointId;
var isAnswer;
var customerExtHosp;
var customerId;
var hasChange = false;
var canEdit = false;//是否可以答题

var totalList
Page({
  data: {
    model: "",
    questionList: [],
    linkId: linkId,
    linkPointId: linkPointId,
    customerExtHosp: '',
    hasChange: hasChange,
    canEdit: canEdit,
    btnColor: "#F0F0F0"
  },

  onLoad: function (option) {
    linkId = option.linkId;
    linkPointId = option.linkPointId;
    isAnswer = option.isAnswer;
    customerExtHosp = option.customerExtHosp;
    customerId = option.customerId;
    canEdit = option.canEdit;

    console.log("customerExtHosp---------------" + customerExtHosp);
    if (canEdit) {
      wx.setNavigationBarTitle({ title: "填写量表" })
      totalList = new Array();//提交答题
    } else {
      wx.setNavigationBarTitle({ title: "量表详情" })
    }

    if (linkId && linkPointId) {
      this.setData({
        linkId: linkId,
        linkPointId: linkPointId,
        customerExtHosp: customerExtHosp,
        canEdit: !canEdit
      })
      this.getScaleDetail(linkId, linkPointId);
    }
  },
  getScaleDetail: function (linkId, linkPointId) {
    var that = this;
    if (isAnswer) {
      customerExtHosp = that.data.customerExtHosp;
      Req.req_post(Api.getScaleDetail(linkId, {
        token: Api.getToken(),
        linkPointId: linkPointId,
        customerExtHosp: customerExtHosp,
        customerId: customerId
      }), "加载中", function success(res) {
        that.initData(res);
      })
    } else {
      Req.req_post(Api.getScaleDetail(linkId, {
        token: Api.getToken(),
        linkPointId: linkPointId,
        customerId: 0
      }), "加载中", function success(res) {
        that.initData(res);
      })
    }
  },
  initData(res) {
    wx.stopPullDownRefresh() //停止下拉刷新
    var model = res.data.model;
    var that = this;
    model = res.data.model;
    if (model.isFinished) {//填写过表单
      if (res.data.model.modifyDate) {
        model.modifyDate = util.formatTime(new Date(model.modifyDate));
      }
      // 是否修改过表单
      if (model.isDoctorOnly != null && model.isDoctorOnly == 0) {
        hasChange = false;
      } else {
        if (model.doctorName != null) {
          hasChange = true;
        } else {
          hasChange = false;
        }
      }
    } else {
      hasChange = false;
    }
    var resultList = res.data.model.questionList;
    if (resultList != null) {
      for (var i in resultList) {
        var bean = resultList[i];
        var max = bean.optionList.length;//最大值
        if (bean.optionList != null) {
          for (var j in bean.optionList) {
            var item = bean.optionList[j];
            item.max = max;
          }
        }
      }
    }

    that.setData({
      model: model,
      questionList: resultList,
      hasChange: hasChange
    })

    //默认手绘题.填空题非必填
    if (canEdit && resultList.length > 0) {
      for (var i in resultList) {
        var bean = resultList[i];
        if (bean.questionType == 5) {
          var obj = new Object();
          obj.optionText = bean.optionList[0].pic;
          obj.questionId = bean.id;
          obj.id = "-1";

          console.log("手绘题--id---------------" + obj.questionId + "/" + obj.optionText);
          this.addDataForList(obj);
        } else if (bean.questionType == 3) {
          var obj = new Object();
          obj.optionText = "";
          obj.questionId = bean.id;
          obj.id = "-1";
          console.log("edit--id---------------" + obj.questionId + "/" + obj.optionText);
          this.addDataForList(obj);
        }
      }
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    if (this.data.questionList.length > 0) {
      wx.stopPullDownRefresh() //停止下拉刷新
      return;
    }
    linkId = this.data.linkId;
    linkPointId = this.data.linkPointId;
    this.getScaleDetail(linkId, linkPointId);
  },
  //全部方案
  jumpToAllTemplate() {
    wx.navigateTo({
      url: "/pages/template/index"
    })
  },
  //图片预览
  previewImage: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.imgurl;

    if (url) {
      var picArray = new Array();
      picArray.push(url);
      wx.previewImage({
        current: picArray[0],
        urls: picArray
      })
    }
  },
  //触摸填空题
  touchInput: function (e) {
    var item = e.currentTarget.dataset.item;
    this.setData({
      editem: item
    })
    console.log("填空题---------------" + item.id);
  },
  //填空
  inputEditContent: function (e) {
    var item = this.data.editem;
    var content = e.detail.value;
    var obj = new Object();
    obj.optionText = content;
    obj.questionId = item.id;
    obj.id = "-1";

    console.log("edit--id---------------" + obj.questionId + "/" + obj.optionText);
    this.addDataForList(obj);

  },

  //触摸打分题
  touchSlider: function (e) {
    var optionlist = e.currentTarget.dataset.optionlist;
    console.log('optionlist', optionlist.length);
    this.setData({
      optionlist: optionlist
    })
  },
  //打分题
  sliderChange: function (e) {
    console.log("打分题---------------" + e.detail.value);
    var index = e.detail.value;
    if (index > 0) {
      var item = this.data.optionlist[index - 1];
      console.log("sliderId---------------" + item.id);
      item.optionText = "";
      this.addDataForList(item);
    }

  },

  // 单选、判断题
  radioChange: function (e) {
    var item = e.currentTarget.dataset.item;
    item.optionText = "";
    this.addDataForList(item);
  },
  //checkbox触摸多选事件
  touchCheckBox: function (e) {
    var item = e.currentTarget.dataset.item;
    console.log('checkbox发生touch事件：', item.questionId + "/id=" + item.id);
    this.setData({
      cbitem: item
    })
  },
  // 多选
  checkboxChange: function (e) {
    var cbid = e.detail.value;
    var item = this.data.cbitem;
    if (cbid != null) {
      //var array = cbid;
      item.id = cbid.join(",");//数组转逗号字符串
    }

    console.log("多选 id-----------" + item.id);
    item.optionText = "";
    this.addDataForList(item);

  },
  //添加数据到集合
  addDataForList: function (item) {
    if (item != null) {
      console.log('发生选中事件，携带value值为：', item.questionId + "/id=" + item.id);
      var hasAnswer = false;
      if (totalList.length > 0) {
        for (var i in totalList) {
          var model = totalList[i];
          if (model.q == item.questionId) {
            totalList[i].o = item.id;
            if (item.optionText != null) {//填空和手绘题输入值
              totalList[i].v = item.optionText;
            } else {
              totalList[i].v = "";
            }
            hasAnswer = true;
            break;
          }
        }
      }
      if (!hasAnswer) {
        //添加选中对象
        var bean = new Object();
        bean.o = item.id;
        bean.q = item.questionId;
        if (item.optionText != null) {//填空和手绘题输入值
          bean.v = item.optionText;
        } else {
          bean.v = "";
        }
        totalList.push(bean);
      }
      console.log("totalList-----", totalList.length + "------Json 数组：" + JSON.stringify(totalList));
      for (var j in totalList) {
        console.log("item-id=", totalList[j].o + "-----questionId=" + totalList[j].q + "v=" + totalList[j].v);
      }
    }
    this.checkStatus();
  },

  //判断是否全部填写 
  checkStatus: function () {
    var totalSize = this.data.questionList.length;
    if (totalList.length > 0 && totalList.length == totalSize) {
      this.setData({
        btnColor: "#81d84b"
      })
      return true;
    } else {
      this.setData({
        btnColor: "#F0F0F0"
      })
      return false;
    }
  },
  //提交答案
  submitAnswer: function () {
    var that = this;
    if (that.checkStatus()) {
      Req.req_post(Api.submitAnswer({
        token: Api.getToken(),
        linkPointId: linkPointId,
        customerExtHosp: that.data.customerExtHosp,
        answerContent: JSON.stringify(totalList)
      }), "加载中", function success(res) {
        wx.setStorageSync('doctorHasAnswer', true);
        wx.setStorageSync('homeRefresh', true);//刷新主页
        wx.navigateBack({
        })
        wx.showToast({
          title: '提交成功',
        })
      })
    } else {
      wx.showToast({
        title: '请先填写所有量表再提交',
      })
    }
  }
})