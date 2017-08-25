const App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
import { $wuxPrompt } from '../../../components/wux'
var frompage;//哪个页面进入
var linkId;
var linkPointId;
Page({
  data: {
    model:"",
    questionList: [],
    linkId: linkId,
    linkPointId: linkPointId
  },
 
  onLoad: function (option) {
    linkId=option.linkId;
    linkPointId=option.linkPointId;
    if (linkId && linkPointId){
      this.setData({
        linkId: linkId,
        linkPointId: linkPointId
      })
      this.getScaleDetail(linkId, linkPointId);
    }
  },
  getScaleDetail: function (linkId, linkPointId){
      var that = this;
      Req.req_post(Api.getScaleDetail(linkId,{
        token: Api.getToken(),
        linkPointId:linkPointId
      }), "加载中", function success(res) {
        that.setData({
          model:res.data.model,
          questionList: res.data.model.questionList
        })
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