// pages/info-list/info-list.js

var api = require('../../api.js');
var app = getApp();
var is_loading_more = false;
var is_no_more = false;
var pageNum = 2;

Page({

    /**
     * 页面的初始数据
     */
  
    data: {  
        show_customer_service: 0, 
        user_info:{},
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page_count: 0,
        cat_show:1,
        note:[
            {
              name: '大脸猫爱吃鱼大脸猫爱吃鱼大脸猫爱吃鱼大脸猫爱吃鱼大脸猫爱吃鱼',
              heart_num: '1',
              title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
              url: 'http://f10.baidu.com/it/u=121654667,1482133440&fm=72',
              avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
            },
            {
              name: '大脸猫爱吃鱼',
              heart_num: '2',
              title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
              url: 'http://img3.imgtn.bdimg.com/it/u=1417732605,3777474040&fm=26&gp=0.jpg',
              avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
            },
            {
              name: '大脸猫爱吃鱼',
              heart_num: '3',
              title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
              url: 'http://img3.imgtn.bdimg.com/it/u=1417732605,3777474040&fm=26&gp=0.jpg',
              avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
            }, {
              name: '大脸猫爱吃鱼',
              heart_num: '4',
              title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
              url: 'http://f10.baidu.com/it/u=121654667,1482133440&fm=72',
              avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
            },
            {
              name: '大脸猫爱吃鱼',
              heart_num: '5',
              title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
              url: 'http://f10.baidu.com/it/u=121654667,1482133440&fm=72',
              avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
            },
            {
              name: '大脸猫爱吃鱼',
              heart_num: '6',
              title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
              url: 'http://img3.imgtn.bdimg.com/it/u=1417732605,3777474040&fm=26&gp=0.jpg',
              avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
            },
            {
              name: '大脸猫爱吃鱼',
              heart_num: '7',
              title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
              url: 'http://img4.imgtn.bdimg.com/it/u=2748975304,2710656664&fm=26&gp=0.jpg',
              avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
            }, {
              name: '大脸猫爱吃鱼',
              heart_num: '8',
              title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
              url: 'http://img2.imgtn.bdimg.com/it/u=1561660534,130168102&fm=26&gp=0.jpg',
              avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
            }
          ],
        goods_list: [
            // {
            //     imgurl: '',
            //     name: '我的牙很白',
            //     title: '原价300优惠券，200欢乐豆出，机不可失 买到就是赚到！！',
            //     tradingnum: 23,
            //     numer: 123
            // },
        ],
        cat_id: "",
        page: 1,
        cat_list: [],
        sort: 0,
      sort_type: -1, 
      style_name: "block",
        avatar_url_hongbao:'',
        isopen:false,
        is_hongbao:0,
        roomId1:4,
        customParams1:4,
        roomId2:5,
        customParams2:5,
        roomId2:6,
        customParams2:6,
        
    },


    
    /**
     * 预约首页加载
     */
    loadIndexInfo: function (e) {
        var page = e;
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        app.request({
            url: api.cheapmarket.index,
            method: "get",
            success: function (res) {
                if (res.code == 0) {
                    setTimeout(function () {
                        // 延长一秒取消加载动画
                        wx.hideLoading();
                    }, 1000);
                    page.setData({
                        cat: res.data.cat,
                        banner: res.data.banner,
                        ad: res.data.ad,
                        goods: res.data.goods.list,
                        cat_show: res.data.cat_show,
                        page_count: res.data.goods.page_count,
                    });
                    if (res.data.goods.page >= res.data.goods.page_count){
                        page.setData({
                            emptyGoods:1,
                        });
                    }
                }
            }
        });
    },
    /**
     * 页面的初始数据
     */

    onLoad: function (options) {
        app.pageOnLoad(this);
        this.loadData(options);  
        this.systemInfo = wx.getSystemInfoSync()
        this.loadIndexInfo(this);
    },

    /**
     * 加载初始数据
     * */
    loadData: function (options) {
        var page = this;
        page.reloadGoodsList();

    },
    reloadGoodsList: function () {
        var page = this;
        is_no_more = false;
        page.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: false,
        });
        var cat_id = page.data.cat_id || "";
        var p = page.data.page || 1;
        //wx.showNavigationBarLoading();
        app.request({
            url: api.couponmerchant.business_list,
            data: {
                page: p,
            },
            success: function (res) {
                if (res.code == 0) {
                    if (res.data.list.length == 0)
                        is_no_more = true;
                    page.setData({page: (p + 1)});
                    page.setData({goods_list: res.data.list});
                    page.setData({is_hongbao: res.data.is_hongbao});
                }
                console.log(res.data.list);
                page.setData({
                    show_no_data_tip: (page.data.goods_list.length == 0),
                });
            },
            complete: function () {
                //wx.hideNavigationBarLoading();
            }
        });
    }
    ,

    onReachBottom: function () {
        var page = this;
        if (is_no_more)
            return;
        page.loadMoreGoodsList();
    },
    loadMoreGoodsList: function () {
        var page = this;
        if (is_loading_more)
            return;
        page.setData({
            show_loading_bar: true,
        });
        is_loading_more = true;
        var cat_id = page.data.cat_id || "";
        var p = page.data.page || 2;
        app.request({
            url: api.couponmerchant.business_list,
            data: {
                page: p,
            },
            success: function (res) {
                if (res.data.list.length == 0)
                    is_no_more = true;
                var goods_list = page.data.goods_list.concat(res.data.list);
                page.setData({
                    goods_list: goods_list,
                    page: (p + 1),
                });
                page.setData({is_hongbao: res.data.is_hongbao});
            },
            complete: function () {
                is_loading_more = false;
                page.setData({
                    show_loading_bar: false,
                });
            }
        });
    }
    ,
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.popup = this.selectComponent('#popup');
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    showPupop: function () {
        this.popup.showPopup();
    },
    _error() {
        this.popup.hidePopup();
    },
    _success() {
        this.popup.hidePopup();
    },
      adClose() {
        this.setData({
          style_name: 'none'
        })
      },
    openDoor(event) {
        var page =this;
        var is_hongbao=event.currentTarget.dataset.ishongbao
        var gid=event.currentTarget.dataset.gid
        var key=event.currentTarget.dataset.key
        var is_ad=event.currentTarget.dataset.is_ad
        var goods_list=event.currentTarget.dataset.goods_list
        console.log(event.currentTarget.dataset.gid)
        console.log(event.currentTarget.dataset.ishongbao)
        console.log(event.currentTarget.dataset.key)
        console.log(event.currentTarget.dataset.goods_list)
        console.log(event.currentTarget.dataset.is_ad)

        //设置点击红包消失
        goods_list[key]['is_hongbao']=0;

        page.setData({
            goods_list: goods_list,
        });
        if(is_hongbao==1){
            wx.showLoading({
                title: '踩到红包',
            });
            app.request({
                url: api.couponmerchant.business_hongbao,
                method: "post",
                data: { is_hongbao: is_hongbao,id:gid,is_ad:is_ad},
                success: function (res) {
                    if (res.code == 0) {
                        wx.showLoading({
                            title: res.msg,
                        });
                        setTimeout(function () {
                            // 延长一秒取消加载动画
                            wx.hideLoading();
                            // wx.navigateTo({
                            //     url: "/pages/coupon-merchant-mall/index?id=" + gid,
                            // });
                        }, 300);
                        if(res.data.avatar_url_hongbao){
                            goods_list[key]['avatar_url_hongbao1']=res.data.avatar_url_hongbao;
                            goods_list[key]['nickname_hongbao1']=res.data.nickname_hongbao;
                            page.setData({
                                goods_list: goods_list,
                            });
                        }
                    }else {
                        wx.showLoading({
                            title: res.msg,
                        });

                        setTimeout(function () {
                            // 延长一秒取消加载动画
                            wx.hideLoading();
                            // wx.navigateTo({
                            //     url: "/pages/coupon-merchant-mall/index?id=" + gid,
                            // });
                        }, 300);
                    }
                }
            });
        }else {
            wx.navigateTo({
                url: "/pages/coupon-merchant-mall/index?id=" + gid +'&is_ad='+is_ad,
            });
        }
    },


    tabOpen:function(){
        this.setData({
            isopen:!this.data.isopen,
            bottom: '300px'
    })
    },



    
    /**
     * 顶部导航事件
     */
    switchNav: function (e) {
        var page = this;
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        var cid = 0;
        pageNum = 2;
        if (cid == e.currentTarget.dataset.id && e.currentTarget.dataset.id != 0) return;
        cid = e.currentTarget.dataset.id;
        console.log(this.systemInfo);
        var windowWidth = this.systemInfo.windowWidth
        var offsetLeft = e.currentTarget.offsetLeft
        var scrollLeft = this.data.scrollLeft;
        if (offsetLeft > windowWidth / 2) {
            scrollLeft = offsetLeft
        } else {
            scrollLeft = 0
        }
        page.setData({
            cid: cid,
            page: 1,
            scrollLeft: scrollLeft,
            scrollTop: 0,
            emptyGoods: 0,
            goods: [],
            show_loading_bar: 1,
        })
        app.request({
            url: api.cheapmarket.list,
            method: "get",
            data: { cid: cid },
            success: function (res) {
                if (res.code == 0) {
                    setTimeout(function () {
                        // 延长一秒取消加载动画
                        wx.hideLoading();
                    }, 1000);
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
})