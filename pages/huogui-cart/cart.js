// cart.js
var api = require('../../api.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        total_price: 0.00,
        cart_check_all: false,
        cart_list: [],
        oldVal: '',
        timeList: [],
        setInter:'',
        hg_id:0,
        opendoorRecordId:0,
        isreplenish:0,
        extraData:{},
        out_order_no:0,
    },


// 点击左上角返回箭头时候触发
    onUnload: function(options) {
        var page = this;
        clearInterval(page.data.setInter)
    },

// 点击系统Home键返回上一步时候触发
    onHide: function(options) {
        var page = this;
        clearInterval(that.data.setInter)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.pageOnLoad(this); 
        var page = this;
        var hg_id = options.hg_id;
        var opendoorRecordId = options.opendoorRecordId;

        if (opendoorRecordId != undefined && opendoorRecordId != 'undefined') {
            var  opendoorRecordId = options.opendoorRecordId;
            page.setData({
                opendoorRecordId: opendoorRecordId,
            });
        }





        console.log('00000000');
        console.log(options);
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


        if(options.out_order_no){
            var  out_order_no = options.out_order_no;
            if (out_order_no != undefined && out_order_no != 'undefined') {
                page.setData({
                    out_order_no: out_order_no,
                });
            }
        }


        if(options.isreplenish){
            var  isreplenish = options.isreplenish;
            if (isreplenish != undefined && isreplenish != 'undefined') {
                page.setData({
                    isreplenish: isreplenish,
                });
                if(isreplenish){
                    wx.setNavigationBarTitle({
                        title: '补货清单'
                    })
                }
            }
        }


        console.log(options)
        page.getCartList();
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
        page.setData({
            cart_check_all: false,
            show_cart_edit: false,
        });
        // clearInterval(page.data.setInter)
        // page.data.setInter =setInterval(function () {
        //     console.log("轮播请求1秒触发一次");
        // }, 3000)
    },

    getCartList: function () {
        var page = this;
        var hg_id =page.data.hg_id
        var opendoorRecordId =page.data.opendoorRecordId
        var isreplenish =page.data.isreplenish
        var out_order_no =page.data.out_order_no
        //wx.showNavigationBarLoading();
        page.setData({
            show_no_data_tip: false,
        });
        app.request({
            method: "post",
            url: api.cart.listhg,
            data: {
                    hg_id: hg_id ,
                    opendoorRecordId: opendoorRecordId,
                    isreplenish: isreplenish,
                    out_order_no: out_order_no,
                  },
            success: function (res) {
                if (res.code == 0) {
                    if(res.data.isClose){
                        console.log(res.data.isreplenish)
                        if(res.data.isreplenish){
                            wx.redirectTo({
                                url: "/pages/huogui-detail/huogui-detail?opendoorRecordId=" + page.data.opendoorRecordId+"&hg_id="+page.data.hg_id+'&isreplenish='+res.data.isreplenish,
                            });
                        }
                        else {
                            if(res.data.isWechatJump){
                                //授权
                                page.setData({
                                    extraData: res.data.pay_data,
                                });
                                wx.openBusinessView({
                                    businessType: 'wxpayScoreDetail',
                                    extraData: page.data.extraData,
                                    success(e) {
                                        wx.redirectTo({
                                            url: "/pages/index/index",
                                        });
                                        //dosomething
                                    },
                                    fail(e) {
                                    },
                                    complete(e) {
                                    }
                                });
                            }else {
                                wx.redirectTo({
                                    url: "/pages/huogui-order/details?opendoorRecordId=" + page.data.opendoorRecordId,
                                });
                            }
                        }
                    }else {
                        setTimeout(function () {
                            //要延时执行的代码
                            page.getCartList();
                            page.cartCheckAll();
                        }, 1000) //延迟时间 这里是1秒
                    }
                    page.setData({
                        cart_list: res.data.list,
                        total_price: 0.00,
                        cart_check_all: false,
                        show_cart_edit: false,
                    });
                }else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: false,
                        success: function (e) {
                        }
                    })
                }
                //wx.hideNavigationBarLoading();
                //wx.stopPullDownRefresh();
            }
        });
    },

    cartCheck: function (e) {
        var page = this;
        var index = e.currentTarget.dataset.index;
        var cart_list = page.data.cart_list;
        if (cart_list[index].checked) {
            cart_list[index].checked = false;
        } else {
            cart_list[index].checked = true;
        }
        page.setData({
            cart_list: cart_list,
        });
        page.updateTotalPrice();
    },

    cartCheckAll: function () {
        var page = this;
        var cart_list = page.data.cart_list;
        var checked = false;
        if (page.data.cart_check_all) {
            checked = false;
        } else {
            checked = true;
        }
        for (var i in cart_list) {
            if (!cart_list[i].disabled || page.data.show_cart_edit)
                cart_list[i].checked = checked;
        }
        page.setData({
            cart_check_all: checked,
            cart_list: cart_list,
        });
        page.updateTotalPrice();

    },

    updateTotalPrice: function () {
        var page = this;
        var total_price = 0.00;
        var cart_list = page.data.cart_list;
        for (var i in cart_list) {
            if (cart_list[i].checked)
                total_price += cart_list[i].price;
        }

        console.log(total_price);
        page.setData({
          total_price: total_price.toFixed(2),
        });
    },

    cartSubmit: function () {
        var page = this;
        var cart_list = page.data.cart_list;
        var cart_id_list = [];
        for (var i in cart_list) {
            if (cart_list[i].checked)
                cart_id_list.push(cart_list[i].cart_id);
        }
        if (cart_id_list.length == 0) {
            return true;
        }
        wx.navigateTo({
            url: '/pages/order-submit/order-submit?cart_id_list=' + JSON.stringify(cart_id_list),
        });
    },

    cartEdit: function () {
        var page = this;
        var cart_list = page.data.cart_list;
        for (var i in cart_list) {
            cart_list[i].checked = false;
        }
        page.setData({
            cart_list: cart_list,
            show_cart_edit: true,
            cart_check_all: false,
        });
        page.updateTotalPrice();
    },

    cartDone: function () {
        var page = this;
        var cart_list = page.data.cart_list;
        for (var i in cart_list) {
            cart_list[i].checked = false;
        }
        page.setData({
            cart_list: cart_list,
            show_cart_edit: false,
            cart_check_all: false,
        });
        page.updateTotalPrice();
    },

    cartDelete: function () {
        var page = this;
        var cart_list = page.data.cart_list;
        var cart_id_list = [];
        for (var i in cart_list) {
            if (cart_list[i].checked)
                cart_id_list.push(cart_list[i].cart_id);
        }
        if (cart_id_list.length == 0) {
            return true;
        }
        wx.showModal({
            title: "提示",
            content: "确认删除" + cart_id_list.length + "项内容？",
            success: function (res) {
                if (res.cancel)
                    return true;
                wx.showLoading({
                    title: "正在删除",
                    mask: true,
                });
                app.request({
                    url: api.cart.delete,
                    data: {
                        cart_id_list: JSON.stringify(cart_id_list),
                    },
                    success: function (res) {
                        wx.hideLoading();
                        wx.showToast({
                            title: res.msg,
                        });
                        if (res.code == 0) {
                            //page.cartDone();
                            page.getCartList();
                        }
                        if (res.code == 1) {
                        }
                    }
                });
            }
        });
    },

});