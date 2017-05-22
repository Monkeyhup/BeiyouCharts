/**
 * echart 三视图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

	var common = require("./echarts.common");

	/**
	 *	地图
	 * @constructor
	 */
	var EChartMap = function(){
		this.option = {
			tooltip: {
				show: true,
				trigger: 'item',
				"axisPointer": {
					"type": "shadow"
				}
			},
			legend: {
				data:[''],
				orient : 'vertical',
				x : 'left',
				"textStyle": {
					"fontSize": 12,
					"fontFamily": "微软雅黑",
					"color": "#26C0C0",
					"fontWeight": "bold"
				},
				"selectedMode": true,
				"show": true
			},
			roamController: {
				show: true,
				x: 'right',
				mapTypeControl: {
					'china': true
				}
			},
			series : [
				{
					"name":"",
					type: 'map',
					mapType: 'china',
					roam: true,
					itemStyle:{
						normal:{label:{show:true}},
						emphasis:{label:{show:true}}
					},
					"data":[]   //数据
				}
			]
		};
	};

	/**
	 *
	 * @type {{}}
	 */
	EChartMap.prototype = {
		init:function(config){
			var that = this;
			config = $.extend({},config);
			common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);
			//是否不显示图例
			if(typeof config.isShowLegend == "boolean" && config.isShowLegend === false){
				that.option.legend.show = false;
			}
			//是否不显示地图控制
			if(typeof config.isShowRoamController == "boolean" && config.isShowRoamController === false){
				that.option.roamController.show = false;
			}

			// 基于准备好的dom，初始化echarts图表
			var myChart = common.myECharts.getChart(config.container);
			if(myChart){
				this.getOptionFromConfig(config,function(){
					//自定义地图
					if(config.map){
						//配置自定义地图数据
						var mapType = config.map.type;

						//兼容旧省级地图
						if(config.map.snType && (!config.map.url || config.map.url == "")){
							var configUrl = SGIS.Config.BASE_MODULE_URL+"js/module/component/china.all.province.config";
							seajs.use(configUrl,function(ChinaAllProvinceConfig){
								if(ChinaAllProvinceConfig && ChinaAllProvinceConfig[config.map.snType]){
									echarts.util.mapData.params.params[mapType] = {
										getGeoJson : function(callback) {
											var mapUrl = SGIS.Config.BASE_MODULE_URL
												+ChinaAllProvinceConfig[config.map.snType];
											common.Ajax.getJsonData(mapUrl,callback);
										}
									};
									that.option.roamController.mapTypeControl = {};
									that.option.roamController.mapTypeControl[mapType] = true;
									for ( var i = 0,len=that.option.series.length; i < len; i++) {
										that.option.series[i].mapType = mapType;
									}
									renderEcharts();
								}else{
									console && console.log("消息提示：china.all.province.config.js配置未找到地图数据！");
								}
							});
						}else{
							var mapUrl = SGIS.Config.BASE_MODULE_URL+config.map.url;
							$.getJSON(mapUrl, function (geoJson) {
								echarts.registerMap(mapType, geoJson);
								that.option.roamController.mapTypeControl = {};
								that.option.roamController.mapTypeControl[mapType] = true;
								for ( var i = 0,len=that.option.series.length; i < len; i++) {
									that.option.series[i].mapType = mapType;
								}
								renderEcharts();
							})
						}
					}else{
						var url= SGIS.Config.BASE_MODULE_URL+"js/module/map/map.geo.china.config.json"
						$.get(url, function (geoJson) {
							echarts.registerMap('china', geoJson);
							renderEcharts();
						})
					}//end if(config.map)

					function renderEcharts(){
						//外部option
						if(config.option){
							//兼容原来的数据
							if(config.option.dataRange){
								delete config.option.dataRange;
							}
							that.option = $.extend(true,that.option,config.option || {});
						}
						myChart.setOption(that.option);

						//设置主题
						if(config.theme && config.theme != ""){
							myChart.setTheme(config.theme);
						}
					}
				});
			}
		},
		setAreaGroupColor:function(dataGroup,colors){
			var that = this;
			if(dataGroup && colors && dataGroup.length == colors.length){
				var dataGroupArr = [];
				for(var i= 0;i<dataGroup.length;i++) {
					for (var j = 0; j < dataGroup[i].length; j++) {
						var item = dataGroup[i][j];

						dataGroupArr.push({
							name: item.name,
							value: item.value,
							itemStyle: {
								normal: {
									color: colors[i],
									label : {
										show : true,	//显示指标文字
										textStyle : {
											fontSize : '12',
											fontWeight : 'bold',
											"fontFamily": "微软雅黑"
										}
									},
									labelLine : {
										show : true			//显示指标线
									},
									borderWidth:3			//省份的边框宽度
								}
							},
							emphasis: {                 	// 也是选中样式
								label : {
									show : true,
									position : 'center',
									textStyle : {
										fontSize : '13',
										fontWeight : 'bold',
										"fontFamily": "微软雅黑",
										"color": "#26C0C0"
									}
								}
							}
						});
					}
				}
				//设置每个区域的颜色
				that.option.series[0]["data"] = dataGroupArr;
			}
		},
		getOptionFromConfig:function(config,callback){
			var that = this;
			if(typeof config.data == "object" && config.data != null){
				this.getDataFromData(config.data,function(re){
					goTo(re);
					callback && callback();
				});
			}else{
				this.getDataFromConfig(config.url,function(re){
					goTo(re);
					callback && callback();
				});
			}
			//
			function goTo(re){
				if(re && re != null){
					//加上单位
					if(re.legendData instanceof Array){
						var llLen=re.legendData.length;
						for(var ll= 0;ll<llLen;ll++){
							re.legendData[ll] = re.legendData[ll]+re.unit;
						}
						if(llLen>0){
							re.seriesName = re.seriesName+re.unit;
						}
					}//end if(re.legendData instanceof Array)
					that.option.legend.data = re.legendData;

					that.option.series = [
						{
							"name":re.seriesName,
							"type": 'map',
							"mapType": 'china',
							"roam": true,
							"data":re.seriesData,
							"itemStyle" : {
								normal : {
									color:"#CDC9C9",
									label : {
										show : true,	//显示指标文字
										textStyle : {
											fontSize : '12',
											fontWeight : 'bold',
											"fontFamily": "微软雅黑"
										}
									},
									labelLine : {
										show : true			//显示指标线
									},
									borderWidth:3			//省份的边框宽度
								},
								emphasis : {
									label : {
										show : true,
										position : 'center',
										textStyle : {
											fontSize : '13',
											fontWeight : 'bold',
											"fontFamily": "微软雅黑",
											"color": "#26C0C0"
										}
									}
								}
							}
						}
					];

					if(typeof config.dataGroup == "object" && config.dataGroup != null){
						//设置分组区域颜色
						var dataGroup = $.extend(true,[],config.dataGroup);
						var colors = $.extend(true,[],config.color);
						delete config.dataGroup;
						delete config.color;
						that.setAreaGroupColor(dataGroup,colors);
					}
				}
			}
		},
		getDataFromConfig:function(url,callback){
			var that = this;
			common.Ajax.getJsonData(url,function(data){
				that.getDataFromData(data,callback);
			});
		},
		getDataFromData:function(data,callback){
			if(data && data != null){
				var legendData = [];

				var seriesName = "";
				var seriesData = [];
				var splitList = [];

				var unit = "";
				var max = 0;
				var min = 0;

				var regex = /\([^\)]+\)/g;
				for (var i = 0; i < data.length; i++) {
					if (!isNaN(data[i].value)) {
						seriesData.push({
							name:data[i].name,
							value:data[i].value
						});

						splitList.push({
							name:data[i].name,
							value:data[i].value,
							start:data[i].value,
							end:data[i].value
						});

						if(data[i].value > max){
							max = data[i].value;
						}else if(data[i].value < min){
							min = data[i].value;
						}
					}

					//第一行为表头
					if (i == 0) {
						//数据指标名称
						seriesName = data[i].value || "";

						var v = regex.exec(seriesName);
						if(v && v[0]){
							unit = v[0];
							seriesName = seriesName.split(v)[0] || "";
						}

						//数据指标名称
						legendData.push(seriesName);
					}//end if (i == 0)
				}

				var re = {
					legendData : legendData,
					seriesName : seriesName,
					seriesData : seriesData,
					splitList : splitList,
					unit : unit,
					max:max,
					min:min
				};
				callback && callback(re);
			}else{
				callback && callback(null);
			}
		}
	};

	/**
	 *	饼图
	 * @constructor
	 */
	var EChartPieSingle = function(){
		this.currentColors = [];

		this.colors = ["#ff7f50", "#87cefa", "#da70d6",
			"#32cd32", "#6495ed", "#ff69b4",
			"#ba55d3", "#cd5c5c", "#ffa500",
			"#40e0d0", "#1e90ff", "#ff6347",
			"#7b68ee", "#00fa9a", "#ffd700",
			"#6699FF", "#ff6666", "#3cb371",
			"#b8860b", "#30e0e0"
		];
		this.option = {
			tooltip: {
				show: true,
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)",
				"axisPointer": {
					"type": "shadow"
				}
			},
			legend: {
				data:[''],
				orient : 'vertical',
				x : 'left',
				"textStyle": {
					"fontSize": 12,
					"fontFamily": "微软雅黑",
					"color": "#26C0C0",
					"fontWeight": "bold"
				},
				"selectedMode": true,
				"show": true
			},
			series : [
				{
					"name":"",
					"type":"pie",
					"radius" : ['25%', '50%'],
					"data":[]   //数据
				}
			]
		};

	};

	/**
	 *
	 * @type {{}}
	 */
	EChartPieSingle.prototype = {
		init:function(config,callback){
			var that = this;
			config = $.extend({},config);
			common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);

			if(typeof config.isShowLegend == "boolean" && config.isShowLegend == false){
				that.option.legend.show = false;
			}

			// 基于准备好的dom，初始化echarts图表
			var myChart = common.myECharts.getChart(config.container);
			if(myChart){
				this.getOptionFromConfig(config,function(){
					//是否设置点击事件
					/*if(config.isClick){
						that.setClickEvent(myChart,config.clickEvent);
					}*/
					if(config.option){
						that.option = $.extend(true,that.option,config.option || {});
					}
					myChart.setOption(that.option);
					callback && $.isFunction(callback) && callback(that);
				});
			}
		},
		//设置点击事件
		setClickEvent:function(myChart,callback){
			var ecConfig = echarts.config;
			myChart.on(ecConfig.EVENT.CLICK, function(param) {
				callback && $.isFunction(callback) && callback(param);
			});
		},
		getOptionFromConfig:function(config,callback){
			var that = this;
			if(typeof config.data == "object" && config.data != null){
				this.getDataFromData(config.data,function(re){
					goTo(re);
					callback && callback();
				});
			}else{
				this.getDataFromConfig(config.url,function(re){
					goTo(re);
					callback && callback();
				});
			}

			//
			function goTo(re){
				if(re && re != null){
					that.option.legend.data = re.legendData;

					//获取颜色参数
					var color = [];
					var colorLen = that.colors.length;
					for(var i=0,len=re.seriesData.length;i<len;i++){
						color.push(that.colors[i%colorLen]);
					}
					//保存当前colors
					that.currentColors = $.extend([],color);
					that.option.color = color;

					that.option.series = [
						{
							"name":re.seriesName,
							"type":"pie",
							"radius" : ['25%', '50%'],
							"data":re.seriesData,
							"color":color,
							"itemStyle" : {
								normal : {
									label : {
										show : true,	//显示指标文字
										textStyle : {
											fontSize : '12',
											fontWeight : 'bold',
											"fontFamily": "微软雅黑"
										},
										formatter : '{b}: \n{c}'+re.unit+'({d}%)'
									},
									labelLine : {
										show : true	//显示指标线
									}
								},
								emphasis : {
									label : {
										show : true,
										position : 'center',
										textStyle : {
											fontSize : '13',
											fontWeight : 'bold',
											"fontFamily": "微软雅黑",
											"color": "#26C0C0"
										}
									}
								}
							}
						}
					];
				}
			}
		},
		getDataFromConfig:function(url,callback){
			var that = this;
			common.Ajax.getJsonData(url,function(data){
				that.getDataFromData(data,callback);
			});
		},
		getDataFromData:function(data,callback){
			if(data && data != null){
				var legendData = [];

				var seriesName = "";
				var seriesData = [];

				var unit = "";

				var regex = /\([^\)]+\)/g;
				for (var i = 0; i < data.length; i++) {
					if (!isNaN(data[i].value)) {
						seriesData.push({
							name:data[i].name,
							value:data[i].value
						});

						//数据指标名称
						legendData.push(data[i].name);
					}

					//第一行为表头
					if (i == 0) {
						//数据指标名称
						seriesName = data[i].value || "";

						var v = regex.exec(seriesName);
						if(v && v[0]){
							unit = v[0];
							seriesName = seriesName.split(v)[0] || "";
						}
					}//end if (i == 0)
				}

				var re = {
					legendData : legendData,
					seriesName : seriesName,
					seriesData : seriesData,
					unit : unit
				};
				callback && callback(re);
			}else{
				callback && callback(null);
			}
		}
	};

	/**
	 *	柱状图
	 * @constructor
	 */
	var EChartBarVerticalSingle = function(){
		this.currentBarColor = [];
		this.option = {
			tooltip: {
				show: true,
				"trigger": "axis",
				"axisPointer": {
					"type": "shadow"
				}
			},
			"grid": {
				"borderWidth": 0
			},
			legend: {
				data:[''],
				"textStyle": {
					"fontSize": 12,
					"fontFamily": "微软雅黑",
					"color": "#26C0C0",
					"fontWeight": "bold"
				},
				"selectedMode": true,
				"show": true
			},
			xAxis : [
				{
					type : 'category',
					data : [],  //数据
					"axisLabel": {
						"rotate": 0,
						"interval": "auto",
						"textStyle": {
							"fontSize": 12,
							"fontFamily": "微软雅黑",
							"color": "#26C0C0",
							"fontWeight": "bold"
						}
					},
					"splitLine": {
						"show": false
					},
					"axisLine": {
						"lineStyle": {
							"color": "#26C0C0"
						}
					}
				}
			],
			yAxis : [
				{
					type : 'value',
					"axisLabel": {
						"textStyle": {
							"fontSize": 12,
							"fontFamily": "微软雅黑",
							"color": "#26C0C0",
							"fontWeight": "bold"
						},
						"formatter": "{value}"
					},
					"nameTextStyle": {
						"fontSize": 12,
						"fontFamily": "微软雅黑",
						"color": "#26C0C0",
						"fontWeight": "bold"
					},
					"splitLine": {
						"show": false
					},
					"axisLine": {
						"lineStyle": {
							"color": "#26C0C0"
						}
					},
					name:""     //数据
				}
			],
			series : [
				{
					"name":"",
					"type":"bar",
					"data":[]   //数据
				}
			]
		};
	};

	/**
	 * @type {{}}
	 */
	EChartBarVerticalSingle.prototype = {
		init:function(config){
			var that = this;
			config = $.extend({},config);
			common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);

			// 基于准备好的dom，初始化echarts图表
			var myChart = common.myECharts.getChart(config.container);
			if(myChart){
				this.getOptionFromConfig(config,function(){
					if(config.option){
						that.option = $.extend(true,that.option,config.option || {});
					}
					myChart.setOption(that.option);
				});
			}
		},
		getOptionFromConfig:function(config,callback){
			var that = this;
			if(typeof config.data == "object" && config.data != null){
				this.getDataFromData(config.data,function(re){
					goTo(re);
					callback && callback();
				});
			}else{
				this.getDataFromConfig(config.url,function(re){
					goTo(re);
					callback && callback();
				});
			}

			//
			function goTo(re){
				if(re && re != null){
					that.option.legend.data = re.legendData;

					$.extend(that.option.xAxis[0],{
						type : 'category',
						data : re.xAxisData
					});
					$.extend(that.option.yAxis[0],{
						name : re.unit
					});
					that.option.series = [
						{
							"name":re.seriesName,
							"type":"bar",
							"data":re.seriesData,
							"itemStyle" : {
								"normal": {
									"barBorderWidth": 2,
									"barBorderColor": "#F5F5F5",
									"barBorderRadius": [0,0,0,0],
									"color": function(param){
										//单独高亮一根柱子
										if(typeof config.selectedBarValue == "number"){
											if(param.data && param.data == config.selectedBarValue){
												return config.selectedBarValueColor;
											}else{
												return "#CDC9C9";	//灰色
											}
										}else{
											if(param.dataIndex > -1){
												return that.currentBarColor[param.dataIndex];
											}else{
												return that.currentBarColor[0];
											}
										}
									},
									"label": {
										"show": true,
										"position": "top",
										"textStyle": {
											"fontSize": 12,
											"fontFamily": "微软雅黑",
											"color": "#26C0C0",
											"fontWeight": "bold"
										}
									}
								}
							}
						}
					];
				}
			}
		},
		getDataFromConfig:function(url,callback){
			var that = this;
			common.Ajax.getJsonData(url,function(data){
				that.getDataFromData(data,callback);
			});
		},
		getDataFromData:function(data,callback){
			if(data && data != null){
				var xAxisData = [];
				var legendData = [];

				var seriesName = "";
				var seriesData = [];

				var unit = "";

				var regex = /\([^\)]+\)/g;
				for (var i = 0; i < data.length; i++) {
					if (!isNaN(data[i].value)) {
						seriesData.push(data[i].value);
						xAxisData.push(data[i].name);
					}

					//第一行为表头
					if (i == 0) {
						//数据指标名称
						seriesName = data[i].value || "";

						var v = regex.exec(seriesName);
						if(v && v[0]){
							unit = v[0];
							seriesName = seriesName.split(v)[0] || "";
						}

						//数据指标名称
						legendData.push(seriesName);
					}//end if (i == 0)
				}

				var re = {
					xAxisData : xAxisData,
					legendData : legendData,
					seriesName : seriesName,
					seriesData : seriesData,
					unit : unit
				};
				callback && callback(re);
			}else{
				callback && callback(null);
			}
		}
	};

	/**
	 *	三试图
	 * @constructor
	 */
	var EChartThreeView = function(){
		this.map = new EChartMap();
		this.pieSingle = new EChartPieSingle();
		this.barVerticalSingle = new EChartBarVerticalSingle();
		this.oldConfig;
	};

	/**
	 *
	 * @type {{}}
	 */
	EChartThreeView.prototype = {
		init:function(config){
			var that = this;
			that.oldConfig = $.extend({},config);

			config = $.extend({},config);
			common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);
			$("#"+config.container).css({
				"position" : "relative"
			});
			var width = parseFloat($("#"+config.container).css("width"));
			var height = parseFloat($("#"+config.container).css("height"));

			var mapWidthPercent = config.mapWidthPercent > 0 ? parseFloat(config.mapWidthPercent)/100 : 0.55;
			var pieWidthPercent = config.pieWidthPercent > 0 ? parseFloat(config.pieWidthPercent)/100 : 0.55;
			var barWidthPercent = config.barWidthPercent > 0 ? parseFloat(config.barWidthPercent)/100 : 0.45;

			//1.地图
			var id1 = null;
			var $maps = $("div[id^='"+ config.container+"_map_']");
			if($maps.length > 0){
				id1 = $($maps[0]).attr("id");
			}else{
				//创建新的div容器
				id1 = config.container+"_map_"+(new Date().getTime());
				$("<div id='"+id1+"'>").css({
					"position" : "absolute",
					"left": 0
				}).appendTo($("#"+config.container));
			}

			//1.饼图
			var id2 = null;
			var $pies = $("div[id^='"+ config.container+"_pie_']");
			if($pies.length > 0){
				id2 = $($pies[0]).attr("id");
				$($pies[0]).css({
					"left": width*(1-pieWidthPercent+0.01)-10,			//width*0.55
					"top":0
				});
			}else{
				//创建新的div容器
				id2 = config.container+"_pie_"+(new Date().getTime());
				$("<div id='"+id2+"'>").css({
					"position" : "absolute",
					"left": width*(1-pieWidthPercent+0.01)-10,			//width*0.55
					"top":0
				}).appendTo($("#"+config.container));
			}

			//3.柱图
			var id3 = null;
			var $bars = $("div[id^='"+ config.container+"_bar_']");
			if($bars.length > 0){
				id3 = $($bars[0]).attr("id");
				$($bars[0]).css({
					"left": width*(1-barWidthPercent)-10,
					"top":height/2
				});
			}else{
				//创建新的div容器
				id3 = config.container+"_bar_"+(new Date().getTime());
				$("<div id='"+id3+"'>").css({
					"position" : "absolute",
					"left": width*(1-barWidthPercent)-10,
					"top":height/2
				}).appendTo($("#"+config.container));
			}

			//文字
			var $as = $("a[id^='"+ config.container+"_name_']");
			if($as.length == 0){
				//创建每个饼的名字
				var pId = config.container+"_name_"+(new Date().getTime());
				$("<a id='"+pId+"' href='javascript:;' class='text1'>全部</a>").css({
					"position" : "absolute",
					"top": (height/4-30)+"px",
					"right" : width*pieWidthPercent/2-40,//(width*0.55+width*0.45/2-15)
					"fontSize": 16,
					"fontFamily": "微软雅黑",
					"fontWeight": "bold"}
				).click(function(){
					//重新制图
					$("#"+config.container).html("");
					that.init(that.oldConfig);
				}).appendTo($("#"+config.container));
			}else{
				$($as[0]).css({
					"position" : "absolute",
					"top": (height/4-30)+"px",
					//"left" : (width*mapWidthPercent+width*(pieWidthPercent-0.02)/2+15),//(width*0.55+width*0.45/2-15)
					"right" : width*pieWidthPercent/2-40,//(width*0.55+width*0.45/2-15)
					"fontSize": 16,
					"fontFamily": "微软雅黑",
					"fontWeight": "bold"
				});
			}

			var mapOption = null,pieOption=null,barOption=null;
			if(config.option){
				if(config.option.mapOption){
					mapOption = $.extend(true,{},config.option.mapOption);
				}
				if(config.option.pieOption){
					pieOption = $.extend(true,{},config.option.pieOption);
				}
				if(config.option.barOption){
					barOption = $.extend(true,{},config.option.barOption);
				}
				//删除
				delete config.option;
			}

			// 基于准备好的dom，初始化echarts图表
			this.getOptionFromConfig(config,function(re){
				if(re && re != null){
					//出饼图
					var pieConfig = $.extend({},config,{
						container:id2,
						width:width*pieWidthPercent+60,	//width*0.45
						height:height/2,
						isShowLegend:false,
						isClick:true,
						clickEvent:function(param){
							if(param){
								var data = re.bar;
								for ( var i = 0; i < data.length; i++) {
									if(data[i].name == param.name){
										//取得当前选中的饼的颜色
										var currentColor = that.pieSingle.currentColors[param.dataIndex];

										//1.高亮地图
										var mapConfig1 = $.extend({},config,{
											container:id1,
											width:width*mapWidthPercent,
											isShowLegend:false,
											isShowRoamController:false
										});

										if(currentColor){
											//添加当前分组
											mapConfig1.dataGroup = $.extend(true,[],[re.group[param.name]]);
											//添加颜色
											mapConfig1.color = [currentColor];
										}

										re.group[param.name].splice(0, 0, re.map[0]); 	//插入表头
										mapConfig1.url = null;
										mapConfig1.data = re.group[param.name];			//只取有效区域

										if(mapOption && mapOption != null){
											mapConfig1 = $.extend(true,mapConfig1,{option:mapOption});
										}

										that.map.init(mapConfig1);

										//2.高亮出柱图
										var barConfig1 = $.extend({},config,{
											container:id3,
											width:width*barWidthPercent+60,
											height:height/2,
											selectedBarValue:data[i].value,			//高亮该值
											selectedBarValueColor:currentColor		//高亮该值颜色
										});
										barConfig1.url = null;
										barConfig1.data = re.bar;

										if(barOption && barOption != null){
											barConfig1 = $.extend(true,barConfig1,{option:barOption});
										}
										that.barVerticalSingle.init(barConfig1);

										break;
									}
								}
							}
						}
					});
					pieConfig.url = null;
					pieConfig.data = re.pie;

					if(pieOption && pieOption != null){
						pieConfig = $.extend(true,pieConfig,{option:pieOption});
					}
					that.pieSingle.init(pieConfig,function(pie){
						//取得当前的颜色
						var colors =  pie.currentColors;

						/*** 显示地图*/
						var mapConfig = $.extend({},config,{
							container:id1,
							width:width*mapWidthPercent,
							isShowLegend:false,
							isShowRoamController:false
						});
						mapConfig.url = null;
						mapConfig.data = re.map;
						//分块地图颜色
						mapConfig.dataGroup = $.extend(true,[],re.mapGroup);
						mapConfig.color = $.extend(true,[],colors);

						if(mapOption && mapOption != null){
							mapConfig = $.extend(true,mapConfig,{option:mapOption});
						}
						that.map.init(mapConfig);

						/*** 显示柱*/
							//设置柱子的颜色
						that.barVerticalSingle.currentBarColor = $.extend(true,[],colors || []);
						//出柱图
						var barConfig = $.extend({},config,{container:id3,width:width*barWidthPercent+60,height:height/2});
						barConfig.url = null;
						barConfig.data = re.bar;

						if(barOption && barOption != null){
							barConfig = $.extend(true,barConfig,{option:barOption});
						}
						that.barVerticalSingle.init(barConfig);
					});
				}else{
					console.log("消息提示：没有数据");
				}
			});
		},
		getOptionFromConfig:function(config,callback){
			var that = this;
			if(typeof config.data == "object" && config.data != null){
				this.getDataFromData(config.data,function(re){
					callback && callback(re);
				});
			}else{
				this.getDataFromConfig(config.url,function(re){
					callback && callback(re);
				});
			}
		},
		getDataFromConfig:function(url,callback){
			var that = this;
			common.Ajax.getJsonData(url,function(data){
				that.getDataFromData(data,callback);
			});
		},
		getDataFromData:function(data,callback){
			if(data && data != null){
				var re = {
					mapGroup:[],
					map:[],
					pie:[],
					bar:[],
					group:{}	//按大区分组
				};

				var cGroupName = "";
				var groupIndex = -1;
				for (var i = 0; i < data.length; i++) {
					//第一行为表头
					if (i == 0) {
						re.map.push(data[i]);
						re.pie.push(data[i]);
						re.bar.push(data[i]);
					}else{
						//地图
						if (!isNaN(data[i].value)) {
							re.map.push(data[i]);

							//当前功能区下的小区域
							re.group[cGroupName].push(data[i]);
							re.mapGroup[groupIndex].push(data[i]);
						}else{
							var d = {
								name:data[i].name,
								value:parseFloat(data[i].value)
							};
							re.pie.push(d);
							re.bar.push(d);

							//初始化几大功能区
							cGroupName = data[i].name;
							re.group[cGroupName] = [];
							groupIndex ++;
							re.mapGroup.push([]);
						}
					}//end if (i == 0)
				}
				callback && callback(re);
			}else{
				callback && callback(null);
			}
		}
	};


	return EChartThreeView;
});