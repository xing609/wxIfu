var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
const App = getApp()
var idArray;//选中的
Page({
  data: {
    hasSelected:false
  },
  onLoad() {
    this.getSpecialty();
  },
  getSpecialty() {
    var that = this;
    Req.req_post(Api.getSpecialtyList({
      token: Api.getToken()
    }), "正在加载", function success(res) {
      that.setData({
        defaultList:res.data.resultList,
        resultList: res.data.resultList
      })
    }, function fail(res) {
    })
  },//进入首页
  btnGoHome() {
    if (this.data.hasSelected){
      this.editSpecialtyList();
    }else{
      wx.showToast({
        title: '请设定亚专业',
      })
    }
    
  },
  //跳过
  btnNext(){
    wx.switchTab({
      url: '/pages/index/index?from=login'
    })
    wx.setStorageSync('homeRefresh', true);
    wx.setStorageSync('hasNewMess', true);
  },
  //点击Group item
  clickItem(e) {
    var item = e.currentTarget.dataset.item;
    var groupIndex = e.currentTarget.dataset.index;
    if (this.data.groupIndex != groupIndex){
      idArray = new Array();
      this.setData({
        resultList: this.data.defaultList,
        currentItem: item.id,
        groupIndex: groupIndex,
        hasSelected: false
      })
    }
  },
  //点击子的item 
  clickChildItem(e) {
    var item = e.currentTarget.dataset.childitem;
    var childIndex = e.currentTarget.dataset.index;
    var resultList = this.data.resultList;
    var groupIndex = this.data.groupIndex;
    var groupItem;
    if (resultList != null && resultList.length > 0) {
      groupItem = resultList[groupIndex];
      var childItem = groupItem.templateGroupBasicList[childIndex]
      if (!childItem.isSelected) {
        childItem.isSelected = true;
      } else {
        childItem.isSelected = false;
      }
    }
    //添加选中数据
    var chidlList = groupItem.templateGroupBasicList;
    var id='';
    if(chidlList!=null&&chidlList.length>0){
      for (var i in chidlList) {
        if (chidlList[i].isSelected){
          id += chidlList[i].id+",";
        }
      }
    }
    var hasSelected=false;
    if(id!=null&&id.indexOf(',')>=0){
      id = id.substr(0, id.length - 1);  
      console.log("----------选中：", id);
      hasSelected=true;
    }
    this.setData({
      resultList: resultList,
      specialtyId:groupItem.id,
      specialtyName: groupItem.title,
      subTemplateGroupIds:id,
      hasSelected: hasSelected
    })
  },

  //编辑亚专业
  editSpecialtyList() {
    var user = Api.getUser();
    user.specialtyName = this.data.specialtyName;
    user.specialtyId = this.data.specialtyId;
    user.subTemplateGroupIds = this.data.subTemplateGroupIds;
    Req.req_post(Api.editSpecialtyList({
      token: Api.getToken(),
      docBasic: JSON.stringify(user)
    }), "正在加载", function success(res) {
      wx.showToast({
        title: '设定成功！',
      })
      wx.switchTab({
        url: '/pages/index/index?from=login'
      })
      wx.setStorageSync('homeRefresh', true);
      wx.setStorageSync('hasNewMess', true);
    }, function fail(res) {

    })
  }
})