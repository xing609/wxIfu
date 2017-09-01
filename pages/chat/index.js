var App = getApp()
var Api = require('../../utils/api.js');
var Req = require('../../utils/req.js');
var util = require('../../utils/util.js');
import { $wuxPrompt } from '../../components/wux'
var totalData = [];
Page({
  data: {
    pageCount: 1,
    currentPage: 1,
    resultList: []
  },
  onLoad: function () {
    this.setData({
      currentPage: 1,
      resultList: []
    })
    this.getChatList(this.data.currentPage);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad();
  },
  onShow: function () {//检测是否有发送新消息
    var hasMess = wx.getStorageSync('hasNewMess');
    if (hasMess) {
      this.onLoad();
    }
  },

  //上拉回调
  onReachBottom: function () {
    var currentPage = this.data.currentPage + 1;
    if (currentPage <= this.data.pageCount) {
      this.setData({
        currentPage: currentPage,
      })
      this.getChatList(currentPage);
    }
  },
  getChatList: function (page) {
    var that = this;
    Req.req_post(Api.getChatList({
      token: Api.getToken(),
      page: page
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

      wx.setStorageSync('hasNewMess', false);
      if (totalData.length > 0) {
        for (var i in totalData) {
          var item = totalData[i];
          if (item.lastChat.createTime) {
            totalData[i].lastChat.createTime = util.formatTime(new Date(item.lastChat.createTime));
          }
        }
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
        resultList: totalData,
      })
      wx.stopPullDownRefresh();
    }, function fail(res) {

    })
  },

  navigateTo(e) {
    var item=e.currentTarget.dataset.item
    if (item.unReadChatNums>0){
      wx.setStorageSync('hasNewMess', true);
    }
    wx.navigateTo({
      url: "/pages/chat/detail/index?customerId=" + item.id + "&realName=" + item.realName
    })
  },
})
