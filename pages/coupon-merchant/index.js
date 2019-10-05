// //coupon-merchant.js
// //获取应用实例
var api = require('../../api.js');
const app = getApp()

Page({
    data: {
        currentTab: 0,
        currentList: 0,
        iconList: [
            {icon: "../../Img/jinxiaoshang.png", text: '经销商'},
            {icon: "../../Img/doudou.png", text: '300个'},
            {icon: "../../Img/money-1.png", text: '300个'}
        ],
        infoList: [
            {icon: "../../Img/jinxiaoshang.png", text: '经销商', img: '../../Img/jinxiaoshangA.png'},
            {icon: "../../Img/qudaoshang.png", text: '渠道商', img: '../../Img/jinxiaoshangA.png'},
            {icon: "../../Img/fuwuquan.png", text: '服务权', img: '../../Img/jinxiaoshangA.png'},
            {icon: "../../Img/fenhongquan.png", text: '分红权', img: '../../Img/jinxiaoshangA.png'},
            {icon: "../../Img/fuli.png", text: '福利分红', img: '../../Img/jinxiaoshangA.png'},
            {icon: "../../Img/choujiang.png", text: '抽奖', img: '../../Img/jinxiaoshangA.png'},
            {icon: "../../Img/zengsong.png", text: '赠送', img: '../../Img/jinxiaoshangA.png'}
        ],
        listDetails: [
            {title: '成为经销商'},
            {title: '成为渠道商'},
            {title: '服务权'},
            {title: '分红权'},
            {title: '福利分红'},
            {title: '抽奖'},
            {title: '赠送'}
        ],
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
    //
    // /**
    //  * 生命周期函数--监听页面加载
    //  */
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
    //点击切换
    clickList: function (e) {
        var that = this;
        if (this.data.currentList === e.currentTarget.dataset.index) {
            return false;
        } else {
            that.setData({
                currentList: e.currentTarget.dataset.index
            })
        }
    }
})
