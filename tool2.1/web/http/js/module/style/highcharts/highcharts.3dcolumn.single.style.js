/**
 * highcharts单一面积图样式调整
 *
 * Created by lmy 2016.4.11
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/highcharts/highcharts.3dcolumn.single.html.tpl");
	
    /**
     *
     */
    var HighChartAreaSingleStyle = (function(){
        var _isInit = false;
    	var _style = {};
    	var _container = {};

		/**
		 * 初始化数据
		 * @param currentHanlder
		 * 			当前处理的对象（chart.highcharts.js
		 * 			或者chart.highcharts.edit.js的对象）
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
				//默认选择（chart.highcharts）
				seajs.use("chart.highcharts",function(hanlder){
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
					//修改图的alpha角度
					$("#chart-chart-alpha-range").change(function(){
						var alpha = $(this).val();
						//设置值
						$("#chart-chart-alpha-text").val(alpha);
						objConfig["option"] = _style = $.extend(true,_style,{
							chart: {
								options3d: {
								alpha: alpha
							}
							}

						});
						chartObj.init(objConfig);
					});
					//修改图的beta角度
					$("#chart-chart-beta-range").change(function(){
						var beta = $(this).val();
						//设置值
						$("#chart-chart-beta-text").val(beta);
						objConfig["option"] = _style = $.extend(true,_style,{
							chart: {
								options3d: {
									beta: beta
								}
							}
						});
						chartObj.init(objConfig);
					});
					//背景颜色
					$("#chart-background-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							chart:{
								backgroundColor: {
									stops: [
									[0, color],
									[1,color]
									]
								}
							}
						});
						chartObj.init(objConfig);
					});
					//背景颜色是否渐变
					$("#chart-is-background-color-check").change(function () {
						var isCheck=$(this).is(":checked");
						var begincolor=$("#chart-background-color-select").val();
						var endcolor=$("#chart-background-color-select").val();
					//控制是否可以修改图例文字颜色
						$("#chart-background-color-begin-select").attr("disabled",!isCheck);
						$("#chart-background-color-end-select").attr("disabled",!isCheck);
						$("#chart-background-color-select").attr("disabled",isCheck);
						$("#chart-background-color-begin-select").val(begincolor);
						$("#chart-background-color-end-select").val(endcolor);
						if(isCheck==false){
							var color=$("#chart-background-color-select").val();
							objConfig["option"] = _style = $.extend(true,_style,{
								chart: {
									backgroundColor: {
										stops: [
											[0,color],
											[1, color]
										]
									}
								}
							});
							chartObj.init(objConfig);
						}


					});

					//背景渐变初始颜色
					$("#chart-background-color-begin-select").change(function(){
						var begincolor=$(this).val();
						var endcolor=$("#chart-background-color-end-select").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							chart: {
								backgroundColor: {
									stops: [
										[0, begincolor],
										[1,endcolor]
									]
								}
							}
						});
						chartObj.init(objConfig);
					})
					//背景渐变终止颜色
					$("#chart-background-color-end-select").change(function(){
						var begincolor=$("#chart-background-color-begin-select").val();
						var endcolor=$(this).val();

						objConfig["option"] = _style = $.extend(true,_style,{
							chart: {
								backgroundColor: {
									stops: [
										[0,begincolor],
										[1, endcolor]
									]
								}
							}
						});
						chartObj.init(objConfig);
					})


					//柱颜色
					$("#chart-column-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							plotOptions:{
								column: {
									color:color
								}
							}
						});
						chartObj.init(objConfig);
					});

					//柱深度
					$("#chart-column-deth-range").change(function(){
						var width = $(this).val();
						$("#chart-area-width-text").val(width);
						objConfig["option"] = _style = $.extend(true,_style,{
							plotOptions:{
								column: {
									depth: width
								}
							}
						});
						chartObj.init(objConfig);
					});

					//是否显示图列
					$("#chart-show-legend-check").change(function(){
						var isShow = $(this).is(":checked");
						//控制是否可以修改图例文字颜色
						$("#chart-legend-color-select").attr("disabled",!isShow);
						$("input[name='legend-position-radio']").attr("disabled",!isShow);
						objConfig["option"] = _style = $.extend(true,_style,{
							legend:{
								enabled:isShow
							}
						});
						chartObj.init(objConfig);
					});
					//图例字体颜色
					$("#chart-legend-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							legend:{
								itemStyle: {
									color: color
								}
							}
						});
						chartObj.init(objConfig);
					});

					//选择图例位置
					$("input[name='legend-position-radio']").click(function(){
						var position = $(this).val();

						objConfig["option"] = _style = $.extend(true,_style,{
							legend:{
								align:position
							}
						});
						chartObj.init(objConfig);
					});


					//x轴是否显示网格
					$("input[name='chart-x-isgrid']").click(function(){
						var isShow = $(this).val();
						var color=$("#chart-x-grid-color-select").val();
						if(isShow=="true"){
							objConfig["option"] = _style = $.extend(true,_style,{
								xAxis:{
									gridLineWidth:1
								}

						});
							$("#chart-x-grid-color-select").attr("disabled",false);
							$("#selectGridStyle").attr("disabled",false);
						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								xAxis:{
									gridLineWidth:0
								}

							});
							$("#chart-x-grid-color-select").attr("disabled",true);
							$("#selectGridStyle").attr("disabled",true);
						}

						chartObj.init(objConfig);
					});

					//x轴网格线样式
					$("#selectGridStyle").change(function(){
						var gridStyle=$(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							xAxis:{
								gridLineDashStyle:gridStyle
							}
						});
						chartObj.init(objConfig);

					})
					//x轴网格颜色
					$("#chart-x-grid-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							xAxis:{
								gridLineColor:color

							}
						});
						chartObj.init(objConfig);
					});

					//x轴字体颜色
					$("#chart-x-font-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							xAxis : {
								labels:{
									style:{
										color:color

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
							xAxis : {
								labels: {
									style: {
										fontSize: size+"px",

									}
								}
							}
						});
						chartObj.init(objConfig);
					});

					//x轴字体加粗
					$("input[name='chart-x-font-isweight']").click(function(){
						var isShow = $(this).val();
						if(isShow=="true"){
							objConfig["option"] = _style = $.extend(true,_style,{
								xAxis:{
									labels:{
										style:{
											fontWeight:"bold"

										}
									}
								}

							});
						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								xAxis:{
									labels:{
										style:{
											fontWeight:"normal"

										}
									}
								}

							});
						}

						chartObj.init(objConfig);
					});

					/*//调整x轴字段高度
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
					});*/

					//y轴类型
					$("#selectYStyle").change(function(){
						var yStyle=$(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis:{
								type: yStyle
							}

						});
						chartObj.init(objConfig);

					})

					//y轴是否显示网格
					$("input[name='chart-y-isgrid']").click(function(){
						var isShow = $(this).val();
						if(isShow=="true"){
							objConfig["option"] = _style = $.extend(true,_style,{
								yAxis:{
									gridLineWidth:1
								}
							});
							$("#chart-y-grid-color-select").attr("disabled",false);
							$("#selectYGridStyle").attr("disabled",false);
						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								yAxis:{
									gridLineWidth:0
								}
							});
							$("#chart-y-grid-color-select").attr("disabled",true);
							$("#selectYGridStyle").attr("disabled",true);
						}

						chartObj.init(objConfig);
					});
					//y轴网格线样式
					$("#selectYGridStyle").change(function(){
						var gridStyle=$(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis:{
								gridLineDashStyle:gridStyle
							}
						});
						chartObj.init(objConfig);

					});
					//y轴网格颜色
					$("#chart-y-grid-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis:{
								gridLineColor:color

							}
						});
						chartObj.init(objConfig);
					});
					//y轴是否显示次级网格
					$("input[name='chart-y-issecondarygrid']").click(function(){
						var isShow = $(this).val();
						if(isShow=="true"){
							objConfig["option"] = _style = $.extend(true,_style,{
								yAxis:{
									minorTickInterval: 'auto'
								}

							});
							$("#chart-y-Secondarygrid-color-select").attr("disabled",false);
							$("#selectYSecondaryGridStyle").attr("disabled",false);

						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								yAxis:{
									minorTickInterval: ''
								}

							});
							$("#chart-y-Secondarygrid-color-select").attr("disabled",true);
							$("#selectYSecondaryGridStyle").attr("disabled",true);
						}

						chartObj.init(objConfig);
					});
					//y轴网格线样式
					$("#selectYSecondaryGridStyle").change(function(){
						var minorGridLineDashStyle=$(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis:{
								minorGridLineDashStyle:minorGridLineDashStyle
							}
						});
						chartObj.init(objConfig);

					});
					//y轴网格颜色
					$("#chart-y-Secondarygrid-color-select").change(function(){
						var minorGridLineColor = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis:{
								minorGridLineColor:minorGridLineColor

							}
						});
						chartObj.init(objConfig);
					});


					//y轴字体颜色
					$("#chart-y-font-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis : {
								labels:{
									style:{
										color:color

									}
								}
							}
						});
						chartObj.init(objConfig);
					});

					//y轴字体大小
					$("#chart-y-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-y-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis : {
								labels: {
									style: {
										fontSize: size+"px",

									}
								}
							}
						});
						chartObj.init(objConfig);
					});

					//y轴字体加粗
					$("input[name='chart-y-font-isweight']").click(function(){
						var isShow = $(this).val();
						if(isShow=="true"){
							objConfig["option"] = _style = $.extend(true,_style,{
								yAxis:{
									labels:{
										style:{
											fontWeight:"bold"

										}
									}
								}

							});
						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								yAxis:{
									labels:{
										style:{
											fontWeight:"normal"

										}
									}
								}

							});
						}

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
			if(series && series[0]){
				var seriesStyle= $.extend(true,{},{series:[
					{
						"itemStyle": {
							"normal": {
								"label": {
									"show":true,
									"position": null,
									"textStyle": {
										"color":null,
										"fontSize": -1
									}
								},
								"lineStyle": {
									width:-1
								}
							}
						}
					}
				]},{
					series:series
				});

				//面积宽度
				var w = seriesStyle.series[0].itemStyle.normal.lineStyle.width;
				if(w > -1){
					$("#chart-area-width-range").attr("value",w).val(w);
					$("#chart-area-width-text").attr("value",w).val(w);
				}

				//是否显示标签
				if(seriesStyle.series[0].itemStyle.normal.label.show === false){
					$("#chart-show-label-check").attr("checked",false);

					//控制是否可以修改
					$("#chart-font-color-select").attr("disabled",true);
					$("#chart-font-size-range").attr("disabled",true);
					$("input[name='chart-font-position-radio']").attr("disabled",true);
				}
				var textStylePosition = seriesStyle.series[0].itemStyle.normal.label.position;
				if(textStylePosition != null){
					var radioId = "chart-font-position-radio-";
					switch(textStylePosition){
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
					$("input[name='chart-font-position-radio']").removeAttr("checked");
					$("input#"+radioId).attr("checked",true);
					var $span = $("input#"+radioId).parent(".input-group-addon");
					$span.html($span.html());
				}
				var textStyleColor = seriesStyle.series[0].itemStyle.normal.label.textStyle.color;
				if(textStyleColor != null){
					$("#chart-font-color-select").attr("value",textStyleColor).val(textStyleColor);
					var $textStyleColorParent =  $("#chart-font-color-select").parent("div");
					//保证控件刷新
					$textStyleColorParent.html($textStyleColorParent.html());
				}
				var textStyleFontSize = seriesStyle.series[0].itemStyle.normal.label.textStyle.fontSize;
				if(textStyleFontSize > -1){
					$("#chart-font-size-range").attr("value",textStyleFontSize).val(textStyleFontSize);
					$("#chart-font-size-text").attr("value",textStyleFontSize).val(textStyleFontSize);
				}
			}//end if(series && series[0])

			//面积颜色
			var color = _style.color;
			if(color && color[0]){
				$("#chart-area-color-select").attr("value",color[0]);
				var $parent =  $("#chart-area-color-select").parent("div");
				//保证控件刷新
				$parent.html($parent.html());
			}

			//是否显示图列
			var legendShow = (_style.legend && _style.legend.show === false) ? false :true;
			if(!legendShow){
				//控制是否可以修改图例文字颜色
				$("#chart-show-legend-check").attr("checked",false);
				$("#chart-legend-color-select").attr("disabled",true);
			}

			//图列颜色
			var legendColor = $.extend(true,{},{
				legend:{
					textStyle:{
						color:null
					}
				}
			},{
				legend : _style.legend || {}
			});
			if(legendColor.legend.textStyle.color != null){
				$("#chart-legend-color-select").attr("value",legendColor.legend.textStyle.color);
				var $parent =  $("#chart-legend-color-select").parent("div");
				//保证控件刷新
				$parent.html($parent.html());
			}

			//x轴
            if(_style.xAxis) {
                var xAxisStyle = $.extend(true, {}, {
                    xAxis:
                        {
                            "gridLineDashStyle": null,
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
                                x: 0,
                                y: 0
                            },
                            "isShowXAxisText": false
                        }
                }, {
                    xAxis: _style.xAxis || []
                });
                //x轴网格样式
                var xAxisStyleGridLineStyle = xAxisStyle.xAxis.gridLineDashStyle;
                if (xAxisStyleGridLineStyle != null) {
                    var radioId = "chart-xAxis-radio-";
                    switch (xAxisStyleGridLineStyle) {
                        case "Solid":
                            radioId = radioId + "1";
                            break;
                        case "Dash":
                            radioId = radioId + "2";
                            break;
                        case "Dot":
                            radioId = radioId + "3";
                            break;
                        default :
                            radioId = radioId + "4";
                            break;
                    }
                    $("option[name='chart-xAxis-line']").removeAttr("selected");
                    $("option#" + radioId).attr("selected", true);
                    var $span = $("option#" + radioId).parent(".input-group-addon");
                    $span.html($span.html());
                    //保证控件刷新
                }
                var xAxisStylePosition = xAxisStyle.xAxis.position;
                if (xAxisStylePosition != null) {
                    var radioId = "chart-x-position-radio-";
                    switch (xAxisStylePosition) {
                        case "bottom":
                            radioId = radioId + "1";
                            break;
                        case "top":
                            radioId = radioId + "2";
                            break;
                    }
                    $("input[name='chart-x-position-radio']").removeAttr("checked");
                    $("input#" + radioId).attr("checked", true);
                    var $span = $("input#" + radioId).parent(".input-group-addon");
                    $span.html($span.html());
                }//end if(xAxisStylePosition != null)
                var xAxisStyleLineColor = xAxisStyle.xAxis.axisLine.lineStyle.color;
                if (xAxisStyleLineColor != null) {
                    $("#chart-x-color-select").attr("value", xAxisStyleLineColor);
                    var $xAxisStyleLineColorParent = $("#chart-x-color-select").parent("div");
                    //保证控件刷新
                    $xAxisStyleLineColorParent.html($xAxisStyleLineColorParent.html());
                }//end if(xAxisStyleLineColor != null)
                var xAxisStyleTextColor = xAxisStyle.xAxis.axisLabel.textStyle.color;
                if (xAxisStyleTextColor != null) {
                    $("#chart-x-font-color-select").attr("value", xAxisStyleTextColor);
                    var $xAxisStyleTextColorParent = $("#chart-x-font-color-select").parent("div");
                    //保证控件刷新
                    $xAxisStyleTextColorParent.html($xAxisStyleTextColorParent.html());
                }//end if(xAxisStyleTextColor != null)
                var xAxisStyleTextSize = xAxisStyle.xAxis.axisLabel.textStyle.fontSize;
                if (xAxisStyleTextSize > -1) {
                    $("#chart-x-font-size-range").attr("value", xAxisStyleTextSize).val(xAxisStyleTextSize);
                    $("#chart-x-font-size-text").attr("value", xAxisStyleTextSize).val(xAxisStyleTextSize);
                }//end if(xAxisStyleTextSize != null)
                var xAxisStyleTextRotate = xAxisStyle.xAxis.axisLabel.rotate;
                if (xAxisStyleTextRotate > -1) {
                    $("#chart-x-text-rotate-range").attr("value", xAxisStyleTextRotate).val(xAxisStyleTextRotate);
                    $("#chart-x-text-rotate-text").attr("value", xAxisStyleTextRotate).val(xAxisStyleTextRotate);
                }//end if(xAxisStyleTextRotate != null)
                var xAistTylePositionOffset = xAxisStyle.xAxis.positionOffset;
                if (xAistTylePositionOffset.x != "") {
                    $("#chart-textxy-color-container>.form-controlx").attr("value", xAistTylePositionOffset.x).val(xAistTylePositionOffset.x);
                }
                if (xAistTylePositionOffset.y != "") {
                    $("#chart-textxy-color-container>.form-controly").attr("value", xAistTylePositionOffset.y).val(xAistTylePositionOffset.y);
                }
            }
			//y轴
			var yAxisStyle = $.extend(true,{},{
				yAxis:{
                    "type": "linear",
                    "minorGridLineDashStyle":null,
                    "gridLineDashStyle": null,
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
            },{
				yAxis:_style.yAxis || []
			});
            var yAxisStyleminorGridLineDashStyleStyle = yAxisStyle.yAxis.minorGridLineDashStyle;
            if (yAxisStyleminorGridLineDashStyleStyle != null) {
                var radioId = "chart-yAxis-minorGridLineDashStyle-radio-";
                switch (yAxisStyleminorGridLineDashStyleStyle) {
                    case "Solid":
                        radioId = radioId + "1";
                        break;
                    case "Dash":
                        radioId = radioId + "2";
                        break;
                    case "Dot":
                        radioId = radioId + "3";
                        break;
                    default :
                        radioId = radioId + "4";
                        break;
                }
                $("option[name='chart-yAxis-minorGridLineDashStyle-line']").removeAttr("selected");
                $("option#" + radioId).attr("selected", true);
                var $span = $("option#" + radioId).parent(".input-group-addon");
                $span.html($span.html());
                //保证控件刷新
            }
            var yAxisStyleGridLineDashStyleStyle = yAxisStyle.yAxis.gridLineDashStyle;
            if (yAxisStyleGridLineDashStyleStyle != null) {
                var radioId = "chart-yAxis-GridLineDashStyle-radio-";
                switch (yAxisStyleGridLineDashStyleStyle) {
                    case "Solid":
                        radioId = radioId + "1";
                        break;
                    case "Dash":
                        radioId = radioId + "2";
                        break;
                    case "Dot":
                        radioId = radioId + "3";
                        break;
                    default :
                        radioId = radioId + "4";
                        break;
                }
                $("option[name='chart-yAxis-GridLineDashStyle-line']").removeAttr("selected");
                $("option#" + radioId).attr("selected", true);
                var $span = $("option#" + radioId).parent(".input-group-addon");
                $span.html($span.html());
                //保证控件刷新
            }
            var yAxisStyleTypeStyle = yAxisStyle.yAxis.type;
            if (yAxisStyleTypeStyle != null) {
                var radioId = "chart-yAxis-type-radio-";
                switch (yAxisStyleTypeStyle) {
                    case "linear":
                        radioId = radioId + "1";
                        break;
                    default :
                        radioId = radioId + "2";
                        break;
                }
                $("option[name='chart-yAxis-type-line']").removeAttr("selected");
                $("option#" + radioId).attr("selected", true);
                var $span = $("option#" + radioId).parent(".input-group-addon");
                $span.html($span.html());
                //保证控件刷新
            }
			var yAxisStylePosition = yAxisStyle.yAxis.position;
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
			var yAxisStyleLineColor = yAxisStyle.yAxis.axisLine.lineStyle.color;
			if(yAxisStyleLineColor != null){
				$("#chart-y-color-select").attr("value",yAxisStyleLineColor);
				var $yAxisStyleLineColorParent =  $("#chart-y-color-select").parent("div");
				//保证控件刷新
				$yAxisStyleLineColorParent.html($yAxisStyleLineColorParent.html());
			}//end if(yAxisStyleLineColor != null)
			var yAxisStyleTextColor = yAxisStyle.yAxis.axisLabel.textStyle.color;
			if(yAxisStyleTextColor != null){
				$("#chart-y-font-color-select").attr("value",yAxisStyleTextColor);
				var $yAxisStyleTextColorParent =  $("#chart-y-font-color-select").parent("div");
				//保证控件刷新
				$yAxisStyleTextColorParent.html($yAxisStyleTextColorParent.html());
			}//end if(yAxisStyleTextColor != null)
			var yAxisStyleTextSize = yAxisStyle.yAxis.axisLabel.textStyle.fontSize;
			if(yAxisStyleTextSize > -1){
				$("#chart-y-font-size-range").attr("value",yAxisStyleTextSize).val(yAxisStyleTextSize);
				$("#chart-y-font-size-text").attr("value",yAxisStyleTextSize).val(yAxisStyleTextSize);
			}//end if(yAxisStyleTextSize != null)
			var yAxisStyleTextRotate = yAxisStyle.yAxis.axisLabel.rotate;
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


    return HighChartAreaSingleStyle;
});