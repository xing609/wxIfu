//获取应用实例
var app = getApp()

var arr_name = ["我的病人", "我的方案", "我的多中心项目", "待完成医用量表", "已收到量表", "未按时提交量表",]
var file = "../../pages/list/list"

Page({
    data: {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        loadingHidden: false,  // loading
        myCustomer:0,
        model:{},
        items: [{
          id: "1",
          src: "../../images/ic_about_us.png",
          num: 0,
          text: arr_name[0],
          
        }, {
          id: "2",
          src: "../../images/ic_about_us.png",
          num: 0,
          text: arr_name[1]
        }, {
          id: "3",
          src: "../../images/ic_about_us.png",
          num: 0,
          text: arr_name[2]
        }, {
          id: "4",
          src: "../../images/ic_about_us.png",
          num: 0,
          text: arr_name[3]
        }, {
          id: "5",
          src: "../../images/ic_about_us.png",
          num: 0,
          text: arr_name[4]
        }, {
          id: "6",
          src: "../../images/ic_about_us.png",
          num: 0,
          text: arr_name[5]
        }]
        
    },


    //事件处理函数
    swiperchange: function(e) {
        //console.log(e.detail.current)
    },

    onLoad: function() {
        console.log('onLoad')
        var that = this
            //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })

        //sliderList
        wx.request({
            url: 'http://huanqiuxiaozhen.com/wemall/slider/list',
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                that.setData({
                    images: res.data
                })
            }
        })
    


       //centerList
        wx.request({
          url: 'http://api.ifuifu.com/api/doctor/myIndex/statistics?token=caf55f5c7d7141b1ab9b38241a4984d5',
            method: 'POST',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function(model) {
                that.setData({
                    model:model.data.model
                   
                })
                setTimeout(function () {
                    that.setData({
                        loadingHidden: true
                    })
                }, 1500)
            }
        })

      
        
        //venuesList
        // wx.request({
        //     url: 'http://huanqiuxiaozhen.com/wemall/venues/venuesList',
        //     method: 'GET',
        //     data: {},
        //     header: {
        //         'Accept': 'application/json'
        //     },
        //     success: function(res) {
        //         that.setData({
        //             venuesItems: res.data.data
        //         })
        //         setTimeout(function () {
        //             that.setData({
        //                 loadingHidden: true
        //             })
        //         }, 1500)
        //     }
        // })

        //choiceList
        // wx.request({
        //     url: 'http://huanqiuxiaozhen.com/wemall/goods/choiceList',
        //     method: 'GET',
        //     data: {},
        //     header: {
        //         'Accept': 'application/json'
        //     },
        //     success: function(res) {
        //         that.setData({
        //             choiceItems: res.data.data.dataList
        //         })
        //         setTimeout(function () {
        //             that.setData({
        //                 loadingHidden: true
        //             })
        //         }, 1500)
        //     }
        // })

    }
})
