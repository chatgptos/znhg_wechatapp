// authorize.js
var api = require('../../api.js');
var app = getApp();

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                // console.log(res.authSetting['scope.userInfo'])
                // console.log(res)

                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            //从数据库获取用户信息
                            // that.queryUsreInfo();
                            getApp().login();
                            //跳转
                            wx.redirectTo({
                                url: '/pages/user/user',
                            })
                            this.onLoad();
                        }
                    });
                }
            }
        })
    },
    bindGetUserInfo: function (e) {

        var parent_id = wx.getStorageSync('parent_id');
        console.log(parent_id)
        // console.log(e.detail.userInfo)


        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            // app.globalData.userInfo = e.detail.userInfo;
            //插入登录的用户的相关信息到数据库
            let that = this;
            getApp().login();
            that.queryUsreInfo();
            // that.insertUserInfo(e);
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”')
                    }
                }
            })
        }
    },
    //获取用户信息接口
    queryUsreInfo: function () {
        //跳转
        //绑定
        // app.getParent_id();
        //绑定
        // var parent_id = wx.getStorageSync('parent_id');
        // if (parent_id != 0) {
        //     getApp().bindParent({parent_id: parent_id});
        // }
        // app.pageOnLoad(this);
        wx.redirectTo({
            url: '/pages/user/user',
        });
        this.onLoad();
        // console.log('插入登录的用户')
        // var user_info = wx.getStorageSync("user_info");
        // console.log(user_info)
        // console.log(1111)
        // wx.getSetting({
        //     success: function (res) {
        //         if (res.authSetting['scope.userInfo']) {
        //             wx.navigateTo({
        //                 url: '/pages/index/index',
        //             })
        //         }else {
        //             //用户已经授权过
        //             getApp().login();
        //         }
        //     }
        // })
//     util.request(api.passport.login, { openid: app.globalData.openid}).then(function (res) {
//       if(res.code === 0){
//         console.log(res.data)
//
// //        app.globalData.userInfo = res.data;
//       }
//     })
    },
    //保存用户信息
    // insertUserInfo: function (res){
    // console.log(8888);
    //   console.log(res);
    // var data = {
    //   // openid: app.globalData.openid,
    //   nickName: res.detail.userInfo.nickName,
    //   avatarUrl: res.detail.userInfo.avatarUrl,
    //   province: res.detail.userInfo.province,
    //   city: res.detail.userInfo.city
    // };
    //   let that = this;
    //   //登入判断
    //   getApp().login();
    //   wx.navigateTo({
    //       url: '/pages/index/index'
    //   })
    // util.request(api.passport.login, data, 'POST').then(function (res) {
    //   if (res.code === 0) {
    //     console.log("小程序登录用户信息成功！");
    //
    //     //授权成功后，跳转进入小程序首页(正式环境应该在这里)
    //     wx.switchTab({
    //       url: '/pages/index/index'
    //     })
    //   }else{
    //     that.insertUserInfo(data);
    //   }
    // });

    // app.request({
    //     url: api.passport.login,
    //     success: function (res) {
    //
    //         if (res.code === 0) {
    //                 console.log("小程序登录用户信息成功！");
    //                 //授权成功后，跳转进入小程序首页(正式环境应该在这里)
    //                 wx.switchTab({
    //                   url: '/pages/index/index'
    //                 })
    //               }else{
    //                 that.insertUserInfo(data);
    //               }
    //
    //         // if (res.code == 0) {
    //         //     page.setData(res.data);
    //         //     wx.setStorageSync('pages_user_user', res.data);
    //         //     wx.setStorageSync("share_setting", res.data.share_setting);
    //         //     wx.setStorageSync("user_info", res.data.user_info);
    //         // }
    //     }
    // });

    //授权成功后，跳转进入小程序首页(展示效果用)
    // },

})


