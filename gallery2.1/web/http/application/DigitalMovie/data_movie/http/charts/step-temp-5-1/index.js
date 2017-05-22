/**
 * 图集展示页
 */
define(function(require, exports, module) {
	/**
	 * 视图类
	 */
	var UI = (function(){
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

		return {
			browerHeight:browerHeight
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
			getChartInfoBychartId(function(){
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
		var getChartInfoBychartId = function(callback){
			$.getJSON("data/data.json",function(data){
				if(data){
					//标题
					$("title").text(data.chartName);
					$("#iden-name").html(data.chartName);

					//备注
					var mome = (data.chartMome && data.chartMome != null && data.chartMome != "null") ? data.chartMome : "";
					$("#interpretation").html(mome);

					showChart(data);
				}

				callback && callback();
			});
		};

		/**
		 * 显示可视化图
		 */
		var showChart = function(re){
			//直接转换
			var data = re.chartJson;
			if(data.chartData){
				goTo(data.chartData);
			}else{
				goTo(data);
			}

			function goTo(data){
				var jsUrl = "js/module/echarts/" + re.chartTypeChart;
				seajs.use(jsUrl, function (Module) {
					if (Module) {
						var obj = new Module();

						var objConfig = {
							container : 'content',
							width : 900,
							height : 400,
							data : data
						};

						var chartParamStr = re.chartParam;
						if(chartParamStr && chartParamStr != null && chartParamStr != "null"){
							var chartParam = chartParamStr;
							if(chartParam){
								//添加宽度
								if(chartParam.container && chartParam.container.width && chartParam.container.width > 0){
									objConfig["width"] = chartParam.container.width;
								}
								//添加高度
								if(chartParam.container && chartParam.container.height && chartParam.container.height > 0){
									objConfig["height"] = chartParam.container.height;
								}

								//添加地图宽度
								if(chartParam.container && chartParam.container.mapWidthPercent && chartParam.container.mapWidthPercent > 0){
									objConfig["mapWidthPercent"] = chartParam.container.mapWidthPercent;
								}

								//添加饼图宽度
								if(chartParam.container && chartParam.container.pieWidthPercent && chartParam.container.pieWidthPercent > 0){
									objConfig["pieWidthPercent"] = chartParam.container.pieWidthPercent;
								}

								//添加柱图宽度
								if(chartParam.container && chartParam.container.barWidthPercent && chartParam.container.barWidthPercent > 0){
									objConfig["barWidthPercent"] = chartParam.container.barWidthPercent;
								}

								//添加地图数据
								if(chartParam.container && chartParam.container.map){
									if(chartParam.container.map.type && chartParam.container.map != ""){
										objConfig["map"] = chartParam.container.map;
									}
								}

								//添加主题
								if(chartParam.container && chartParam.container.theme){
									if(chartParam.container.theme != ""){
										objConfig["theme"] = chartParam.container.theme;
									}
								}

								//添加样式
								if(chartParam.style){
									objConfig["option"] = chartParam.style;
								}
							}
						}
						obj.init(objConfig);
					}
				});
			}//end function
		};

		return {
			init:init
		};
	})();

	/**
	 * 入口调用方法
	 */
	$(function(){
		Chart.init();
	});
});
