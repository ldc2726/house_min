//index.js
const app = getApp()

Page({
  data: {
    searchValue:"",
    city:'',
    cardList:[],
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  onSearch(event){
    console.log(event.detail)
  },
  onShow: function(e){
    this.onLoad();
    this.onGetOpenid();
  },
  onCancel(){
    console.log(222222)
  },
  city_index(){
    var _this = this;
    wx.navigateTo({
      url: '/commen/cityIndex/cityIndex'
    })
  }, 
  /**
   * 初始化数据
   */
  onLoad: function() {
    const db = wx.cloud.database();
    var _this = this;
    wx.getStorage({
      key: 'city',
      success(res) {
        console.log(res,1111111)
        _this.setData({ city: res.data });
        _this.loadData();
      },
      fail:err=>{
        wx.getLocation({//获取经纬度
          type: 'wgs84',
          success: res => {
            console.log(res)
            var longitude = res.longitude
            var latitude = res.latitude
            _this.loadCity(longitude, latitude)

          }
        })
      }
    })
    
    
    
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    
  },
  loadCity: function (longitude, latitude) {//百度api，经纬度转换地址
     var page = this
     wx.request({
       url: 'https://api.map.baidu.com/reverse_geocoding/v3/?ak=hPSV9fbG0gyc0XbKLq5WIlnXXBShmkN5&location=' + latitude + ',' + longitude + '&output=json&coordtype=wgs84ll',
        data: {},
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          // success 
          console.log(res);
          var city = res.data.result.addressComponent.city;
          console.log("城市为" + city)
          page.setData({ city: city });
          page.loadData();
        }
    })
  },
  itemDetails:function(a){//详情
    console.log(222222222, a.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/indexItem/indexItem?id=' + a.currentTarget.dataset.id, 
    })
  },
  onGetUserInfo: function(e) {
      console.log(e,22222222)
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  loadData(){
    const db = wx.cloud.database();
    const _this = this;
    const _ = db.command;
    let s = _this.data.city;
    db.collection('housing').where({
      citys: _.eq(s).or(_.eq(s.substring(0, s.length - 1)))
    }).get().then(res => {
      // res.data 包含该记录的数据
      _this.setData({ cardList: res.data });
    })
  },
  onGetOpenid: function() {// 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res)
        app.globalData.openid = res.result.openid
        const db = wx.cloud.database();
        db.collection('user').where({
          _openid: app.globalData.openid // 填入当前用户 openid
        }).get({
          success: function (res) {
            console.log(res.data,44444444444)
            if(res.data.length==0){
              console.log('没有数据')
              db.collection('user').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  userId: app.globalData.openid,
                  _id: app.globalData.openid
                }
              }).then(res => {
                console.log(res)
              }).catch(console.error)
            }
          }
        })
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
