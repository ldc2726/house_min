//index.js
const app = getApp()
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
Page({
  data: {
    cardList: [],
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  onShow: function (e) {
    this.onLoad();
  },
  city_index() {
    var _this = this;
    wx.navigateTo({
      url: '/commen/cityIndex/cityIndex'
    })
  },
  /**
   * 初始化数据
   */
  onLoad: function () {
    const db = wx.cloud.database();
    var _this = this;
    _this.loadData();

  },
  itemDetails: function (a) {//详情
    console.log(222222222, a)
    const db = wx.cloud.database();
    const _this = this;
    const _ = db.command;
    switch (a.detail) {
      case 'left':
      case 'cell':
        wx.navigateTo({
          url: '/pages/indexItem/indexItem?id=' + a.currentTarget.dataset.id,
        })
        break;
      case 'right':
        Dialog.confirm({
          message: '确定取消关注吗？'
        }).then(() => {
          let index = this.data.likeArray.indexOf(a.currentTarget.dataset.id);
          console.log(index)
          this.data.likeArray.splice(index, 1);
          db.collection('user').doc(app.globalData.openid).update({
            data: {
              like: this.data.likeArray
            }
          }).then(res => {
            wx.showToast('取消关注成功')
            _this.data.cardList.splice(index, 1)
            _this.setData({ cardList: _this.data.cardList })
            }).catch(
              wx.showToast({
                icon: 'none',
                title: '取消关注失败',
              })
            )
        });
        break;
    }
    
  },
  loadData() {
    const db = wx.cloud.database();
    const _this = this;
    const _ = db.command;
    let s = _this.data.city;
    db.collection('user').doc(app.globalData.openid).get().then(res => {
      // res.data 包含该记录的数据
      console.log(res.data.like)
      _this.setData({ likeArray: res.data.like})
      db.collection('housing').where({
        _id: _.in(res.data.like)
        }).get().then(data=>{
        console.log(data.data,888888888)
        _this.setData({ cardList: data.data });
      })
    })
  }
})
