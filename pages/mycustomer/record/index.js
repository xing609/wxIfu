var App = getApp();
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var app = getApp()
Page({
  data: {
    hasNotice: false,
    resultList: '',
    pageNum: 1,
    pageSize: 10,
    pageCount: 1,
    customerId: ''
  },
  onLoad: function (option) {
    var that = this;
    if (option.templateId && option.customerId) {
      that.setData({
        customerId: option.customerId,
        templateId: option.templateId
      })
    }
    this.getRecordList(this.data.templateId, this.data.customerId, this.data.pageNum, this.data.pageSize);
  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      pageNum: 1,
      pageSize: 10,
      pageCount: 1
    })
    this.onLoad();
  },
  getRecordList: function (templateId, customerId, pageNum, pageSize) {
    var that = this;
    Req.req_post(Api.getRecordList({
      token: Api.getToken(),
      templateId: templateId,
      customerId: customerId,
      pageNum: pageNum,
      pageSize: pageSize
    }), "", function success(res) {
      that.setData({
        resultList: res.data.resultList,
        pageNum: res.data.currentPage,
        pageSize: 10,
        pageCount: res.data.pageCount
      })

      wx.stopPullDownRefresh();
      that.setData({
        model: res.data.model
      })
    }, function fail(res) {
    })
  },
  //图片预览
  previewImage: function (e) {
    var that = this;
    //获取当前图片的下表
    //var groupindex = e.currentTarget.dataset.groupindex;
   // var index = e.currentTarget.dataset.index;
    var url = e.currentTarget.dataset.imgurl;
    console.log(url + "/");
    if (url){
      var picArray = new Array();
      picArray.push(url);
      wx.previewImage({
        //当前显示下表
        current: picArray[0],
        //数据源
        urls: picArray
      })
    }
  }
  // navigateTo(e) {
  //   console.log("jump--customerId=" + e.currentTarget.dataset.customerId);
  //   wx.navigateTo({
  //     url: "/pages/mycustomer/detail/index?customerId=" + e.currentTarget.dataset.customerId
  //   })
  // }

})  