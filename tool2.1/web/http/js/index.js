/**
 * 浏览器判断
 */
var browerHanlder = function() {
	var agent = navigator.userAgent.toLowerCase();
	var regStr_ie = /msie [\d.]+;/gi;
	var regStr_ff = /firefox\/[\d.]+/gi;
	var regStr_chrome = /chrome\/[\d.]+/gi;
	var regStr_saf = /safari\/[\d.]+/gi;
	
	// IE
	var userAgent = navigator.userAgent.toLowerCase();
	jQuery.browser = {
		version : (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
		safari : /webkit/.test(userAgent),
		opera : /opera/.test(userAgent),
		msie : /msie/.test(userAgent) && !/opera/.test(userAgent),
		mozilla : /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
	};
	
	$("#remove-top-btn").click(function() {
		$("#top-alert-container").hide();
	});
	//IE 不支持
	if (agent.indexOf("msie") > 0) {
		var test = jQuery.browser.version;
		var version = parseInt(test);
//		if (version < 10) {
//		} else {
//			$("#top-alert-container").hide();
//		}

		$("#top-alert-container").show();
		return version;
	}
	
	//edge不支持
	if(agent.indexOf("edge") > 0){
		$("#top-alert-container").show();
		return "edge";
	}
	
	// Chrome
	if (agent.indexOf("chrome") > 0) {
		$("#top-alert-container").hide();
		return agent.match(regStr_chrome);
	}
	// firefox
	if (agent.indexOf("firefox") > 0) {
		$("#top-alert-container").hide();
		return agent.match(regStr_ff);
	}
	
	// Safari
	if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
		$("#top-alert-container").hide();
		return agent.match(regStr_saf);
	}
	
	//默认不支持
	$("#top-alert-container").show();
};



/**
 * ui操作
 *
 */
var UI = (function(){
	/**
	 * 控制浏览器高度
	 */
	var browerHeight = function() {

		//窗口高度
		$('#login-modal').css({
			'padding-top': function () {
				var top = ($(window).height() / 2 - 250);
				return top > 0 ? top : 0;
			}
		});
	};

	/**
	 * 左侧的样式
	 */
	var cssStyle = function(){
		var t = document.documentElement.scrollTop
			|| document.body.scrollTop;
		//移除所有选中
		$(".row-left >div.title-name").removeClass("active");

		var activeIdIndex = 0;
		if($(window).width() > 770){
			$(".row-left").addClass("fixed-container");
			if($(window).scrollTop() >= ($(document).height()-$(window).height())){
				activeIdIndex = 5;
			}else if (t < 260) {
				activeIdIndex = 0;
			}else if (t >= 260 && t < 750) {
				activeIdIndex = 1;
			}else if (t >= 750 && t < 998) {
				activeIdIndex = 2;
			}else if (t >= 998 && t < 1234) {
				activeIdIndex = 3;
			}else if (t >= 1234 && t < 1472) {
				activeIdIndex = 4;
			}else if (t >= 1472 && t < 1982) {
				activeIdIndex = 5;
			}else if (t >= 1982) {
				activeIdIndex = 6;
			}
		}else{
			$(".row-left.fixed-container").removeClass("fixed-container");
			if (t < 288) {
				activeIdIndex = 0;
			}else if (t >= 288 && t < 538) {
				activeIdIndex = 1;
			}else if (t >= 538 && t < 782) {
				activeIdIndex = 2;
			}else if (t >= 782 && t < 1038) {
				activeIdIndex = 3;
			}else if (t >= 1038 && t < 1277) {
				activeIdIndex = 4;
			}else if (t >= 1277 && t < 1782) {
				activeIdIndex = 5;
			}else if (t >= 1782) {
				activeIdIndex = 6;
			}
		}

		$("#name_"+activeIdIndex).addClass("active");
	};

	/**
	 * 重置
	 */
	var resize = SGIS.Util.throttle(cssStyle,100);

	/**
	 * 绑定事件
	 */
	var bindEvent = function(){
		//默认选中第一个
		$("#name_0").addClass("active");
		$("html,body").animate({scrollTop : 0}, 100);
		//绑定滚动样式
		window.onscroll = cssStyle;
	};


	return {
		resize:resize,
		browerHeight:browerHeight,
		bindEvent:bindEvent
	};
})();

/**
 * 初始化数据b
 *
 * @type {{into}}
 */
var Index = (function() {

	/**
	 * 初始化
	 */
	var into = function() {
		// 浏览器操作
		browerHanlder();

		// 控制浏览器高度
		UI.browerHeight();
		// 绑定事件
		UI.bindEvent();
		//设置重置方式
		$(window).resize(UI.resize);

		//绑定事件
		bindEvent();
		//绑定时间滚动
		bindScrollScroll();


		/*User.init();
		User.getUserInfo(function(){
			console.log("消息提示：获取用户信息成！");
		});*/
	};


	/**
	 * 绑定事件
	 */
	var bindEvent = function(){

		/**
		 *	我的作品缩略图
		 */
		$("#my-charts-btn").click(function(){
			//我的作品缩略图
			var url = "chart.mine.thumbnail.html";
			window.location = url;
		});

		/**
		 * 点击目录
		 */
		$(".row-header .title-name a").click(function() {
			var ID = $(this).attr("data-for");
			if(ID && ID != ""){
				//目录置顶
				$("html,body").animate({
					scrollTop : $("#" + ID).offset().top - 60
				}, 500);
			}
		});

		/**
		 * 点击制图
		 */
		$(".row-right-container img").click(function(re) {
			var imgID = re.currentTarget.id;
			if (imgID.indexOf("d3.") > -1) {
				window.location = "addd3?chart-type-chart=" + imgID;
			}else if((imgID.indexOf("highcharts.") > -1)) {
				window.location = "addhighcharts?chart-type-chart=" + imgID;
			}else if((imgID.indexOf("fusioncharts.") > -1)) {
				window.location = "addfusioncharts?chart-type-chart=" + imgID;
			}
			else {
				console.log("addecharts?chart-type-chart=" + imgID);
				window.location = "addecharts?chart-type-chart=" + imgID
			}
		});

		/**
		 * 鼠标悬浮图片事件
		 */

		$(".row-right .row-right-container .im-ul>li").mouseover(function(){
			var liId=$(this).attr("class");
			console.log(liId);
			//$(".row-right .row-right-container  #"+liId).css("display","block");
			/*$(".row-right").css("opacity","0.2");*/
		});

		$(".row-right .row-right-container .im-ul-2").mouseover(function(){
			$(this).css("display","block");
			/*$(".row-right").css("opacity","0.2");*/
		});



		/**
		 * 鼠标离开图片事件
		 */

		$(".row-right .row-right-container .im-ul>li").mouseout(function(){
			var liId=$(this).attr("class");
			var wx = window.event.clientX;
			var wy_1 = window.event.offsetY;
			var d_left = $(this).offset().left;
			var d_width =  $(this).width();

			if(wx < d_left  || wx > d_left + d_width || wy_1 < 50){
				console.log("离开");
				$(".row-right .row-right-container  #"+liId).css("display","none");
				/*$(".row-right").css("opacity","1");*/
			}


		});

		$(".row-right .row-right-container .im-ul-2").mouseout(function(){
			$(this).css("display","none");
			/*$(".row-right").css("opacity","1");*/
		});

		//回到顶部
		$('#roll_top').click(function () {
			//返回顶部所用的时间 返回顶部也可调用goto()函数
			$('html,body').animate({
				scrollTop : '0px'
			}, 300);
		});




	};

	/**
	 * 绑定滚动加载时间
	 */
	var bindScrollScroll = function(){

		/*返回顶部*/
		$('#roll_top').hide();
		//绑定
		$(window).scroll(function(){
			var scrollHeight = $(window).scrollTop();
			if (scrollHeight > 300) {
				//当滑动栏向下滑动时，按钮渐现的时间
				$('#roll_top').fadeIn(400);
			} else {
				//当页面回到顶部第一屏时，按钮渐隐的时间
				$('#roll_top').fadeOut(0);
			}
		});
	};

	/**
	 * 返回
	 */
	return {
		into : into
	};
})();


jQuery(function() {
	Index.into();
});
