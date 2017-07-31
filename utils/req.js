const App = getApp()
//GET请求
function req_get(url, message, success, fail) {
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: function (res) {
      wx.hideNavigationBarLoading()
      // if (message != "") {
      //   wx.hideLoading()
      // }
      if (res.data.resCode == '0000') {
        success(res);
      } else if (res.data.resCode == '403') {//无权限，需重新登录
        wx.removeStorageSync('token');
        wx.redirectTo({
          url: '/pages/login/index',
        });
      } else {
        console.log("--------reqfail---------" + res.data.resCode + "/" + res.data.resDesc);
        if (res.data.resCode) {
          wx.showToast({
            title: res.data.resDesc
          })
        }
        fail(res);
      }
    },
    fail: function (res) {
      wx.hideNavigationBarLoading();
      if (message != "") {
        wx.hideLoading();
      }
      fail(res);
    }
  })
}

function cbFail() {
  return res;
}

//POST请求
function req_post(url, message, success, fail) {
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (res.data.resCode == '0000') {
        success(res);
      } else if (res.data.resCode == '403') {//无权限，需重新登录
        wx.removeStorageSync('token');
        wx.redirectTo({
          url: '/pages/login/index',
        });
      } else {
        console.log("--------reqfail---------"+res.data.resCode +"/"+res.data.resDesc);
        if(res.data.resCode){
          wx.showToast({
            title: res.data.resDesc
          })
        }
        fail(res);
      }
    },
    fail: function (res) {
      wx.hideNavigationBarLoading();
      if (message != "") {
        wx.hideLoading();
      }
      fail(res);
    }
  })
}


//JSON传参
function req_json(url, params, message, success, fail) {
  wx.showNavigationBarLoading()
  // if (message != "") {
  //   wx.showLoading({
  //     title: message,
  //   })
  // }
  wx.request({
    url: url,
    dataType: JSON,
    header: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    success: function (res) {
      wx.hideNavigationBarLoading()
      // if (message != "") {
      //   wx.hideLoading()
      // }
      if (res.data.resCode == '0000') {
        success(res);
      } else if (res.data.resCode == '403') {//无权限，需重新登录
        wx.removeStorageSync('token');
        wx.redirectTo({
          url: '/pages/login/index',
        });
      } else {
        console.log("--------reqfail---------" + res.data.resCode + "/" + res.data.resDesc);
        if (res.data.resCode) {
          wx.showToast({
            title: res.data.resDesc
          })
        }
        fail(res);
      }
    },
    fail: function (res) {
      wx.hideNavigationBarLoading();
      if (message != "") {
        wx.hideLoading();
      }
      fail(res);
    }
  })
}

module.exports = {
  req_post: req_post,
  req_get: req_get,
  req_json: req_json
}