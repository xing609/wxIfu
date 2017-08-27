const App = getApp()
var Api = require('../../utils/api.js');
var Req = require('../../utils/req.js');
import { $wuxPrompt } from '../../components/wux'
Page({
  data: {
    resultList: [],
    childList:[]
  },
  // 主专区方案
  getTemplateGroupList: function () {
    var that = this;
    Req.req_post(Api.getTemplateGroupList({
      token: Api.getToken(),
      page: 1,
      specialtyId:''
    }), "", function success(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        resultList: res.data.resultList
      })
      if(res.data.resultList.length>0){
        var childBean = res.data.resultList[0];
        var groupId=childBean.id;
        that.getTemplateChildList(groupId);

        $wuxPrompt.init('msg3', {
          icon: '../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).hide();
      }else{
        $wuxPrompt.init('msg3', {
          icon: '../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).show();
      }
    }, function fail(res) {
    })
  },
// 子专区方案
  getTemplateChildList: function (templateGroupId) {
    var that = this;
    Req.req_post(Api.getTemplateCommonList({
      token: Api.getToken(),
      page: 1,
      type: 1,
      tempname: '',
      templateGroupId: templateGroupId,

    }), "加载中", function success(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        childList: res.data.resultList
      })
    }, function fail(res) {
    })
  },

  onLoad: function () {
    var that = this;
   this.getTemplateGroupList();
  },
  search() {
    App.WxService.navigateTo('/pages/search/index')
  },
  navigateTo(e) {
    if (e.currentTarget.dataset.id){
      this.getTemplateChildList(e.currentTarget.dataset.id);
    } 
    //console.log("--------------------templateGroupId=" + e.currentTarget.dataset.id);
    // wx.navigateTo({
    //   url: "/pages/template/templateChild/index?templateGroupId=" + e.currentTarget.dataset.id+"&title="+e.currentTarget.dataset.title
    // })
  },
  navigateChildTo(e) {
    console.log("--------------------templateid=" + e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "/pages/template/templateIntroduce/index?templateId=" + e.currentTarget.dataset.id
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.getTemplateGroupList();
  },
})