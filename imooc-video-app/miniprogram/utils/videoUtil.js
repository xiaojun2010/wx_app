function uploadVideo() {
  var that = this;
  wx.chooseMedia({
    mediaType: ['image', 'video'],
    sourceType: ['album', 'camera'],
    success(res) {
      console.log(res);
      var tmpFile = res.tempFiles[0];
      var duration = tmpFile.duration;
      var tmpHeight = tmpFile.height;
      var tmpVideoUrl = tmpFile.tempFilePath;
      var tmpCoverUrl = tmpFile.thumbTempFilePath;
      var tmpWidth = tmpFile.width;
      var fileType = tmpFile.fileType;
      if (duration > 33) {
        wx.showToast({
          title: '视频长度不能超过10秒...',
          icon: "none",
          duration: 3000
        })
      } else if (duration < 1) {
        wx.showToast({
          title: '视频长度太短，请上传超过1秒的视频...',
          icon: "none",
          duration: 3000
        })
      } else {
        //TODO 打开选择bgm的页面
        wx.navigateTo({
          url: '../chooseBgm/chooseBgm?duration=' + duration +
            '&tmpVideoUrl=' + tmpVideoUrl +
            '&tmpCoverUrl=' + tmpCoverUrl +
            '&tmpHeight=' + tmpHeight +
            '&tmpWidth=' + tmpWidth
        })
      }
    }
  })
}

//videoUtil.js
module.exports = {
  uploadVideo : uploadVideo
}