//list.js
var api = require('../../api.js');
var app = getApp();
var is_no_more = false;
var is_loading = false;
var p =2;

Page({
    data: {
        array: [],
        cash_list:[],
        status:-1,
        show_no_data_tip:false,
    },
    onLoad: function (options) {
        var page = this;
        is_no_more = false;
        is_loading = false;
        p = 2;
        page.LoadCashList(options.status || -1);
        this.setData({
            array: [
             {
                imgurl:'../../images/znxflogo.jpg',
                name:'系统提醒',
                msg:'积分奖励直推奖励1积分',
                date:'09:05 08/3/23'
            }
            ]
        })
    },
    LoadCashList: function (status){
        var page = this;
        page.setData({
            status: parseInt(status || -1),
        });
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        app.request({
            url: api.messagelist.message_detail,
            data: {
                status: page.data.status,
            },
            success: function (res) {
                if (res.code == 0) {
                    page.setData({
                        cash_list: res.data.list,
                    });
                }
                page.setData({
                    show_no_data_tip: (page.data.cash_list.length == 0),
                });
            },
            complete: function () {
                wx.hideLoading();
            }
        });
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
            url: api.share.cash_detail,
            data: {
                status: page.data.status,
                page: p,
            },
            success: function (res) {
                if (res.code == 0) {

                    var cash_list = page.data.cash_list.concat(res.data.list);
                    page.setData({
                        cash_list: cash_list,
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
})