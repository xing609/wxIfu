const App = getApp()
var Api = require('../../../../utils/api.js');
var Req = require('../../../../utils/req.js');
import { $wuxPrompt } from '../../../../components/wux'
var groupId;
Page({
  data: {
    page:1,
    resultList: []
  },
  onLoad: function (option) {
    var bean = JSON.parse(option.bean);
    this.setData({
      areaId: bean.id
    })
    if (bean.name!=null){
      wx.setNavigationBarTitle({
        title: bean.name
      })
    }
    this.getHosptialList();
  },
  // 主专区方案
  getHosptialList: function () {
    var that = this;
    Req.req_post(Api.getHosptialList({
      token: Api.getToken(),
      areaId: that.data.areaId,
      page:that.data.page
    }), "加载中", function success(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        resultList: res.data.resultList
      })
      if (res.data.resultList.length > 0) {
        $wuxPrompt.init('msg3', {
          icon: '../../../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).hide();
      } else {
        $wuxPrompt.init('msg3', {
          icon: '../../../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).show();
      }
    }, function fail(res) {
    })
  },
  navigateTo(e) {
    var id = e.currentTarget.dataset.id;
    if (id != null) {
      //设置当前样式
      this.setData({
        'currentItem': id,
        'currentChildItem': ""
      })
    
    }

  },
  navigateChildTo(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    that.setData({//默认选中第一个
      'currentChildItem': id
    })
    // wx.navigateTo({
    //   url: "/pages/template/templateIntroduce/index?templateId=" + e.currentTarget.dataset.id
    // })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.getHosptialList();
  },
})