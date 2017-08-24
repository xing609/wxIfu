var App = getApp()
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
import { $wuxPrompt } from '../../../components/wux'
Page({
  data: {
    pageCount: 0,
    currentPage: 0,
    resultList: []
  },
  onPullDownRefresh: function () {
    this.needDoctorSurvey();
  },
  needDoctorSurvey: function () {
    var that = this;
    Req.req_post(Api.needDoctorSurvey({
      token: Api.getToken(),
      page: 1,
    }), "", function success(res) {
      var num=0;
      var title = "待完成医用量表（" +num + "）";
      if(res.data.resultList.length>0){
        $wuxPrompt.init('msg3', {
          icon: '../../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).hide();
        num = res.data.total;
      }else{
        $wuxPrompt.init('msg3', {
          icon: '../../../assets/images/iconfont-empty.png',
          text: '暂时没有相关数据',
        }).show();
      }
      that.setData({
        resultList: res.data.resultList
      })
      wx.setNavigationBarTitle({ title: title })
      wx.stopPullDownRefresh();
    }, function fail(res) {

    })
  },
  onLoad: function () {
    var that = this;
    this.needDoctorSurvey();
  },
  jumpToUserInfo(e) {
    if (e.currentTarget.dataset.customerid && e.currentTarget.dataset.exthospitalid) {
      wx.navigateTo({
        url: "/pages/mycustomer/detail/index?customerId=" + e.currentTarget.dataset.customerid + "&customerExtHosp=" + e.currentTarget.dataset.exthospitalid
      })
    } else {
      wx.showToast({
        title: '未获取到参数',
      })
    }

  },
  navigateTo(e) {
    // wx.navigateTo({
    //   url: "/pages/mycustomer/detail/index?customerId=" + e.currentTarget.dataset.customerId + "&customerExtHosp=" + e.currentTarget.dataset.id
    // })
  }
})