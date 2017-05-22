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
	
		//下钻方法
		var _selfDrillDown = null;
		var _selfDrillUp = null;
		
		/**
		 * 初始化
		 */
		var init = function(){
			_selfDrillDown = null;
			
			UI.browerHeight();
			
			$("#play_icon").click(function(){
				var $this = $(this);
				var value = $this.attr("data-value");
				if(value === 1 || value === "1"){
					if(_selfDrillDown){
						
						$this.attr("data-value","0").html("上钻");
						_selfDrillDown();
					} 
				}else{
					if(_selfDrillUp){
						$this.attr("data-value","1").html("下钻");
						_selfDrillUp();
					} 
				}
			});
			
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
				var jsUrl = "js/module/d3/" + re.chartTypeChart;
				seajs.use(jsUrl,function(Module){
					if(Module){
						var obj = new Module();
						var config = {
							containerId:"#content",
							data:data,
							url:null,
							dataType:"data1",				//默认的数据
							w:960,                         	//图宽度
							h:620
						};

						var chartParamStr = re.chartParam;
						if(chartParamStr && chartParamStr != null && chartParamStr != "null"){
							var chartParam = chartParamStr;
							if(chartParam){
								//添加宽度
								if(chartParam.container && chartParam.container.width && chartParam.container.width > 0){
									config["w"] = chartParam.container.width;
								}
								//添加高度
								if(chartParam.container && chartParam.container.height && chartParam.container.height > 0){
									config["h"] = chartParam.container.height;
								}

								//添加样式
								if(chartParam.style){
									config["config"] = chartParam.style;
								}
							}
						}

						if(re.chartTypeChart == "d3.bar.drill"){
							var textWidth = 600;
							if(config["config"].textWidth > 0){
								textWidth = parseFloat(config["config"].textWidth);
							}
							var w = parseFloat(config["w"]);
							var marginLeft = w/24+textWidth/2;
							$("#content").css({
								"margin-left":"-"+(marginLeft-160)+"px",
								"width":w+200
							});
							config["textWidth"] = textWidth;		//文字宽度
							config["w"] = config["w"] > 1305 ? config["w"] : 1305;					//图宽度
						}else if(re.chartTypeChart == "d3.category.compare"){
							config["w"] = 780;				//图宽度
						}else if(re.chartTypeChart == "d3.bar.order"){
							if(config.w > 880){
								config["w"] = 880;					//图宽度过宽
							}
						}
						obj.init(config,function(selfDrillDown,selfDrillUp){
							if(typeof selfDrillDown == "function"){
								_selfDrillDown = selfDrillDown;
							}else{
								_selfDrillDown = null;
							}
							if(typeof selfDrillUp == "function"){
								_selfDrillUp = selfDrillUp;
							}else{
								_selfDrillUp = null;
							}
						});
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
