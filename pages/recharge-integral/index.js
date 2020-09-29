// pages/cash/index.js
var api = require('../../api.js');
var app = getApp();

function min(var1, var2) {
    var1 = parseFloat(var1);
    var2 = parseFloat(var2);
    return var1 > var2 ? var2 : var1;
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        price: 0.00,
        cash_max_day: -1,
        selected: -1,
      user_info:{},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.pageOnLoad(this);
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

      var page= this;
      var user_info = wx.getStorageSync('user_info');
      console.log(user_info);
      page.setData({
        user_info: user_info,
                    });

        // var page = this;
        // var share_setting = wx.getStorageSync("share_setting");
        // page.setData({
        //     share_setting: share_setting
        // });
        // app.request({
        //     url: api.share.get_price,
        //     success: function (res) {
        //         if (res.code == 0) {
        //             var selected = 0;
        //             var name = '';
        //             var mobile = '';
        //             var cash_last = res.data.cash_last;
        //             if (res.data.pay_type == 1) {
        //                 selected = 1;
        //             }
        //             if (cash_last && (res.data.pay_type == 2 || res.data.pay_type == cash_last['type'])) {
        //                 selected = cash_last['type'];
        //                 name = cash_last['name'];
        //                 mobile = cash_last['mobile'];
        //             }
        //             page.setData({
        //                 price: res.data.price.integral,
        //                 cash_max_day: res.data.cash_max_day,
        //                 pay_type: res.data.pay_type,
        //                 selected: selected,
        //                 name: name,
        //                 mobile: mobile,
        //                 bank: res.data.bank,
        //             });
        //         }
        //     }
        // });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },


    formSubmit: function (e) {
        var page = this;
        var cash = parseFloat(parseFloat(e.detail.value.cash).toFixed(2));
        var cash_max = page.data.price;
        if (page.data.cash_max_day != -1) {
            cash_max = min(cash_max, page.data.cash_max_day)
        }
        // if (cash > cash_max) {
        //     wx.showToast({
        //         title: "提现金额不能超过" + cash_max + "元",
        //         image: "/images/icon-warning.png",
        //     });
        //     return;
        // }
        // if (cash < parseFloat(page.data.share_setting.min_money)) {
        //     wx.showToast({
        //         title: "提现金额不能低于" + page.data.share_setting.min_money + "元",
        //         image: "/images/icon-warning.png",
        //     });
        //     return;
        // }
        // var name = e.detail.value.name;
        // var mobile = e.detail.value.mobile;
        // if (!name || name == undefined) {
        //     wx.showToast({
        //         title: '姓名不能为空',
        //         image: "/images/icon-warning.png",
        //     });
        //     return;
        // }
        // if (!mobile || mobile == undefined) {
        //     wx.showToast({
        //         title: '账号不能为空',
        //         image: "/images/icon-warning.png",
        //     });
        //     return;
        // }
        // var bank = e.detail.value.bank;
        //
        // if(!bank || bank == ''){
        //     if(bank == ''){
        //         wx.showToast({
        //         title: '开户行不能为空',
        //         image: "/images/icon-warning.png",
        //     });
        //         return;
        //     }
        // }
        console.log(e.detail.value)
        var selected = page.data.selected;
        // if (selected != 0 && selected != 1 && selected != 3) {
        //     wx.showToast({
        //         title: '请选择提现方式',
        //         image: "/images/icon-warning.png",
        //     });
        //     return;
        // }
        wx.showLoading({
            title: "正在提交",
            mask: true,
        });
        // app.request({
        //     url: api.share.apply,
        //     method: 'POST',
        //     data: {
        //         cash: cash,
        //         // name: name,
        //         // mobile: mobile,
        //         // bank: bank,
        //         // pay_type: selected,
        //         scene: 'CASH',
        //         form_id: e.detail.formId,
        //     },
        //     success: function (res) {
        //         wx.hideLoading();
        //         wx.showModal({
        //             title: "提示",
        //             content: res.msg,
        //             showCancel: false,
        //             success: function (e) {
        //                 if (e.confirm) {
        //                     if (res.code == 0) {
        //                         wx.redirectTo({
        //                             url: '/pages/cash-detail/cash-detail',
        //                         })
        //                     }
        //                 }
        //             }
        //         });
        //     }
        // });
        //提交订单
        app.request({
            url: api.order.submit,
            method: "post",
            data: {
                address_id: 9,
                offline: 1,
                address_name:'平台积分',
                address_mobile:'13236390680',
                form: 1,
                goods_info: '{"goods_id":"23","attr":[{"attr_group_id":1,"attr_group_name":"规格","attr_id":1,"attr_name":"默认"}],"num":' + cash + '}',
                use_integral: 2,
                // access_token: '7CVgdYqZ8ZMGqeSo-AgOgVl6S67NN98P',
                store_id: 1,
            },
            success: function (res) {
                if (res.code == 0) {
                    // setTimeout(function () {
                    //     wx.hideLoading();
                    // }, 1000);
                    setTimeout(function () {
                        page.setData({
                            options: {},
                        });
                    }, 1);
                    var order_id = res.data.order_id;

                    wx.showLoading({
                        title: "正在排队支付",
                        mask: true,
                    });
                    //获取支付数据
                    app.request({
                        url: api.order.pay_data,
                        data: {
                            order_id: order_id,
                            pay_type: 'WECHAT_PAY',
                        },
                        success: function (res) {
                            if (res.code == 0) {

                                wx.showLoading({
                                    title: "排队成功开始支付",
                                    mask: true,
                                });
                                //发起支付
                                wx.requestPayment({
                                    timeStamp: res.data.timeStamp,
                                    nonceStr: res.data.nonceStr,
                                    package: res.data.package,
                                    signType: res.data.signType,
                                    paySign: res.data.paySign,
                                    success: function (e) {
                                        if (res.code == 0) {
                                            wx.redirectTo({
                                                url: '/pages/cash-detail/cash-detail',
                                            })
                                        }
                                    },
                                    fail: function (e) {
                                    },
                                    complete: function (e) {
                                        wx.hideLoading();
                                        if (e.errMsg == "requestPayment:fail" || e.errMsg == "requestPayment:fail cancel") {//支付失败转到待支付订单列表
                                            wx.showModal({
                                                title: "提示",
                                                content: "订单尚未支付",
                                                showCancel: false,
                                                confirmText: "确认",
                                                success: function (res) {
                                                    if (res.confirm) {
                                                        wx.redirectTo({
                                                            url: "/pages/order/order?status=0",
                                                        });
                                                    }
                                                }
                                            });
                                            return;
                                        }
                                        if (e.errMsg == "requestPayment:ok") {
                                            if (page.data.goods_card_list.length > 0) {
                                                page.setData({
                                                    show_card: true
                                                });
                                            } else {
                                                wx.redirectTo({
                                                    url: "/pages/order/order?status=-1",
                                                });
                                            }
                                            return;
                                        }
                                        wx.redirectTo({
                                            url: "/pages/order/order?status=-1",
                                        });
                                    },
                                });
                                return;
                            }
                            if (res.code == 1) {
                                wx.showToast({
                                    title: res.msg,
                                    image: "/images/icon-warning.png",
                                });
                                return;
                            }
                        },
                        complete: function (e) {
                            wx.hideLoading();
                        },

                    });
                }
                if (res.code == 1) {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.msg,
                        image: "/images/icon-warning.png",
                    });
                    return;
                }
            }
        });


    },

    showCashMaxDetail: function () {
        wx.showModal({
            title: "提示",
            content: "今日剩余提现金额=平台每日可提现金额-今日所有用户提现金额"
        });
    },
    select: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            selected: index
        });
    }

});