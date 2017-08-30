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
var canEdit=false;//是否可以答题
Page({
  data: {
    model: "",
    questionList: [],
    linkId: linkId,
    linkPointId: linkPointId,
    customerExtHosp: '',
    hasChange: hasChange,
    canEdit: canEdit
  },

  onLoad: function (option) {
    linkId = option.linkId;
    linkPointId = option.linkPointId;
    isAnswer = option.isAnswer;
    customerExtHosp = option.customerExtHosp;
    customerId = option.customerId;
    canEdit=option.canEdit;

    if(canEdit){
      wx.setNavigationBarTitle({ title: "填写量表" })
    }else{
      wx.setNavigationBarTitle({ title: "量表详情" })
    }
   
    if (linkId && linkPointId) {
      this.setData({
        linkId: linkId,
        linkPointId: linkPointId,
        customerExtHosp: customerExtHosp,
        canEdit:!canEdit
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
    var model = res.data.model;
    var that = this;
    model = res.data.model;
    if (model.isFinished) {//填写过表单
      if (res.data.model.modifyDate) {
        model.modifyDate = util.formatTime(new Date(model.modifyDate));
      }
      // 是否修改过表单
      if (model.isDoctorOnly != null && model.isDoctorOnly == 0) {
        hasChange=false;
      } else {
        if (model.doctorName != null) {
          hasChange = true;
        } else {
          hasChange = false;
        }
      }
    }else{
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
  },
  //下拉刷新
  onPullDownRefresh: function () {
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
    console.log(url + "/");
    if (url) {
      var picArray = new Array();
      picArray.push(url);
      wx.previewImage({
        current: picArray[0],
        urls: picArray
      })
    }
  }
})