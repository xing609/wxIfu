const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var wxbarcode = require("../../../utils/index.js");
import { $wuxPrompt } from '../../../components/wux'
var frompage;//哪个页面进入
var oldTemplate;//原方案
Page({
  data: {
    pageCount: 0,
    currentPage: 0,
    resDesc: null,
    resultList: [],
    extHosptialList: [],

    animationData: "",
    showModalStatus: false,
    imageHeight: 0,
    imageWidth: 0,
    showModal: false,//是否显示弹窗
    bean:{},
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  onShow: function () {
    if (wx.getStorageSync('hasChange')) {
      this.getMyTemplateList();
    }
    if (wx.getStorageSync('sendStatus')) {
      //刚分配完或替换方案后返回
      wx.navigateBack({
      })
    }
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
      wx.setStorageSync('hasChange', false);
      if (frompage == "home") {
        that.setData({
          resultList: res.data.resultList
        })
        if (res.data.resultList.length > 0) {
          $wuxPrompt.init('msg3', {
            icon: '../../../assets/images/iconfont-empty.png',
            text: '暂时没有相关数据',
          }).hide();
        } else {
          $wuxPrompt.init('msg3', {
            icon: '../../../assets/images/iconfont-empty.png',
            text: '暂时没有相关数据',
          }).show();
        }
      } else if (frompage == "sendTemplate" || frompage == "replace") {
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
    if (frompage == "replace") {
      oldTemplate = option.template;
    }
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
      if (templateList.length > 0) {
        if (res.data.resultList.length > 0) {
          $wuxPrompt.init('msg3', {
            icon: '../../../assets/images/iconfont-empty.png',
            text: '暂时没有相关数据',
          }).hide();
        }
      } else {
        $wuxPrompt.init('msg3', {
          icon: '../../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).show();
      }
    }, function fail(res) {

    })
  },

  search() {
    App.WxService.navigateTo('/pages/search/index')
  },
  //item 点击事件
  navigateTo(e) {
    if (frompage == "home") {
      wx.navigateTo({
        url: "/pages/template/templateIntroduce/index?templateId=" + e.currentTarget.dataset.id
      })
    } else if (frompage == "sendTemplate") {
      wx.navigateTo({
        url: "/pages/template/confirmTemplate/index?templateId=" + e.currentTarget.dataset.id + "&actionType=send"
      })
    } else if (frompage == "replace") {
      wx.navigateTo({
        url: "/pages/template/confirmTemplate/index?templateId=" + e.currentTarget.dataset.id + "&actionType=replace" + "&oldTemplate=" + oldTemplate
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
  },
  //显示方案二维码弹窗
  showTemplateQr: function (e) {
    var bean=e.currentTarget.dataset.bean;
    var code = bean.weixinUrl;
    if (code!=null) {
      wxbarcode.qrcode('qrcode', code, 380, 380);
    }
    this.setData({
      bean:bean,
      showModal: true
    });
  },
  // 查看患者
  lookCustomer: function () {
    wx.navigateTo({
      url: "/pages/mycustomer/index"
    })
  },
  //关闭弹窗
  closeDialog:function(){
    this.setData({
      showModal: false
    });
  }
})