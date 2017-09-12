function callIfuService() {
    wx.showModal({
      title: '修改认证信息，请联系客服',
      content: '400-618-2535',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-618-2535'
          })
        }
      }
    })
}
function authStatus(auditStatus){
  switch (auditStatus) {
    case '0':
      return "已认证"
      break;
    case '6':
      return "认证失败"
      break;
    case '3':
      return "未认证"
    break
    case '2':
    case '5':
    case '4':
    case '1':
      return "认证中"
      break
  }
}
// 取亚专业id
function getSubTemplateGroupIdsId(chidlList){
  var id = '';
  if (chidlList != null && chidlList.length > 0) {
    for (var i in chidlList) {
      if (chidlList[i].isSelected) {
        id += chidlList[i].id + ",";
      }
    }
  }
  if (id != null && id.indexOf(',') >= 0) {
    id = id.substr(0, id.length - 1);
  }
  return id;
}


module.exports = {
  callIfuService: callIfuService,
  authStatus:authStatus,
  getSubTemplateGroupIdsId: getSubTemplateGroupIdsId
}
