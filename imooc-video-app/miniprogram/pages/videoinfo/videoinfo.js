
var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover:'cover',
    videoId:"",
    src:"",
    videoInfo:{}
  },

  videoCtx:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(params) {
      var that = this;
      that.videoCtx = wx.createVideoContext("myVideo",that);
      if(params.videoInfo != null && params.videoInfo != '' && params.videoInfo != undefined){
          //获取上一个页面传入的参数
          var videoInfo = JSON.parse(params.videoInfo);
          var height = videoInfo.videoHeight;
          var width = videoInfo.videoWidth;
          var cover = "cover";
          if(width >= height){
            cover = "";
          }
          that.setData({
            videoId:videoInfo.id,
            src: app.serverUrl + videoInfo.videoPath,
            videoInfo:videoInfo,
            cover:cover
          })
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
    var that = this;
    that.videoCtx.play();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    var that = this;
    that.videoCtx.pause();
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
  showSearch : function(){
    wx.navigateTo({
      url:'../searchVideo/searchVideo'
    })
  },

  upload : function(){
    var user = app.getGlobalUserInfo();
    var videoInfo = JSON.stringify(that.data.videoInfo);
    var realUrl = '../videoinfo/videoinfo#videoinfo@'+videoInfo;
    


    if(user == null || user == undefined || user == ''){
      wx.navigateTo({
        url:'../userLogin/login?redirectUrl='+realUrl
      })
    }else{
      videoUtil.uploadVideo();
    }
    
  },
  showIndex: function(){
    wx.redirectTo({
      url:'../index/index'
    })
  },
  showMine : function(){

    var user = app.getGlobalUserInfo();
    if(user == null || user == undefined || user == ''){
      wx.navigateTo({
        url:'../userLogin/login'
      })
    }else{
      wx.navigateTo({
        url:'../mine/mine'
      })
    }

    
  }
})