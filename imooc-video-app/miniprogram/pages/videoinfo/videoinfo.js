var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: 'cover',
    videoId: "",
    src: "",
    videoInfo: {},
    userLikeVideo: false,

    commentsPage:1,
    commentsTotalPage:1,
    commentsList:[],
    placeholder:"说点什么吧..."
  },

  videoCtx: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var that = this;
    that.videoCtx = wx.createVideoContext("myVideo", that);
    if (params.videoInfo != null && params.videoInfo != '' && params.videoInfo != undefined) {
      //获取上一个页面传入的参数
      var videoInfo = JSON.parse(params.videoInfo);
      var height = videoInfo.videoHeight;
      var width = videoInfo.videoWidth;
      var cover = "cover";
      if (width >= height) {
        cover = "";
      }
      that.setData({
        videoId: videoInfo.id,
        src: app.serverUrl + videoInfo.videoPath,
        videoInfo: videoInfo,
        cover: cover
      });
      var serverUrl = app.serverUrl;
      var user = app.getGlobalUserInfo();
      var loginUserId = "";
      if (user != null && user != '' && user != undefined) {
        loginUserId = user.id;
      }
      wx.request({
        url: serverUrl + '/user/queryPublisher?loginUserId=' + loginUserId + '&videoId=' + videoInfo.id + '&publishUserId=' + videoInfo.userId,
        method: 'POST',
        success: function (res) {
          console.log(res.data);
          var publisher = res.data.data.publisher;
          var userLikeVideo = res.data.data.userLikeVideo;
          that.setData({
            serverUrl: serverUrl,
            publisher: publisher,
            userLikeVideo: userLikeVideo
          });
        }
      })
    }
    that.getCommentsList(1);
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
  showPublisher: function () {
    var that = this;
    var user = app.getGlobalUserInfo();
    var videoInfo = that.data.videoInfo;
    var realUrl = '../mine/mine#publisherId@' + videoInfo.userId;

    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../userLogin/login?redirectUrl=' + realUrl
      })
    } else {
      wx.navigateTo({
        url: '../mine/mine?publisherId=' + videoInfo.userId
      })
    }
  },
  showSearch: function () {
    wx.navigateTo({
      url: '../searchVideo/searchVideo'
    })
  },

  upload: function () {
    var user = app.getGlobalUserInfo();
    var videoInfo = JSON.stringify(that.data.videoInfo);
    var realUrl = '../videoinfo/videoinfo#videoinfo@' + videoInfo;



    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../userLogin/login?redirectUrl=' + realUrl
      })
    } else {
      videoUtil.uploadVideo();
    }

  },
  showIndex: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  showMine: function () {
    var user = app.getGlobalUserInfo();
    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../userLogin/login'
      })
    } else {
      wx.navigateTo({
        url: '../mine/mine'
      })
    }
  },

  likeVideoOrNot: function () {
    var that = this;
    var videoInfo = that.data.videoInfo;
    var user = app.getGlobalUserInfo();
    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../userLogin/login'
      })
    } else {
      var userLikeVideo = that.data.userLikeVideo;
      var url = '/video/userLike?userId=' + user.id + "&videoId=" + videoInfo.id + "&videoCreaterId=" + videoInfo.userId;
      if (userLikeVideo) {
        url = '/video/userUnLike?userId=' + user.id + "&videoId=" + videoInfo.id + "&videoCreaterId=" + videoInfo.userId;
      }
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '...'
      });
      wx.request({
        url: serverUrl + url,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'headerUserId': user.id,
          'headerUserToken': user.userToken
        },
        success: function (res) {
          wx.hideLoading();
          that.setData({
            userLikeVideo: !userLikeVideo
          })
        }
      })
    }
  },
  shareMe: function () {
    var that = this;
    var user = app.getGlobalUserInfo();
    wx.showActionSheet({
      itemList: ['下载到本地', '举报用户', '分享到朋友圈', '分享到QQ空间', '分享到微博'],
      success: function (res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 0) {
          //下载
          wx.showLoading({
            title: '下载中......'
          })
          wx.downloadFile({
            url: app.serverUrl + that.data.videoInfo.videoPath,
            success: function (res) {
              //只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载了想要的内容
              if (res.statusCode == 200) {
                console.log(res.tempFilePath);
                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (res) {
                    console.log(res.errMsg);
                    wx.hideLoading();
                  }
                })
              }
            }
          })

        } else if (res.tapIndex == 1) {
          //举报
          var videoInfo = JSON.stringify(that.data.videoInfo);
          var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;
          if (user == null || user == undefined || user == '') {
            wx.navigateTo({
              url: '../userLogin/login?redirectUrl=' + realUrl
            })
          } else {
            var publishUserId = that.data.videoInfo.userId;
            var videoId = that.data.videoInfo.id;
            var currentUserId = user.id;
            wx.navigateTo({
              url: '../report/report?videoId=' + videoId + '&publishUserId=' + publishUserId
            })
          }
        } else {
          wx.showToast({
            title: '官方暂未开放...'
          })
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    var videoInfo = that.data.videoInfo;
    return {
      title: '短视频内容分享',
      path: "pages/videoinfo/videoinfo?videoInfo=" + JSON.stringify(videoInfo)
    }
  },

  leaveComment: function () {
    this.setData({
      commentFocus: true
    })
  },
  saveComment: function (e) {
    var that = this;
    var content = e.detail.value;

    var fatherCommentId = e.currentTarget.dataset.replyfathercommentid;
    var toUserId= e.currentTarget.dataset.replytouserid;
    

    var user = app.getGlobalUserInfo();
    var videoInfo = JSON.stringify(that.data.videoInfo);
    var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;
    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../userLogin/login?redirectUrl=' + realUrl
      })
    } else {
      wx.showLoading({
        title:'请稍后...',
      })
       wx.request({
        url:app.serverUrl + '/video/saveComment?fatherCommentId='+fatherCommentId+'&toUserId='+toUserId ,
        method:'POST',
        header:{
          'content-type': 'application/json',
          'headerUserId': user.id,
          'headerUserToken': user.userToken
        },
        data:{
          fromUserId:user.id,
          videoId:that.data.videoInfo.id,
          comment : content
        },
        success : function(res){
          console.log(res.data);
          wx.hideLoading();
          that.setData({
            contentValue :"",
            commentsList:[]
          });
          that.getCommentsList(1);
        }
       })
    }
  },

  replyFocus: function(e){
    var fatherCommentId = e.currentTarget.dataset.fathercommentid;
    var toUserId= e.currentTarget.dataset.touserid;
    var toNickname= e.currentTarget.dataset.tonickname;
    
    this.setData({
      placeholder:"回复 "+toNickname,
      replyFatherCommentId:fatherCommentId,
      replyToUserId:toUserId,
      commentFocus:true
    })
  },

  getCommentsList: function(page){
    var that = this;
    var videoId = that.data.videoInfo.id;
    wx.request({
      url: app.serverUrl +'/video/getVideoComments?videoId='+videoId+"&page="+page+"&pageSize=5",
      method:'POST',
      success:function(res){
        console.log(res.data);
        var commentsList = res.data.data.rows;
        var newCommentsList = that.data.commentsList;
        that.setData({
          commentsList: newCommentsList.concat(commentsList),
          commentsPage: page,
          commentsTotalPage: res.data.total
        })
      }
    })
  },

  onReachBottom:function(){
    var that = this;
    var currentPage = that.data.commentsPage;
    var totalPage = that.data.commentsTotalPage;
    if(currentPage === totalPage){
      return;
    }
    var page = currentPage + 1;
    that.getCommentsList(page);
  }
})