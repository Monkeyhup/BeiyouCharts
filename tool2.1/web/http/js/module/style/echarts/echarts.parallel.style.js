/**
 * echart对比面积图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/echarts/echarts.parallel.html.tpl");
	
    /**
     *
     */
    var EChartAreaMultiStyle = (function(){
        var _isInit = false;
    	var _style = {};
    	var _container = {};

		/**
		 * 初始化数据
		 * @param currentHanlder
		 * 			当前处理的对象（chart.echarts.js
		 * 			或者chart.echarts.edit.js的对象）
		 * @param chartParam
		 * 			当为图编辑时传入的初始化参数，新建时为null
		 * @param callback
		 * 			回调方法
		 */
        var init = function(currentHanlder,chartParam,callback){
        	if(_isInit){
        		callback && callback();
        		return 
        	}
        	_style = {};
        	_container = {};
        	
        	//添加内容
        	$("#param-pane").html("").append($(templateHtml));
			//初始化样式参数时必须放在【添加内容】后面
			if(chartParam != null){
				//设置参数并初始化数据
				setChartParam(chartParam);
			}
        	
        	_isInit = true;
			initEventBind(currentHanlder,callback);
        };
		/**
		 * 初始化绑定事件
		 * @param currentHanlder
		 * @param callback
		 */
		var initEventBind = function(currentHanlder,callback){
			if(currentHanlder && currentHanlder != null){
				eventBind(currentHanlder,callback);
			}else{
				//默认选择（chart.echarts）
				seajs.use("chart.echarts",function(hanlder){
					eventBind(hanlder,callback);
				});
			}
		};

		/**
		 * 绑定事件
		 * @param hanlder
		 * @param callback
		 */
		var eventBind = function(hanlder,callback){
			if(hanlder){
				var chartObj = hanlder.getChartObj();
				var objConfig = hanlder.getChartConfig();
				if(chartObj && objConfig){
					//修改图的高度
					$("#chart-chart-height-range").change(function(){
						var height = $(this).val();
						//设置值
						$("#chart-chart-height-text").val(height);

						_container["height"] = height;
						objConfig["height"] = height;
						chartObj.init(objConfig);
					});
					//背景颜色
					$("#background-color-select").change(function(){
						var color = $(this).val();

						objConfig["option"] = _style = $.extend(true,_style,{
							backgroundColor:color
						});
						chartObj.init(objConfig);
					});



					//是否显示图列
					$("#chart-show-legend-check").change(function(){
						var isShow = $(this).is(":checked");
						//控制是否可以修改图例文字颜色
						$("#chart-legend-color-select").attr("disabled",!isShow);

						objConfig["option"] = _style = $.extend(true,_style,{
							legend:{
								show:isShow
							}
						});
						chartObj.init(objConfig);
					});

					//图列文字颜色
					$("#chart-legend-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							legend:{
								textStyle:{
									color:color
								}
							}
						});
						chartObj.init(objConfig);
					});

					//图列文字大小
					$("#input-legend-font-range").change(function(){
						var size = $(this).val();
						$("#input-legend-font-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							legend:{
								textStyle:{
									fontSize:size
								}
							}
						});
						chartObj.init(objConfig);
					});

					//x轴位置
					$("input[name='chart-x-position-radio']").click(function(){
						var position = $(this).val();

						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									nameLocation: position
								}
							}
						});
						chartObj.init(objConfig);
					});

					//x轴距离
					$("#input-x-level-range").change(function(){
						var size = $(this).val();
						$("#input-x-level-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									nameGap: size
								}
							}
						});
						chartObj.init(objConfig);
					});

					//x轴字体颜色
					$("#chart-x-font-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									nameTextStyle: {
										color: color,
									}
								}

							}
						});
						chartObj.init(objConfig);
					});

					//x轴字体大小
					$("#chart-x-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-x-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									nameTextStyle: {
										fontSize: size
									}
								}
							}
						});
						chartObj.init(objConfig);
					});


					//y轴颜色
					$("#chart-y-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									axisLine: {
										lineStyle: {
											color: color
										}
									},
								}

							}
						});
						chartObj.init(objConfig);
					});


					//y轴线宽
					$("#chart-y-line-size-range").change(function(){
						var size = $(this).val();
						$("#chart-y-line-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									axisLine: {
										lineStyle: {
											width: size
										}
									},
								}

							}
						});
						chartObj.init(objConfig);
					});

					//是否设置y轴模糊阴影
					$("#chart-show-y-shadow-check").change(function(){
						var isShow = $(this).is(":checked");
						var color=$("#chart-y-shadow-color-select").val();
						var level=$("#charty-shadow-range").val();
						//控制是否可以修改阴影模糊程度和颜色
						$("#charty-shadow-range").attr("disabled",!isShow);
						$("#chart-y-shadow-color-select").attr("disabled",!isShow);
						if(isShow){
							objConfig["option"] = _style = $.extend(true,_style,{
								parallel:{
									parallelAxisDefault:{
										axisLine: {
											lineStyle: {
												shadowBlur : level,
												shadowColor: color
											}
										}
									}

								}
							});
						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								parallel:{
									parallelAxisDefault:{
										axisLine: {
											lineStyle: {
												shadowBlur : 0
											}
										}
									}

								}
							});
						}

						chartObj.init(objConfig);
					});


					//设置y轴阴影模糊程度
					$("#charty-shadow-range").change(function(){
						var color=$("#chart-y-shadow-color-select").val();
						var level=$(this).val();
						$("#charty-shadow-range-text").val(level);
						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									axisLine: {
										lineStyle: {
											shadowBlur : level,
											shadowColor : color
										}
									}
								}

							}
						});
						chartObj.init(objConfig);
					});

					//设置y轴阴影模糊颜色
					$("#chart-y-shadow-color-select").change(function(){
						var level=$("#charty-shadow-range").val();
						var color=$(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									axisLine: {
										lineStyle: {
											shadowBlur : level,
											shadowColor : color
										}
									},
								}

							}
						});
						chartObj.init(objConfig);


					})

					//y轴是否显示刻度点
					$("#chart-show-y-calibration-point-check").change(function(){
						var isShow = $(this).is(":checked");
						//控制是否可以修改阴影模糊程度和颜色
						$("#chart-y-calibration-point-color-select").attr("disabled",!isShow);
						if(isShow){
							objConfig["option"] = _style = $.extend(true,_style,{
								parallel:{
									parallelAxisDefault:{
										axisTick: {
											show: true
										}
									}

								}
							});
						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								parallel:{
									parallelAxisDefault:{
										axisTick: {
											show: false
										}
									}

								}
							});
						}

						chartObj.init(objConfig);
					});

					//y轴刻度点颜色
					$("#chart-y-calibration-point-color-select").change(function(){
						var color=$(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									axisTick: {
										lineStyle: {
											color : color
										}
									}
								}

							}
						});
						chartObj.init(objConfig);


					});

					//y轴是否显示标签
					$("#chart-show-y-label-check").change(function(){
						var isShow = $(this).is(":checked");
						//控制是否可以标签颜色
						$("#chart-y-label-color-select").attr("disabled",!isShow);
						$("#charty-label-size-range").attr("disabled",!isShow);
						if(isShow){
							objConfig["option"] = _style = $.extend(true,_style,{
								parallel:{
									parallelAxisDefault:{
										axisLabel: {
											show: true
										}
									}

								}
							});
						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								parallel:{
									parallelAxisDefault:{
										axisLabel: {
											show: false
										}
									}

								}
							});
						}

						chartObj.init(objConfig);
					});

					//y轴标签颜色
					$("#chart-y-label-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									axisLabel: {
										textStyle: {
											color : color
										}
									}
								}

							}
						});

						chartObj.init(objConfig);
					});

					//y轴标签大小
					$("#charty-label-size-range").change(function(){
						var size=$(this).val();
						$("#charty-label-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							parallel:{
								parallelAxisDefault:{
									axisLabel: {
										textStyle: {
											fontSize : size
										}
									}
								}

							}
						});
						chartObj.init(objConfig);
					});


				}//end if(chartObj && objConfig)
			}//end if(hanlder)

			callback && callback();
        };
        
        /**
         * 取得style
         */
        var getStyle = function(){
        	return _style;
        };
        
        /**
         * 取得container
         */
    	var getContainer = function(){
    		return _container;
    	};
    	
    	var setHeight = function(height){
    		if(height && height > 0){
    			_container["height"] = height;
    		}
    	};

		/**
		 * 设置参数（编辑时使用）
		 *
		 * @param chartParam
		 * 			设置参数
		 */
		var setChartParam = function(chartParam){
			if(chartParam && typeof chartParam == "object"){
				if(chartParam.container){
					_container = $.extend(true,_container || {},chartParam.container);
				}

				if(chartParam.style){
					_style = $.extend(true,_style || {},chartParam.style);
				}
			}

			//初始化控件的值
			initControlStyle();
		};

		/**
		 * 初始化控件的值（编辑时使用）
		 */
		var initControlStyle = function(){
			var series = _style.series;
			if(series){
				//折线是否为平滑曲线
				var seriesStyle= $.extend(true,{},{series:[
					{
						"itemStyle": {
							"normal": {
								"lineStyle": {
									width:-1
								},
								"label": {
									"show":true,
									"position": null,
									"textStyle": {
										"color":null,
										"fontSize": -1
									}
								}
							}
						}
					},{
						"itemStyle": {
							"normal": {
								"lineStyle": {
									width:-1
								},
								"label": {
									"show":true,
									"position": null,
									"textStyle": {
										"color":null,
										"fontSize": -1
									}
								}
							}
						}
					}
				]},{
					series:series
				});

				var lineWidthStyle1 = seriesStyle.series[0].itemStyle.normal.lineStyle.width;
				if(lineWidthStyle1 > -1){
					$("#chart1-area-width-range").attr("value",lineWidthStyle1).val(lineWidthStyle1);
					$("#chart1-area-width-text").attr("value",lineWidthStyle1).val(lineWidthStyle1);
				}
				var lineWidthStyle2 = seriesStyle.series[1].itemStyle.normal.lineStyle.width;
				if(lineWidthStyle2 > -1){
					$("#chart2-area-width-range").attr("value",lineWidthStyle2).val(lineWidthStyle2);
					$("#chart2-area-width-text").attr("value",lineWidthStyle2).val(lineWidthStyle2);
				}

				//是否显示标签
				var textShowStyle = seriesStyle.series[0].itemStyle.normal.label.show === false;
				if(textShowStyle){
					$("#chart-show-label-check").attr("checked",false);

					//控制是否可以修改
					$("#chart1-font-color-select").attr("disabled",true);
					$("#chart2-font-color-select").attr("disabled",true);
					$("#chart1-font-size-range").attr("disabled",true);
					$("#chart2-font-size-range").attr("disabled",true);
					$("input[name='chart1-font-position-radio']").attr("disabled",true);
					$("input[name='chart2-font-position-radio']").attr("disabled",true);
				}
				var textStylePosition1 = seriesStyle.series[0].itemStyle.normal.label.position;
				if(textStylePosition1 != null){
					var radioId = "chart1-font-position-radio-";
					switch(textStylePosition1){
						case "top":
							radioId = radioId + "1";
							break;
						case "bottom":
							radioId = radioId + "2";
							break;
						case "left":
							radioId = radioId + "3";
							break;
						case "right":
							radioId = radioId + "4";
							break;
					}
					$("input[name='chart1-font-position-radio']").removeAttr("checked");
					$("input#"+radioId).attr("checked",true);
					var $span = $("input#"+radioId).parent(".input-group-addon");
					$span.html($span.html());
				}
				var textStylePosition2 = seriesStyle.series[1].itemStyle.normal.label.position;
				if(textStylePosition2 != null){
					var radioId = "chart2-font-position-radio-";
					switch(textStylePosition2){
						case "top":
							radioId = radioId + "1";
							break;
						case "bottom":
							radioId = radioId + "2";
							break;
						case "left":
							radioId = radioId + "3";
							break;
						case "right":
							radioId = radioId + "4";
							break;
					}
					$("input[name='chart2-font-position-radio']").removeAttr("checked");
					$("input#"+radioId).attr("checked",true);
					var $span = $("input#"+radioId).parent(".input-group-addon");
					$span.html($span.html());
				}
				var textStyleColor1 = seriesStyle.series[0].itemStyle.normal.label.textStyle.color;
				if(textStyleColor1 != null){
					$("#chart1-font-color-select").attr("value",textStyleColor1).val(textStyleColor1);
					var $textStyleColorParent =  $("#chart1-font-color-select").parent("div");
					//保证控件刷新
					$textStyleColorParent.html($textStyleColorParent.html());
				}
				var textStyleColor2 = seriesStyle.series[1].itemStyle.normal.label.textStyle.color;
				if(textStyleColor2 != null){
					$("#chart2-font-color-select").attr("value",textStyleColor2).val(textStyleColor2);
					var $textStyleColorParent =  $("#chart2-font-color-select").parent("div");
					//保证控件刷新
					$textStyleColorParent.html($textStyleColorParent.html());
				}
				var textStyleFontSize1 = seriesStyle.series[0].itemStyle.normal.label.textStyle.fontSize;
				if(textStyleFontSize1 > -1){
					$("#chart1-font-size-range").attr("value",textStyleFontSize1).val(textStyleFontSize1);
					$("#chart1-font-size-text").attr("value",textStyleFontSize1).val(textStyleFontSize1);
				}
				var textStyleFontSize2 = seriesStyle.series[1].itemStyle.normal.label.textStyle.fontSize;
				if(textStyleFontSize2 > -1){
					$("#chart2-font-size-range").attr("value",textStyleFontSize2).val(textStyleFontSize2);
					$("#chart2-font-size-text").attr("value",textStyleFontSize2).val(textStyleFontSize2);
				}

			}//end if(series && series[0])


			//x轴
			var xAxisStyle = $.extend(true,{},{
				xAxis: [
					{
						"position": null,
						"axisLine": {
							"lineStyle": {
								"color": null
							}
						},
						"axisLabel": {
							"textStyle": {
								"color": null,
								"fontSize": -1
							},
							"rotate": -1
						},
						positionOffset: {
							x:0,
							y:0
						},
						"isShowXAxisText" : false
					}
				]
			},{
				xAxis:_style.xAxis || []
			});
			var xAxisStylePosition = xAxisStyle.xAxis[0].position;
			if(xAxisStylePosition != null){
				var radioId = "chart-x-position-radio-";
				switch(xAxisStylePosition){
					case "bottom":
						radioId = radioId +"1";
						break;
					case "top":
						radioId = radioId +"2";
						break;
				}
				$("input[name='chart-x-position-radio']").removeAttr("checked");
				$("input#"+radioId).attr("checked",true);
				var $span = $("input#"+radioId).parent(".input-group-addon");
				$span.html($span.html());
			}//end if(xAxisStylePosition != null)
			var xAxisStyleLineColor = xAxisStyle.xAxis[0].axisLine.lineStyle.color;
			if(xAxisStyleLineColor != null){
				$("#chart-x-color-select").attr("value",xAxisStyleLineColor);
				var $xAxisStyleLineColorParent =  $("#chart-x-color-select").parent("div");
				//保证控件刷新
				$xAxisStyleLineColorParent.html($xAxisStyleLineColorParent.html());
			}//end if(xAxisStyleLineColor != null)
			var xAxisStyleTextColor = xAxisStyle.xAxis[0].axisLabel.textStyle.color;
			if(xAxisStyleTextColor != null){
				$("#chart-x-font-color-select").attr("value",xAxisStyleTextColor);
				var $xAxisStyleTextColorParent =  $("#chart-x-font-color-select").parent("div");
				//保证控件刷新
				$xAxisStyleTextColorParent.html($xAxisStyleTextColorParent.html());
			}//end if(xAxisStyleTextColor != null)
			var xAxisStyleTextSize = xAxisStyle.xAxis[0].axisLabel.textStyle.fontSize;
			if(xAxisStyleTextSize > -1){
				$("#chart-x-font-size-range").attr("value",xAxisStyleTextSize).val(xAxisStyleTextSize);
				$("#chart-x-font-size-text").attr("value",xAxisStyleTextSize).val(xAxisStyleTextSize);
			}//end if(xAxisStyleTextSize != null)
			var xAxisStyleTextRotate = xAxisStyle.xAxis[0].axisLabel.rotate;
			if(xAxisStyleTextRotate > -1){
				$("#chart-x-text-rotate-range").attr("value",xAxisStyleTextRotate).val(xAxisStyleTextRotate);
				$("#chart-x-text-rotate-text").attr("value",xAxisStyleTextRotate).val(xAxisStyleTextRotate);
			}//end if(xAxisStyleTextRotate != null)
			var xAistTylePositionOffset = xAxisStyle.xAxis[0].positionOffset;
			if(xAistTylePositionOffset.x != ""){
				$("#chart-textxy-color-container>.form-controlx").attr("value",xAistTylePositionOffset.x).val(xAistTylePositionOffset.x);
			}
			if(xAistTylePositionOffset.y != ""){
				$("#chart-textxy-color-container>.form-controly").attr("value",xAistTylePositionOffset.y).val(xAistTylePositionOffset.y);
			}


			//y轴
			var yAxisStyle = $.extend(true,{},{
				yAxis: [
					{
						"position": null,
						"axisLine": {
							"lineStyle": {
								"color": null
							}
						},
						"axisLabel": {
							"textStyle": {
								"color": null,
								"fontSize": -1
							},
							"rotate": -1
						}
					}
				]
			},{
				yAxis:_style.yAxis || []
			});
			var yAxisStylePosition = yAxisStyle.yAxis[0].position;
			if(yAxisStylePosition != null){
				var radioId = "chart-y-position-radio-";
				switch(yAxisStylePosition){
					case "left":
						radioId = radioId +"1";
						break;
					case "right":
						radioId = radioId +"2";
						break;
				}
				$("input[name='chart-y-position-radio']").removeAttr("checked");
				$("input#"+radioId).attr("checked",true);
				var $span = $("input#"+radioId).parent(".input-group-addon");
				$span.html($span.html());
			}//end if(yAxisStylePosition != null)
			var yAxisStyleLineColor = yAxisStyle.yAxis[0].axisLine.lineStyle.color;
			if(yAxisStyleLineColor != null){
				$("#chart-y-color-select").attr("value",yAxisStyleLineColor);
				var $yAxisStyleLineColorParent =  $("#chart-y-color-select").parent("div");
				//保证控件刷新
				$yAxisStyleLineColorParent.html($yAxisStyleLineColorParent.html());
			}//end if(yAxisStyleLineColor != null)
			var yAxisStyleTextColor = yAxisStyle.yAxis[0].axisLabel.textStyle.color;
			if(yAxisStyleTextColor != null){
				$("#chart-y-font-color-select").attr("value",yAxisStyleTextColor);
				var $yAxisStyleTextColorParent =  $("#chart-y-font-color-select").parent("div");
				//保证控件刷新
				$yAxisStyleTextColorParent.html($yAxisStyleTextColorParent.html());
			}//end if(yAxisStyleTextColor != null)
			var yAxisStyleTextSize = yAxisStyle.yAxis[0].axisLabel.textStyle.fontSize;
			if(yAxisStyleTextSize > -1){
				$("#chart-y-font-size-range").attr("value",yAxisStyleTextSize).val(yAxisStyleTextSize);
				$("#chart-y-font-size-text").attr("value",yAxisStyleTextSize).val(yAxisStyleTextSize);
			}//end if(yAxisStyleTextSize != null)
			var yAxisStyleTextRotate = yAxisStyle.yAxis[0].axisLabel.rotate;
			if(yAxisStyleTextRotate > -1){
				$("#chart-y-text-rotate-range").attr("value",yAxisStyleTextRotate).val(yAxisStyleTextRotate);
				$("#chart-y-text-rotate-text").attr("value",yAxisStyleTextRotate).val(yAxisStyleTextRotate);
			}//end if(yAxisStyleTextRotate != null)
		};
    	
        return {
        	init:init,
        	getStyle:getStyle,
        	getContainer:getContainer,
        	setHeight:setHeight
        };
    })();


    return EChartAreaMultiStyle;
});