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
      console.log(res.data)
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (res.data.resCode == '0000') {
        success(res)
      } else if (res.data.resCode = '403') {//无权限，需重新登录
        App.WxService.removeStorageSync('token');
        App.WxService.redirectTo('/pages/login/index');
      } else {
        fail(res)
      }
    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      console.log(res.data.resCode + "--------reqfail---------");
      fail(res)
    }
  })
}

//POST请求
function req_post(url, message, success, fail) {
  wx.showNavigationBarLoading()
  // if (message != "") {
  //   wx.showLoading({
  //     title: message,
  //   })
  // }
  wx.request({
    url: url,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      wx.hideNavigationBarLoading()
      // if (message != "") {
      //   wx.hideLoading()
      // }
      if (res.data.resCode == '0000') {
        success(res);
      } else {
        fail(res);
      }

      // else if(res.data.resCode = '403') {//无权限，需重新登录
      // App.WxService.removeStorageSync('token');
      // App.WxService.redirectTo('/pages/login/index');
    
    },
    fail: function (res) {
      wx.hideNavigationBarLoading();
      if (message != "") {
        wx.hideLoading();
      }
     if (res.data.resCode = '403') {//无权限，需重新登录
        App.WxService.removeStorageSync('token');
        App.WxService.redirectTo('/pages/login/index');
      }else{
       console.log(res.data.resCode + "--------reqfail---------");
       fail(res);
      }
      
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
        success(res.data)
      } else if (res.data.resCode ='403') {//无权限，需重新登录
        App.WxService.removeStorageSync('token');
        App.WxService.redirectTo('/pages/login/index');
      } else {
        fail(res);
      }
    },
    fail: function (res) {
      wx.hideNavigationBarLoading();
      // if (message != "") {
      //   wx.hideLoading()
      // }
      console.log(res.data.resCode + "--------reqfail---------");
      fail(res);
    }
  })

//显示loadin
  // function showLoading(mess) {
  //   if (mess!=""){
  //     wx.showLoading({
  //       title: "加载中",
  //       mask: true
  //     })
  //     setTimeout(function () {
  //       wx.hideLoading()
  //     }, 5000)
  //   }
    
  // }

}

module.exports = {
  req_post: req_post,
  req_get: req_get,
  req_json: req_json
}