/**
 * echart对比面积图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/echarts/echarts.area.multi-2.html.tpl");
	
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
					//y轴数值可调
					$("#chart-yaxis-change").change(function(){
						var text = $(this).val();

						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis:[
								{
									"min": text
								}
							]
						});
						chartObj.init(objConfig);
					});


					//面积1颜色
					$("#chart1-area-color-select").change(function(){
						var color = $(this).val();
						var color2 = $("#chart2-area-color-select").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							color:[color,color2]
						});
						chartObj.init(objConfig);
					});

					//面积2颜色
					$("#chart2-area-color-select").change(function(){
						var color = $(this).val();
						var color1 = $("#chart1-area-color-select").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							color:[color1,color]
						});
						chartObj.init(objConfig);
					});

					//面积1线宽度
					$("#chart1-area-width-range").change(function(){
						var width = $(this).val();
						var width2 = $("#chart2-area-width-range").val();
						$("#chart1-area-width-text").val(width);
						$("#chart2-area-width-text").val(width2);
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"lineStyle":{
										"normal":{
											width:width
										}
									}
								},{
									"lineStyle":{
										"normal":{
											width:width2
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//面积2线宽度
					$("#chart2-area-width-range").change(function(){
						var width = $(this).val();
						var width1 = $("#chart1-area-width-range").val();
						$("#chart2-area-width-text").val(width);
						$("#chart1-area-width-text").val(width1);
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"lineStyle":{
										"normal":{
											width:width1
										}
									}
								},{
									"lineStyle":{
										"normal":{
											width:width
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

                    //转折点样式
                    $("#select-point-style").change(function(){
                        var pointStyle=$(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    symbol:pointStyle
                                },{
                                    symbol:pointStyle
                                }
                            ]
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

					//是否显示标签
					$("#chart-show-label-check").change(function(){
						var isShow = $(this).is(":checked");

						//控制是否可以修改
						$("#chart1-font-color-select").attr("disabled",!isShow);
						$("#chart2-font-color-select").attr("disabled",!isShow);
						$("#chart1-font-size-range").attr("disabled",!isShow);
						$("#chart2-font-size-range").attr("disabled",!isShow);
						$("input[name='chart1-font-position-radio']").attr("disabled",!isShow);
						$("input[name='chart2-font-position-radio']").attr("disabled",!isShow);

						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"itemStyle": {
										"normal": {
											"label": {
												"show":isShow
											}
										}
									}
								},{
									"itemStyle": {
										"normal": {
											"label": {
												"show":isShow
											}
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体1颜色
					$("#chart1-font-color-select").change(function(){
						var color = $(this).val();
						var color2 = $("#chart2-font-color-select").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"label":{
										normal:{
											textStyle:{
												color:color
											}
										}
									}
								},{
									"label":{
										normal:{
											textStyle:{
												color:color2
											}
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体2颜色
					$("#chart2-font-color-select").change(function(){
						var color = $(this).val();
						var color1 = $("#chart1-font-color-select").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"label":{
										normal:{
											textStyle:{
												color:color1
											}
										}
									}
								},{
									"label":{
										normal:{
											textStyle:{
												color:color
											}
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体1大小
					$("#chart1-font-size-range").change(function(){
						var size = $(this).val();
						var size2 = $("#chart2-font-size-range").val();

						//设置值
						$("#chart1-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"label":{
										"normal":{
											"textStyle":{
												"fontSize":size
											}
										}
									}
								},{
									"label":{
										"normal":{
											"textStyle":{
												"fontSize":size2
											}
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体2大小
					$("#chart2-font-size-range").change(function(){
						var size = $(this).val();
						var size1 = $("#chart1-font-size-range").val();

						//设置值
						$("#chart2-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"label":{
										"normal":{
											"textStyle":{
												"fontSize":size1
											}
										}
									}
								},{
									"label":{
										"normal":{
											"textStyle":{
												"fontSize":size
											}
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体1位置
					$("input[name='chart1-font-position-radio']").click(function(){
						var position = $(this).val();
						var position2 = $("input[name='chart2-font-position-radio']:checked").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"label":{
										"normal":{
											"position":position
										}
									}
								},{
									"label":{
										"normal":{
											"position":position2
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体2位置
					$("input[name='chart2-font-position-radio']").click(function(){
						var position = $(this).val();
						var position1 = $("input[name='chart1-font-position-radio']:checked").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"label":{
										"normal":{
											"position":position1
										}
									}
								},{
									"label":{
										"normal":{
											"position":position
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//x轴位置
					$("input[name='chart-x-position-radio']").click(function(){
						var position = $(this).val();

						objConfig["option"] = _style = $.extend(true,_style,{
							xAxis: [
								{
									position: position
								}
							]
						});
						chartObj.init(objConfig);
					});

					//x轴颜色
					$("#chart-x-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							xAxis : [
								{
									"axisLine": {
										"lineStyle": {
											"color": color
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//x轴字体颜色
					$("#chart-x-font-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							xAxis : [
								{
									"axisLabel": {
										"textStyle": {
											"color": color
										},
										"show": false
									},
									"nameTextStyle": {
										"color": color
									},
									"isShowXAxisText" : true
								}
							]
						});
						chartObj.init(objConfig);
					});

					//x轴字体大小
					$("#chart-x-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-x-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							xAxis : [
								{
									"axisLabel": {
										"textStyle": {
											"fontSize": size
										},
										"show": false
									},
									"nameTextStyle": {
										"fontSize": size
									},
									"isShowXAxisText" : true
								}
							]
						});
						chartObj.init(objConfig);
					});

					//x轴字体旋转角度
					$("#chart-x-text-rotate-range").change(function(){
						var angle = $(this).val();

						//设置值
						$("#chart-x-text-rotate-text").val(angle);
						objConfig["option"] = _style = $.extend(true,_style,{
							xAxis : [
								{
									"axisLabel": {
										"show": false,
										"rotate": angle		//保存当前的x轴文字旋转角度
									},
									"isShowXAxisText":true
								}
							]
						});
						chartObj.init(objConfig);
					});
					//调整x轴字段高度
					$("#chart-textxy-color-container>.form-controlx").change(function(){
						var xmove = $(this).val();
						if(xmove != ""){
							objConfig["option"] = _style = $.extend(true,_style,{
								xAxis: [
									{
										positionOffset: {
											x:xmove
										}
									}
								]
							});
							chartObj.init(objConfig);
						}
					});

					$("#chart-textxy-color-container>.form-controly").change(function() {
						var ymove = $(this).val();
						if(ymove != ""){
							objConfig["option"] = _style = $.extend(true,_style,{
								xAxis: [
									{
										positionOffset: {
											y:ymove
										}
									}
								]
							});
							chartObj.init(objConfig);
						}
					});

					//y轴位置
					$("input[name='chart-y-position-radio']").click(function(){
						var position = $(this).val();

						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis: [
								{
									position: position
								}
							]
						});
						chartObj.init(objConfig);
					});

					//y轴颜色
					$("#chart-y-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis : [
								{
									"axisLine": {
										"lineStyle": {
											"color": color
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//y轴字体颜色
					$("#chart-y-font-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis : [
								{
									"axisLabel": {
										"textStyle": {
											"color": color
										}
									},
									"nameTextStyle": {
										"color": color
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//y轴字体大小
					$("#chart-y-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-y-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis : [
								{
									"axisLabel": {
										"textStyle": {
											"fontSize": size
										}
									},
									"nameTextStyle": {
										"fontSize": size
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//y轴字体旋转角度
					$("#chart-y-text-rotate-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-y-text-rotate-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis : [
								{
									"axisLabel": {
										"rotate": size
									}
								}
							]
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
                        "symbol":null,
						"itemStyle":{
							"normal":{
								width:-1
							}
						},
						"label":{
							"normal":{
								"show":true,
								"position":null,
								"textStyle":{
									"color":null,
									"fontSize":-1
								}
							}
						}
					},{
                        "symbol":null,
						"itemStyle":{
							"normal":{
								width:-1
							}
						},
						"label":{
							"normal":{
								"show":true,
								"position":null,
								"textStyle":{
									"color":null,
									"fontSize":-1
								}
							}
						}
					}
				]},{
					series:series
				});
                //曲线转折点形状
                var columnLinePlotStyleMarkerSymbol = seriesStyle.series[0].symbol;
                if(columnLinePlotStyleMarkerSymbol != null) {
                    var radioId = "chart-marker-symbol-radio-";
                    switch(columnLinePlotStyleMarkerSymbol){
                        case "diamond":
                            radioId = radioId + "1";
                            break;
                        case "rect":
                            radioId = radioId + "2";
                            break;
                        case "circle":
                            radioId = radioId + "3";
                            break;
                        case "triangle":
                            radioId = radioId + "4";
                            break;
                    }
                    $("option[name='chart-marker-symbol']").removeAttr("selected");
                    $("option#"+radioId).attr("selected",true);
                    var $span = $("option#"+radioId).parent(".input-group-addon");
                    $span.html($span.html());
                    //保证控件刷新
                }

				var lineWidthStyle1 = seriesStyle.series[0].itemStyle.normal.width;
				if(lineWidthStyle1 > -1){
					$("#chart1-area-width-range").attr("value",lineWidthStyle1).val(lineWidthStyle1);
					$("#chart1-area-width-text").attr("value",lineWidthStyle1).val(lineWidthStyle1);
				}
				var lineWidthStyle2 = seriesStyle.series[1].itemStyle.normal.width;
				if(lineWidthStyle2 > -1){
					$("#chart2-area-width-range").attr("value",lineWidthStyle2).val(lineWidthStyle2);
					$("#chart2-area-width-text").attr("value",lineWidthStyle2).val(lineWidthStyle2);
				}

				//是否显示标签
				var textShowStyle = seriesStyle.series[0].label.normal.show === false;
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
				var textStylePosition1 = seriesStyle.series[0].label.normal.position;
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
				var textStylePosition2 = seriesStyle.series[1].label.normal.position;
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
				var textStyleColor1 = seriesStyle.series[0].label.normal.textStyle.color;
				if(textStyleColor1 != null){
					$("#chart1-font-color-select").attr("value",textStyleColor1).val(textStyleColor1);
					var $textStyleColorParent =  $("#chart1-font-color-select").parent("div");
					//保证控件刷新
					$textStyleColorParent.html($textStyleColorParent.html());
				}
				var textStyleColor2 = seriesStyle.series[1].label.normal.textStyle.color;
				if(textStyleColor2 != null){
					$("#chart2-font-color-select").attr("value",textStyleColor2).val(textStyleColor2);
					var $textStyleColorParent =  $("#chart2-font-color-select").parent("div");
					//保证控件刷新
					$textStyleColorParent.html($textStyleColorParent.html());
				}
				var textStyleFontSize1 = seriesStyle.series[0].label.normal.textStyle.fontSize;
				if(textStyleFontSize1 > -1){
					$("#chart1-font-size-range").attr("value",textStyleFontSize1).val(textStyleFontSize1);
					$("#chart1-font-size-text").attr("value",textStyleFontSize1).val(textStyleFontSize1);
				}
				var textStyleFontSize2 = seriesStyle.series[1].label.normal.textStyle.fontSize;
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
						"min":-1,
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
			var yAxismin = yAxisStyle.yAxis[0].min;
			if(yAxismin!=-1 ){
				$("#chart-yaxis-change").attr("value",yAxismin);
				var $yAxismin =  $("#chart-yaxis-change").parent("div");
				//保证控件刷新
				$yAxismin.html($yAxismin.html());
			}
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