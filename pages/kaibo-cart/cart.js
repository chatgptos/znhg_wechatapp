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
        app.pageOnShow(this);
        var page = this;
        page.setData({
            cart_check_all: true,
            show_cart_edit: true,
        });
        page.getCartList();
    },

    getCartList: function () {
        var page = this;
        //wx.showNavigationBarLoading();
        page.setData({
            show_no_data_tip: false,
        });
        app.request({
            url: api.cart.kaibo_list,
            success: function (res) {
                if (res.code == 0) {
                    page.setData({
                        cart_list: res.data.list,
                        total_price: 0.00,
                        cart_check_all: false,
                        show_cart_edit: true,
                    });
                }
                page.setData({
                    show_no_data_tip: (page.data.cart_list.length == 0),
                });
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
                total_price += cart_list[i].yongjin;
        }
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

    cartDelete : function () {
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
            content: "确认加入" + cart_id_list.length + "件热卖商品？",
            success: function (res) {
                if (res.cancel)
                    return true;
                wx.showLoading({
                    title: "正在加入您直播间",
                    mask: true,
                });
                app.request({
                    url: api.cart.kaibo_add_cart,
                    method: "post",
                    data: {
                        cart_id_list: JSON.stringify(cart_id_list), 
                    },
                    success: function (res) {
                        wx.hideLoading(); 
                        if (res.code == 0) {
                            //page.cartDone();
                            page.getCartList(); 
                            var user_info = wx.getStorageSync("user_info"); 
                            if(user_info && user_info.id!= "undefined"&& user_info.id!= 0&& user_info.id!= undefined){ 
                            }
                            let roomId = res.data.roomId // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
                            let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/kaibo/index', pid: 1,user_id:user_info.id })) 
                            wx.navigateTo({
                                url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
                            }) 

                        }
                        if (res.code == 2) {
                            wx.showModal({
                                title: "提示",
                                content: res.msg,
                                showCancel: true,
                                success: function (e) {
                                    if (e.confirm) {  
                                        wx.navigateTo({
                                            url: '/pages/kaibo/index',
                                        });
                                    }
                                }
                            }); 
                        }else{
                            wx.showToast({
                                title: res.msg,
                            });
                        }
                    }
                });
            }
        });
    },

});