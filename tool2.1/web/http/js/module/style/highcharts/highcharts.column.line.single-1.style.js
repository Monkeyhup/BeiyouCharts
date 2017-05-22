/**
 * highcharts单一面积图样式调整
 *
 * Created by lmy 2016.4.11
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/highcharts/highcharts.column.line.single-1.html.tpl");
	
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
					//背景颜色
					$("#chart-background-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							chart:{
								backgroundColor: color
							}
						});
						chartObj.init(objConfig);
					});

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

                    //折线颜色
                    $("#chart-line-color-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            plotOptions:{
                                column:{
                                },
                                spline: {
                                    color: color
                                }
                            }
                        });
                        chartObj.init(objConfig);
                    });

                    //折线样式
                    $("#select-line-style").change(function(){
                        var lineStyle=$(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            plotOptions:{
                                column:{
                                },
                                spline: {
                                        dashStyle:lineStyle
                                }
                            }
                        });
                        chartObj.init(objConfig);
                    });
                    //转折点样式
                    $("#select-point-style").change(function(){
                        var pointStyle=$(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            plotOptions:{
                                column:{
                                },
                                spline: {
                                    marker:{
                                        symbol:pointStyle
                                    }
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
                        $("#chart-legend-lable-color-select").attr("disabled",!isShow);
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

                    //图例标签底色
                    $("#chart-legend-lable-color-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            legend:{
                                backgroundColor: color
                            }
                        });
                        chartObj.init(objConfig);
                    });

					//选择图例位置
					$("input[name='legend-position-radio']").click(function(){
						var position = $(this).val();
                        switch(position){
                            case "left":
                                objConfig["option"] = _style = $.extend(true,_style,{
                                    legend:{
                                        x:120,
                                        align:position
                                    }
                                });
                                break;
                            default :
                                objConfig["option"] = _style = $.extend(true,_style,{
                                    legend:{
                                        x: 0,
                                        align:position
                                    }
                                });
                        }
                        chartObj.init(objConfig);
					});


					//x轴是否显示网格
					$("input[name='chart-x-isgrid']").click(function(){
						var isShow = $(this).val();
						//var color=$("#chart-x-grid-color-select").val();
						if(isShow=="true"){
							objConfig["option"] = _style = $.extend(true,_style,{
								xAxis:{
									gridLineWidth:1
								}

						});
							$("#chart-x-grid-color-select").attr("disabled",false);
							$("#select-xAxis-style").attr("disabled",false);
						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								xAxis:{
									gridLineWidth:0
								}

							});
							$("#chart-x-grid-color-select").attr("disabled",true);
							$("#select-xAxis-style").attr("disabled",true);
						}

						chartObj.init(objConfig);
					});

					//x轴网格线样式
					$("#select-xAxis-style").change(function(){
						var gridStyle=$(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							xAxis:{
								gridLineDashStyle:gridStyle
							}
						});
						chartObj.init(objConfig);

					});

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
										fontSize: size+"px"
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

					//y轴是否显示网格
					$("input[name='chart-y-isgrid']").click(function(){
						var isShow = $(this).val();
						if(isShow=="true"){
							objConfig["option"] = _style = $.extend(true,_style,{
								yAxis:[
                                    {
                                        gridLineWidth:1
                                    },{
                                        gridLineWidth:1
                                    }
                                ]

							});
							$("#chart-y-grid-color-select").attr("disabled",false);
							$("#selectYGridStyle").attr("disabled",false);
						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								yAxis:[
                                    {
                                        gridLineWidth:0
                                    },{
                                        gridLineWidth:0
                                    }
                                ]
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
							yAxis:[
                                {
                                    gridLineDashStyle:gridStyle
                                },{
                                    gridLineDashStyle:gridStyle
                                }
                            ]
						});
						chartObj.init(objConfig);

					});
					//y轴网格颜色
					$("#chart-y-grid-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							yAxis:[
                                {
                                    gridLineColor:color
                                },{
                                    gridLineColor:color
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
                                    labels:{
                                        style:{
                                            color:color

                                        }
                                    }
                                },{
                                    labels:{
                                        style:{
                                            color:color

                                        }
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
							yAxis :[
                                {
                                    labels: {
                                        style: {
                                            fontSize: size+"px",

                                        }
                                    }
                                }, {
                                    labels: {
                                        style: {
                                            fontSize: size+"px",

                                        }
                                    }
                                }
                            ]
						});
						chartObj.init(objConfig);
					});

					//y轴字体加粗
					$("input[name='chart-y-font-isweight']").click(function(){
						var isShow = $(this).val();
						if(isShow=="true"){
							objConfig["option"] = _style = $.extend(true,_style,{
								yAxis:[
                                    {
                                        labels:{
                                            style:{
                                                fontWeight:"bold"

                                            }
                                        }
                                    },{
                                        labels:{
                                            style:{
                                                fontWeight:"bold"

                                            }
                                        }
                                    }
                                ]

							});
						}
						else{
							objConfig["option"] = _style = $.extend(true,_style,{
								yAxis:[
                                    {
                                        labels:{
                                            style:{
                                                fontWeight:"normal"

                                            }
                                        }
                                    },{
                                        labels:{
                                            style:{
                                                fontWeight:"normal"

                                            }
                                        }
                                    }
                                ]

							});
						}

						chartObj.init(objConfig);
					});

                    //改变标题
                    $("input[id='chart-name']").change(function(){
                        var val=$(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            title :{
                                text : val
                            }
                        })
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
            if(_style.chart){
                //保存编辑
                var columnLineStyle = $.extend(true,{},{
                    chart:{
                        backgroundColor: null//背景颜色
                    }
                },{
                    chart:_style.chart || []
                });
                var columnLineStyleBackgroundColor = columnLineStyle.chart.backgroundColor;
                if(columnLineStyleBackgroundColor != null) {
                    $("#chart-background-color-select").attr("value",columnLineStyleBackgroundColor).val(columnLineStyleBackgroundColor);
                    var $columnLineStyleBackgroundColorParent =  $("#chart-background-color-select").parent("div");
                    $columnLineStyleBackgroundColorParent.html($columnLineStyleBackgroundColorParent.html());
                    //保证控件刷新
                }
            }
            if(_style.plotOptions) {
                var columnLinePlotStyle = $.extend(true,{},{
                    plotOptions: {
                        column: {
                            color: null
                        },
                        spline: {
                            color: null,
                            dashStyle: null,
                            marker: {
                                symbol: null
                            }
                        }
                    }
                },{
                    plotOptions:_style.plotOptions || []
                });
                //柱形图颜色
                var columnLinePlotStyleColor = columnLinePlotStyle.plotOptions.column.color;
                if(columnLinePlotStyleColor != null) {
                    $("#chart-column-color-select").attr("value",columnLinePlotStyleColor).val(columnLinePlotStyleColor);
                    var $columnLinePlotStyleColorParent =  $("#chart-column-color-select").parent("div");
                    $columnLinePlotStyleColorParent.html($columnLinePlotStyleColorParent.html());
                    //保证控件刷新
                }
                //折线图颜色
                var columnLineStyleColor = columnLinePlotStyle.plotOptions.spline.color;
                if(columnLineStyleColor != null) {
                    $("#chart-line-color-select").attr("value",columnLineStyleColor).val(columnLineStyleColor);
                    var $columnLineStyleColorParent =  $("#chart-line-color-select").parent("div");
                    $columnLineStyleColorParent.html($columnLineStyleColorParent.html());
                    //保证控件刷新
                }

                //折线图线形
                var columnLinePlotStyleDashStyle = columnLinePlotStyle.plotOptions.spline.dashStyle;
                if(columnLinePlotStyleDashStyle != null) {
                    var radioId = "chart-dashStyle-radio-";
                    switch(columnLinePlotStyleDashStyle){
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
                    $("option[name='chart-dashStyle']").removeAttr("selected");
                    $("option#"+radioId).attr("selected",true);
                    var $span = $("option#"+radioId).parent(".input-group-addon");
                    $span.html($span.html());
                    //保证控件刷新
                }
                //折线图转折点形状
                var columnLinePlotStyleMarkerSymbol = columnLinePlotStyle.plotOptions.spline.marker.symbol;
                if(columnLinePlotStyleMarkerSymbol != null) {
                    var radioId = "chart-marker-symbol-radio-";
                    switch(columnLinePlotStyleMarkerSymbol){
                        case "circle":
                            radioId = radioId + "1";
                            break;
                        case "square":
                            radioId = radioId + "2";
                            break;
                        case "diamond":
                            radioId = radioId + "3";
                            break;
                        default :
                            radioId = radioId + "4";
                            break;
                    }
                    $("option[name='chart-marker-symbol']").removeAttr("selected");
                    $("option#"+radioId).attr("selected",true);
                    var $span = $("option#"+radioId).parent(".input-group-addon");
                    $span.html($span.html());
                    //保证控件刷新
                }

            }
            if(_style.legend) {
                var columnLineLegendStyle = $.extend(true,{},{
                    legend:{
                        enabled:true,
                        align:null,
                        backgroundColor: null,
                        itemStyle: {
                            color: null
                        }
                    }
                },{
                    legend:_style.legend || []
                });
                if(columnLineLegendStyle.legend.enabled === false) {
                    $("#chart-show-legend-check").attr("checked",false);

                    //控制是否可以修改
                    $("#chart-legend-color-select").attr("disabled",true);
                    $("#chart-legend-lable-color-select").attr("disabled",true);
                    $("input[name='legend-position-radio']").attr("disabled",true);
                }
                var columnLineLegendStylePosition = columnLineLegendStyle.legend.align;
                if(columnLineLegendStylePosition != null){
                    var radioId = "chart-font-position-radio-";
                    switch(columnLineLegendStylePosition){
                        case "left":
                            radioId = radioId + "1";
                            break;
                        case "center":
                            radioId = radioId + "2";
                            break;
                        case "right":
                            radioId = radioId + "3";
                            break;
                    }
                    $("input[name='legend-position-radio']").removeAttr("checked");
                    $("input#"+radioId).attr("checked",true);
                    var $span = $("input#"+radioId).parent(".input-group-addon");
                    $span.html($span.html());
                }
                var columnLineLegendStyleColor = columnLineLegendStyle.legend.itemStyle.color;
                if(columnLineLegendStyleColor != null){
                    $("#chart-legend-color-select").attr("value",columnLineLegendStyleColor).val(columnLineLegendStyleColor);
                    var $columnLineLegendStyleColorParent =  $("#chart-legend-color-select").parent("div");
                    //保证控件刷新
                    $columnLineLegendStyleColorParent.html($columnLineLegendStyleColorParent.html());
                }
                var columnLineLegendStyleBackgroundColor = columnLineLegendStyle.legend.backgroundColor;
                if(columnLineLegendStyleBackgroundColor != null){
                    $("#chart-legend-lable-color-select").attr("value",columnLineLegendStyleBackgroundColor).val(columnLineLegendStyleBackgroundColor);
                    var $columnLineLegendStyleBackgroundColorParent =  $("#chart-legend-lable-color-select").parent("div");
                    //保证控件刷新
                    $columnLineLegendStyleBackgroundColorParent.html($columnLineLegendStyleBackgroundColorParent.html());
                }
            }
            if(_style.xAxis) {
                var columnLinexAxisStyle = $.extend(true,{},{
                    xAxis:{
                        gridLineColor:null,
                        gridLineDashStyle:null,
                        gridLineWidth:null,
                        labels: {
                            style: {
                                color: null,
                                fontSize: -1,
                                fontWeight: null
                            }
                        }
                    }
                },{
                    xAxis:_style.xAxis || []
                });
                //x轴字体颜色
                var columnLinexAxisStyleColor = columnLinexAxisStyle.xAxis.labels.style.color;
                if(columnLinexAxisStyleColor != null){
                    $("#chart-x-font-color-select").attr("value",columnLinexAxisStyleColor).val(columnLinexAxisStyleColor);
                    var $columnLinexAxisStyleColorParent =  $("#chart-x-font-color-select").parent("div");
                    //保证控件刷新
                    $columnLinexAxisStyleColorParent.html($columnLinexAxisStyleColorParent.html());
                }
                //x轴字体大小
                var columnLinexAxisStyleTextSize = parseInt(columnLinexAxisStyle.xAxis.labels.style.fontSize);
                if(columnLinexAxisStyleTextSize > -1){
                    $("#chart-x-font-size-range").attr("value",columnLinexAxisStyleTextSize).val(columnLinexAxisStyleTextSize);
                    $("#chart-x-font-size-text").attr("value",columnLinexAxisStyleTextSize).val(columnLinexAxisStyleTextSize);
                }//end if(xAxisStyleTextSize != null)
                //x轴字体加粗
                var columnLinexAxisStyleFontWeight = columnLinexAxisStyle.xAxis.labels.style.fontWeight;
                if(columnLinexAxisStyleFontWeight == "bold") {
                    $("input[name='chart-x-font-isweight']").removeAttr("checked");
                    $("#chart-x-font-isweight-1").attr("checked",true);
                    var $span = $("#chart-x-font-isweight-1").parent(".input-group-addon");
                    $span.html($span.html());
                }else{
                    $("input[name='chart-x-font-isweight']").removeAttr("checked");
                    $("#chart-x-font-isweight-2").attr("checked",true);
                    var $span = $("#chart-x-font-isweight-2").parent(".input-group-addon");
                    $span.html($span.html());
                }
                //x轴网格样式
                var columnLinexAxisStyleGridLineColor = columnLinexAxisStyle.xAxis.gridLineDashStyle;
                if(columnLinexAxisStyleGridLineColor != null) {
                    var radioId = "chart-xAxis-radio-";
                    switch(columnLinexAxisStyleGridLineColor){
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
                    $("option#"+radioId).attr("selected",true);
                    var $span = $("option#"+radioId).parent(".input-group-addon");
                    $span.html($span.html());
                    //保证控件刷新
                }
                //x轴网格线条颜色
                var columnLinexAxisStyleColor = columnLinexAxisStyle.xAxis.gridLineColor;
                if(columnLinexAxisStyleColor != null){
                    $("#chart-x-grid-color-select").attr("value",columnLinexAxisStyleColor).val(columnLinexAxisStyleColor);
                    var $columnLinexAxisStyleColorParent =  $("#chart-x-grid-color-select").parent("div");
                    //保证控件刷新
                    $columnLinexAxisStyleColorParent.html($columnLinexAxisStyleColorParent.html());
                }
                //是否显示网格
                var columnLinexAxisStyleGridLineWidth = columnLinexAxisStyle.xAxis.gridLineWidth;
                if(columnLinexAxisStyleGridLineWidth == 1) {
                    $("#chart-x-grid-color-select").attr("disabled",false);
                    $("#select-xAxis-style").attr("disabled",false);
                    $("input[name='chart-x-isgrid']").removeAttr("checked");
                    $("#chart-x-isgrid-1").attr("checked",true);
                    var $span = $("#chart-x-isgrid-1").parent(".input-group-addon");
                    $span.html($span.html());
                }else{
                    $("#chart-x-grid-color-select").attr("disabled",true);
                    $("#select-xAxis-style").attr("disabled",true);
                    $("input[name='chart-x-isgrid']").removeAttr("checked");
                    $("#chart-x-isgrid-2").attr("checked",true);
                    var $span = $("#chart-x-isgrid-2").parent(".input-group-addon");
                    $span.html($span.html());
                }
            }
            if(_style.yAxis) {
                var columnLineyAxisStyle = $.extend(true,{},{
                    yAxis:[
                        {
                            gridLineColor:null,
                            gridLineDashStyle:null,
                            gridLineWidth:1,
                            labels: {
                                style: {
                                    color: null,
                                    fontSize: -1,
                                    fontWeight: null
                                }
                            }
                        },
                        {
                            gridLineColor:null,
                            gridLineDashStyle:null,
                            gridLineWidth:1,
                            labels: {
                                style: {
                                    color: null,
                                    fontSize: -1,
                                    fontWeight: null
                                }
                            }
                        }
                    ]
                },{
                    yAxis:_style.yAxis || []
                });

                //是否显示网格
                var columnLineyAxisStyleGridLineWidth = columnLineyAxisStyle.yAxis[0].gridLineWidth;
                if(columnLineyAxisStyleGridLineWidth == 1) {
                    $("input[name='chart-y-isgrid']").removeAttr("checked");
                    $("#chart-y-isgrid-1").attr("checked",true);
                    $("#chart-y-grid-color-select").attr("disabled",false);
                    $("#selectYGridStyle").attr("disabled",false);
                    var $span = $("#chart-y-isgrid-1").parent(".input-group-addon");
                    $span.html($span.html());
                }else{
                    $("input[name='chart-y-isgrid']").removeAttr("checked");
                    $("#chart-y-isgrid-2").attr("checked",true);
                    $("input#chart-y-grid-color-select").attr("disabled",true);
                    $("#selectYGridStyle").attr("disabled",true);
                    var $span = $("#chart-y-isgrid-2").parent(".input-group-addon");
                    $span.html($span.html());
                }

                //y轴网格线条颜色
                var columnLineyAxisStyleColor = columnLineyAxisStyle.yAxis[0].gridLineColor;
                if(columnLineyAxisStyleColor != null){
                    $("#chart-y-grid-color-select").attr("value",columnLineyAxisStyleColor).val(columnLineyAxisStyleColor);
                    var $columnLineyAxisStyleColorParent =  $("#chart-y-grid-color-select").parent("div");
                    //保证控件刷新
                    $columnLineyAxisStyleColorParent.html($columnLineyAxisStyleColorParent.html());
                }

                //y轴网格样式
                var columnLineyAxisStyleGridLineColor = columnLineyAxisStyle.yAxis[0].gridLineDashStyle;
                if(columnLineyAxisStyleGridLineColor != null) {
                    var radioId = "chart-yAxis-radio-";
                    switch(columnLineyAxisStyleGridLineColor){
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
                    $("option[name='chart-yAxis-line']").removeAttr("selected");
                    $("option#"+radioId).attr("selected",true);
                    var $span = $("option#"+radioId).parent(".input-group-addon");
                    $span.html($span.html());
                    //保证控件刷新
                }


                //y轴字体颜色
                var columnLineyAxisStyleColor = columnLineyAxisStyle.yAxis[0].labels.style.color;
                if(columnLineyAxisStyleColor != null){
                    $("#chart-y-font-color-select").attr("value",columnLineyAxisStyleColor).val(columnLineyAxisStyleColor);
                    var $columnLineyAxisStyleColorParent =  $("#chart-y-font-color-select").parent("div");
                    //保证控件刷新
                    $columnLineyAxisStyleColorParent.html($columnLineyAxisStyleColorParent.html());
                }
                //y轴字体大小
                var columnLineyAxisStyleTextSize = parseInt(columnLineyAxisStyle.yAxis[0].labels.style.fontSize);
                if(columnLineyAxisStyleTextSize > -1){
                    $("#chart-y-font-size-range").attr("value",columnLineyAxisStyleTextSize).val(columnLineyAxisStyleTextSize);
                    $("#chart-y-font-size-text").attr("value",columnLineyAxisStyleTextSize).val(columnLineyAxisStyleTextSize);
                }//end if(xAxisStyleTextSize != null)
                //y轴字体加粗
                var columnLineyAxisStyleFontWeight = columnLineyAxisStyle.yAxis[0].labels.style.fontWeight;
                if(columnLineyAxisStyleFontWeight == "bold") {
                    $("input[name='chart-y-font-isweight']").removeAttr("checked");
                    $("#chart-y-font-isweight-1").attr("checked",true);
                    var $span = $("#chart-y-font-isweight-1").parent(".input-group-addon");
                    $span.html($span.html());
                }else{
                    $("input[name='chart-y-font-isweight']").removeAttr("checked");
                    $("#chart-y-font-isweight-2").attr("checked",true);
                    var $span = $("#chart-y-font-isweight-2").parent(".input-group-addon");
                    $span.html($span.html());
                }

            }
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