// pages/lucky-draw/lucky-draw.js

// //coupon-merchant.js
// //获取应用实例 
var mta = require('../../analysis/mta_analysis.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        times:1,
        redEnvelopeList0: [{
            text: "一"
        },
            {
                text: "二"
            }, {
                text: "三"
            }, {
                text: "一"
            }, {
                text: "五"
            }, {
                text: "六"
            }, {
                text: "七"
            }, {
                text: "八"
            },
            {
                text: "九"
            }, {
                text: '十',
                prize: true,
            },
        ],
        redEnvelopeList1: [{
            text: "一"
        },
            {
                text: "二"
            }, {
                text: "三"
            }, {
                text: "二"
            }, {
                text: "五"
            }, {
                text: "六"
            }, {
                text: "七"
            }, {
                text: "八"
            },
            {
                text: "九"
            }, {
                text: '十',
                prize: true,
            },
        ],
        redEnvelopeList2: [
            {
                text: "一",
                prize: true,
            },
            {
                text: "二"
            }, {
                text: "一"
            }, {
                text: "三"
            }, {
                text: "五"
            }, {
                text: "六"
            }, {
                text: "七"
            }, {
                text: "八"
            },
            {
                text: "九"
            }, {
                text: '十',
            },
        ],
        animation0: -30,
        animation1: -30,
        animation2: -30,
        time0: 5,
        time1: 6.2,
        time2: 7.2,
        show: true,
        flashing: true,
        winInfo: [{
            date: "12-20",
            time: "14:28",
            phone: "135****6521",
            prize: "网红面膜一盒子"
        },
            {
                date: "12-20",
                time: "14:28",
                phone: "135****6521",
                prize: "奖励欢乐豆50"
            },
            {
                date: "12-20",
                time: "14:28",
                phone: "135****6521",
                prize: "兑换商城大奖"
            },
            {
                date: "12-20",
                time: "14:28",
                phone: "135****6521",
                prize: "100平台优惠券"
            }
        ],
        prizeShow: false,
        prizeList: new Array(3),
        QR: ''
    },


    /**
     * @params sort 随机事件
     */
  /**
   * @params sort 随机事件
   */
  sort(data) {
    //随机数组
    return data.sort((a, b) => {
      if (a.prize || b.prize) {

      } else {
        return false;
      }
    })
  },
    /**
     * @params start 抽奖事件
     */
    openQR() {
        mta.Event.stat("openqr",{})
    },

    start() {
        const that = this;
        if(that.data.times<=0){
            wx.showModal({
                title: '提示',
                content: '请兑换抽奖资格: ',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/coupon-merchant/index'
                        });
                    }
                }
            });
        }
        

    //     //  重置数组顺序后转动两圈
    //     this.setData({
    //         redEnvelopeList0: that.sort(this.data.redEnvelopeList0),
    //         redEnvelopeList1: that.sort(this.data.redEnvelopeList1),
    //         redEnvelopeList2: that.sort(this.data.redEnvelopeList2)
    //     }, () => {
           

    // })
      that.setData({
        animation0: this.data.animation0 + 720,
      })

        if(this.data.times>0){
            that.setData({
                times:this.data.times-1,
            })
        }




        mta.Event.stat("start", {})
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    showPrize() {
        this.setData({
            prizeShow: true
        });

        mta.Event.stat("showprize", {})
    },
    closePrize() {
        this.setData({
            prizeShow: false
        });

        mta.Event.stat("closeprize", {})
    },
    /**
     * @params lamp 跑马灯封装
     */
  lamp() {
    let flashing = !this.data.flashing;
    this.setData({
      flashing: flashing
    }, () => {
      setTimeout(() => {
        this.lamp();
      }, 250);
    });
  },
    onReady: function () {
        this.lamp();
    },

});