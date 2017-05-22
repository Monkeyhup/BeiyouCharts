/**
 * Create by FanFeiHua on 2015/3/30
 */
var Entrancefunction = (function() {
	/**
	 * 入口
	 */
	var init = function() {
		// 控制浏览器的高度
		windowheight();
		// 页面切换
		pageSwitch();
	};
	/**
	 * 页面切换
	 */
	var pageSwitch = function() {
		var totalHtml = [ 1, 2, 3, 4 ];
		var htmlNumber = null;
		var getUrl = location.href;
		var lastUrl = getUrl.split("/");
		lastUrl = lastUrl.pop();
		switch (lastUrl) {
		case "industry.html":
			htmlNumber = 1;
			break;
		case "train.html":
			htmlNumber = 3;
			break;
		case "edu&health.html":
			htmlNumber = 2;
			break;
		case "life&gdp.html":
			htmlNumber = 4;
			break;
		default:
			break;
		}
		if (htmlNumber == 4) {
			$("#right_icon").hide();
		}
		if (htmlNumber == 1) {
			$("#left_icon").hide();
		}
		// 点击左右按钮切换
		clickIcon(totalHtml, htmlNumber);
	};
	/**
	 * 点击左右按钮切换
	 */
	var clickIcon = function(totalHtml, num) {
		var atlasNumber = null;
		for ( var i = 0, lens = totalHtml.length; i < lens; i++) {
			if (num == totalHtml[i]) {
				atlasNumber = i;
				break;
			}
		}
		var localUrl = null;
		$("#left_icon").click(function() {
			atlasNumber--;
			switch (atlasNumber) {
			case "2":
			case 2:
				localUrl = "train.html";
				break;
			case "1":
			case 1:
				localUrl = "edu&health.html";
				break;
			case "0":
			case 0:
				localUrl = "industry.html";
				break;
			default:
				break;
			}
			window.location = localUrl;
		});
		$("#right_icon").click(function() {
			atlasNumber++;
			switch (atlasNumber) {
			case "2":
			case 2:
				localUrl = "train.html";
				break;
			case "1":
			case 1:
				localUrl = "edu&health.html";
				break;
			case "3":
			case 3:
				localUrl = "life&gdp.html";
				break;
			default:
				break;
			}
			window.location = localUrl;
		});
	};

	/**
	 * 获取浏览器的URL
	 * 
	 * @returns
	 */
	var trunpagedata = function() {
		var url = location.href;
		var paraObj = url.substring(url.indexOf("?") + 1).split("&");
		imageflag = paraObj[0];
		imageflag = imageflag.split("=")[1];
		var result = {};
		var queryString = url || location.search.substring(1);
		var re = /([^&=]+)=([^&]*)/g;
		var m;
		while (m = re.exec(queryString)) {
			result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		var id = result.id;
		var addchild = result.addchild;
		var test = result.test;
		var serach = result.search;
		var jgrandson = result.jgrandson;
		if (!serach) {
			serach = null;
		}
		return {
			id : id,
			test : test,
			serach : serach,
			addchild : addchild,
			jgrandson : jgrandson
		};
	};
	/**
	 * 控制浏览器高度
	 * 
	 * @returns
	 */
	var windowheight = function() {
		// 获得浏览器高度
		var winHeight = 0;
		winHeight = $(window).height();
		document.getElementById("contenter").style.minHeight = (winHeight - 85)
				+ "px";
	};
	return {
		init : init
	};
})();

jQuery(function() {
	Entrancefunction.init();
});