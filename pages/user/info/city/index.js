const App = getApp()
var Api = require('../../../../utils/api.js');
var Req = require('../../../../utils/req.js');
import { $wuxPrompt } from '../../../../components/wux'
var groupId;
Page({
  data: {
    resultList: [],
    childList: []
  },
  // 主专区方案
  getGroupCityList: function () {
    var that = this;
    Req.req_post(Api.chooseCity({
      token: Api.getToken(),
    }), "加载中", function success(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        resultList: res.data.resultList
      })
      if (res.data.resultList.length > 0) {
        var childBean = res.data.resultList[0];
        that.setData({//默认选中第一个
          'currentItem': childBean.id
        })
        groupId = childBean.id;
        that.getChildCityList(groupId);

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
  // 子专区方案
  getChildCityList: function (id) {
    var that = this;
    Req.req_post(Api.chooseCity({
      token: Api.getToken(),
      id: id
    }), "加载中", function success(res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        childList: res.data.resultList
      })
      wx.setStorageSync('hasChange', false);
    }, function fail(res) {
    })
  },

  onShow: function () {
    // if (wx.getStorageSync('hasChange')) {
    //   this.getTemplateChildList(groupId);
    // }
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: parseInt(res.windowHeight)
        })
      }
    });
    this.getGroupCityList();
  },
 
 
  navigateTo(e) {
    var id = e.currentTarget.dataset.id;
    if (id != null) {
      //设置当前样式
      this.setData({
        'currentItem': id,
        'currentChildItem': ""
      })
      this.getChildCityList(id);
    }
   
  },
  navigateChildTo(e) {
    var item = e.currentTarget.dataset.item;
    var bean = JSON.stringify(item);
    var that=this;
    that.setData({//默认选中第一个
      'currentChildItem': item.id
    })
    wx.navigateTo({
      url: "/pages/user/info/hospital/index?bean=" + bean
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.getTemplateGroupList();
  },
})