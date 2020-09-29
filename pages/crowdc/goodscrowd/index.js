// pages/market/market.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    crowdFundingStatus:0,
    bannerImgs: ["../../images/banner01.jpg", "../../images/banner02.jpg"],
    //所有banner图片的高度
    bannerheights: [],
    product:{
      title:'除醛祛味精灵，守护室内清新',
      current:15000,
      total:50000,
      dueDate:'2019年9月30日',
      remainDay:24,
      persons:89,
      limit:200,
      remaining:132,
      description:'感谢您对***除甲醛去味盒项目的支持，您将以平台抢鲜优惠价89元，获得预计市场零售价129元的**除醛去味盒1个(颜色:灰色)，(产品重量: 130g/个)。',
      thumbnails: ["../../images/thumbnail.png", "../../images/thumbnail.png",],
      distributionWay:'自提/快递',
      distributionWait:30
    },
    productDueDate:''
  },
  /**
   * FUNCTIONS
   */
  getDate(timeStamp){
    let date=new Date(timeStamp);
    let year = date.getFullYear();
    let month = date.getMonth() > 10 ? date.getMonth : '0' + date.getMonth;
    let day=date.getDate();
    this.setData({
      productDueDate:year+'年'+month+'月'+day+'日'
    })
  },
  imageLoad: function (e) {//获取图片真实宽度 
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比 
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值 
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.bannerheights;
    //把每一张图片的对应的高度记录到数组里 
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})