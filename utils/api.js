'use strict';
var HOST_URI = 'http://apitest.ifuifu.com/';


//微信登录
var OPENID_LOGIN ='api/common/thirdLogin';

//获取首页数量
var HOME_GEM_NUM ='api/doctor/myIndex/statistics';

//取聊天列表
var CHAT_GET_LIST ='api/common/chat/myFriendlist';



function _openIdLogin(o){
  return reqUrl(OPENID_LOGIN,o);
}

//首页API
function _getHomeNum(o){
  return reqUrl(HOME_GEM_NUM, o);
}
//聊天API
function _getChatList(o){
  return HOST_URI + CHAT_GET_LIST + '?' + _obj2uri(o);
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
  openIdLogin:_openIdLogin
};