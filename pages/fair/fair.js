//index.js
//获取应用实例
var api = require('../../api.js');
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        islike: false,
        isCollection: false,
        hiddenmodalput: true,
        duihuanjifen: 0,
        hld: 0,
        integral: 0,
        rechangeType: 0,
        coupon: 0,
        num: 0,
        huanledou: 0,
        huanledou_charge: 0,
        xtjl: 0,
        huanledou_total: 0,
        // "integral": 0,
        // "score": 0,
        // "coupon": 0,
        // motto: 'Hello World',
        // userInfo: {},
        // hasUserInfo: false,
        // canIUse: wx.canIUse('button.open-type.getUserInfo'),
        // list:[
        //     { text: "成为商家" }, { text: "我的好友" }, { text: "我的二维码" }, { text: "意见反馈" }, { text: "系统设置" },
        // ]
    },
    bindKeyInput: function (e) {
        this.setData({
            duihuanjifen: e.detail.value,
        });
    },

    bindKeyInputCard: function (e) {
        this.setData({
            duihuanjifen: e.detail.value,
        });
        var page = this;

        if (page.data.duihuanjifen > 0) {
            wx.showLoading({
                title: '智能计算中..',
            });
            app.request({
                url: api.couponmerchant.pre_fair_exchange,
                method: "post",
                data: {
                    num: page.data.duihuanjifen,
                    integral: page.data.duihuanjifen,
                    rechangeType: page.data.rechangeType,
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.code == 0) {

                        page.setData({
                            num: res.data.num,
                            huanledou: res.data.huanledou,
                            huanledou_charge: res.data.huanledou_charge,
                            xtjl: res.data.xtjl,
                            huanledou_total: res.data.huanledou_total,
                        })
                    }
                    if (res.code == 1) {
                        wx.showToast({
                            title: res.msg,
                            image: "/images/icon-warning.png",
                        });
                    }
                }
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.pageOnLoad(this);
    },

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
                if (res.code == 0) {
                    page.setData(res.data);
                    wx.setStorageSync('pages_user_user', res.data);
                    wx.setStorageSync("share_setting", res.data.share_setting);
                    wx.setStorageSync("user_info", res.data.user_info);
                    page.setData({
                        hiddenmodalput: true,
                        hld: res.data.user_info.hld,
                        integral: res.data.user_info.integral,
                        coupon: res.data.user_info.coupon,
                    })

                    console.log(res.code)
                } else {

                    console.log(res.code)
                    wx.showToast({
                        title: '请登入',
                        image: "/images/icon-warning.png",
                    });

                }
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    exchangeHld: function () {
        this.setData({
            hiddenmodalput: false,
            rechangeType: 2,//充值欢乐豆 扣除积分
        })
    },

    exchangeJf: function () {
        this.setData({
            hiddenmodalput: false,
            rechangeType: 1,//充值积分 扣除欢乐豆
        })
    },
    think: function () {
        this.setData({
            hiddenmodalput: true,
        })
    },
    sureDo: function (e) {
        var page = this;

        //如果充值积分方式存在
        if (page.data.rechangeType) {
            app.request({
                url: api.couponmerchant.fair_exchange,
                method: "post",
                data: {
                    hld: page.data.duihuanjifen,
                    integral: page.data.duihuanjifen,
                    rechangeType: page.data.rechangeType,
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.code == 0) {
                        wx.showToast({
                            title: res.msg,
                        });
                        page.setData({
                            hiddenmodalput: true,
                            hld: res.data.user_info.hld,
                            integral: res.data.user_info.integral,
                            coupon: res.data.user_info.coupon,
                        })
                    }
                    if (res.code == 1) {
                        wx.showToast({
                            title: res.msg,
                            image: "/images/icon-warning.png",
                        });
                    }
                }
            });

        } else {

            //卖出卡券
            app.request({
                url: api.couponmerchant.business_add,
                method: "post",
                data: {
                    num: page.data.duihuanjifen,
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.code == 0) {
                        wx.showToast({
                            title: res.msg,
                        });
                        page.setData({
                            hiddenmodalput: true,
                            coupon: res.data.coupon,
                            // hld: res.data.user_info.hld,
                            // integral: res.data.user_info.integral,
                        })
                    }
                    if (res.code == 1) {
                        wx.showToast({
                            title: res.msg,
                            image: "/images/icon-warning.png",
                        });
                    }
                }
            });


        }


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
    getcard: function () {

        var page =this;
        this.setData({
            // hiddenmodalput: false,
            rechangeType: 3,//充值欢乐豆 扣除积分
        })
        //获取集市开放时间
        app.request({
            url: api.couponmerchant.business_setting,
            method: "post",
            data: {
                rechangeType: page.data.rechangeType,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.code == 0) {
                    // wx.showToast({
                    //     title: res.msg,
                    // });
                    // page.setData({
                    //     hiddenmodalput: true,
                    //     coupon: res.data.coupon,
                    //     // hld: res.data.user_info.hld,
                    //     // integral: res.data.user_info.integral,
                    // })
                    //
                    wx.navigateTo({
                        url: '/pages/coupon-merchant-mall-list/index',
                    })
                }
                if (res.code == 1) {
                    wx.showToast({
                        title: res.msg,
                        image: "/images/icon-warning.png",
                    });
                    page.setData({
                        buttonClickedbuy: true,
                    })
                }
            }
        });
    },
    sellcard: function () {


        var page =this;
        this.setData({
            // hiddenmodalput: false,
            rechangeType: 0,//充值欢乐豆 扣除积分
        })
        //获取集市开放时间
        app.request({
            url: api.couponmerchant.business_setting,
            method: "post",
            data: {
                rechangeType: page.data.rechangeType,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.code == 0) {
                    // wx.showToast({
                    //     title: res.msg,
                    // });
                    // page.setData({
                    //     hiddenmodalput: true,
                    //     coupon: res.data.coupon,
                    //     // hld: res.data.user_info.hld,
                    //     // integral: res.data.user_info.integral,
                    // })


                    //

                    page.setData({
                        hiddenmodalput: false,
                        rechangeType: 0,//出售卡券
                    })
                }
                if (res.code == 1) {
                    wx.showToast({
                        title: res.msg,
                        image: "/images/icon-warning.png",
                    });
                    page.setData({
                        buttonClickedsell: true,
                    })
                }
            }
        });
    },
    integral: function () {
        wx.navigateTo({
            url: '/pages/recharge-integral/index',
        })
    },
    cash: function () {
        wx.navigateTo({
            url: '/pages/cash/cash',
        })
    },
});

