var Cookie = (function() {
	var _maxCookieNum = 1; 					// 默认最大cookie数
	var _cookieName = "gallery_login_info"; // 默认cookie名字

	/**
	 * 把图片信息放入到cookie中
	 *
	 * @param value
	 *            cookie的value
	 */
	var setCookie = function(value) {
		var exp = new Date();
		exp.setTime(exp.getTime() + 3600000000);
		document.cookie = _cookieName + "=" + value + "; expires="
			+ exp.toGMTString();
	};

	/**
	 * 添加cookie 的信息
	 *
	 * @param value
	 *            cookie的value
	 * @returns boolean
	 */
	var addCookie = function(value) {
		if (!value)
			return false;
		var newCookieValue = "";
		var cookies = getCookies(); // 获取cookie

		var tempArr = []; // 只取_maxCookieNum-1
		var index = 0;

		if (cookies.length > 0) {
			var len = cookies.length - 1;
			for ( var i = len; i >= 0; i--) {
				var item = cookies[i];
				if (!item)
					continue;

				if (index < _maxCookieNum - 1) {
					if (item != value) {
						index++;
						tempArr.push(item);
					}
				}
			}
		}

		if (tempArr.length > 0) {
			for ( var i = tempArr.length - 1; i >= 0; i--) {
				var item = tempArr[i];
				newCookieValue += item + "&";
			}
		}

		newCookieValue += value;
		setCookie(newCookieValue);

		return true;
	};

	/**
	 * 清空cookie
	 */
	var clearCookie = function(){
		setCookie("");
	};

	/**
	 * 移除cookie 的信息
	 *
	 * @param value
	 *            cookie的value
	 * @returns boolean
	 */
	var delCookie = function(value) {
		if (!value)
			return false;
		var newCookieValue = "";
		var cookies = getCookies(); // 获取cookie
		if (cookies.length > 0) {
			var flag = false;
			var len = cookies.length;
			for ( var i = 0; i < len; i++) {
				var item = cookies[i];
				if (!item)
					continue;
				if (item != value) {
					if (flag)
						newCookieValue += "&" + item;
					else {
						newCookieValue += item;
						flag = true;
					}
				}
			}
		}
		setCookie(newCookieValue);

		return true;
	};

	/**
	 * 读取cokkie值
	 *
	 * @returns 返回一个值的数组
	 */
	var getCookies = function() {

		var name = _cookieName + "=";

		var cookie = document.cookie;
		var cookieLen = cookie.length;
		var nameLen = name.length;
		var i = 0;
		while (i < cookieLen) {
			var j = i + nameLen;
			if (cookie.substring(i, j) == name) {
				var value = getCookieVal(j);
				var array = value.split("&");
				return array || [];
			}
			i = cookie.indexOf(" ", i) + 1;
			if (i == 0)
				break;
		}

		return [];
	};

	var getCookieVal = function(offset) {
		var cookie = document.cookie;

		var endstr = cookie.indexOf(";", offset);
		if (endstr == -1) {
			endstr = cookie.length;
		}
		return unescape(cookie.substring(offset, endstr));
	};

	return {
		addCookie : addCookie,
		getCookies : getCookies,
		delCookie : delCookie,
		clearCookie:clearCookie
	};
})();