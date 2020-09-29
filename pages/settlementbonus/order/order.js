// pages/settlementbonus/order/order.js
var api = require('../../../api.js');
var app = getApp();
var is_no_more = false;
var is_loading = false;
var p = 2;
Page({

  /**
   * 页面的初始数据
   */
    data: {
        hide: 1,
        qrcode: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      app.pageOnLoad(this);
      var page = this;
      is_no_more = false;
      is_loading = false;
      p = 2;
      page.loadOrderList(options.status || -1);
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
      var page = this;
      if (is_loading || is_no_more)
          return;
      is_loading = true;
      app.request({
          url: api.settlementbonus.order_list,
          data: {
              status: page.data.status,
              page: p,
          },
          success: function (res) {
              if (res.code == 0) {
                  var order_list = page.data.order_list.concat(res.data.list);
                  page.setData({
                      order_list: order_list,
                  });
                  if (res.data.list.length == 0) {
                      is_no_more = true;
                  }
              }
              p++;
          },
          complete: function () {
              is_loading = false;
          }
      });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
    /**
     * 初次加载数据
     */
    loadOrderList: function (status) {
        if (status == undefined)
            status = -1;
        var page = this;
        page.setData({
            status: status,
        });
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        app.request({
            url: api.settlementbonus.order_list,
            data: {
                status: page.data.status,

            },
            success: function (res) {
                if (res.code == 0) {
                    page.setData({
                        order_list: res.data.list,
                    });
                }
                page.setData({
                    show_no_data_tip: (page.data.order_list.length == 0),
                });
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },

    /**
     * 点击取消
     */
    orderCancel:function(e)
    {
        var page = this;
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        var id = e.currentTarget.dataset.id;
        app.request({
            url: api.settlementbonus.order_cancel,
            data: {
                id: id,
            },
            success: function (res) {
                if (res.code == 0) {
                    wx.redirectTo({
                        url: '/pages/settlementbonus/order/order?status=0'
                    })
                }
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },
    /**
     * 奖励列表点击支付
     */
    GoToPay(e){
        wx.showLoading({
            title: "正在支付中",
            mask: true,
        });
        app.request({
            url: api.settlementbonus.order_pay,
            data: {
                id: e.currentTarget.dataset.id,
            },
            complete: function () {
                // wx.hideLoading();
            },
            success: function (res) {
                console.log(res);
                if (res.code == 0) {
                    wx.showToast({
                        title: '支付成功',
                    });
                    wx.redirectTo({
                        url: "/pages/settlementbonus/order/order?status=1",
                    });

                    // if (e.errMsg == "requestPayment:fail" || e.errMsg == "requestPayment:fail cancel") {//支付失败转到待支付奖励列表
                    //     wx.showModal({
                    //         title: "提示",
                    //         content: "奖励尚未支付",
                    //         showCancel: false,
                    //         confirmText: "确认",
                    //         success: function (res) {
                    //             if (res.confirm) {
                    //                 wx.redirectTo({
                    //                     url: "/pages/settlementbonus/order/order?status=0",
                    //                 });
                    //             }
                    //         }
                    //     });
                    //     return;
                    // }


                    // wx.requestPayment({
                    //     timeStamp: res.data.timeStamp,
                    //     nonceStr: res.data.nonceStr,
                    //     package: res.data.package,
                    //     signType: res.data.signType,
                    //     paySign: res.data.paySign,
                    //     success: function (e) {
                    //         console.log("success");
                    //         console.log(e);
                    //     },
                    //     fail: function (e) {
                    //         console.log("fail");
                    //         console.log(e);
                    //     },
                    //     complete: function (e) {
                    //         console.log("complete");
                    //         console.log(e);
                    //
                    //         if (e.errMsg == "requestPayment:fail" || e.errMsg == "requestPayment:fail cancel") {//支付失败转到待支付奖励列表
                    //             wx.showModal({
                    //                 title: "提示",
                    //                 content: "奖励尚未支付",
                    //                 showCancel: false,
                    //                 confirmText: "确认",
                    //                 success: function (res) {
                    //                     if (res.confirm) {
                    //                         wx.redirectTo({
                    //                             url: "/pages/settlementbonus/order/order?status=0",
                    //                         });
                    //                     }
                    //                 }
                    //             });
                    //             return;
                    //         }
                    //         wx.redirectTo({
                    //             url: "/pages/settlementbonus/order/order?status=1",
                    //         });
                    //     },
                    // });
                }
                if (res.code == 1) {
                    wx.showToast({
                        title: res.msg,
                        image: "/images/icon-warning.png",
                    });
                }
                if (res.code == 2) {
                    wx.showToast({
                        title: res.msg,
                        image: "/images/icon-warning.png",
                    });
                }
            }
        });
    },
    /**
     * 前往详情
     */
    goToDetails:function(e){
        console.log(e);
        wx.navigateTo({
            url: '/pages/settlementbonus/order/details?oid=' + e.currentTarget.dataset.id,
        });
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
        if (page.data.order_list[index].offline_qrcode) {
            page.setData({
                hide: 0,
                qrcode: page.data.order_list[index].offline_qrcode
            });
            wx.hideLoading();
        } else {
            app.request({
                url: api.settlementbonus.get_qrcode,
                data: {
                    order_no: page.data.order_list[index].order_no
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
     * 申请退款
     */
    applyRefund:function(e)
    {
        var page = this;
        var id = e.target.dataset.id;
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        app.request({
            url: api.settlementbonus.apply_refund,
            data: {
                order_id: id
            },
            success: function (res) {
                if (res.code == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '申请退款成功',
                        showCancel:false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: "/pages/settlementbonus/order/order?status=3",
                                });
                            }
                        }
                    })
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
    },
    /**
     * 前往评价
     */
    comment:function(e){
        wx.navigateTo({
            url: '/pages/settlementbonus/order-comment/order-comment?id='+e.target.dataset.id,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    }
})