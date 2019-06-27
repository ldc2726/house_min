// commen/cityIndex/cityIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    var _this = this;
    db.collection('city').get().then(res => {
      // res.data 包含该记录的数据
      console.log(res,res.data)
      _this.setData({ cityArray: res.data });
    })
  },
  onChange(event) {
    console.log(event.detail, 'click right menu callback data')
  },
  routerIndex(a){
    console.log(a.currentTarget.dataset.url)
    var url = a.currentTarget.dataset.url;
    wx.setStorage({
      key: 'city',
      data: url
    })
    wx.switchTab({
      url: '/pages/index/index'
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