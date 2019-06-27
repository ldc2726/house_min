// pages/indexItem/indexItem.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData:'',
    productId:'',//详情id
    indicatorDots: false,
    autoplay: true,//是否轮播
    interval: 5000,//轮播时间
    duration: 1000,
    likeStar:false,//是否收藏
    likeArray:[],//收藏列表
    canIUse: wx.canIUse('button.open-type.getUserInfo')
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (e) {
    this.onLoad();
  },
  onLoad: function (options) {
    console.log(options.id, app.globalData)
    this.setData({ productId: options.id })
    const db = wx.cloud.database();
    const _this = this;
    //查询对应的详情
    db.collection('housing').doc(options.id).get().then(res => {
      console.log(res.data,999999)
      this.setData({ pageData:res.data})
    })
    //查询是否已经收藏
    db.collection('user').doc(app.globalData.openid).get().then(res=>{
      console.log(res.data, res.data.like.indexOf(1),888888888888)
      _this.setData({ likeArray:res.data.like})
      if (res.data.like.indexOf(options.id)!=-1){
        _this.setData({ likeStar:true })
        console.log(res.data.like,888888888888)
      }
    })
    //访问量加1
    this.seeCount();
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  getPhoneNumber(e) {
    console.log(e)
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       console.log(e)
    //       console.log(e.detail.errMsg)
    //       console.log(e.detail.iv)
    //       console.log(e.detail.encryptedData)
    //     }
    //     }
    //     })
    
  },
  seeCount(){
    const _this = this;
    wx.cloud.callFunction({
      name: 'seeCount',
      data: { _id: _this.data.productId},
      success: res => {
        
      }
    })
  },
  likeRoute(){
    wx.navigateTo({
      url: '../likeHous/likeHous',
    })
  },
  focusOn(){//点击关注
    const db = wx.cloud.database();
    const _ = db.command
    const _this = this;
    console.log(_this.data.productId,'----------')
    if (!_this.data.likeStar){
      db.collection('user').doc(app.globalData.openid).update({
        data: {
          like: _.unshift([_this.data.productId])
        }
      }).then(res=>{
        // Toast.success('关注成功');
        _this.setData({ likeStar: true })
        let index = _this.data.likeArray.length
        _this.data.likeArray[index]=1
        let a = _this.data.likeArray
        console.log(a)
        _this.setData({ likeArray: a })
      }).catch()
    }else{
      let index = this.data.likeArray.indexOf(this.data.productId);
      console.log(index)
      let array = this.data.likeArray.splice(index, 1);
      db.collection('user').doc(app.globalData.openid).update({
        data: {
          like: array
        }
      }).then(res=>{
        // Toast.success('取消关注成功');
        _this.setData({ likeStar: false })
      }).catch(Toast.fail('取消关注失败'))
    }
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