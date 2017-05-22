/**
 * highcharts3D饼图
 *
 * Created by HWLUO 2016/05/16
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/highcharts/highcharts.gradient.pie.single.html.tpl");
	
    /**
     *
     */
    var EChart3dPieStyle = (function(){
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

                    //修改图的深度
                    $("#chart-3dpie-depth-range").change(function(){
                        var depth = $(this).val();
                        //设置值
                        $("#chart-3dpie-depth-text").val(depth);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            plotOptions:{
                                pie: {
                                    depth: depth
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
                                backgroundColor: color
                            }
                        });
                        chartObj.init(objConfig);
                    });

                    //是否切换至双饼图
                    $("#chart-show-3dDoublePie-check").change(function(){
                        var isShow = $(this).is(":checked");
                        var size = 0;
                        if(isShow) {
                            size =120;
                        }
                        objConfig["option"] = _style = $.extend(true,_style,{
                            plotOptions:{
                                pie:{
                                    innerSize:size
                                }
                            }
                        });
                        chartObj.init(objConfig);
                    });

                    //是否允许单个扇形选择
                    $("#chart-show-3dPie-select-check").change(function(){
                        var isShow = $(this).is(":checked");
                        objConfig["option"] = _style = $.extend(true,_style,{
                            plotOptions:{
                                pie:{
                                    allowPointSelect:isShow
                                }
                            }
                        });
                        chartObj.init(objConfig);
                    });

                    //是否显示标签
                    $("#chart-show-label-check").change(function(){
                        var isShow = $(this).is(":checked");
                        //控制是否可以修改图例文字颜色
                        $("#chart-label-color-select").attr("disabled",!isShow);
                        $("#chart-label-size-range").attr("disabled",!isShow);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            plotOptions: {
                                pie: {
                                    dataLabels: {
                                        enabled: isShow
                                    }
                                }
                            }
                        });
                        chartObj.init(objConfig);
                    });
                    //标签字体颜色
                    $("#chart-label-color-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            plotOptions: {
                                pie: {
                                    dataLabels: {
                                        style:{
                                            color: color
                                        }
                                    }
                                }
                            }
                        });
                        chartObj.init(objConfig);
                    });
                    //标签字体大小
                    $("#chart-label-size-range").change(function(){
                        var fontsize = $(this).val();
                        $("#chart-label-size-text").val(fontsize);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            plotOptions: {
                                pie: {
                                    dataLabels: {
                                        style:{
                                            fontSize: fontsize
                                        }
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
        /**
         * 设置高度
         * @param height
         */
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
                var pieAngleStyle = $.extend(true,{},{
                    chart:{
                        backgroundColor: null, //背景颜色
                        options3d: {
                            alpha: -1,
                            beta: -1
                        }
                    }
                },{
                    chart:_style.chart || []
                });
                var pieAngleStyleAlpha = pieAngleStyle.chart.options3d.alpha;
                if(pieAngleStyleAlpha > -1){
                    $("#chart-chart-alpha-range").attr("value",pieAngleStyleAlpha).val(pieAngleStyleAlpha);
                    $("#chart-chart-alpha-text").attr("value",pieAngleStyleAlpha).val(pieAngleStyleAlpha);
                }
                var pieAngleStyleBeta = pieAngleStyle.chart.options3d.beta;
                if(pieAngleStyleBeta > -1){
                    $("#chart-chart-beta-range").attr("value",pieAngleStyleBeta).val(pieAngleStyleBeta);
                    $("#chart-chart-beta-text").attr("value",pieAngleStyleBeta).val(pieAngleStyleBeta);
                }
                var pieAlgleStyleBackgroundColor = pieAngleStyle.chart.backgroundColor;
                if(pieAlgleStyleBackgroundColor != null) {
                    $("#chart-background-color-select").attr("value",pieAlgleStyleBackgroundColor).val(pieAlgleStyleBackgroundColor);
                    var $pieAlgleStyleBackgroundColorParent =  $("#chart-background-color-select").parent("div");
                    $pieAlgleStyleBackgroundColorParent.html($pieAlgleStyleBackgroundColorParent.html());
                    //保证控件刷新
                }
            }
            if(_style.plotOptions) {
                var pieDepthStyle = $.extend(true,{},{
                    plotOptions: {
                        pie: {
                            innerSize:0, //双饼图
                            allowPointSelect: true,  //允许选择
                            depth: -1, //饼厚度
                            dataLabels: {
                                enabled: true, //是否显示标签
                                style:{
                                    fontSize: -1,  //标签字体大小
                                    color: null  //标签字体颜色
                                }
                            }
                        }
                    }
                },{
                    plotOptions:_style.plotOptions || []
                });
                var pieDepthStyleDepth = pieDepthStyle.plotOptions.pie.depth;
                if(pieDepthStyleDepth > -1) {
                    $("#chart-3dpie-depth-range").attr("value",pieDepthStyleDepth).val(pieDepthStyleDepth);
                    $("#chart-3dpie-depth-text").attr("value",pieDepthStyleDepth).val(pieDepthStyleDepth);
                }
                if(pieDepthStyle.plotOptions.pie.allowPointSelect === false) {
                    $("#chart-show-3dPie-select-check").attr("checked",false);
                }
                if(pieDepthStyle.plotOptions.pie.dataLabels.enabled === false) {
                    $("#chart-show-label-check").attr("checked",false);

                    //控制是否可以修改
                    $("#chart-label-color-select").attr("disabled",true);
                    $("#chart-label-size-range").attr("disabled",true);
                }
                var pieDepthStyleFontSize = pieDepthStyle.plotOptions.pie.dataLabels.style.fontSize;
                if(pieDepthStyleFontSize > -1) {
                    $("#chart-label-size-range").attr("value",pieDepthStyleFontSize).val(pieDepthStyleFontSize);
                    $("#chart-label-size-text").attr("value",pieDepthStyleFontSize).val(pieDepthStyleFontSize);
                }
                var pieDepthStyleColor = pieDepthStyle.plotOptions.pie.dataLabels.style.color;
                if(pieDepthStyleColor != null) {
                    $("#chart-label-color-select").attr("value",pieDepthStyleColor).val(pieDepthStyleColor);
                    var $pieDepthStyleColorParent =  $("#chart-label-color-select").parent("div");
                    $pieDepthStyleColorParent.html($pieDepthStyleColorParent.html());
                    //保证控件刷新
                }
                //双饼图
                var pieDepthStyleInnerSize = $("#chart-show-3dDoublePie-check").val("checked");
                //var pieDepthStyleInnerSizeNum = pieDepthStyle.plotOptions.pie.innerSize;
                if(pieDepthStyleInnerSize){
                    $("#chart-show-3dDoublePie-check").attr("checked",true);
                    //pieDepthStyleInnerSizeNum = 120;
                }else {
                    $("#chart-show-3dDoublePie-check").attr("checked",false);
                }
            }
            if(_style.legend) {
                var pieLegendStyle = $.extend(true,{},{
                    legend:{
                        enabled:true,
                        align:null,
                        itemStyle: {
                            color: null
                        }
                    }
                },{
                    legend:_style.legend || []
                });
                if(pieLegendStyle.legend.enabled === false) {
                    $("#chart-show-legend-check").attr("checked",false);

                    //控制是否可以修改
                    $("#chart-legend-color-select").attr("disabled",true);
                    $("input[name='legend-position-radio']").attr("disabled",true);
                }
                var pieLegendStylePosition = pieLegendStyle.legend.align;
                if(pieLegendStylePosition != null){
                    var radioId = "chart-font-position-radio-";
                    switch(pieLegendStylePosition){
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
                var pieLegendStyleColor = pieLegendStyle.legend.itemStyle.color;
                if(pieLegendStyleColor != null){
                    $("#chart-legend-color-select").attr("value",pieLegendStyleColor).val(pieLegendStyleColor);
                    var $pieLegendStyleColorParent =  $("#chart-legend-color-select").parent("div");
                    //保证控件刷新
                    $pieLegendStyleColorParent.html($pieLegendStyleColorParent.html());
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


    return EChart3dPieStyle;
});