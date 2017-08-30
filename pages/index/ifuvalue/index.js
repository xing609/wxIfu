var App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
import { $wuxPrompt } from '../../../components/wux';
var totalData = [];
Page({
  data: {
    pageCount: 0,
    currentPage: 0,
    allcredic:0,
    resultList: []
  },
  onPullDownRefresh: function () {
    this.setData({
      currentPage: 1,
      resultList: []
    })
    this.getIfuValue(this.data.currentPage);
  },
  onLoad: function (option) {
    var allcredic = option.allcredic;
    this.setData({
      currentPage: 1,
      allcredic: allcredic,
      resultList: []
    })
    this.getIfuValue(this.data.currentPage);
  },
  //上拉回调
  onReachBottom: function () {
    var currentPage = this.data.currentPage + 1;
    if (currentPage <= this.data.pageCount) {
      this.setData({
        currentPage: currentPage,
      })
      this.getIfuValue(currentPage);
    }else{
      wx.showToast({
        title: '到底啦',
      })
    }
  },

  getIfuValue: function (page) {
    var that = this;
    Req.req_post(Api.getIfuValue({
      token: Api.getToken(),
      page: page,
    }), "", function success(res) {
      if (page != 1 && page <= that.data.pageCount) {
        if (res.data.resultList) {
          for (var i in res.data.resultList) {
            totalData.push(res.data.resultList[i])
          }
        }
      } else {
        totalData = res.data.resultList;
      }
      if (totalData.length > 0) {
        $wuxPrompt.init('msg3', {
          icon: '../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).hide();
      } else {
        $wuxPrompt.init('msg3', {
          icon: '../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).show();
      }
      that.setData({
        currentPage: res.data.currentPage,
        pageCount: res.data.pageCount,
        resultList: totalData
      })
    }, function fail(res) {

    })
  }
 
  
})