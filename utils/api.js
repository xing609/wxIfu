'use strict';
var HOST_URI = 'http://apitest.ifuifu.com/';

var TOKEN = 'a002eb47616f4a348996b84bca9bbccc';
//微信登录
var OPENID_LOGIN ='api/common/thirdLogin';

//获取首页数量
var HOME_GEM_NUM ='api/doctor/myIndex/statistics';

//取聊天列表
var CHAT_GET_LIST ='api/common/chat/myFriendlist';

var MY_CUSTOMER_LIST ='api/doctor/customer/list';

//我的方案列表
var MY_TEMPLATE_LIST ='api/doctor/template/list';

function _openIdLogin(o){
  return reqUrl(OPENID_LOGIN,o);
}

//首页API
function _getHomeNum(o){
  return reqUrl(HOME_GEM_NUM, o);
}
//聊天API
function _getChatList(o){
  return reqUrl(CHAT_GET_LIST,o);
}

//我的病人列表
function _getMyCustomerList(o) {
  return reqUrl(MY_CUSTOMER_LIST,o);
}

//我的方案列表
function _getMyTemplateList(o){
  return reqUrl(MY_TEMPLATE_LIST,o);
}

//取token
function _getToken(){
  return TOKEN;
}

//我的API
// function _getNodeInfo(o){
// 	return reqUrl(SS);
// }




//带参数的请求
function reqUrl(url,o){
  return HOST_URI + url+'?'+_obj2uri(o);
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
module.exports = {
  getHomeNum:_getHomeNum,
  getChatList:_getChatList,
  openIdLogin:_openIdLogin,
  getToken:_getToken,
  getMyCustomerList:_getMyCustomerList,
  getMyTemplateList:_getMyTemplateList
};