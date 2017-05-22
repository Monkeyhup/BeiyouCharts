
/**
 * 初始化数据
 *
 * @type {{into}}
 */
var Register = (function() {
	/**
	 * 初始化
	 */
	var into = function() {
		$("form#register-form")[0].reset();
		bindEvent();
	};

	/**
	 * 绑定时间
	 */
	var bindEvent = function(){
		/**
		 * 点击获取焦点
		 */
		$("form#register-form input[name='userLogin']").on("click",function(){
			$(this).focus();
		});

		/**
		 * 失去焦点
		 */
		$("form#register-form input[name='userLogin']").on("blur",function(){
			var userLogin = userLoginVerification();
			if(userLogin != null){
				SGIS.API.get("user/checkUserLogin/exist").data({
					"userLogin":userLogin
				}).json(function(re){
					var $registerMsg = $("#register-msg").html(re.message);
					var $userLogin = $("form#register-form input[name='userLogin']");
					if(re && re.code==0){
						setTimeout(function(){
							$registerMsg.html("");
						},2000);
					}else{
						$userLogin.parent("div.input-group").addClass("has-error");
						$userLogin.select();
						$userLogin.focus();
						setTimeout(function(){
							$userLogin.parent("div.input-group").removeClass("has-error");
							$registerMsg.html("");
						},1500);
					}
				});
			}
		});

		/**
		 * 登录提交
		 */
		$("form#register-form #submit-btn").on("click",function(){
			var $that = $(this);
			var $userName = $("form#register-form input[name='userName']");

			var userName = $.trim($userName.val());
			var userLogin = userLoginVerification();
			if(userLogin == null){
				return false;
			}
			var password = passwordVerification();
			if(password == null){
				return false;
			}
			var repeatPassword = repeatPasswordVerification();
			if(repeatPassword == null){
				return false;
			}

			if(userName == ""){
				userName = userLogin;
			}

			$that.button("loading");
			SGIS.API.post("user/register")
				.data(JSON.stringify({
					"userName":userName,
					"userLogin":userLogin,
					"userPassword":password
				})).json(function(re){
					$that.button("reset");
					var $registerMsg = $("#register-msg").html("");
					if(re && re.code==0){
						$registerMsg.html(re.message+" 2秒后跳转到首页...");
						setTimeout(function(){
							$registerMsg.html("");
							window.location = "index.html";
						},2000);
					}else{
						$registerMsg.html(re.message);
						setTimeout(function(){
							$registerMsg.html("");
						},1500);
					}
				});
		});
	};

	/**
	 * 用户登录校验器
	 *
	 * @returns 校验通过，返回用户登录名
	 */
	var userLoginVerification = function(){
		var $registerMsg = $("#register-msg").html("");
		var $userLogin = $("form#register-form input[name='userLogin']");

		var userLogin = $.trim($userLogin.val());
		if(userLogin == ""){
			$userLogin.parent("div.input-group").addClass("has-error");
			$registerMsg.html("用户登录名不能为空！");
			$userLogin.focus();

			setTimeout(function(){
				$userLogin.parent("div.input-group").removeClass("has-error");
				$registerMsg.html("");
			},1500);
			return null;
		}

		if(userLogin.length > 40){
			$userLogin.parent("div.input-group").addClass("has-error");
			$registerMsg.html("用户登录名长度最大40个字符！");
			$userLogin.select();
			$userLogin.focus();

			setTimeout(function(){
				$userLogin.parent("div.input-group").removeClass("has-error");
				$registerMsg.html("");
			},1500);
			return null;
		}

		if(!userLogin.match(/^[a-zA-Z0-9_]{1,}$/)){
			$userLogin.parent("div.input-group").addClass("has-error");
			$registerMsg.html("只能输入字母、数字或者下划线！");
			$userLogin.select();
			$userLogin.focus();

			setTimeout(function(){
				$userLogin.parent("div.input-group").removeClass("has-error");
				$registerMsg.html("");
			},1500);
			return null;
		}

		return userLogin;
	};

	/**
	 * 用户密码校验器
	 *
	 * @returns 校验通过，返回用户密码
	 */
	var passwordVerification = function(){
		var $registerMsg = $("#register-msg").html("");
		var $password = $("form#register-form input[name='password']");

		var password = $password.val();
		if(password == ""){
			$password.parent("div.input-group").addClass("has-error");
			$registerMsg.html("密码不能为空！");
			$password.focus();

			setTimeout(function(){
				$password.parent("div.input-group").removeClass("has-error");
				$registerMsg.html("");
			},1500);
			return null;
		}

		if(password.length < 6){
			$password.parent("div.input-group").addClass("has-error");
			$registerMsg.html("密码最少6位！");
			$password.focus();

			setTimeout(function(){
				$password.parent("div.input-group").removeClass("has-error");
				$registerMsg.html("");
			},1500);
			return null;
		}

		if(password.length > 40){
			$password.parent("div.input-group").addClass("has-error");
			$registerMsg.html("用户密码长度最大40个字符！");
			$password.focus();

			setTimeout(function(){
				$password.parent("div.input-group").removeClass("has-error");
				$registerMsg.html("");
			},1500);
			return null;
		}

		return password;
	};

	/**
	 * 重复用户密码校验器
	 *
	 * @returns 校验通过，返回重复用户密码
	 */
	var repeatPasswordVerification = function(){
		var $registerMsg = $("#register-msg").html("");
		var $password = $("form#register-form input[name='password']");
		var $repeatPassword = $("form#register-form input[name='repeatPassword']");

		var password = $password.val();
		var repeatPassword = $repeatPassword.val();
		if(repeatPassword == ""){
			$repeatPassword.parent("div.input-group").addClass("has-error");
			$registerMsg.html("重复密码不能为空！");
			$repeatPassword.focus();

			setTimeout(function(){
				$repeatPassword.parent("div.input-group").removeClass("has-error");
				$registerMsg.html("");
			},1500);
			return null;
		}

		if(password != repeatPassword){
			$repeatPassword.parent("div.input-group").addClass("has-error");
			$registerMsg.html("两次输入的密码不一致！");
			$repeatPassword.select();
			$repeatPassword.focus();

			setTimeout(function(){
				$repeatPassword.parent("div.input-group").removeClass("has-error");
				$registerMsg.html("");
			},1500);
			return null;
		}

		return $repeatPassword;
	};

	/**
	 * 返回
	 */
	return {
		into : into
	};
})();


jQuery(function() {
	Register.into();
});
