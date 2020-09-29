//index.js
//获取应用实例
var api = require('../../../api.js');
var app = getApp();
var pageNum = 2;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        "integral": 500,
        "score": 300,
        "coupon": 600,
        contact_tel: "",
        show_customer_service: 0,
        user_center_bg: "/images/img-user-bg.png",
        user_info:{},
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page_count: 0,
        cat_show:1,
    },

    //点击切换
    clickTab: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    clickTab2: function (e) {
        var that = this;
        if (this.data.clickTab2 === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                clickTab2: e.target.dataset.current
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.pageOnLoad(this);
        this.systemInfo = wx.getSystemInfoSync()
        this.loadIndexInfo(this);
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
                }
            }
        });
    },

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
        wx.redirectTo({
            url: '/pages/member/member',
        })
    },
    card: function () {
        wx.redirectTo({
            url: '/pages/card/card',
        })
    },




    /**
     * 预约首页加载
     */
    loadIndexInfo: function (e) {
        var page = e;
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        app.request({
            url: api.crowdapply.index,
            method: "get",
            success: function (res) {
                if (res.code == 0) {
                    setTimeout(function () {
                        // 延长一秒取消加载动画
                        wx.hideLoading();
                    }, 1000);
                    page.setData({
                        cat: res.data.cat,
                        banner: res.data.banner,
                        ad: res.data.ad,
                        goods: res.data.goods.list,
                        cat_show: res.data.cat_show,
                        page_count: res.data.goods.page_count,
                    });
                    if (res.data.goods.page >= res.data.goods.page_count){
                        page.setData({
                            emptyGoods:1,
                        });
                    }
                }
            }
        });
    },






    /**
     * 顶部导航事件
     */
    switchNav: function (e) {
        var page = this;
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        var cid = 0;
        pageNum = 2;
        if (cid == e.currentTarget.dataset.id && e.currentTarget.dataset.id != 0) return;
        cid = e.currentTarget.dataset.id;
        console.log(this.systemInfo);
        var windowWidth = this.systemInfo.windowWidth
        var offsetLeft = e.currentTarget.offsetLeft
        var scrollLeft = this.data.scrollLeft;
        if (offsetLeft > windowWidth / 2) {
            scrollLeft = offsetLeft
        } else {
            scrollLeft = 0
        }
        page.setData({
            cid: cid,
            page: 1,
            scrollLeft: scrollLeft,
            scrollTop: 0,
            emptyGoods: 0,
            goods: [],
            show_loading_bar: 1,
        })
        app.request({
            url: api.crowdapply.list,
            method: "get",
            data: { cid: cid },
            success: function (res) {
                if (res.code == 0) {
                    setTimeout(function () {
                        // 延长一秒取消加载动画
                        wx.hideLoading();
                    }, 1000);
                    var goods = res.data.list;
                    if (res.data.page_count >= res.data.page) {
                        page.setData({
                            goods: goods,
                            // page: res.data.page,
                            page_count: res.data.page_count,
                            row_count: res.data.row_count,
                            show_loading_bar: 0,
                        });
                    } else {
                        page.setData({
                            emptyGoods: 1,
                        });
                    }
                }
            }
        });
    },

});

