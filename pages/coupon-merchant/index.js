// //coupon-merchant.js
// //获取应用实例
var api = require('../../api.js');
var app = getApp()

Page({
    data: {
        qsId:0,
        buttonClicked: '',
        buttonName: '立即申请',
        currentTab: 0,
        currentList: 0,
        requirelist: {},
        award:{},
        ishidden:false,
        couponpre:0,
        userlist: {},
        roleName: '',
        flc:{},
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
            {title: '' +
                '成为经销商'},
            {title: '成为渠道商'},
            {title: '服务权'},
            {title: '分红权'},
            {title: '福利'},
            {title: '抽奖'},
            {title: '赠送'}
        ],
        initCount:[1000,'...','...'],
        roundIndex:['一','二','三'],
        addLine:100,
        youHas:'',
    },


    //点击切换
    // clickTab: function (e) {
    //     var that = this;
    //     if (this.data.currentTab === e.target.dataset.current) {
    //         return false;
    //     } else {
    //         that.setData({
    //             currentTab: e.target.dataset.current
    //         })
    //
    //         console.log(e.target.dataset.current)
    //     }
    //
    // },
    //点击切换
    clickList: function (e) {
        var page = this;
        var qsId = e.currentTarget.dataset.index;

        var that = this;
        if (this.data.currentList === e.currentTarget.dataset.index) {
            return false;
        } else {
            that.setData({
                buttonClicked: true,
                buttonName: '立即申请',
                currentList: e.currentTarget.dataset.index
            })
        }
        console.log(e);
        console.log(this.data.currentTab);
        console.log(e.currentTarget.dataset.index);

        if(qsId==3){
            //分红
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
                            buttonName: res.data.buttonName,
                            buttonClicked: res.data.buttonClicked,
                            fhq: res.data.fhq,
                            fhqfs: res.data.fhq.fhqfs,
                            fhqqs: res.data.fhq.fhqqs,
                            initCount:res.data.fhq.fhqfs,
                            roundIndex:res.data.fhq.fhqqs,
                            youHas:res.data.fhq.youHas
                        })
                    }
                },
                complete: function () {
                    wx.hideLoading();
                }
            });



        }else if(qsId==4){
            //福利
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
                            buttonName: res.data.buttonName,
                            buttonClicked: res.data.buttonClicked,
                            flc: res.data.flc,
                            youHas:res.data.flc.youHas
                        })
                    }
                },
                complete: function () {
                    wx.hideLoading();
                }
            });



        }else if(qsId==5){
            //抽奖获取奖品
            app.request({
                url: api.couponmerchant.get_qs_info,
                methods: "POST",
                data: {
                    qsId: qsId,
                    num:7
                },
                success: function (res) {
                    if (res.code == 0) {
                        wx.showLoading({
                            title: "授权成功",
                            mask: false,
                        });
                        console.log(res.data.award.awardsList);
                        page.setData({
                            buttonName: res.data.buttonName,
                            buttonClicked: res.data.buttonClicked,
                            award: res.data.award,
                            ishidden:false,
                        })
                        var awardsList = page.data.award.awardsList
                        page.initAwardList(awardsList);
                    }
                    if (res.code == 1) {
                        wx.showToast({
                            title: res.msg,
                            image: "/images/icon-warning.png",
                        });
                        page.setData({
                            buttonName: res.data.buttonName,
                            buttonClicked: res.data.buttonClicked,
                            ishidden:true,
                        })
                    }
                },
                complete: function () {
                    wx.hideLoading();
                }
            });



        }else {
            app.request({
                url: api.couponmerchant.get_qs_info,
                methods: "POST",
                data: {
                    qsId: qsId
                },
                success: function (res) {
                    if (res.code == 0) {
                        wx.showLoading({
                            title: "授权成功",
                            mask: false,
                        });
                        console.log(res.data);
                        page.setData({
                            buttonName: res.data.buttonName,
                            buttonClicked: res.data.buttonClicked,
                            requirelist: res.data,
                        })
                    }
                },
                complete: function () {
                    wx.hideLoading();
                }
            });
        }












    },

    addValue(e){//分红权---点击增加/减少
        var index = e.currentTarget.dataset.index;
        var isAdd = e.currentTarget.dataset.isadd;
        let lastNumber = this.data.initCount[index];
        if(isAdd){
            lastNumber += this.data.addLine
        }else{//减少
            if (lastNumber<=0){
                lastNumber=0
            }else{
                lastNumber -= this.data.addLine
            }
        }
        this.data.initCount[index]=lastNumber
        this.setData({
            initCount: this.data.initCount
        })
        console.log(e.currentTarget)
    },
    //申请
    apply: function (e) {
        var form_id = e.detail.formId;
        console.log(e);
        var page = this;
        var share_setting = wx.getStorageSync("share_setting");
        var user_info = wx.getStorageSync("user_info");
        page.setData({
            buttonClicked: '申请中...'
        });
        wx.showModal({
            title: "申请",
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
                        data: {
                            qsId: page.data.currentList,
                            form_id: form_id
                        },
                        success: function (res) {
                            if (res.code == 0) {
                                wx.showLoading({
                                    title: "授权成功",
                                    mask: false,
                                });
                                page.setData({
                                    buttonName: res.data.buttonName,
                                    buttonClicked: res.data.buttonClicked,
                                    coupon: res.data.coupon,
                                    youHas:res.data.youHas
                                })
                            }else {
                                page.setData({
                                    buttonName: res.msg,
                                    buttonClicked: true,
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

        //请求券池子初始化
        app.request({
            url: api.couponmerchant.get_qs_info,
            methods: "POST",
            data: {
                qsId: 10,
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
                        buttonName: res.data.buttonName,
                        buttonClicked: res.data.buttonClicked,
                        userlist: res.data.userlist,
                        roleName: res.data.userlist.roleName,
                        coupon:res.data.userlist.coupon,
                        ishidden:true,
                    })
                }
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },


    /**
     * 初始化
     */
    onLoad: function (options) {

    },

    /**
     * 初始化抽奖
     */
    initAwardList: function (list) {
        // 绘制转盘
        var awardsList = [];
        var angle = 360 / list.length;
        for (var i = 0; i < list.length; i++) {
            awardsList.push({
                degree: {
                    item: `${i * angle}deg`,
                    line: `${(i + 0.5) * angle}deg`,
                    bg_1: `${(i - 0.5) * angle + 90}deg`,
                    bg_2: `${angle - 90}deg`
                },
                award: list[i],
                color: this.getRandomColor()
            })
        }
        this.setData({
            awardsList: awardsList
        });
    },

    /**
     * 点击抽奖
     */
    getLotteryClick: function (awardIndex) {

        var page = this;
        //抽奖获取奖品
        app.request({
            url: api.couponmerchant.choujiang,
            methods: "POST",
            data: {
                num: 7,//抽奖编号
            },
            success: function (res) {
                if (res.code == 0) {
                    wx.showLoading({
                        title: "授权成功",
                        mask: false,
                    });
                    console.log(res.data.award.awardsList);
                    page.setData({
                        buttonName: res.data.buttonName,
                        buttonClicked: res.data.buttonClicked,
                        award: res.data.award,
                        couponpre:res.data.coupon,
                    })
                    var awardsList = page.data.award.awardsList;
                    var awardIndex = page.data.award.awardIndex;
                    var duration = page.data.award.duration ;//转动时间4000
                    var runNum = page.data.award.runNum;//转动圈数
                    page.getLottery(awardIndex,awardsList,duration,runNum);
                }
            },
            complete: function () {
              wx.hideLoading();
            }
        });
    },
    /**
     * 开始抽奖
     * 获奖序号
     * var awardIndex = 0;
     // /// 转动时间
     // let duration = 4000;
     // /// 转动圈数
     // let runNum = 6;
     */
    getLottery: function (awardIndex,awardsList,duration,runNum) {


        // 旋转抽奖
        this.runDegs = this.runDegs || 0;
        this.runDegs = this.runDegs + (360 - this.runDegs % 360) + (360 * runNum - awardIndex * (360 / this.data.awardsList.length));

        /// 开始转动
        this.startRun(awardIndex, duration, this.runDegs,awardsList);
    },

    /**
     * 开始转动
     */
    startRun: function (awardIndex, duration, runDegs,awardsList) {
        /// 动画
        var animation = wx.createAnimation({
            duration: duration,
            timingFunction: 'ease'
        });
        animation.rotate(runDegs).step();
        this.setData({
            animationData: animation.export()
        });
        /// 中奖提示
        setTimeout(() => {
            this.stopRun(awardsList[awardIndex]);
        }, duration + 300)
        ;
    },

    /**
     * 结束转动
     */
    stopRun: function (awardIndex) {
        console.log('抽中了奖品: ' + awardIndex)
        var page =this
        page.setData({
            coupon:page.data.couponpre,
            buttonName:'开始抽奖',
            buttonClicked: false,
        })

        wx.showModal({
            title: '中奖',
            content: '抽中了奖品: ' + awardIndex + '已经进入您账户是否去参加新年抽奖',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    wx.redirectTo({
                        url: '/pages/choujiang/choujiang'
                    });
                }
            }
        });
    },

    /**
     * 获取随机颜色
     */
    getRandomColor: function () {
        var func = function (color) {
            return (color += '0123456789abcdefg' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : func(color);
        }
        return `#${func('')}`
    },
    account: function () {
        wx.navigateTo({
            url: '/pages/fair/fair',
        })
    },

})
