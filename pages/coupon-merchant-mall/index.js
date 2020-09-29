// //coupon-merchant.js
// //获取应用实例
var api = require('../../api.js');
var utils = require('../../utils.js');
var app = getApp();
var p = 1;
var is_loading_comment = false;
var is_more_comment = true;
var WxParse = require('../../wxParse/wxParse.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        islike: false,
        isCollection: false,
        hiddenmodalput: true,
        tab_comment: "",
        userlist: {},
        title: {},
        num: 0,
        hld: 0,
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0,
        },
        is_exchange: 0,
        huanledou_charge: 0,
        xtjl: 0,
        huanledou_total: 0,
        is_hongbao:0,
        is_prarent:0,
        is_aim:0,
        is_ad:0,
        liveStatus:0,
        liveStatusName:'直播',
        room_info:'',
        article_info:'',
    },

    //点击事件 点赞
    onLiki: function () {
        if (this.data.islike) {
            console.log('点赞不可取消');
        } else {
            this.setData({islike: true});
        }
    },
    //是否收藏
    onCollec: function () {
        this.setData({isCollection: !this.data.isCollection});
    },
    exchange: function () {
        this.setData({
            hiddenmodalput: false,
        })
    },
    think: function () {
        this.setData({
            hiddenmodalput: true,
        })
    },
    sureDo: function (e) {
        var page = this;

        app.request({
            url: api.couponmerchant.business_exchange,
            method: "post",
            data: {
                order_id: page.data.id,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.code == 0) {
                    wx.showToast({
                        title: res.msg,
                    });
                    page.setData({
                        hiddenmodalput: true,
                        is_exchange: res.data.is_exchange,
                    })
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
        var page = this;
        page.setData({
            id: options.id,
        });
        page.setData({
            is_ad: options.is_ad,
        });

        page.getCommentList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var page = this;
        page.getCommentList(true);
    },

    getCommentList: function (more) {
        var page = this;
        if (more && page.data.tab_comment != "active")
            return;
        if (is_loading_comment)
            return;
        if (!is_more_comment)
            return;
        is_loading_comment = true;
        app.request({
            url: api.couponmerchant.business_comment_list,
            data: {
                order_id: page.data.id,
                page: p,
            },
            success: function (res) {
                if (res.code != 0)
                    return;
                is_loading_comment = false;
                p++;
                page.setData({
                    comment_count: res.data.comment_count,
                    comment_list: more ? page.data.comment_list.concat(res.data.list) : res.data.list,
                });
                if (res.data.list.length == 0)
                    is_more_comment = false;
            }
        });
    },

    loadData: function (options) {


        var page = this;
        page.setData({
            store: wx.getStorageSync('store'),
        });
        page.setData({
            hiddenmodalput: true
        })
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

        // console.log(this.data.id)
        app.request({
            url: api.couponmerchant.business,
            methods: "POST",
            data: {
                id: this.data.id,
            },
            success: function (res) {
                if (res.code == 0) {
                    wx.showLoading({
                        title: "授权成功",
                        mask: false,
                    });
                    console.log(res.data);
                    page.setData({
                        requirelist: res.data,
                        title: res.data.title,
                        userlist: res.data.userlist,
                        num: res.data.num,
                        hld: res.data.hld,
                        is_exchange: res.data.is_exchange,
                        huanledou_charge: res.data.huanledou_charge,
                        xtjl: res.data.xtjl,
                        huanledou_total: res.data.huanledou_total,
                        is_hongbao: res.data.is_hongbao,
                        is_aim: res.data.is_aim,
                        is_parent: res.data.is_parent,
                        room_info: res.data.room_info,
                        room_id: res.data.room_id,
                        article_id: res.data.article_id,
                        article_info:res.data.article_info,
                    })
                    WxParse.wxParse("content", "html", res.data.article_info.content, page);
                    page.setData({
                        is_favorite: res.data.article_info.is_favorite,
                    });
                }
            },
            complete: function () {
                wx.hideLoading();
            }
        });


                var livePlayer = requirePlugin('live-player-plugin')
                // 首次获取立马返回直播状态，往后间隔1分钟或更慢的频率去轮询获取直播状态
                var roomId = 3 // 房间 id
                livePlayer.getLiveStatus({ room_id: roomId })
                    .then(res => {
                    // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期
                    const liveStatus = res.liveStatus
                    // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期
                    var liveStatusName='';
                if(liveStatus=='101'){
                    liveStatusName='直播中'
                }
                if(liveStatus=='102'){
                    liveStatusName='直播未开始'
                }
                if(liveStatus=='103'){
                    liveStatusName='直播结束'
                }

                if(liveStatus=='104'){
                    liveStatusName='直播禁播'
                }

                if(liveStatus=='105'){
                    liveStatusName='直播暂停中'
                }

                if(liveStatus=='106'){
                    liveStatusName='直播异常'
                }
                if(liveStatus=='107'){
                    liveStatusName='直播已过期'
                }
                page.setData({
                    liveStatus: liveStatus,
                    liveStatusName: liveStatusName,
                });
                console.log('get live status', liveStatus)
            })
            .catch(err => {
                    console.log('get live status', err)
            })






    },
    openDoor(event) {
        var page =this;
        var is_hongbao=event.currentTarget.dataset.ishongbao
        var gid=event.currentTarget.dataset.gid
        var is_ad=event.currentTarget.dataset.is_ad
        // console.log(event.currentTarget.dataset.gid)
        // console.log(event.currentTarget.dataset.ishongbao)
        console.log(event.currentTarget.dataset.is_ad)

        //设置点击红包消失
        page.setData({
            is_hongbao: 0,
        });
        page.setData({
            is_ad: is_ad,
        });
        if(is_hongbao==2){
            wx.showLoading({
                title: '这里都被发现啦，晕～',
            });
            app.request({
                url: api.couponmerchant.business_hongbao,
                method: "post",
                data: { is_hongbao: is_hongbao,id:gid},
                success: function (res) {
                    if (res.code == 0) {
                        wx.showLoading({
                            title: res.msg,
                        });
                        setTimeout(function () {
                            // 延长一秒取消加载动画
                            wx.hideLoading();
                        }, 1000);
                    }else {
                        wx.showLoading({
                            title: res.msg,
                        });
                        setTimeout(function () {
                            // 延长一秒取消加载动画
                            wx.hideLoading();
                        }, 1000);
                    }
                }
            });
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var page = this;
        var user_info = wx.getStorageSync("user_info");
        var id = page.data.id;
        var res = {
            title: page.data.article_info.title,
            path: "/pages/topic/topic?id="+id+"&user_id=" + user_info.id,
        };
        console.log(res);
        return res;
    },
    wxParseTagATap: function (e) {
        console.log(e);
        if (e.currentTarget.dataset.goods) {
            var src = e.currentTarget.dataset.src || false;
            if (!src)
                return;
            wx.navigateTo({
                url: src,
            });
        }
    },

    favoriteClick: function (e) {
        var page = this;
        var action = e.currentTarget.dataset.action;
        app.request({
            url: api.user.topic_favorite,
            data: {
                topic_id: page.data.article_id,
                action: action,
            },
            success: function (res) {
                wx.showToast({
                    title: res.msg,
                });
                if (res.code == 0) {
                    var article_info=page.data.article_info;
                    console.log(article_info);
                    article_info.avatar_url=res.data.avatar_url
                    article_info.nickname=res.data.nickname
                    page.setData({
                        is_favorite: action,
                        article_info:article_info,
                    });
                }
            }
        });
    },
})