// pages/shop-detail/shop-detail.js
var api = require('../../api.js');
var utils = require('../../utils.js');
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        score: [1, 2, 3, 4, 5],
        hg_id:0,
        shop_id:0,
        parent_id:0,
        opendoorRecordId:0,
        user_info:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        app.pageOnLoad(this);

        var page = this;

        var user_id = options.user_id;
        app.loginBindParent({ parent_id: user_id });
        page.setData({
            shop_id: options.shop_id
        });
        console.log(user_id);

        if (options.q){
            var scan_url = decodeURIComponent(options.q);
            console.log("scan_url:" + scan_url)
            var hg_id = scan_url.match(/\d+/) //提取链接中的数字，也就是链接中的参数id，/\d+/ 为正则表达式
            console.log(hg_id[0]);
            if(hg_id[0]){
                page.setData({
                    hg_id: hg_id[0]
                });
            }
        }

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

        wx.showLoading({
            title: '加载中',
        });

        var user_info = wx.getStorageSync("user_info");
        page.setData({
            user_info: user_info,
        });

        var hg_id =page.data.hg_id;
        console.log(hg_id)

        app.request({
            url: api.cheapmarket.listhg,
            method: "post",
            data: { hg_id: hg_id},
            success: function (res) {
                if (res.code == 0) {
                    setTimeout(function () {
                        // 延长一秒取消加载动画
                        wx.hideLoading();
                    }, 100);
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
    openBusinessView(isreplenish){
        var page = this;
        var hg_id =page.data.hg_id
        console.log(hg_id)
        console.log(hg_id)
        wx.showLoading({
            title: "正在开门",
            mask: true,
        });
        app.request({
            url: api.cheapmarket.opendoor,
            method: "post",
            data: {
                hg_id: hg_id ,
                isreplenish:isreplenish,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.code == 0) {
                    console.log(res.success);
                    if(res.success==true){
                        if(res.data.isOpen==true){
                            console.log(res.success);
                            console.log('/pages/huogui-cart/cart?hg_id='+hg_id+'&opendoorRecordId='+res.data.opendoorRecordId);
                            if(res.data.isreplenish){
                                wx.redirectTo({
                                    url: '/pages/huogui-cart/cart?hg_id='+hg_id+'&opendoorRecordId='+res.data.opendoorRecordId+'&isreplenish='+res.data.isreplenish,
                                })
                            }else {
                                wx.redirectTo({
                                    url: '/pages/huogui-cart/cart?hg_id='+hg_id+'&opendoorRecordId='+res.data.opendoorRecordId+'&out_order_no='+res.data.out_order_no,
                                })
                            }
                            

                        }else {
                            //授权
                            page.setData({
                                extraData: res.data.data,
                            });
                            wx.openBusinessView({
                                businessType: 'wxpayScoreEnable',
                                extraData: page.data.extraData,
                                success(e) {
                                    page.openBusinessView();
                                    console.log(e);
                                    console.log('ok');
                                    //dosomething
                                },
                                fail(e) {
                                    console.log(e);
                                    console.log(wx.openBusinessView);
                                    console.log('fail');
                                    //dosomething
                                },
                                complete(e) {
                                    wx.hideLoading();
                                    console.log(e);
                                    console.log('complete');
                                    //dosomething
                                }
                            });

                        }

                    }else {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                            showCancel: false,
                            success: function (e) {
                            }
                        })
                    }
                } else if(res.code == '3'){
                    if (page.data.parent_id == "undefined"){
                        page.data.parent_id =0;
                    }
                    wx.navigateTo({
                        url: "/pages/user/user?user_id=" + page.data.parent_id,
                    });
                    // wx.showModal({
                    //     title: '提示',
                    //     content: res.msg,
                    //     showCancel: false,
                    //     success: function (e) {
                    //         if (page.data.parent_id == "undefined"){
                    //             page.data.parent_id =0;
                    //         }
                    //         wx.navigateTo({
                    //             url: "/pages/user/user?user_id=" + page.data.parent_id,
                    //         });
                    //     }
                    // })
                }else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: false,
                        success: function (e) {
                        }
                    })
                }
            }
        });
    },
    openDoor() {
        var page =this;
        //授权
        if (wx.openBusinessView) {
            page.openBusinessView(0);
        }else {
            wx.showModal({
                title: '微信提示',
                content: '您微信版本不支持请升级',
                showCancel: false,
                success: function (e) {
                }
            })
        }

    },
    openDoorBuhuo() {
        var page =this;
        //授权
        if (wx.openBusinessView) {
            page.openBusinessView(1);
        }else {
            wx.showModal({
                title: '微信提示',
                content: '您微信版本不支持请升级',
                showCancel: false,
                success: function (e) {
                }
            })
        }

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

    mobile: function () {
        var page = this;
        wx.makePhoneCall({
            phoneNumber: page.data.shop.mobile,
        })
    },
    goto: function () {
        var page = this;
        wx.getSetting({
            success: function (res) {
                if (!res.authSetting['scope.userLocation']) {
                    app.getauth({
                        content: '需要获取您的地理位置授权，请到小程序设置中打开授权！',
                        cancel: false,
                        success: function (res) {
                            if (res.authSetting['scope.userLocation']) {
                                page.location();
                            }
                        }
                    });
                } else {
                    page.location();
                }
            }
        })
    },

    location: function () {
        var page = this;
        var shop = page.data.shop;
        wx.openLocation({
            latitude: parseFloat(shop.latitude),
            longitude: parseFloat(shop.longitude),
            name: shop.name,
            address: shop.address
        })
    },


})