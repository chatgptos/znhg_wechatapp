//index.js
//获取应用实例
var api = require('../../api.js');
const app = getApp()
var interval = new Object();
Page({
    data: {
        titleData: ['商城商品', "预售商品", "众筹商品"],
        titleActive: 2,
        swiper: [
            '../../Img/bg1.jpg', '../../Img/2.jpg', '../../Img/bg1.jpg',
        ],
        raiseSwiper: ['../../Img/bg1.jpg', '../../Img/2.jpg', '../../Img/bg1.jpg'],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 1000,
        hours:"00",
        minutes:"00",
        seconds:"00",
        productData:[
          { img: '../../Img/2.jpg', title: '阿德曼书包', newPrice: 99, oldPrice:199},
          { img: '../../Img/2.jpg', title: '阿德曼书包', newPrice: 99, oldPrice: 199 },
          { img: '../../Img/2.jpg', title: '阿德曼书包', newPrice: 99, oldPrice: 199 },
          { img: '../../Img/2.jpg', title: '阿德曼书包', newPrice: 99, oldPrice: 199 }
        ],
        raiseTitleTab:['全部',"家居服饰","母婴用品","食品美食","时令生鲜","休闲运动"],
        raiseTab:0,
        raiseList:[
            { img: '../../Img/2.jpg', title:'司琸自带可伸缩线移动电源',pel:'40人',money:'1.3万',time:'10天'},
            { img: '../../Img/2.jpg', title: '司琸自带可伸缩线移动电源', pel: '40人', money: '1.3万', time: '10天' },
            { img: '../../Img/2.jpg', title: '司琸自带可伸缩线移动电源', pel: '40人', money: '1.3万', time: '10天' }
          ],
        percent:70,
        raiseListNew:[
          { img: '../../Img/2.jpg', title: '司琸自带可伸缩线', percentage: '40%', money: '1.3万', day: '10天' },
          { img: '../../Img/2.jpg', title: '司琸自带可伸缩线', percentage: '40%', money: '1.3万', day: '10天' },
          { img: '../../Img/2.jpg', title: '司琸自带可伸缩线', percentage: '40%', money: '1.3万', day: '10天' },
          { img: '../../Img/2.jpg', title: '司琸自带可伸缩线', percentage: '40%', money: '1.3万', day: '10天' }
        ]
    },
    //开始计时
    startTimer: function (currentstartTimer) {
      clearInterval(interval);
      interval = setInterval(function () {
        // 秒数
        var second = currentstartTimer;
        // 天数位
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length == 1) dayStr = '0' + dayStr;

        // 小时位
        var hr = Math.floor((second - day * 3600 * 24) / 3600);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;

        // 分钟位
        var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;

        // 秒位
        var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;

        this.setData({
          countDownDay: dayStr,
          hours: hrStr,
          minutes: minStr,
          seconds: secStr,
        });
        currentstartTimer--;
        if (currentstartTimer <= 0) {
          clearInterval(interval);
          this.setData({
            hours: '00',
            minutes: '00',
            seconds: '00',
          });
        }
      }.bind(this), 1000);
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.pageOnLoad(this);
        this.startTimer(600);
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
        // 第一种 开始计时方式 请求到数据就开始计时
        // this.startTimer(600);
        app.pageOnShow(this);
        var page = this;
        page.loadData();
    },
    //点击切换
    clickTitle: function (e) {
        var that = this;
        if (this.data.titleActive === e.currentTarget.dataset.index) {
            return false;
        } else {
            that.setData({
                titleActive: e.currentTarget.dataset.index
            })
        }
    },
    //点击切换
    clickraiseTab: function (e) {
        var that = this;
        if (this.data.raiseTab === e.currentTarget.dataset.index) {
            return false;
        } else {
            that.setData({
                raiseTab: e.currentTarget.dataset.index
            })
        }
    }

})
