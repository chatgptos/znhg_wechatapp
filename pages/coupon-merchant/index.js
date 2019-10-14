// //coupon-merchant.js
// //获取应用实例
var api = require('../../api.js');
const app = getApp()

Page({
    data: {
        buttonClicked:'',
        buttonName:'立即申请',
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
            {icon: "../../Img/fuli.png", text: '福利', img: '../../Img/jinxiaoshangA.png'},
            {icon: "../../Img/choujiang.png", text: '抽奖', img: '../../Img/jinxiaoshangA.png'},
            {icon: "../../Img/zengsong.png", text: '赠送', img: '../../Img/jinxiaoshangA.png'}
        ],
        listDetails: [
            {title: '成为经销商'},
            {title: '成为渠道商'},
            {title: '服务权'},
            {title: '分红权'},
            {title: '福利'},
            {title: '抽奖'},
            {title: '赠送'}
        ],
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

            console.log(e.target.dataset.current)
        }

    },
    //点击切换
    clickList: function (e) {
        var page = this;
        var qsId = e.currentTarget.dataset.index;

        app.request({
            url: api.couponmerchant.get_qs_info,
            methods: "POST",
            data: {
                qsId: qsId,
            },
            success: function (res) {
                if (res.code == 0) {
                    wx.showLoading({
                        title: "授权成功",
                        mask: false,
                    });
                    page.setData({
                        buttonName: '已经拥有',
                        buttonClicked: false,
                    })
                }else {
                    // page.setData({
                    //     buttonClicked: res.msg
                    // })
                }
            },
            complete: function () {
                wx.hideLoading();
            }
        });


        var that = this;
        if (this.data.currentList === e.currentTarget.dataset.index) {
            return false;
        } else {
            that.setData({
                buttonClicked:'',
                buttonName:'立即申请',
                currentList: e.currentTarget.dataset.index
            })
        }
        console.log(e);
        console.log(this.data.currentTab);
        console.log(e.currentTarget.dataset.index);



    },
    //申请
    apply: function (e) {
        console.log(e.currentTarget.dataset.index);
        var page = this;
        var share_setting = wx.getStorageSync("share_setting");
        var user_info = wx.getStorageSync("user_info");
        page.setData({
            buttonClicked: '申请中...'
        });
        wx.showModal({
            title: "申请成为经销商",
            content: "是否申请？",
            success: function (r) {
                if (r.confirm) {
                    wx.showLoading({
                        title: "正在加载",
                        mask: true,
                    });
                    app.request({
                        url: api.couponmerchant.join,
                        methods: "POST",
                        success: function (res) {
                            if (res.code == 0) {
                                wx.showLoading({
                                    title: "授权成功",
                                    mask: false,
                                });
                                wx.setStorageSync("user_info", user_info);
                                page.setData({
                                    buttonClicked:'',
                                    buttonName: '已经拥有'
                                })
                            }else {
                                page.setData({
                                    buttonClicked:true,
                                    buttonName: res.msg
                                })
                            }
                        },
                        complete: function () {
                            wx.hideLoading();
                        }
                    });
                }
            },
        })
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
        console.log(page.data)
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

})
