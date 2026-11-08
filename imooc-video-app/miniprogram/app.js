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
  }
})