// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    step: 1,
    counterId: '',
    likeLength:0,
    openid: '',
    count: null,
    queryResult: '',
  },
  onShow: function (e) {
    this.onLoad();
  },
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
      // wx.showToast({
      //   title: '删除成功',
      // })
      this.loadData();
    }
  },

  loadData(){//初始化加载的数据
    const db = wx.cloud.database();
    db.collection('user').doc(this.data.openid).get().then(res=>{
      console.log(res.data.like.length)
      this.setData({ likeLength: res.data.like.length})
    })
  },

  routeLike(){//跳转到我的关注列表
    wx.navigateTo({
      url: '../likeHous/likeHous',
    })
  }

})