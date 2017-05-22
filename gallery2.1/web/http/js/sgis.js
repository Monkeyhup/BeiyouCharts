/**
 * 图集展示页
 */
define(function(require, exports, module) {
	var SGIS_BASE = SGIS.Config.BASE + "/web/main/base.html";
	var THIRD_CHARTS_CONFIG_URL = "js/component/third.charts.config";
	
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
	 * 用户信息
	 */
	var UserInfo = (function(){
		var userInfo = null;
		
		/**
		 * 获取用户信息
		 */
		var getUserInfo = function(callback){
			if(userInfo != null){
				callback && callback(userInfo);
				return;
			}
			SGIS.API.get("user/is/login").json(function(re){
					if(re && re.code == 0){
						userInfo = re.data;
					}else{
						userInfo = null;
					}
					callback && callback(userInfo);
				});
		};
		
		return {
			getUserInfo:getUserInfo
		};
	})();
	
	/**
	 * 图库
	 */
	var Chart = (function() {
		
		/**
		 * 初始化
		 */
		var init = function(){
			UI.browerHeight();
			var urlParam = SGIS.Util.getParamFromURL();
			var chartId = urlParam.items("chart-id");
			var catalogId = urlParam.items("chart-catalog");
			var keyword = urlParam.items("keyword");

			$("#left_icon").addClass("hide");
			$("#right_icon").addClass("hide");
			if(chartId && chartId != ""){
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
				getChartInfoBychartId(chartId,function(info){
					//添加cookie信息
					Cookie.addCookie(JSON.stringify({
						"chartId":chartId,
						"dataIsThirdCharts":0,	//不是第三方集成
						"chartIsfromSgis":1,	//SGIS保存结果
						"url":"sgis.html"
					}));
					if((typeof catalogId == "string" || typeof catalogId == "number")){
						$("#left_icon").removeClass("hide");
						$("#right_icon").removeClass("hide");

						//初始化左右点击事件
						initLeftRightClick(chartId,catalogId,keyword);
					}
				});
			}//end if(chartId && chartId != "")
			
			//初始化绑定事件
			initBindData(catalogId,keyword);
		};

		/**
		 * 初始化左右点击事件
		 * @param chartId
		 * 				当前图集id
		 * @param catalogId
		 * 				当前目录
		 * @param keyword
		 * 				当前关键字
         */
		var initLeftRightClick = function(chartId,catalogId,keyword){
			SGIS.API.get("chart/?/chart/?/index/info",catalogId,chartId)
			.data({keyword:keyword})
			.json(function(re){
				//alert(JSON.stringify(re));
				if(re && re.code == 0){
					var data = re.data;
					var total = data.total;
					var index = data.index;
					
					if(index == -1){
						//没有左右切换
						$("#left_icon").addClass("hide");
						$("#right_icon").addClass("hide");
					}else{
						if(index === 0){
							//判断是否可以跳转到第三方集成
							seajs.use(THIRD_CHARTS_CONFIG_URL,function(ThirdChartsConfig){
								if(ThirdChartsConfig){
									ThirdChartsConfig.init();
									ThirdChartsConfig.getConfig(function(config){
										//按条件过滤
										config = ThirdChartsConfig.filterConfigBycatalogIdAndkeyword(
											config,catalogId,keyword);
										//保存过滤后的长度
										ThirdChartsConfig.setCurrentUsedLength(config.length);
										if(config && config.length > 0){
											//最后一个（注:数据库中的第一个的前一个就是第三方集成的最后一个）
											var currentChart = config[config.length-1];
											//注册左点击
											$("#left_icon").click(function(){
												var myUrl = currentChart.url+"?chart-id="+currentChart.id
													+"&chart-catalog="+catalogId+"&keyword="+keyword
													+"&url=sgis.html"+"&url-id="+chartId;
												window.location = myUrl;
											});
										}else{
											//没有上一个
											$("#left_icon").addClass("hide");
										}//end if(config && config.length > 0) else
									});
								}else{
									//没有上一个
									$("#left_icon").addClass("hide");
								}
							});
						}else{
							//左点击
							$("#left_icon").click(function(){
								if(index > 0){
									//上一个
									var nIndex = index-1;
									SGIS.API.get("chart/?/index/?/chart",catalogId,nIndex)
										.data({keyword:keyword})
										.json(function(re){
											console.dir(re);
											if(re && re.data && re.data[0]){
												var id = re.data[0].id;
												var chartIsfromSgis = re.data[0].chartIsfromSgis;
												if(chartIsfromSgis === "1" || chartIsfromSgis === 1){
													window.location = "sgis.html?chart-id="+id+"&chart-catalog="+catalogId+"&keyword="+keyword;
												}else{
													window.location = "chart.html?chart-id="+id+"&chart-catalog="+catalogId+"&keyword="+keyword;
												}
											}else{
												SGIS.UI.alert("未找到上一个！",
													null,false,function(modal){
														modal.css({
															"top":"40%",
															"height":"60px",
															"width":"300px",
															"margin-left":"-20px",
															"overflow":"hidden",
															"background-color":"transparent",
															"border":"none"
														});

														modal.find(".content>.ui.label").css({
															"font-size":"16px"
														});
													});
											}
										});
								}
							});
						}//end if(index === 0)

						if(index === (total-1)){
							//没有最后一个
							$("#right_icon").addClass("hide");
						}
						//右点击
						$("#right_icon").click(function(){
							if(index < (total-1)){
								//下一个
								var nIndex = index+1;
								SGIS.API.get("chart/?/index/?/chart",catalogId,nIndex)
								.data({keyword:keyword})
								.json(function(re){
									console.dir(re);
									if(re && re.data && re.data[0]){
										var id = re.data[0].id;
										var chartIsfromSgis = re.data[0].chartIsfromSgis;
										if(chartIsfromSgis === "1" || chartIsfromSgis === 1){
											window.location = "sgis.html?chart-id="+id+"&chart-catalog="+catalogId+"&keyword="+keyword;
										}else{
											window.location = "chart.html?chart-id="+id+"&chart-catalog="+catalogId+"&keyword="+keyword;
										}
									}else{
										SGIS.UI.alert("未找到下一个！",
											null,false,function(modal){
												modal.css({
													"top":"40%",
													"height":"60px",
													"width":"300px",
													"margin-left":"-20px",
													"overflow":"hidden",
													"background-color":"transparent",
													"border":"none"
												});

												modal.find(".content>.ui.label").css({
													"font-size":"16px"
												});
											});
									}
								});
							}//end if(index < (total-1))
						});
					}//end if(index == -1) else
				}else{
					//没有左右切换
					$("#left_icon").addClass("hide");
					$("#right_icon").addClass("hide");
				}//end if(re && re.code == 0) else
			});
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
				if(typeof catalogId != "undefined" && typeof catalogId != "keyword"){
					window.location = url+"#!/"+catalogId+"/"+keyword;
				}else{
					window.location = url;
				}
			});
		};

		/**
		 * 
		 * 
		 * @param chartId
		 * 			图表信息
		 * @param callback
		 * 			回调函数
		 */
		var getChartInfoBychartId = function(chartId,callback){
			SGIS.API.get("chart/?",chartId)
			.json(function(re){
				if(re && re.code == 0){
					var data = re.data;
					if(data){
						//标题
						$("title").text(data.chartName);
						$("#iden-name").html(data.chartName);
						
						//创建时间
//						var time = "创建时间："+SGIS.Time.longTimeToStringTime(data.createTime);
//						$("#made-time").html(time);
						
						//备注
						var mome = (data.chartMome && data.chartMome != null && data.chartMome != "null") ? data.chartMome : "";
						$("#interpretation").html(mome);
						
						showChart(data);

						callback && callback({
							id:data.id,
							chartName:data.chartName,
							chartIsfromSgis:data.chartIsfromSgis
						});
					}else{
						callback && callback(null);
					}
				}else{
					SGIS.UI.alert("消息提示："+re.message,
						null,false,function(modal){
							modal.css({
								"top":"40%",
								"height":"60px",
								"width":"300px",
								"margin-left":"-20px",
								"overflow":"hidden",
								"background-color":"transparent",
								"border":"none"
							});

							modal.find(".content>.ui.label").css({
								"font-size":"16px"
							});
						});
				}
			});
		};
		
		/**
		 * 是否已什么结尾
		 */
		var endWith = function(str,end){
			var reg=new RegExp(end+'$');     
			return reg.test(str); 
		};
		
		/**
		 * 显示可视化图
		 */
		var showChart = function(re){
			
			var picture = "<ul class='sgis-grid'><li class='cs-style-5'>"
					+ "<figure>"
					+ "<div><img src='"+re.chartImage+"' style='width:950px;height:500px;text-align:center;'></div>"
					+ "<figcaption><h3>"+ re.chartName+ "</h3>"
					+ "<p>"
					+ re.chartMome
					+ "</p>" 
					+ "<a id='goto-sgis-btn' data-aid='"+re.chartParam+"' href='javascript:;' style='margin-right:160px;'>点击进入</a>"
					+ "</figcaption></figure>"
					+ "</li></ul>"; 
			$("#contant").html(picture);
			
			$("#goto-sgis-btn").off("click");
			$("#goto-sgis-btn").click(function() {
				var aid = $(this).attr("data-aid");
				var url = SGIS_BASE + "?gallery=y&aid=" + aid + "";
				if(top.window){
					top.window.location = url;
				}else{
					window.location = url;
				}
			});
		};
		
		return {
			init:init
		};
	})();
	
	
	
	/**
	 * 入口调用方法
	 */
	$(function(){
		UI.init();
		Chart.init();
	});
});