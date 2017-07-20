var wxbarcode = require("../../../utils/index.js");
const Api = require('../../../utils/api.js');
Page({
    data: {
        code: '',
        userInfo:{}
    },

    onLoad: function() {
      this.getUserInfo();
    },
    getUserInfo:function() {
      var that=this;
      var userInfo = Api.getUser();
      var code =userInfo.weixinUrl;
      console.log("---------myqrcode=" + code);
      if(code){
        wxbarcode.qrcode('qrcode', code, 380, 380);
      }
      console.log("---------userInfo=" + userInfo);
      if (userInfo) {
        this.setData({
          userInfo: userInfo,
        })
        return
      }
    },
})


