    // pages/cheapmarket/order/details.js
var api = require('../../api.js');
var utils = require('../../utils.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: 1,
        qrcode: "",
        opendoorRecordId:0,
        hg_id:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.pageOnLoad(this);
        var page = this;

        if(options.opendoorRecordId){
            var  opendoorRecordId = options.opendoorRecordId;

            if (opendoorRecordId != undefined && opendoorRecordId != 'undefined') {
                page.setData({
                    opendoorRecordId: opendoorRecordId,
                });
            }
        }

        if(options.hg_id){
            var  hg_id = options.hg_id;
            if (hg_id != undefined && hg_id != 'undefined') {
                page.setData({
                    hg_id: hg_id,
                });
            }
        }

        this.getOrderDetails(options);
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    
    },

    /**
     * 订单详情
     */
    getOrderDetails:function(e){
        var oid = e.oid;
        var page = this;
        var opendoorRecordId =page.data.opendoorRecordId
        var hg_id =page.data.hg_id
        console.log(opendoorRecordId)
        console.log(e)
        console.log(opendoorRecordId)
        console.log(page.data.opendoorRecordId)
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        // wx.showNavigationBarLoading();
        app.request({
            url: api.cheapmarket.order_detailshg,
            method: "post",
            data: { opendoorRecordId: opendoorRecordId  , hg_id: hg_id},
            success: function (res) {
                if (res.code == 0) {
                    page.setData({
                        goods: res.data,
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: "/pages/huogui-detail/huogui-detail?status=1"+"&hg_id="+hg_id,
                                });
                            }
                        }
                    });
                }
            },
            complete: function (res) {
                setTimeout(function () {
                    // 延长一秒取消加载动画
                    wx.hideLoading();
                }, 1000);
            }
        });
    },
    /**
     * 跳转至商品详情
     */
    goToGoodsDetails:function(e){
        wx.redirectTo({
            // url: '/pages/cheapmarket/details/details?id=' + this.data.goods.goods_id,
            url: '/pages/cheapmarket/index/cheapmarket' ,
        })
    },
    /**
 * 点击取消
 */
    orderCancel: function (e) {
        var page = this;
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        var id = e.currentTarget.dataset.id;
        app.request({
            url: api.cheapmarket.order_cancel,
            data: {
                id: id,
            },
            success: function (res) {
                if (res.code == 0) {
                    wx.redirectTo({
                        url: '/pages/huogui-order/order?status=0'
                    })
                }
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },
    /**
     * 订单列表点击支付
     */
    GoToPay(e) {
        wx.showLoading({
            title: "正在提交",
            mask: true,
        });
        app.request({
            url: api.cheapmarket.order_pay,
            data: {
                id: e.currentTarget.dataset.id,
            },
            complete: function () {
                wx.hideLoading();
            },
            success: function (res) {
                console.log(res);
                if (res.code == 0) {
                    wx.requestPayment({
                        timeStamp: res.data.timeStamp,
                        nonceStr: res.data.nonceStr,
                        package: res.data.package,
                        signType: res.data.signType,
                        paySign: res.data.paySign,
                        success: function (e) {
                            console.log("success");
                            console.log(e);
                        },
                        fail: function (e) {
                            console.log("fail");
                            console.log(e);
                        },
                        complete: function (e) {
                            console.log("complete");
                            console.log(e);

                            if (e.errMsg == "requestPayment:fail" || e.errMsg == "requestPayment:fail cancel") {//支付失败转到待支付订单列表
                                wx.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: false,
                                    confirmText: "确认",
                                    success: function (res) {
                                        if (res.confirm) {
                                            wx.redirectTo({
                                                url: "/pages/huogui-order/order?status=0",
                                            });
                                        }
                                    }
                                });
                                return;
                            }
                            wx.redirectTo({
                                url: "/pages/huogui-order/order?status=1",
                            });
                        },
                    });
                }
                if (res.code == 1) {
                    wx.showToast({
                        title: res.msg,
                        image: "/images/icon-warning.png",
                    });
                }
            }
        });
    },
    /**
     * 货柜列表
     */
    goToShopList:function(e)
    {
        wx.redirectTo({
            url: '/pages/cheapmarket/shop/shop?ids=' + this.data.goods.shop_id,
        })
    },
    /**
     * 核销码
     */
    orderQrcode: function (e) {
        var page = this;
        var index = e.target.dataset.index;
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        if (page.data.goods.offline_qrcode) {
            page.setData({
                hide: 0,
                qrcode: page.data.goods.offline_qrcode
            });
            wx.hideLoading();
        } else {
            app.request({
                url: api.cheapmarket.get_qrcode,
                data: {
                    order_no: page.data.goods.order_no
                },
                success: function (res) {
                    if (res.code == 0) {
                        page.setData({
                            hide: 0,
                            qrcode: res.data.url
                        });
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                        })
                    }
                },
                complete: function () {
                    wx.hideLoading();
                }
            });
        }
    },
    hide: function (e) {
        this.setData({
            hide: 1
        });
    },
    /**
     * 前往评价
     */
    comment: function (e) {
        wx.navigateTo({
            // url: '/pages/cheapmarket/order-comment/order-comment?id=' + e.target.dataset.id,
            url: '/pages/coupon-merchant-mall-list/index' ,

            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },

    tabOpen:function(){
        this.setData({
            isopen:!this.data.isopen
        })
    },
});