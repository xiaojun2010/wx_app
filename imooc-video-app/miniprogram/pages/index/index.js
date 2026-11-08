const app = getApp()

Page({
  data: {
    totalPage: 1,
    page: 1,
    videoList:[],
    screenWidth: 350,
    searchContent:"",
    serverUrl : ""
    
  },

  onLoad: function (params) {
    var that = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
  
    that.setData({
      screenWidth: screenWidth,
    });

    var searchContent = params.search;
    var isSaveRecord = params.isSaveRecord;
    if(isSaveRecord == null || isSaveRecord == '' || isSaveRecord== undefined){
      isSaveRecord = 0;
    }
    that.setData({
      searchContent:searchContent
    })
    //获取当前的分页数
    var page = that.data.page;
    that.getAllVideoList(page,isSaveRecord);
  },

  getAllVideoList:function(page,isSaveRecord){
    var that = this;
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请等待，加载中.....',
    });
    var searchContent = that.data.searchContent;
    wx.request({
      url: serverUrl + '/video/showAll?page='+page+'&pageSize=5&isSaveRecord='+isSaveRecord,
      method:'POST',
      data: {
            videoDesc: searchContent
      },
      success:function(res){
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          console.log(res);
          if(res.statusCode != 200 ){
              wx.showToast({
                title: '请求异常',
                icon:'error'
              });
              return;
          }
          console.log(res.data);

          //判断当前页page是否第一页，如果是第一页，videoList 需要清空
          if(page == 1){
            that.setData({
              videoList:[]
            })
          }
          var oldVideoList = res.data.data.rows;
          var newVideoList = that.data.videoList;

          that.setData({
            videoList: newVideoList.concat(oldVideoList),
            page : page ,
            totalPage: res.data.data.total,
            serverUrl:serverUrl
          });
      }

      
    })
  },

  onReachBottom: function(){
    var that = this;
    var currentPage = that.data.page;
    var totalPage = that.data.totalPage;
    if(currentPage == totalPage){
       wx.showToast({
         title:'已经没有视频啦～～～～',
         icon:'none'
       });
       return;
    }
    var page = currentPage + 1;
    //判断当前页数和总页数是否相等，若相等则无需查询
    that.getAllVideoList(page,0);
  },
  enablePullDownRefresh : function(){
    wx.showNavigationBarLoading();
    this.getAllVideoList(1,0);
  },

  showVideoInfo : function(e){
    var that = this;
    var videoList  = that.data.videoList;
    var arrIndex = e.target.dataset.arrindex;
    var videoInfo = JSON.stringify(videoList[arrIndex]);
    console.info('videoInfo='+videoInfo);
    wx.redirectTo({
      url:'../videoinfo/videoinfo?videoInfo='+videoInfo
    })
  }

})
