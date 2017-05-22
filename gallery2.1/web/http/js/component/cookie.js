/**
 * cookie 信息操作
 */
define(function(require, exports, module) {
	var Cookie = (function() {
		var _maxCookieNum = 4; // 默认最大cookie数
		var _cookieName = "gallery_history_info"; // 默认cookie名字

		/**
		 * 设置同一name设置最大cookie数
		 */
		var setMaxCookieNum = function(num) {
			if (num > 0)
				_maxCookieNum = num;
		};

		/**
		 * 设置同一name设置最大cookie数
		 */
		var setCookieName = function(name) {
			if (name && name != "")
				_cookieName = name;
		};

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
			var tempArr = []; 			// 只取_maxCookieNum-1
			var index = 0;

			var valueJson = JSON.parse(value);
			if (cookies.length > 0) {
				var len = cookies.length - 1;
				for ( var i = len; i >= 0; i--) {
					var item = cookies[i];
					if (!item)
						continue;

					if (index < _maxCookieNum - 1) {
						var itemJson = JSON.parse(item);
						if (itemJson.chartId != valueJson.chartId) {
							index++;
							tempArr.push(item);
						}
					}
				}
			}

			if (tempArr.length > 0) {
				for ( var i = tempArr.length - 1; i >= 0; i--) {
					var item = tempArr[i];
					newCookieValue += item + "&&";
				}
			}

			newCookieValue += value;
			setCookie(newCookieValue);

			return true;
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

			var valueJson = null;
			if(value.indexOf("{") == 0){
				valueJson = JSON.parse(value);
			}else{
				valueJson = {
					chartId:value
				};
			}

			if (cookies.length > 0) {
				var flag = false;
				var len = cookies.length;
				for ( var i = 0; i < len; i++) {
					var item = cookies[i];
					if (!item)
						continue;
					var itemJson = JSON.parse(item);
					if (itemJson.chartId != valueJson.chartId) {
						if (flag)
							newCookieValue += "&&" + item;
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
			if(cookie.length > 0){
				var result = [];
				var cookieStr = cookie.toString();
				var cookieArr = cookieStr.split(";");

				for(var i= 0,len=cookieArr.length;i<len;i++){
					var cookieItem = $.trim(cookieArr[i]);
					if(cookieItem.indexOf(name) == 0){
						var item = cookieItem.substr(name.length);
						if(item){
							var itemArr = item.split("&&");
							if(itemArr.length > 0){
								for(var j= 0,jLen=itemArr.length;j<jLen;j++){
									if($.trim(itemArr[j])){
										result.push($.trim(itemArr[j]));
									}
								}
							}//end if(itemArr.length > 0)
						}//end if(item)
					}//end if(cookieItem.indexOf(name) == 0)
				}
				return result;
			}

			return [];
		};

		var getCookieVal = function(offset) {
			var cookie = document.cookie;

			var endstr = cookie.indexOf(";", offset);
			if (endstr == -1) {
				endstr = cookie.length;
			}

			//return unescape(cookie.substring(offset, endstr));
			return cookie.substring(offset, endstr);
		};

		return {
			addCookie : addCookie,
			getCookies : getCookies,
			delCookie : delCookie,
			setMaxCookieNum:setMaxCookieNum,
			setCookieName:setCookieName
		};
	})();
	
	return Cookie;
});
 
