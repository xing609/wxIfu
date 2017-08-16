var App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var Tools = require('../../../utils/tools.js');
var totalData = [];
Page({
  data: {
    pageCount: 1,
    currentPage: 1,
    toId:"",
    resultList: []
  },
  onLoad: function (option) {
    if (option.customerId){
      this.setData({
        toId: option.customerId
      })
      this.getChatDetail(this.data.currentPage);
    }
    if(option.realName){
      wx.setNavigationBarTitle({
        title: option.realName
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentPage: 1,
      resultList: []
    })
    this.getChatDetail(1);
  },
  //上拉回调
  onReachBottom: function () {
    var currentPage = this.data.currentPage + 1;
    if (currentPage <= this.data.pageCount) {
      this.setData({
        currentPage: currentPage,
      })
      this.getChatDetail(currentPage);
    }
  },
  getChatDetail: function (page) {
    var that = this;
    Req.req_post(Api.chatDetail({
      token: Api.getToken(),
      toId: that.data.toId,
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

      if(totalData){
          for(var j in totalData){
            var message = totalData[j];
            var upDate = 0;
            if (j > 0) {
              upDate = new Date(totalData[j - 1].createTime);
            }
            var nextDate = new Date(message.createTime);
            var min = parseInt((nextDate - upDate) / 60000);
            if (min < 1) {//两条聊天记录5分钟内的不显示时间
              message.createTimeStr = null;
            } else {
              message.createTimeStr = Tools.dateToShortTimeString(new Date(message.createTime));
            }
          }
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
  //进入患者详情
  navigateTo(e) {
    var sendId = e.currentTarget.dataset.sendid;
    console.log("===============sendid=" + sendId);
    if(sendId){
      wx.navigateTo({
        url: "/pages/mycustomer/detail/index?customerId=" + sendId
      })
    }
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.rightAudio= wx.createAudioContext('rightAudio')
  },
  audioPlay: function () {
    this.rightAudio = wx.createAudioContext('rightAudio');
    this.rightAudio.play()
    wx.showToast({
      title: 'play',
    })
  },
  audioPause: function () {
    this.rightAudio.pause()
  },
  audio14: function () {
    this.rightAudio.seek(14)
  },
  audioStart: function () {
    this.rightAudio.seek(0)
  },

  //语音播放
  playRightVoice(e){
    var path = e.currentTarget.dataset.rightvoice;
    //var path="http://qqma.tingge123.com:823/mp3/2015-06-13/1434188181.mp3";
    console.log("log----path=" + path);
    wx.showToast({
      title: 'click'+path,
    })


    wx.playVoice({
      filePath: path,
      complete: function () {
        wx.showToast({
          title: 'ok',
        })
      }
    })

    wx.saveFile({
      tempFilePath: path,
      success: function (res) {
        var savedFilePath = res.savedFilePath

        console.log("log----save="+savedFilePath);
        if (savedFilePath) {
          wx.showToast({
            title: 'play',
          })
          wx.playVoice({
            filePath: savedFilePath,
            complete: function () {
            }
          })
        }
      }
    })
  
   
    
  },
  playLeftVoice(e) {
    //var tempFilePath = e.currentTarget.dataset.leftvoice;
    var tempFilePath = "http://qqma.tingge123.com:823/mp3/2015-06-13/1434188181.mp3";
    if (tempFilePath) {
      wx.showToast({
        title: 'play',
      })
      wx.playVoice({
        filePath: tempFilePath,
        complete: function () {
          wx.showToast({
            title: 'over',
          })
        }
      })
    }
  },
  //图片预览
  previewImage: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.imgurl;
    if (url) {
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
})
