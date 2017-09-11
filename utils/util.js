function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 验证手机号
function isMobile(mobile) {
  if (mobile==null||mobile.length == 0) {
    wx.showToast({
      title: '请输入手机号！',
      icon: 'success',
      duration: 1500
    })
    return false;
  }
  if (mobile.length != 11) {
    wx.showToast({
      title: '手机号长度有误！',
      icon: 'success',
      duration: 1500
    })
    return false;
  }
  var myreg = /^(((13[0-9]{1})|(11[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
    wx.showToast({
      title: '手机号有误！',
      icon: 'success',
      duration: 1500
    })
    return false;
  }
  return true;
}
// 是否为数字
function checkNumber(theObj) {
  var reg = /^[0-9]+.?[0-9]*$/;
  if (reg.test(theObj)) {
    return true;
  }
  return false;
}
module.exports = {
  formatTime: formatTime,
  isMobile: isMobile,
  checkNumber:checkNumber
}
