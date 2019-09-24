//index.js
//获取应用实例
var api = require('../../api.js');
const app = getApp();

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
    }
});

