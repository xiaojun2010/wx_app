const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgmList:[],
    serverUrl: "",
    videoParams:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    var that = this;
    console.log(params);
    that.setData({
      videoParams:params
    })
    
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title:'请等待.....'
    })
    wx.request({
      url: serverUrl + '/bgm/list',
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
           var bgmList = res.data.data;
           that.setData({
            bgmList:bgmList,
            serverUrl:serverUrl
           });
        } else if (status == 500) {

        }
      }
    })
  }
  ,

  upload:function(e){
        var that = this;
        var bgmId = e.detail.value.bgmId;
        var desc = e.detail.value.desc;
        console.log("bgmId : "+bgmId);
        console.log("desc : "+desc);
        var duration = that.data.videoParams.duration;
        var tmpHeight = that.data.videoParams.tmpHeight;
        var tmpVideoUrl = that.data.videoParams.tmpVideoUrl;
        var tmpCoverUrl = that.data.videoParams.tmpCoverUrl;
        var tmpWidth = that.data.videoParams.tmpWidth;
        var serverUrl  = app.serverUrl;
        console.log(this.data);
        //上传短视频
        wx.showLoading({
          title: '请等待...'
        });
       var userInfo = app.getGlobalUserInfo();
       
       console.log('upload1 ->'+app.getGlobalUserInfo());
       console.log('upload2 ->'+ userInfo);
        wx.uploadFile({
          url: serverUrl + '/video/upload',
          formData:{
            userId:userInfo.id,
            bgmId:bgmId,
            desc:desc,
            videoSeconds:duration,
            videoHeight:tmpHeight,
            videoWidth:tmpWidth
          },
          filePath: tmpVideoUrl,
          name: 'file',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
    
            wx.hideLoading();
            console.log(res);
            var status = res.data.status;
            if (status == 200) {
              wx.showToast({
                title: '上传成功！～',
                icon:"success"
              })
               
            } 
          }
        })
  }
})