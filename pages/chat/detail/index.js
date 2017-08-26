var App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
var util = require('../../../utils/util.js');
const qiniuUploader = require("../../../utils/qiniuUploader");
var totalData = [];

Page({
  data: {
    pageCount: 1,
    currentPage: 1,
    toId: "",
    resultList: [],
    uptoken: '',
    speak: "按住录音"
  },
  onLoad: function (option) {
    if (option.customerId) {
      this.setData({
        toId: option.customerId
      })
      this.getChatDetail(this.data.currentPage);
    }
    if (option.realName) {
      wx.setNavigationBarTitle({
        title: option.realName
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var currentPage = this.data.currentPage + 1;
    if (currentPage <= this.data.pageCount) {
      this.setData({
        currentPage: currentPage,
      })
      this.getChatDetail(currentPage);
    } else {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '拉取完毕',
      })
    }
  },
  //取聊天列表
  getChatDetail: function (page) {
    var that = this;
    Req.req_post(Api.chatDetail({
      token: Api.getToken(),
      toId: that.data.toId,
      page: page
    }), "", function success(res) {
      if (page != 1 && page <= that.data.pageCount) {
        if (res.data.resultList) {
          res.data.resultList.reverse();//先倒序数组
          Array.prototype.push.apply(res.data.resultList, totalData);//将老数据插入新数组
          totalData = res.data.resultList;
        }
      } else {
        totalData = res.data.resultList;
        totalData.reverse();
      }
      if (totalData) {
        for (var j in totalData) {
          var message = totalData[j];
          var upDate = 0;

          if (message.contentType == 3 && message.contentDuration != null) {
            message.contentDuration = parseInt(message.contentDuration)+"'" + "'";
          }

          if (j > 0) {
            upDate = new Date(totalData[j - 1].createTime);
          }
          var nextDate = new Date(message.createTime);
          var min = parseInt((nextDate - upDate) / 60000);
          if (min < 1) {//两条聊天记录5分钟内的不显示时间
            message.createTimeStr = null;
          } else {
            message.createTimeStr = util.formatTime(new Date(message.createTime));
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
    if (sendId) {
      wx.navigateTo({
        url: "/pages/mycustomer/detail/index?customerId=" + sendId
      })
    }
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.rightAudio = wx.createAudioContext('rightAudio')
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
  playVoice(e) {
    var path = e.currentTarget.dataset.voiceurl;
    if (path) {
      if (path.indexOf("http") >= 0) {
        path = path.replace('http', 'https');
      }
    }
    if (!path) {
      wx.showToast({
        title: '未获取到播放地址',
      })
      return
    }
    console.log("play-right-voice----=" + path);
    //开始下载
    wx.downloadFile({
      url: path,
      success: function (res) {
        wx.playVoice({
          filePath: res.tempFilePath,
          complete: function () {
          }
        })
        // wx.saveFile({
        //   tempFilePath: res.tempFilePath,
        //   success: function (res) {
        //     var savedFilePath = res.savedFilePath

        //     console.log("log----save=" + savedFilePath);
        //     if (savedFilePath) {

        //       wx.playVoice({
        //         filePath: savedFilePath,
        //         complete: function () {
        //         }
        //       })
        //     }
        //   }
        // })
      }
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
        //当前显示下表
        current: picArray[0],
        //数据源
        urls: picArray
      })
    }
  },
  //发送消息
  sendChatMess(contentType, content) {
    var that = this;
    Req.req_post(Api.sendChatMess({
      token: Api.getToken(),
      contentType: contentType,
      toId: that.data.toId,
      contentDuration: 0,
      content: content
    }), "发送中", function success(res) {
      if (contentType == 1) {//文字
        that.setData({
          chatInput: ""
        })
      }
      that.setData({
        currentPage: 1,
        resultList: []
      })
      that.getChatDetail(1);
      wx.showToast({
        title: '发送成功',
      })

      wx.setStorageSync('hasNewMess', true);
    }, function fail(res) {
    })
  },

  chatInput: function (e) {
    this.setData({
      chatInput: e.detail.value
    })
  },
  // 初始化七牛相关参数
  initQiniu(upToken, type) {
    var options;
    switch (type) {//图片
      case 1:
        options = {
          region: 'ECN', // 华东区 /uptoken
          uptokenURL: 'https://qiniu.ifuifu.com',
          uptoken: upToken,
          domain: 'https://qiniu.ifuifu.com/img/origin',
          shouldUseQiniuFileName: true
        };
        break
      case 2:
        options = {//语音
          region: 'ECN', // 华东区 /uptoken
          uptokenURL: 'https://qiniu.ifuifu.com',
          uptoken: upToken,
          domain: 'https://qiniu.ifuifu.com/audio/origin',
          shouldUseQiniuFileName: true
        };
        break
      case 3:
        options = {//视频
          region: 'ECN', // 华东区 /uptoken
          uptokenURL: 'https://qiniu.ifuifu.com',
          uptoken: upToken,
          domain: 'https://qiniu.ifuifu.com/video/origin',
          shouldUseQiniuFileName: true
        };
        break
    }
    qiniuUploader.init(options);
  },
  didPressChooesImage() {
    var that = this;
    // 微信 API 选文件
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        // 交给七牛上传
        that.getQiNiuToken(that, filePath, 1);
      }
    })
  },
  getQiNiuToken(that, imgUrl, type) {
    Req.req_post(Api.getQiNiuToken({
      token: Api.getToken()
    }), "", function success(res) {
      that.setData({
        uptoken: res.data.model.token
      })
      that.initQiniu(res.data.model.token, type);
      qiniuUploader.upload(imgUrl, (res) => {
        if (res.resCode == '0000') {
          if (res.model.url) {

            console.log("图片地址：-------------" + res.model.url);
            that.sendChatMess(2, res.model.url);
          }
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'success',
            duration: 1000
          });
        }

      }, (error) => {
        console.log('error: ' + error);
      })
    }, function fail(res) {

    })
  },


  //手指按下 
  touchdown() {
    console.log("手指按下了...")
    wx.showToast({
      title: '开始录音',
    })
    console.log("new date : " + new Date)
    var that = this;
    //speaking.call(this);
    that.setData({
      isSpeaking: true,
      speak: "正在录音"
    })
    //开始录音 
    wx.startRecord({

      success: function (res) {
        //临时路径,下次进入小程序时无法正常使用 
        var tempFilePath = res.tempFilePath
        console.log("tempFilePath: " + tempFilePath)
        //持久保存 
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            //持久路径 
            //本地文件存储的大小限制为 100M 
            var savedFilePath = res.savedFilePath
            console.log("savedFilePath: " + savedFilePath)
            that.getQiNiuToken(that, savedFilePath, 2);
          }
        })
        wx.showToast({
          title: '录音成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          isSpeaking: false,
          speak: "按住录音"
        })

        // //获取录音音频列表 
        // wx.getSavedFileList({
        //   success: function (res) {
        //     var voices = [];
        //     for (var i = 0; i < res.fileList.length; i++) {
        //       //格式化时间 
        //       var createTime = new Date(res.fileList[i].createTime)
        //       //将音频大小B转为KB 
        //       var size = (res.fileList[i].size / 1024).toFixed(2);
        //       var voice = { filePath: res.fileList[i].filePath, createTime: createTime, size: size };
        //       console.log("文件路径: " + res.fileList[i].filePath)
        //       console.log("文件时间: " + createTime)
        //       console.log("文件大小: " + size)
        //       voices = voices.concat(voice);
        //     }
        //     _this.setData({
        //       voices: voices
        //     })
        //   }
        // })
      },
      fail: function (res) {
        //录音失败 
        wx.showToast({
          title: '录音的姿势不对!',
        })
      }
    })
  },

  //手指抬起 
  touchup() {
    console.log("手指抬起了...")
    this.setData({
      isSpeaking: false,
      speak: "按住录音"
    })
    clearInterval(this.timer)
    wx.stopRecord()
  },



  //发送
  btnSend() {
    if (!this.data.chatInput) {
      wx.showToast({
        title: '请输入发送内容',
      })
      return
    }
    this.sendChatMess(1, this.data.chatInput);
  }
},

);



