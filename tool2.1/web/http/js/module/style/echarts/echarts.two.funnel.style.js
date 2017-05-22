/**
 * echart漏斗图样式调整
 *
 * Created by HWLUO on 2016/5/10.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/echarts/echarts.two.funnel.html.tpl");
    var inputHtml = "<input type=\"color\" class=\"form-control\" style=\"width:45px;\" value=\"#ffffff\" />";


    /**
     *
     */
    var EChartTwoFunnelStyle = (function(){
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
         * 重新绑定颜色选择
         */
        var reBindColorSelect = function(chartObj,objConfig){
            if(!chartObj || !objConfig){
                return ;
            }
            var m = 2;
            //添加饼的颜色
            var currentColors = $.extend([],chartObj.currentColors || []);
            var colorsLength = currentColors.length;

            for(var j=0;j<m;j++){
                $("#chart-pie-color-container-"+j).html("");

                //若已经修改过配色，直接显示配色的
                if(_style.color && _style.color.length > 0){
                    //表示没有新增数据
                    if(_style.color.length >= colorsLength){
                        //修改数据长度
                        _style.color.length = colorsLength;
                        for(var c=0,cLen=colorsLength/m;c<cLen;c++){

                            //添加新的颜色
                            $(inputHtml).attr("id","chart-pie-color-select-"+j+c).val(_style.color[c+j*colorsLength/2])
                                .appendTo($("#chart-pie-color-container-"+j));
                        }
                    }else{
                        //有新增的数据
                        for(var d=0,dLen=_style.color.length;d<dLen;d++){
                            //添加新的颜色
                            $(inputHtml).attr("id","chart-pie-color-select-"+d).val(_style.color[d])
                                .appendTo($("#chart-pie-color-container-"+j));
                        }

                        var index = _style.color.length;
                        for(var e=index,eLen=colorsLength;e<eLen;e++){
                            //添加新的颜色
                            var cc = currentColors[e%colorsLength];
                            //添加新的颜色
                            $(inputHtml).attr("id","chart-pie-color-select-"+e).val(cc)
                                .appendTo($("#chart-pie-color-container"+j));
                            //添加新的
                            _style.color.push(cc);
                        }
                    }
                }else{
                    for(var i = 0; i<colorsLength/m;i++){
                        //添加新的颜色
                        $(inputHtml).attr("id","chart-pie-color-select-"+j+i).val(currentColors[i+j*colorsLength/2])
                            .appendTo($("#chart-pie-color-container-"+j));
                    }
                }//end if(_style.color && _style.color.length > 0) else

                //动态绑定饼颜色
                $("#chart-pie-color-container-"+j).off("change",">input");
                $("#chart-pie-color-container-"+j).on("change",">input",function(){

                    var colorArr = [];
                    //找到所有的颜色
                    var $inputs = $("#chart-pie-color-container-0").find(">input");
                    $inputs.each(function(i,o){
                        var c = $(o).val();
                        if(c && c != ""){
                            colorArr.push($(o).val());
                        }
                    });
                    var $inputs = $("#chart-pie-color-container-1").find(">input");
                    $inputs.each(function(i,o){
                        var c = $(o).val();
                        if(c && c != ""){
                            colorArr.push($(o).val());
                        }
                    });

                    objConfig["option"] = _style = $.extend(true,_style,{
                        color:colorArr
                    });
                    chartObj.init(objConfig);
                });
            }

            //$("#chart-pie-color-container-"+0).on("change",">input",function(){
            //
            //    var colorArr = [];
            //    //找到所有的颜色
            //    var $inputs = $("#chart-pie-color-container-"+0).find(">input");
            //    $inputs.each(function(i,o){
            //        var c = $(o).val();
            //        if(c && c != ""){
            //            colorArr.push($(o).val());
            //        }
            //    });
            //    var $inputs = $("#chart-pie-color-container-"+1).find(">input");
            //    $inputs.each(function(i,o){
            //        var c = $(o).val();
            //        if(c && c != ""){
            //            colorArr.push($(o).val());
            //        }
            //    });
            //
            //    objConfig["option"] = _style = $.extend(true,_style,{
            //        color:colorArr
            //    });
            //    chartObj.init(objConfig);
            //});
            //$("#chart-pie-color-container-"+1).on("change",">input",function(){
            //
            //    var colorArr = [];
            //    //找到所有的颜色
            //    var $inputs = $("#chart-pie-color-container-"+0).find(">input");
            //    $inputs.each(function(i,o){
            //        var c = $(o).val();
            //        if(c && c != ""){
            //            colorArr.push($(o).val());
            //        }
            //    });
            //    var $inputs = $("#chart-pie-color-container-"+1).find(">input");
            //    $inputs.each(function(i,o){
            //        var c = $(o).val();
            //        if(c && c != ""){
            //            colorArr.push($(o).val());
            //        }
            //    });
            //
            //    objConfig["option"] = _style = $.extend(true,_style,{
            //        color:colorArr
            //    });
            //    chartObj.init(objConfig);
            //});


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

                    //重新绑定颜色选择
                    reBindColorSelect(chartObj,objConfig);

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
                                    "label":{
                                        "normal":{
                                            "show":isShow
                                        }
                                    }
                                },
                                {
                                    "label":{
                                        "normal":{
                                            "show":isShow
                                        }
                                    }
                                }
							]
						});
						chartObj.init(objConfig);
					});

					//选择外漏斗字体颜色
					$("#chart1-font-color-select").change(function(){
						var color = $(this).val();
						var color2 = $("#chart2-font-color-select").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
                                {
                                    "label":{
                                        "normal":{
                                            "textStyle": {
                                                "color":color
                                            }
                                        }
                                    }
                                },{
                                    "label":{
                                        "normal":{
                                            "textStyle": {
                                                "color":color2
                                            }
                                        }
                                    }
                                }
							]
						});
						chartObj.init(objConfig);
					});

					//选择内漏斗字体颜色
					$("#chart2-font-color-select").change(function(){
						var color = $(this).val();
						var color1 = $("#chart1-font-color-select").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
                                {
                                    "label":{
                                        "normal":{
                                            "textStyle": {
                                                "color":color1
                                            }
                                        }
                                    }
                                },{
                                    "label":{
                                        "normal":{
                                            "textStyle": {
                                                "color":color
                                            }
                                        }
                                    }
                                }
							]
						});
						chartObj.init(objConfig);
					});

					//选择外漏斗字体大小
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

					//选择内漏斗字体大小
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
                                }, {
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

					//选择外漏斗字体位置
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

					//选择内漏斗字体位置
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

					//选择漏斗线条颜色
					$("#chart1-line-color-select").change(function(){
						var color = $(this).val();
						var color2 = $("#chart2-line-color-select").val();
						objConfig["option"] = _style = $.extend(true, _style, {
							series:[
								{
									"itemStyle":{
										"normal":{
											"borderColor":color
										}
									}
								},{
									"itemStyle":{
										"normal":{
											"borderColor":color2
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

                    //选择漏斗线条颜色
                    $("#chart2-line-color-select").change(function(){
                        var color = $(this).val();
                        var color1 = $("#chart1-line-color-select").val();
                        objConfig["option"] = _style = $.extend(true, _style, {
                            series:[
                                {
                                    "itemStyle":{
                                        "normal":{
                                            "borderColor":color1
                                        }
                                    }
                                },{
                                    "itemStyle":{
                                        "normal":{
                                            "borderColor":color
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //选择外漏斗边框宽
                    $("#chart1-line-width-range").change(function(){
                        var size = $(this).val();
                        var size2 = $("#chart2-line-width-range").val();

                        //设置值
                        $("#chart1-line-width-text").val(size);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "itemStyle": {
                                        "normal": {
                                            "borderWidth":size
                                        }
                                    }
                                },{
                                    "itemStyle": {
                                        "normal": {
                                            "borderWidth":size2
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //选择内漏斗边框宽
                    $("#chart2-line-width-range").change(function(){
                        var size = $(this).val();
                        var size1 = $("#chart1-line-width-range").val();

                        //设置值
                        $("#chart2-line-width-text").val(size);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "itemStyle": {
                                        "normal": {
                                            "borderWidth":size1
                                        }
                                    }
                                },{
                                    "itemStyle": {
                                        "normal": {
                                            "borderWidth":size
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

					//改变标题
					$("input[id='chart-name']").change(function(){
						var val=$(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							"title" :{
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
			var series = _style.series;
			if(series){
				//编辑漏斗图标签设置
				var seriesStyle= $.extend(true,{},{series:[
					{
						"label":{
							"normal":{
								"position":null,
								"show":true,
								"textStyle": {
									"color":null,
									"fontSize": -1
								}
							}
						},
						"itemStyle":{
							"normal":{
								"borderColor":"#fff",
								"borderWidth":1
							}
						}
					},{
						"label":{
							"normal":{
								"position":null,
								"show":true,
								"textStyle": {
									"color":null,
									"fontSize": -1
								}
							}
						},
						"itemStyle":{
							"normal":{
								"borderColor":"#fff",
								"borderWidth":2
							}
						}
					}
				]},{
					series:series
				});

				//边框宽度
				var lineWidthStyle1 = seriesStyle.series[0].itemStyle.normal.borderWidth;
				if(lineWidthStyle1 > -1){
					$("#chart1-line-width-range").attr("value",lineWidthStyle1).val(lineWidthStyle1);
					$("#chart1-line-width-text").attr("value",lineWidthStyle1).val(lineWidthStyle1);
				}
				var lineWidthStyle2 = seriesStyle.series[1].itemStyle.normal.borderWidth;
				if(lineWidthStyle2 > -1){
					$("#chart2-line-width-range").attr("value",lineWidthStyle2).val(lineWidthStyle2);
					$("#chart2-line-width-text").attr("value",lineWidthStyle2).val(lineWidthStyle2);
				}
                //漏斗边框颜色
                var lineColorStyle1 = seriesStyle.series[0].itemStyle.normal.borderColor;
                if(lineColorStyle1 != null){
                    $("#chart1-line-color-select").attr("value",lineColorStyle1);
                    var $parent =  $("#chart1-line-color-select").parent("div");
                    //保证控件刷新
                    $parent.html($parent.html());
                }

                var lineColorStyle2 = seriesStyle.series[1].itemStyle.normal.borderColor;
                if(lineColorStyle2 != null){
                    $("#chart2-line-color-select").attr("value",lineColorStyle2);
                    var $parent =  $("#chart2-line-color-select").parent("div");
                    //保证控件刷新
                    $parent.html($parent.html());
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
                //控制标签位置
				var textStylePosition1 = seriesStyle.series[0].label.normal.position;
				if(textStylePosition1 != null){
					var radioId = "chart1-font-position-radio-";
					switch(textStylePosition1){
						case "left":
							radioId = radioId + "1";
							break;
						case "inside":
							radioId = radioId + "2";
							break;
						case "right":
							radioId = radioId + "3";
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
                        case "left":
                            radioId = radioId + "1";
                            break;
                        case "inside":
                            radioId = radioId + "2";
                            break;
                        case "right":
                            radioId = radioId + "3";
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
		};

        return {
        	init:init,
        	getStyle:getStyle,
        	getContainer:getContainer,
        	setHeight:setHeight,
            reBindColorSelect:reBindColorSelect
        };
    })();


    return EChartTwoFunnelStyle;
});