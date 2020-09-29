// pages/share/index.js
var api = require('../../api.js');
var app = getApp();
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


        total_price: 0,
        price: 0,
        cash_price: 0,
        total_cash: 0,
        team_count: 0,
        integral: 0,
        total_integral: 0,
        order_money: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.pageOnLoad(this);
        var page = this;
        var user_info = wx.getStorageSync("user_info");
        this.loadIndexInfo(this);
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
        var page = this;
        var user_info = wx.getStorageSync("user_info");
        if (user_info.is_distributor != 1) {
            wx.showModal({
                title: "您还没有加入集市！",
                content: '请先前往“个人中心->成为集市”处进行申请成为分销商',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        wx.redirectTo({
                            url: '/pages/user/user',
                        })
                    }
                }
            });
        } else {
            page.setData({
                user_info: user_info,
            });
            // wx.showLoading({
            //     title: "正在加载",
            //     mask: true,
            // });
            // app.request({
            //     url: api.share.get_info,
            //     success: function (res) {
            //         if (res.code == 0) {
            //             page.setData({
            //                 total_price: res.data.price.total_price,
            //                 price: res.data.price.price,
            //                 cash_price: res.data.price.cash_price,
            //                 total_cash: res.data.price.total_cash,
            //                 team_count: res.data.team_count,
            //                 order_money: res.data.order_money,
            //                 integral: res.data.price.integral,
            //                 total_integral: res.data.price.total_integral
            //             });
            //         }
            //     },
            //     complete: function () {
            //         wx.hideLoading();
            //     }
            // });

        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

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
            url: api.settlementbonus.index,
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

})