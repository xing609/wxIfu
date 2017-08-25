var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
import { $wuxButton } from '../../../components/wux'
const App = getApp()
Page({
  data: {
    types: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
    index: 3,
    opened: !1, 
    template: ''
  },
  onLoad: function (option) {
    this.initButton();
    if(option.from=="introduce"){//从方案简介进入
      if(option.templateId){
        this.getIntroduceTemplateInfo(option.templateId);
      }
    } else if (option.from="customer"){//从患者进入
      if (!option.customerId && !option.exthospitalId) {
        return
      }
      this.getCustomerTemplateInfo(option.customerId, option.exthospitalId);
    }
  },
  getCustomerTemplateInfo: function (customerId, customerExtHosp) {
    var that = this;
    Req.req_post(Api.getCustomerTemplateInfo({
      token: Api.getToken(),
      customerId: customerId,
      customerExtHosp: customerExtHosp
    }), "加载中", function success(res) {
      console.log(res);
      that.setData({
        template: res.data.model
      })
      if (res.data.model.templateName) {
        wx.setNavigationBarTitle({
          title: res.data.model.templateName,
        })
      }

    }, function fail(res) {
    })
  },
  getIntroduceTemplateInfo: function (templateId) {
    var that = this;
    Req.req_post(Api.getIntroduceTemplateDetail(templateId,{
      token: Api.getToken(),
     
    }), "加载中", function success(res) {
      console.log(res);
      that.setData({
        template: res.data.model
      })
      if (res.data.model.templateName) {
        wx.setNavigationBarTitle({
          title: res.data.model.templateName,
        })
      }

    }, function fail(res) {
    })
  },
  jumpToScalDetail(e){
    console.log("item-============" + e.currentTarget.dataset.item);
    var item = e.currentTarget.dataset.item;
    console.log("item-id============" + item.id);
    if (item.linkType ==0){//量表
      wx.navigateTo({
        url: "/pages/template/scale/index?linkPointId=" + item.id + "&linkId=" + item.linkId
      })
    }else{//须知
      wx.navigateTo({
        url: "/pages/template/knows/index?nodeId=" + item.linkId 
      })
    }
  },


initButton(position = 'bottomRight') {
    this.setData({
      opened: !1,
    })

    this.button = $wuxButton.init('br', {
      position: position,
      buttons: [
        {
          label: 'View on Github',
          icon: "../../../assets/images/iconfont-kefu.png",
        },
        {
          label: 'View on About',
          icon: "../../../assets/images/iconfont-kefu.png",
        },
        {
          label: 'View on Demo',
          icon: "../../../assets/images/iconfont-kefu.png",
        }
      ],
      buttonClicked(index, item) {
        index === 0 && wx.showModal({
          title: 'Thank you for your support!',
          showCancel: !1,
        })

        index === 1 && wx.switchTab({
          url: '/pages/about/index'
        })

        index === 2 && wx.switchTab({
          url: '/pages/index/index'
        })

        return true
      },
      callback(vm, opened) {
        vm.setData({
          opened,
        })
      },
    })
  },
  switchChange(e) {
    e.detail.value ? this.button.open() : this.button.close()
  },
  pickerChange(e) {
    const index = e.detail.value
    const position = this.data.types[index]
    this.initButton(position)
  },
})