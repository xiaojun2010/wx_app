//app.js

App({
  serverUrl:"http://localhost:8080",
  userInfo:null,
  setGlobalUserInfo:function(user){
      
      wx.setStorageSync("userInfo",user);
  },
  getGlobalUserInfo:function(){
    var userInfo = wx.getStorageSync("userInfo");

    return userInfo;
  },
  removeGlobalUserInfo:function(){
    return wx.removeStorageSync("userInfo");
  },
  reportReasonArray:[
    "色情低俗",
    "政治敏感",
    "涉嫌诈骗",
    "辱骂谩骂",
    "广告垃圾",
    "诱导分享",
    "引人不适",
    "过于暴力",
    "违法违纪",
    "其它原因"
  ]
})