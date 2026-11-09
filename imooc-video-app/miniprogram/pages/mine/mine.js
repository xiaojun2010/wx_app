var videoUtil = require('../../utils/videoUtil.js')
const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
    serverUrl:app.serverUrl,
    fansCounts:0,
    followCounts:0,
    receiveLikeCounts:0,
    nickname:'',
    isMe: true,
    isFollow:false,
    publisherId:"",
    videoSelClass:"video-info",
    isSelectedWork:"video-info-selected",
    isSelectedLike:"",
    isSelectedFollow:"",


    myVideoList: [],
    myVideoPage: 1,
    myVideoTotal: 1,

    likeVideoList: [],
    likeVideoPage: 1,
    likeVideoTotal: 1,

    followVideoList: [],
    followVideoPage: 1,
    followVideoTotal: 1,

    myWorkFalg:false,
    myLikesFalg:true,
    myFollowFalg:true

  },
  onLoad: function (params) {
      var that = this;
      var user = app.getGlobalUserInfo();
      var userId = user.id;
      var publisherId = params.publisherId;
      if(publisherId!=null && publisherId!='' && publisherId!=undefined){
        userId = publisherId;
        that.setData({
          isMe:false,
          publisherId:publisherId
        })
      }
      
      wx.showLoading({
          title:'请等待...'
      });
      var serverUrl = app.serverUrl;
      wx.request(
        {
          url:app.serverUrl + '/user/query?userId='+userId+'&fanId='+user.id,
          method:'POST',
         
          header: {
            'content-type': 'application/json' ,// 默认值
            'userId':user.id,
            'userToken':user.userToken
          },
          success: function (res) {
            wx.hideLoading();
            console.log(res.data);
            var status = res.data.status;
            
            if(status == 200){
              var userInfo = res.data.data;
              var faceUrl = '../resource/images/noneface.png';
            
              if(userInfo.faceImage!=null && userInfo.faceImage!='' && userInfo.faceImage != undefined){
                 faceUrl = serverUrl + userInfo.faceImage;
              }
              that.setData({
                faceUrl:faceUrl,
                fansCounts:userInfo.fansCounts,
                followCounts:userInfo.followCounts,
                receiveLikeCounts:userInfo.receiveLikeCounts,
                nickname:userInfo.nickname,
                isFollow:userInfo.follow
              })
            }else if(status==502){
              wx.showToast({
                title:res.data.msg,
                duration:3000,
                icon:"none",
                success:function(){
                  wx.redirectTo({
                    url:'../userLogin/login'
                  })
                }
              })
            }
          }
        }
      )

  },

  followMe:function(e){
      var that = this;
      var user = app.getGlobalUserInfo();
      var userId = user.id;
      var publisherId = that.data.publisherId;
      console.log(e);
      var followType = e.currentTarget.dataset.followtype;
      //1:关注；0:取消关注
      var url = '';
      if(followType == '1'){
        url = '/user/beyourfans?userId='+publisherId+'&fanId='+userId;
      }else{
        url = '/user/dontbeyourfans?userId='+publisherId+'&fanId='+userId;
      }
      wx.showLoading({

      });
      wx.request({
        url:app.serverUrl + url,
        method:'POST',
        header:{
          'content-type':'application/json',
          'headerUserId':user.id,
          'headerUserToken':user.userToken
        },
        success:function(){
          wx.hideLoading();
          if(followType == '1'){
            that.setData({
              isFollow:true,
              fansCounts:++that.data.fansCounts
            })
          }else{
            that.setData({
              isFollow:false,
              fansCounts: --that.data.fansCounts
            })
          }
        }
      })
  },
  logout: function () {
    var user = app.getGlobalUserInfo();
    
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请等待...'
    });

    wx.request({
      url: serverUrl + '/logout?userId=' + user.id,
      method: 'POST',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        wx.hideLoading();
        console.log(res.data);
        var status = res.data.status;
        if (status == 200) {
          wx.showToast({
            title: '注销成功',
            icon: 'success',
            duration: 2000
          });
          //app.userInfo = null;
          app.removeGlobalUserInfo();
          //TODO 页面跳转
          wx.navigateTo({
            url: '../userLogin/login'
          })
        } else if (status == 500) {

        }
      }
    })
  },

  changeFace: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.showLoading({
          title: '上传中'
        })
        var serverUrl = app.serverUrl;
        wx.uploadFile({
          url: serverUrl + '/' + '/user/uploadFace?userId=' + app.userInfo.id, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            var data = JSON.parse(res.data);
            wx.hideLoading();
            //do something
            console.log(data);
            if (data.status == 200) {
              wx.showToast({
                title: '上传成功！～',
                icon: "success",
                duration:3000
              });
              var imagUrl = data.data;
              that.setData({
                  faceUrl: serverUrl + imagUrl
              });
            }else if (data.status == 500) {
              wx.showToast({
                title: data.msg,
                icon: "error"
              })
            }
          }
        })
      }
    })

  }
  ,

  uploadVideo:function(){
    videoUtil.uploadVideo();
  },

  doSelectWork : function(){
    this.setData({
      isSelectedWork:"video-info-selected",
      isSelectedLike:"",
      isSelectedFollow:"",

      myWorkFalg :false,
      myLikesFalg:true,
      myFollowFalg:true,


      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    });
    this.getMyVideoList(1);
  },
  doSelectLike : function(){
    this.setData({
      isSelectedWork:"",
      isSelectedLike:"video-info-selected",
      isSelectedFollow:"",

      myWorkFalg :true,
      myLikesFalg:false,
      myFollowFalg:true,


      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    });
    this.getMyLikesList(1);
  },
  doSelectFollow : function(){
    this.setData({
      isSelectedWork:"",
      isSelectedLike:"",
      isSelectedFollow:"video-info-selected",

      myWorkFalg :true,
      myLikesFalg:true,
      myFollowFalg:false,


      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    });
    this.getMyFollowList(1);
  },

  getMyVideoList:function(page){
      var that = this;
      wx.showLoading();
      var serverUrl = app.serverUrl;

      wx.request({
        url:serverUrl + '/video/showAllList?page='+page+'&pageSize=6',
        method:'POST',
        header:{
            'content-type':'application/json'
        },
        success:function(res){
          var myVideoList = res.data.data.rows;
          wx.hideLoading();
          console.log(res);
          var oldMyVideoList = that.data.myVideoList;
          that.setData({
            myVideoList: oldMyVideoList.concat(myVideoList),
            myVideoPage: page,
            myVideoTotal: res.data.data.total
          })
        }
      })
  },
  getMyLikesList:function(page){
    var that = this;
    
    wx.showLoading();
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    wx.request({
      url:serverUrl + '/video/showMyLike?userId='+user.id+'&page='+page+'&pageSize=6',
      method:'POST',
      header:{
          'content-type':'application/json'
      },
      success:function(res){
        var likeVideoList = res.data.data.rows;
        console.log(likeVideoList)
        wx.hideLoading();
        console.log(res);
        var oldLikeVideoList = that.data.likeVideoList;
        that.setData({
          likeVideoList: oldLikeVideoList.concat(likeVideoList),
          likeVideoPage: page,
          likeVideoTotal: res.data.data.total,
          serverUrl:app.serverUrl
        });
      }
    })
  },
  getMyFollowList:function(page){
    var that = this;
    var user = app.getGlobalUserInfo();
    wx.showLoading();
    var serverUrl = app.serverUrl;
    wx.request({
      url:serverUrl + '/video/showMyFollow?userId='+user.id+'&page='+page+'&pageSize=6',
      method:'POST',
      header:{
          'content-type':'application/json'
      },
      success:function(res){
        var followVideoList = res.data.data.rows;
        wx.hideLoading();
        console.log(res);
        var oldfollowVideoList = that.data.followVideoList;
        that.setData({
          followVideoList: oldfollowVideoList.concat(followVideoList),
          followVideoPage: page,
          followVideoTotal: res.data.data.total,
          serverUrl:app.serverUrl
        });
      }
    })
  },

  //到底部后触发加载
  onReachBottom:function(){
    var myWorkFalg = this.data.myWorkFalg;
    var myLikesFalg  = this.data.myLikesFalg;
    var myFollowFalg  = this.data.myFollowFalg;
    if(!myWorkFalg){
      var currentPage = this.data.myVideoPage;
      var totalPage = this.data.myVideoTotal;
      //获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if(currentPage == totalPage){
        wx.showToast({
          title:'已经没有视频啦...',
          icon:'none'
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyVideoList(page);
    }else if(!myLikesFalg){
      var currentPage = this.data.likeVideoPage;
      var totalPage = this.data.likeVideoTotal;
      //获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if(currentPage == totalPage){
        wx.showToast({
          title:'已经没有视频啦...',
          icon:'none'
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyLikesList(page);
    }else if(!myFollowFalg){
      var currentPage = this.data.followVideoPage;
      var totalPage = this.data.followVideoTotal;
      //获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if(currentPage == totalPage){
        wx.showToast({
          title:'已经没有视频啦...',
          icon:'none'
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyFollowList(page);
    }
  },
  showVideo: function(e){
    console.log(e);
    var myWorkFalg = this.data.myWorkFalg;
    var myLikesFalg = this.data.myLikesFalg;
    var myFollowFalg = this.data.myFollowFalg;
    if(!myWorkFalg){
      var videoList = this.data.myVideoList;
    }else if(!myLikesFalg){
      var videoList = this.data.likeVideoList;
    }else if(!myFollowFalg){
      var videoList = this.data.followVideoList;
    }

    var arrindex = e.target.dataset.arrindex;
    var videoInfo = JSON.stringify(videoList[arrindex]);
    wx.redirectTo({
      url:'../videoinfo/videoinfo?videoInfo='+videoInfo
    })
  }
})