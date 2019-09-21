// pages/shop/shop.js
var api = require('../../api.js');
var utils = require('../../utils.js');
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        page_count: 1,
        longitude: '',
        latitude: '',
        score: [1, 2, 3, 4, 5],
        keyword: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.pageOnLoad(this);
        var page = this;
        var user_id = options.user_id;
        app.loginBindParent({parent_id: user_id});
        wx.getLocation({
            success: function (res) {
                page.setData({
                    longitude: res.longitude,
                    latitude: res.latitude
                });
            },
            complete: function () {
                page.loadData();
            }
        })
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
    },
    loadData: function () {
        var page = this;
        wx.showLoading({
            title: '加载中',
        });
        app.request({
            url: api.default.shop_list,
            method: 'GET',
            data: {
                longitude: page.data.longitude,
                latitude: page.data.latitude
            },
            success: function (res) {
                if (res.code == 0) {
                    page.setData(res.data);
                }
            },
            fail: function (res) {
                console.log(res)
            },
            complete: function () {
                wx.hideLoading();
            }

        });
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

});