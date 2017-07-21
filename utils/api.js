'use strict';
var HOST_URI = 'http://apitest.ifuifu.com/';

//微信登录
var OPENID_LOGIN ='api/common/thirdLogin';
//获取首页数量
var HOME_GEM_NUM ='api/doctor/myIndex/statistics';
//取聊天列表
var CHAT_GET_LIST ='api/common/chat/myFriendlist';
//我的病人列表
var MY_CUSTOMER_LIST ='api/doctor/customer/list';
//我的方案列表
var MY_TEMPLATE_LIST ='api/doctor/template/list';
//登录
var LOGIN ='api/doctor/op/login';
//个人信息
var USER_INFO ='api/doctor/op/info';
//首页方案
var HOME_NEW_TEMPLATE ='api/doctor/template/home';
//七牛云token
var GET_QINIU_TOKEN ='api/media/getUploadToken';
//修改用户信息
var EDIT_USER_INFO ='api/doctor/op/edit';
//患者详情
var GET_CUSTOMER_INFO ='api/doctor/customer';
//进行中的方案
var GET_TEMPLATE_ING ='api/doctor/customer/customerAllExtHospitalList';
//确认方案
var GET_TEMPLATE_DETAIL ='api/doctor/template';



//===========================================请求接口==================================================
function _openIdLogin(o) {
  return reqUrl(OPENID_LOGIN, o);
}
function _login(o){
  return reqUrl(LOGIN,o);
}
function _getHomeNum(o){
  return reqUrl(HOME_GEM_NUM, o);
}
function _getChatList(o){
  return reqUrl(CHAT_GET_LIST,o);
}
function _getMyCustomerList(o) {
  return reqUrl(MY_CUSTOMER_LIST,o);
}
function _getMyTemplateList(o){
  return reqUrl(MY_TEMPLATE_LIST,o);
}
function _getUserInfo(o){
  return reqUrl(USER_INFO,o);
}
function _getHomeNewTemplate(o){
  return reqUrl(HOME_NEW_TEMPLATE,o);
}
function _getQiNiuToken(o){
  return reqUrl(GET_QINIU_TOKEN,o);
}
function _editUserInfo(o){
  return reqUrl(EDIT_USER_INFO,o);
}
function _getCustomerInfo(id,o){
  return reqUrlId(GET_CUSTOMER_INFO,id,o);
}
function _getTemplateIng(o){
  return reqUrl(GET_TEMPLATE_ING,o);
}
function _getTemplateDetail(templateId,o) {
  return reqUrlId(GET_TEMPLATE_DETAIL,templateId,o);
}


//========================================cache缓存=========================================

//取token
function _getToken(){
  return wx.getStorageSync('token');
}

//取用户信息
function _getUser(){
  return wx.getStorageSync('user');
}

//取选中当前患者的ID
function _getCustomerId(){
  return wx.getStorageSync('customerId');
}
//==========================================================================================

//带参数的请求
function reqUrl(url,o){
  return HOST_URI + url+'?'+_obj2uri(o);
}

//带id
function reqUrlId(url,id,o) {
  return HOST_URI + url +"/"+id+'?'+ _obj2uri(o);
}

//不带参数请求
function reqCon(url) {
  return HOST_URI + url + '?';
}
function _obj2uri(obj) {
  return Object.keys(obj).map(function (k) {
    return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
  }).join('&');
}
//===========================================导出===========================================
module.exports = {
  login:_login,
  getHomeNum:_getHomeNum,
  getChatList:_getChatList,
  openIdLogin:_openIdLogin,
  getToken:_getToken,
  getUser:_getUser,
  getCustomerId: _getCustomerId,
  getMyCustomerList:_getMyCustomerList,
  getMyTemplateList:_getMyTemplateList,
  getUserInfo:_getUserInfo,
  getHomeNewTemplate:_getHomeNewTemplate,
  getQiNiuToken: _getQiNiuToken,
  editUserInfo: _editUserInfo,
  getCustomerInfo: _getCustomerInfo,
  getTemplateIng: _getTemplateIng,
  getTemplateDetail: _getTemplateDetail

};