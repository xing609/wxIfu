'use strict';
var HOST_URI = 'https://apitest.ifuifu.com/';
//开放平台医数医生端APPID
const COMPONENT_APP_ID="wx0cedb53c749e8372";
//小程序appid
const APP_ID ="wxd992a930df145349"


const WX_PAGE ="https://mp.weixin.qq.com/s?__biz=MzAwMzU1NjkxNQ==&mid=401971566&idx=6&sn=960fe14d513abb88a7540a325e836169";

const MS_PAGE_2 ="https://ms.ifuifu.com/index/detail/id/4808";
const MS_PAGE ="https://ms.ifuifu.com/index/detail/id/4803";
   
//微信登录
var OPENID_LOGIN = 'api/common/thirdLogin';
//获取首页数量
var HOME_GEM_NUM = 'api/doctor/myIndex/statistics';
//取聊天列表
var CHAT_GET_LIST = 'api/common/chat/myFriendlist';
//我的病人列表
var MY_CUSTOMER_LIST = 'api/doctor/customer/list';
//我的方案列表
var MY_TEMPLATE_LIST = 'api/doctor/template/list';
//登录
var LOGIN = 'api/doctor/op/login';
//个人信息
var USER_INFO = 'api/doctor/op/info';
//首页方案
var HOME_NEW_TEMPLATE = 'api/doctor/template/home';
//七牛云token
var GET_QINIU_TOKEN = 'api/media/getUploadToken';
//修改用户信息
var EDIT_USER_INFO = 'api/doctor/op/edit';
//患者详情
var GET_CUSTOMER_INFO = 'api/doctor/customer';
//进行中的方案
var GET_TEMPLATE_ING = 'api/doctor/customer/customerAllExtHospitalList';
//确认方案
var GET_TEMPLATE_DETAIL = 'api/doctor/template';
//登出
var LOGIN_OUT = "api/doctor/op/logout";
//确认方案
var SEND_TEMPLATE = "api/doctor/customer/confirm";
//随访方案库
var TEMPLATE_GROUP_LIST = "api/doctor/templategroup/list";
//方案分组
var TEMPLATE_COMMONLIST = "api/doctor/template/commonlist";
//方案简介
var TEMPLATE_INDRODUCE = "api/doctor/template/";
//第三方登录
var THIRD_LOGIN = "api/common/thirdLogin";
//未按时提交量表的患者
var NO_SUBMIT_CUSTOMER = "api/doctor/myIndex/getUnSurveyCustomers";
//批量提醒
var NOTICE_CUSTOMER = "api/doctor/myIndex/batchSendMsg";
//已收到量表
var RECEIVE_SURVEY ="api/doctor/myIndex/receiveSurvey";
//待完成的医用量表
var NEED_DOCTOR_SURVEY="api/doctor/myIndex/doctorSurveylist";
//获取新病人列表
var GET_NEW_CUSTOMER ="api/doctor/customer/list";
//患者方案详情
var GET_CUSTOMER_TEMPLATE_INFO ="api/doctor/customer/info";
//病程录
var GET_RECORD_LIST ="api/doctor/msgMedical/getRecordList";
//聊天详情
var CHAT_DETAIL ="api/common/chat/list";
//屏蔽
var BTN_SHIELD ="api/doctor/customer/imstatus";
//加标
var BTN_REMARK ="api/doctor/customer/edit";
//取随访记录列表
var GET_CUSTOMER_EXTHOSPTIAL_LIST="api/doctor/customer/customerExtHospitalList";
//停用方案
var STOP_TEMPLATE_TRODUCE ="api/doctor/template/stop";
//启用用方案
var START_TEMPLATE = "api/doctor/template/start";
//简介方案详情
var INTRODUCE_TEMPLATE_DETAIL ="api/doctor/template";
//量表详情
var SCALE_DETAIL ="api/doctor/survey";
//须知详情
var KNOWS_DETAIL ="api/doctor/notes";
//发送消息
var SEND_CHAT_MESS ="api/common/chat/sendMsg";
//加为我的方案
var ADD_MY_TEMPLATE ="api/doctor/template/choiceTempletes";
//终止方案
var STOP_TEMPLATE ="api/doctor/customer/deleteCustomerExtHospital";
//重置方案
var RETSETTING_TEMPLATE ="api/doctor/customer/resetting";
//医数值
var GET_IFU_VALUE ="api/doctor/credit/logList";
//量表答题
var SUBMIT_ANSWER ="api/doctor/survey/answer";
//修改患者信息
var EDIT_CUSTOMER_MARK ="api/doctor/customer/editCustomerAlias";
//提醒患者登记
var REMIND_CUSTOMER ="api/doctor/customer/finishCustomerExtHospital";
//获取验证码
var SEND_VERIFICATION ="api/phoneCode/sendVerification";
//注册
var USER_REGISTER ="api/doctor/op/register";
//获取亚专业信息
var GET_SPECIALTY_LIST="api/doctor/specialty/specialtyList"
//选择亚专业
var EDIT_SPECIALTY ="api/doctor/op/edit";
//找回密码
var FIND_PASSWORD ="api/doctor/op/retrieveDoctorPassword";
//认证状态
var GET_AUDIT_STATUS ="api/doctor/op/auditStatus";

//===========================================请求接口==================================================
function _getAuditStatus(o){
  return reqUrl(GET_AUDIT_STATUS,o);
}

function _findPassWord(o){
  return reqUrl(FIND_PASSWORD,o);
}

function _editSpecialtyList(o){
  return reqUrl(EDIT_SPECIALTY,o);
}

function _getSpecialtyList(o){
  return reqUrl(GET_SPECIALTY_LIST,o);
}

function _userRegister(o){
  return reqUrl(USER_REGISTER,o);
}

function _sendVerfication(o){
  return reqUrl(SEND_VERIFICATION,o);
}

function _remind_customer(o){
  return reqUrl(REMIND_CUSTOMER,o);
}

function _editCustomerMark(o){
  return reqUrl(EDIT_CUSTOMER_MARK,o);
}

function _submitAnswer(o){
  return reqUrl(SUBMIT_ANSWER,o);
}

function _getIfuValue(o){
  return reqUrl(GET_IFU_VALUE,o);
}

function _resettingTemplate(o){
  return reqUrl(RETSETTING_TEMPLATE,o);
}

function _stopTemplate(o){
  return reqUrl(STOP_TEMPLATE,o);
}

function _stopTemplateIntroduce(o) {
  return reqUrl(STOP_TEMPLATE_TRODUCE, o);
}
function _addMyTemplate(o){
  return reqUrl(ADD_MY_TEMPLATE,o);
}

function _sendChatMess(o){
  return reqUrl(SEND_CHAT_MESS,o);
}
function _getKnowDetail(noteId,o){
  return reqUrlId(KNOWS_DETAIL, noteId, o);
}

function _getScaleDetail(surveryId,o){
  return reqUrlId(SCALE_DETAIL,surveryId,o);
}

function _getIntroduceTemplateDetail(templateId, o) {
  return reqUrlId(INTRODUCE_TEMPLATE_DETAIL, templateId, o);
}
function _stopTeamplate(o){
  return reqUrl(STOP_TEMPLATE,o);
}
function _startTemplate(o){
  return reqUrl(START_TEMPLATE,o);
}
function _getCustomerExtHosptialList(o){
  return reqUrl(GET_CUSTOMER_EXTHOSPTIAL_LIST,o);
}

function _btnShield(o){
  return reqUrl(BTN_SHIELD,o);
}
function _btnRemark(o){
 return reqUrl(BTN_REMARK,o);
}

function _openIdLogin(o) {
  return reqUrl(OPENID_LOGIN, o);
}
function _login(o) {
  return reqUrl(LOGIN, o);
}
function _getHomeNum(o) {
  return reqUrl(HOME_GEM_NUM, o);
}
function _getChatList(o) {
  return reqUrl(CHAT_GET_LIST, o);
}
function _getMyCustomerList(o) {
  return reqUrl(MY_CUSTOMER_LIST, o);
}
function _getMyTemplateList(o) {
  return reqUrl(MY_TEMPLATE_LIST, o);
}
function _getUserInfo(o) {
  return reqUrl(USER_INFO, o);
}
function _getHomeNewTemplate(o) {
  return reqUrl(HOME_NEW_TEMPLATE, o);
}
function _getQiNiuToken(o) {
  return reqUrl(GET_QINIU_TOKEN, o);
}
function _editUserInfo(o) {
  return reqUrl(EDIT_USER_INFO, o);
}
function _getCustomerInfo(id, o) {
  return reqUrlId(GET_CUSTOMER_INFO, id, o);
}
function _getTemplateIng(o) {
  return reqUrl(GET_TEMPLATE_ING, o);
}
function _getTemplateDetail(templateId, o) {
  return reqUrlId(GET_TEMPLATE_DETAIL, templateId, o);
}
function _loginOut(o) {
  return reqUrl(LOGIN_OUT, o);
}
function _sendTemplate(o) {
  return reqUrl(SEND_TEMPLATE, o);
}
function _getTemplateGroupList(o) {
  return reqUrl(TEMPLATE_GROUP_LIST, o);
}
function _getTemplateCommonList(o) {
  return reqUrl(TEMPLATE_COMMONLIST, o);
}
function _getTemplateIntroduce(id, o) {
  return reqUrlId(TEMPLATE_INDRODUCE, id, o);
}
function _thirdLogin(o) {
  return reqUrl(THIRD_LOGIN, o);
}
function _unSurveyCustomers(o) {
  return reqUrl(NO_SUBMIT_CUSTOMER, o);
}
function _batchSendMsg(o) {
  return reqUrl(NOTICE_CUSTOMER, o);
}
function _receiveSurvey(o){
  return reqUrl(RECEIVE_SURVEY,o);
}
function _needDoctorSurvey(o){
  return reqUrl(NEED_DOCTOR_SURVEY,o);
}
function _getNewCustomer(o){
  return reqUrl(GET_NEW_CUSTOMER,o);
}
function _getCustomerTemplateInfo(o){
  return reqUrl(GET_CUSTOMER_TEMPLATE_INFO,o);
}
function _getRecordList(o){
  return reqUrl(GET_RECORD_LIST,o);
}
function _chatDetail(o){
  return reqUrl(CHAT_DETAIL,o);
}
//========================================cache缓存=========================================
//用户帐号
function _getLoginName(){
  return wx.getStorageSync('loginName');
}

//密码
function _getPsw(){
  return wx.getStorageSync('psw');
}

//取token
function _getToken() {
  return wx.getStorageSync('token');
}

//取用户信息
function _getUser() {
  return wx.getStorageSync('user');
}

//取选中当前患者的ID
function _getCustomerId() {
  return wx.getStorageSync('customerId');
}

//==========================================================================================

//带参数的请求
function reqUrl(url, o) {
  return HOST_URI + url + '?' + _obj2uri(o);
}

//带id
function reqUrlId(url, id, o) {
  return HOST_URI + url + "/" + id + '?' + _obj2uri(o);
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
  getAuditStatus: _getAuditStatus,
  findPassWord: _findPassWord,
  editSpecialtyList: _editSpecialtyList,
  getSpecialtyList: _getSpecialtyList,
  userRegister:_userRegister,
  sendVerfication:_sendVerfication,
  remindCustomer: _remind_customer,
  editCustomerMark: _editCustomerMark,
  submitAnswer: _submitAnswer,
  getIfuValue: _getIfuValue,
  resettingTemplate: _resettingTemplate,
  stopTemplate: _stopTemplate,
  addMyTemplate: _addMyTemplate,
  sendChatMess:_sendChatMess,
  getKnowsDetail:_getKnowDetail,
  getScaleDetail:_getScaleDetail,
  getCompnentAppId: COMPONENT_APP_ID,
  getAppId: APP_ID,
  msPage: MS_PAGE,
  msPage2: MS_PAGE_2,
  wxPage: WX_PAGE,
  login: _login,
  getHomeNum: _getHomeNum,
  getChatList: _getChatList,
  openIdLogin: _openIdLogin,
  getLoginName:_getLoginName,
  getPsw:_getPsw,
  getToken: _getToken,
  getUser: _getUser,
  getCustomerId: _getCustomerId,
  getMyCustomerList: _getMyCustomerList,
  getMyTemplateList: _getMyTemplateList,
  getUserInfo: _getUserInfo,
  getHomeNewTemplate: _getHomeNewTemplate,
  getQiNiuToken: _getQiNiuToken,
  editUserInfo: _editUserInfo,
  getCustomerInfo: _getCustomerInfo,
  getTemplateIng: _getTemplateIng,
  getTemplateDetail: _getTemplateDetail,
  loginOut: _loginOut,
  sendTemplate: _sendTemplate,
  getTemplateGroupList: _getTemplateGroupList,
  getTemplateCommonList: _getTemplateCommonList,
  getTemplateIntroduce: _getTemplateIntroduce,
  thirdLogin: _thirdLogin,
  unSurveyCustomers: _unSurveyCustomers,
  batchSendMsg: _batchSendMsg,
  receiveSurvey: _receiveSurvey,
  needDoctorSurvey: _needDoctorSurvey,
  getNewCustomer: _getNewCustomer,
  getCustomerTemplateInfo: _getCustomerTemplateInfo,
  getRecordList: _getRecordList,
  chatDetail: _chatDetail,
  btnShield:_btnShield,
  btnRemark:_btnRemark,
  getCustomerExtHosptialList: _getCustomerExtHosptialList,
  stopTemplateIntroduce: _stopTemplateIntroduce,
  startTemplate:_startTemplate,
  getIntroduceTemplateDetail:_getIntroduceTemplateDetail
};