const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad :function(params) {
    var that = this;
    var redirectUrl = params.redirectUrl;
    if(redirectUrl!=null && redirectUrl != '' && redirectUrl!=undefined){
      redirectUrl = redirectUrl.replace(/#/g,"?");
      redirectUrl = redirectUrl.replace(/@/g,"=");
      that.redirectUrl = redirectUrl;
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  doLogin:function(e){
    var that = this;
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;
    //简单验证
    if(username.length == 0 || password.length == 0){
      wx.showToast({
        title:'用户名或密码不能为空',
        icon:'none',
        duration:3000
      })
    }else{
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title:'请等待...'
      });
      wx.request(
        {
          url:serverUrl + '/login',
          method:'POST',
          data:{
            username:username,
            password:password
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            wx.hideLoading();
            console.log(res.data);
            var status = res.data.status;
            if(status == 200){
              wx.showToast({
                title:'用户登录成功～！！！',
                icon:'none',
                duration:2000
              }), 
              app.userInfo = res.data.data;
              console.log('doLogin ->'+res.data.data);
              //fix me,修改原有的全局对象为本地缓存
              app.setGlobalUserInfo(res.data.data);


              //页面跳转
              var redirectUrl = that.redirectUrl;
              if(redirectUrl != null && redirectUrl!=undefined && redirectUrl!= ''){
                wx.navigateTo(
                  {
                    url: redirectUrl
                  }
                )
              }else{
                wx.navigateTo(
                  {
                    url:'../mine/mine'
                  }
                )
              }
              
            }else if(status==500){
              wx.showToast({
                title:res.data.msg,
                icon:'none',
                duration:3000
              })
            }
          }
        }
      )
    }
  },

  goRegistPage:function(){
    wx.navigateTo(
      {
        url:'../userRegist/regist'
      }
    )
  }
})