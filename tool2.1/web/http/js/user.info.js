/**
 * 用户信息
 */
var UserInfo = (function(){
	var userInfo = null;

	/**
	 * 初始化数据
	 */
	var init = function(){
		userInfo = null;
	};

	/**
	 * 获取用户登录信息
	 */
	var getUserInfo =  function(callback){
		if(userInfo != null){
			callback && callback(userInfo);
			return ;
		}
		
		SGIS.API.get("user/is/login").json(function(re){
			userInfo = null;
			if(re && re.code == 0){
				if(re.data){
					//保存用户信息
					userInfo = re.data;
				}
			}
			callback && callback(userInfo);
		});
	};

	return {
		init:init,
		getUserInfo:getUserInfo
	};
})();

(function(){
	UserInfo.init();
})();

