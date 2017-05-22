/**
 * 图集展示页
 */
define(function(require, exports, module) {
	var Cookie = require("js/component/cookie");
	var CookieTool = require("js/component/cookie.tool");

	/**
	 * 视图类
	 */
	var UI = (function(){
		//判断是否被iframe引用
		var _isIframe = false;

		var init = function(){
			if(top.location !== location){
				_isIframe = true;
				$("body").css({"padding-top":"50px"});
			}else{
				_isIframe = false;
				$("body").css({"padding-top":"5px"});
			}
		};

		/**
		 * 获得浏览器高度
		 */
		var browerHeight = function() {
			// 获得浏览器高度
			var winHeight = $(window).height();
			$("#content").css({
				"min-height": (winHeight - 519)+ "px"	//-489
			});
		};

		/**
		 * 判断是否当前页面被iframe引用
		 */
		var isIframe = function(){
			return _isIframe;
		};

		return {
			init:init,
			isIframe:isIframe,
			browerHeight:browerHeight
		};
	})();

	/**
	 * 图库
	 */
	var Chart = (function(){

		var init = function(){
			UI.browerHeight();
			//获取cookie信息
			CookieTool.getCookieInfo(Cookie,function(){
				//气泡
				$('.circular.heart.icon.link').popup({
					on : 'hover',
					position : 'top center'
				});
				// 绑定最近浏览列表的点击事件
				CookieTool.bindHistoryListEvent();
			});

			var urlParam = SGIS.Util.getParamFromURL();
			var chartId = urlParam.items("chart-id");
			var catalogId = urlParam.items("chart-catalog");
			var keyword = urlParam.items("keyword");
			var url = urlParam.items("url");			//数据查出来的第一个的url
			var urlId = urlParam.items("url-id");		//数据查出来的第一个的chart-id

			//初始化绑定事件
			initBindData(catalogId,keyword);

			$("#left_icon").addClass("hide");
			$("#right_icon").addClass("hide");

			if(typeof chartId != "undefined"){
				getConfig(chartId,catalogId,keyword,url,urlId,function(data){
					for(var k= 0,kLen=data.length;k<kLen;k++){
						var cItem = data[k];
						if(cItem.id == chartId){
							//添加cookie信息
							Cookie.addCookie(JSON.stringify({
								"chartId":chartId,
								"dataIsThirdCharts":1,	//标记第三方集成
								"chartIsfromSgis":0,	//不是SGIS保存结果
								"url":cItem.url,
								"img":cItem.img,
								"chartName":encodeURI(cItem.title) || ""
							}));
							break;
						}
					}//end for(var k= 0,kLen=data.length;k<kLen;k++)

					//部分参数
					var lrUrlParam = "&chart-catalog="+catalogId+"&keyword="+keyword;

					//左点击
					$("#left_icon").click(function(){
						var cChartId = chartId;
						for(var i= 0,len=data.length;i<len;i++){
							var item = data[i];
							if(item.id == cChartId){
								if(i>0){
									//不是第一个，向前一个
									var myId = data[i-1].id;
									var myUrl = data[i-1].url;
									if(myUrl && myUrl != ""){
										if(myUrl.indexOf("../../") == -1){
											myUrl = "../../"+myUrl;
										}
										var urlParam = myUrl+"?chart-id="+myId+lrUrlParam;
										if(url && url){
											window.location = urlParam+"&url="+url+"&url-id="+urlId;
										}else{
											window.location = urlParam;
										}
									}
								}
								break;
							}
						}
					});

					//右点击
					$("#right_icon").click(function(){
						var cChartId = chartId;

						for(var i= 0,len=data.length;i<len;i++){
							var item = data[i];
							if(item.id == cChartId){
								if(i<len-1){
									//不是最后一个，向后一个
									var myId = data[i+1].id;
									var myUrl = data[i+1].url;
									if(myUrl && myUrl != ""){
										if(myUrl.indexOf("../../") == -1){
											myUrl = "../../"+myUrl;
										}
										var urlParam = myUrl+"?chart-id="+myId+lrUrlParam;
										if(url && url){
											window.location = urlParam+"&url="+url+"&url-id="+urlId;
										}else{
											window.location = urlParam;
										}
									}
								}else{
									//最后一个，如果有数据库中下一个
									if(url && urlId){
										window.location = "../../"+url+"?chart-id="+urlId+lrUrlParam;
									}
								}
								break;
							}
						}
					});
				});
			}//end if(chartId && chartId > 0)
		};

		/**
		 * @param chartId
		 * @param catalogId
		 * @param keyword
		 * @param url
		 * @param urlId
		 * @param callback
		 */
		var getConfig = function(chartId,catalogId,keyword,url,urlId,callback){
			var url = "../config/third.charts.config.json";
			$.getJSON(url,function(re){
				//过滤目录和关键字
				re = filterConfigBycatalogIdAndkeyword(re,catalogId,keyword);
				if(re && re.length > 0){
					var len=re.length;
					for(var i= 0;i<len;i++){
						var item = re[i];
						if(item.id == chartId){
							if(i == 0){
								//第一个
								$("#left_icon").addClass("hide");
								if(len > i+1){
									$("#right_icon").removeClass("hide");
								}else{
									if(url && urlId){
										$("#right_icon").removeClass("hide");
									}else{
										$("#right_icon").addClass("hide");
									}
								}
							}else if(i+1 < len){
								//不是第一个，不是最后一个
								$("#left_icon").removeClass("hide");
								$("#right_icon").removeClass("hide");
							}else{
								//最后一个
								$("#left_icon").removeClass("hide");
								if(url && urlId){
									$("#right_icon").removeClass("hide");
								}else{
									$("#right_icon").addClass("hide");
								}
							}
							break;
						}
					}
				}//end if(re && re.length > 0) else

				callback && callback(re);
			});
		};

		/**
		 * 过滤不符合条件的
		 * @param config
		 * @param catalogId
		 * @param keyword
         */
		var filterConfigBycatalogIdAndkeyword = function(config,catalogId,keyword){
			var result = [];

			if(typeof catalogId == "undefined" && typeof keyword == "undefined"){
				return $.extend(true,result,config)
			}else{
				//如果是根节点
				if(catalogId === "0" || catalogId === 0){
					for (var i= 0,len=config.length;i<len;i++){
						//过滤关键字
						if(config[i].title.indexOf(keyword) > -1){
							result.push(config[i]);
						}
					}
				}else{
					for (var j= 0,len2=config.length;j<len2;j++){
						//过滤分类
						var id = config[j].chartCatalog;
						if(typeof id != "undefined" && id == catalogId){
							//过滤关键字
							if(config[j].title.indexOf(keyword) > -1){
								result.push(config[j]);
							}
						}
					}
				}
			}

			return result;
		};

		/**
		 * 初始化绑定事件
		 */
		var initBindData = function(catalogId,keyword){
			//回到首页气泡
			$('.large.demo.home.circular.link.icon').popup({
				position : 'bottom center'
			});

			//回到首页
			$("#home").click(function() {
				var url = SGIS.Util.getLocalPath()+"http/";
				if(typeof catalogId != "undefined" && typeof keyword != "undefined"){
					window.location = url+"#!/"+catalogId+"/"+keyword;
				}else{
					window.location = url;
				}
			});
		};

		return {
			init:init
		};
	})();

	$(function(){
		UI.init();
		Chart.init();
	});
});