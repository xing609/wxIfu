const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var frompage;//哪个页面进入
Page({
  data: {
    pageCount: 0,
    currentPage: 0,
    resDesc: null,
    resultList: [],
    extHosptialList: []
  },
  //我的方案
  getMyTemplateList: function () {
    var that = this;
    Req.req_post(Api.getMyTemplateList({
      token: Api.getToken(),
      page: 1,
      tempname: "",
      type: 0,
    }), "加载中", function success(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (!res.data.resultList) {
        wx.showToast({
          title: '无可分配方案，请先去添加方案',
        })
        return
      }
      if (frompage == "home") {
        that.setData({
          resultList: res.data.resultList
        })
      } else if (frompage == "sendTemplate") {
        var mytemplateList = new Array();
        for (var i in res.data.resultList) {
          var bean = res.data.resultList[i];
          if (bean.status == 0) {//启用
            mytemplateList.push(bean);
          }
        }
        
        that.getExHosptialList(mytemplateList);
      }
    }, function fail(res) {
    })
  },
  onLoad: function (option) {
    frompage = option.from;
    var that = this;
    //来自首页
    this.getMyTemplateList();
  },
  //取随访记录列表
  getExHosptialList: function (canUseTempList) {
    var that = this;
    Req.req_post(Api.getCustomerExtHosptialList({
      token: Api.getToken(),
      customerId: Api.getCustomerId()
    }), "加载中", function success(res) {
      var recordList = res.data.resultList;
      var templateList = new Array();
      if (canUseTempList) {
        if (recordList) {
          for (var i in canUseTempList) {
            var bean = canUseTempList[i];
            var templateId = canUseTempList[i].id;
            var canUse = true;
            for (var j in recordList) {
              var recordId = recordList[j].templateId;
              if (templateId == recordId) {
                canUse = false;
              }
            }
            if (canUse) {
              templateList.push(bean);
            }
          }
        } else {
          templateList = canUseTempList;
        }
      }
      that.setData({
        resultList: templateList
      })
    }, function fail(res) {

    })
  },
  onLoad: function (option) {
    frompage = option.from;
    this.getMyTemplateList();
  },
  search() {
    App.WxService.navigateTo('/pages/search/index')
  },
  //item 点击事件
  navigateTo(e) {
    console.log("--------------------templateid=" + e.currentTarget.dataset.id);
    if (frompage == "home") {
      wx.navigateTo({
        url: "/pages/template/templateIntroduce/index?templateId=" + e.currentTarget.dataset.id
      })
    } else if (frompage == "sendTemplate") {
      wx.navigateTo({
        url: "/pages/template/confirmTemplate/index?templateId=" + e.currentTarget.dataset.id
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.getMyTemplateList();
  },
  //全部方案
  jumpToAllTemplate() {
    wx.navigateTo({
      url: "/pages/template/index"
    })
  }
})