var videoUtil = require('../../utils/videoUtil.js')
const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
    fansCounts:0,
    followCounts:0,
    receiveLikeCounts:0,
    nickname:''
  },
  onLoad: function (params) {
      var that = this;
      var user = app.getGlobalUserInfo();
      
      wx.showLoading({
          title:'请等待...'
      });
      var serverUrl = app.serverUrl;
      wx.request(
        {
          url:app.serverUrl + '/user/query?userId='+user.id,
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
                nickname:userInfo.nickname
              })
            }else if(status==502){
              wx.showToast({
                title:res.data.msg,
                duration:3000,
                icon:"none"
              })
            }
          }
        }
      )

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
  }
})