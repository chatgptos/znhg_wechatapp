// page/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islike:false,
    isCollection:false
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

  },
  //点击事件 点赞
  onLiki:function(){
    if (this.data.islike){
      console.log('点赞不可取消');
    }else{
      this.setData({ islike: true }); 
    }
  },
  //是否收藏
  onCollec:function(){
    this.setData({ isCollection: !this.data.isCollection });
  }
})