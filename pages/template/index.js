const App = getApp()
var Api = require('../../utils/api.js');
var Req = require('../../utils/req.js');
import { $wuxPrompt } from '../../components/wux'
var groupId;
Page({
  data: {
    resultList: [],
    childList: []
  },
  // 主专区方案
  getTemplateGroupList: function () {
    var that = this;
    Req.req_post(Api.getTemplateGroupList({
      token: Api.getToken(),
      page: 1,
      specialtyId: ''
    }), "", function success(res) {
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
        that.getTemplateChildList(groupId);

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
      wx.setStorageSync('hasChange', false);
    }, function fail(res) {
    })
  },

  onShow:function(){
    if (wx.getStorageSync('hasChange')){
      this.getTemplateChildList(groupId);
    }
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
    this.getTemplateGroupList();
  },
  search() {
    App.WxService.navigateTo('/pages/search/index')
  },
  //加为我的方案
  addMyTemplate(e) {
    var that=this;
    var id = e.currentTarget.dataset.id;
    if (id) {
      var list=new Array();
      var bean=new Object();
      bean.id=id;
      list.push(bean);
      Req.req_post(Api.addMyTemplate({
        token: Api.getToken(),
        templateIds: JSON.stringify(list)
      }), "加载中", function success(res) {
        var newList = that.data.childList;
        if (newList) {
          for (var i in newList) {
            if (newList[i].id = id) {
              newList[i].hasTemplate=true;
              break;
            }
          }
        }
        that.setData({
          childList: newList
        })
        wx.showToast({
          title: '添加成功',
        })
        
      }, function fail(res) {
      })
    }
  },
  navigateTo(e) {
    var id = e.currentTarget.dataset.id;
    if(id!=null){
      //设置当前样式
      this.setData({
        'currentItem': id
      })
      wx.showToast({
        title: id+""
      })
      this.getTemplateChildList(id);
    }
    //console.log("--------------------templateGroupId=" + e.currentTarget.dataset.id);
    // wx.navigateTo({
    //   url: "/pages/template/templateChild/index?templateGroupId=" + e.currentTarget.dataset.id+"&title="+e.currentTarget.dataset.title
    // })
  },
  navigateChildTo(e) {
    wx.navigateTo({
      url: "/pages/template/templateIntroduce/index?templateId=" + e.currentTarget.dataset.id
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.getTemplateGroupList();
  },
})