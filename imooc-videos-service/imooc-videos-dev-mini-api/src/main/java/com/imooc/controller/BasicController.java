package com.imooc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

//import com.imooc.utils.RedisOperator;

@RestController
public class BasicController {
	
//	@Autowired
//	public RedisOperator redis;
	
	public static final String USER_REDIS_SESSION = "user-redis-session";
	
	// 文件保存的命名空间
//	public static final String FILE_SPACE = "C:/imooc_videos_dev";
	public static final String FILE_SPACE = "/Users/zxj/work/workspace/wx_app/wx_app/imooc-videos-service/imooc_videos_upload";
	
	// ffmpeg所在目录
	public static final String FFMPEG_EXE = "/opt/homebrew/bin/ffmpeg";
	
	// 每页分页的记录数
	public static final Integer PAGE_SIZE = 5;
	
}
