//index.js
//获取应用实例

var api = require('../../api.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        contact_tel: "",
        show_customer_service: 0,
        user_center_bg: "/images/img-user-bg.png",
        user_info: {},
        userinfo: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.pageOnLoad(this);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    loadData: function (options) {
        var page = this;
        page.setData({
            store: wx.getStorageSync('store'),
        });
        var pages_user_user = wx.getStorageSync('pages_user_user');
        if (pages_user_user) {
            page.setData(pages_user_user);
        }
        app.request({
            url: api.user.index,
            success: function (res) {
                if (res.data.code == 0) {
                    page.setData(res.data);
                    wx.setStorageSync('pages_user_user', res.data);
                    wx.setStorageSync("share_setting", res.data.share_setting);
                    wx.setStorageSync("user_info", res.data.user_info);
                }
            },
            // complete: function (res) {
            // if(res.data.code == -1)
            // {
            //     var user_info = wx.getStorageSync('user_info');
            //     console.log('user_info-1')
            //     console.log(user_info)
            //     //本地的缓存数据作为access_token登入不了那么晴空数据
            //     wx.setStorageSync("user_info", {});
            //
            // }
            // }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    // onLoad: function (options) {
    //     app.pageOnLoad(this);
    //     this.loadData(options);
    //     var page = this;
    //     var parent_id = 0;
    //
    //     var user_info = wx.getStorageSync('user_info');
    //     var user_id = user_info.id;
    //
    //     console.log('console.log(user_id)------------------' + user_id)
    //
    //     var share_user_id = options.user_id;
    //     console.log('console.log(share_user_id)------------------' + share_user_id)
    //     var scene = decodeURIComponent(options.scene);
    //
    //     console.log('console.log(options)------------------' + options)
    //     console.log(options)
    //
    //     if (share_user_id != undefined) {
    //         parent_id = share_user_id;
    //     }
    //     else if (scene != undefined) {
    //         parent_id = scene;
    //     }
    //     console.log('console.log(parent_id)------------------' + parent_id + 'user_id' + user_id)
    //     app.loginBindParent({parent_id: parent_id});
    //     console.log('console.log(loginBindParent)------------------')
    // },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.pageOnShow(this);
        var page = this;
        page.loadData();
    },

    callTel: function (e) {
        var tel = e.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: tel, //仅为示例，并非真实的电话号码
        });
    },
    apply: function (e) {
        var page = this;
        var share_setting = wx.getStorageSync("share_setting");
        var user_info = wx.getStorageSync("user_info");
        if (share_setting.share_condition == 1) {
            wx.navigateTo({
                url: '/pages/add-share/index',
            })
        } else if (share_setting.share_condition == 0 || share_setting.share_condition == 2) {
            if (user_info.is_distributor == 0) {
                wx.showModal({
                    title: "申请加入集市",
                    content: "是否申请？",
                    success: function (r) {
                        if (r.confirm) {
                            wx.showLoading({
                                title: "正在加载",
                                mask: true,
                            });
                            app.request({
                                url: api.share.join,
                                methods: "POST",
                                success: function (res) {
                                    if (res.code == 0) {
                                        if (share_setting.share_condition == 0) {
                                            user_info.is_distributor = 2;
                                            wx.navigateTo({
                                                url: '/pages/add-share/index',
                                            })
                                        } else {
                                            user_info.is_distributor = 1;
                                            wx.navigateTo({
                                                url: '/pages/share/index',
                                            })
                                        }
                                        wx.setStorageSync("user_info", user_info);
                                    }
                                },
                                complete: function () {
                                    wx.hideLoading();
                                }
                            });
                        }
                    },
                })
            } else {
                wx.navigateTo({
                    url: '/pages/add-share/index',
                })
            }
        }
    },
    verify: function (e) {
        wx.scanCode({
            onlyFromCamera: false,
            success: function (res) {
                console.log(res)
                wx.navigateTo({
                    url: '/' + res.path,
                })
            }, fail: function (e) {
                wx.showToast({
                    title: '失败'
                });
            }
        });
    },
    member: function () {
        wx.navigateTo({
            url: '/pages/member/member',
        })
    },
    integral: function () {
        wx.navigateTo({
            url: '/pages/recharge-integral/index',
        })
    },
    card: function () {
        wx.navigateTo({
            url: '/pages/card/card',
        })
    },
    //事件处理函数
    bindViewTap: function () {
        var user_info = wx.getStorageSync("user_info");
        console.log(user_info)
        if (Object.keys(user_info).length === 0 || user_info == "") {
            wx.navigateTo({
                url: '/pages/authorize/authorize',
            })
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (options) {
        var page = this;
        var user_info = wx.getStorageSync("user_info");
        return {
            path: "/pages/user/user?user_id=" + user_info.id,
            success: function (e) {
                share_count++;
                if (share_count == 1)
                    app.shareSendCoupon(page);
            }
        };
    }
});
