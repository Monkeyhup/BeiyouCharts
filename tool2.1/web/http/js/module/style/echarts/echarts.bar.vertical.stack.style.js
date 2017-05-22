/**
 * echart对比柱图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/echarts/echarts.bar.vertical.stack.html.tpl");
    var inputHtml = "<input type=\"color\" class=\"form-control\" style=\"width:45px;\" value=\"#ffffff\" />";
	
    /**
     *
     */
    var EChartBarVerticalMultiStyle = (function(){
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

            $("#chart-bar-color-container").html("");
            //添加饼的颜色
            var currentColors = $.extend([],chartObj.currentColors || []);
            var colorsLength = currentColors.length;

            //若已经修改过配色，直接显示配色的
            if(_style.color && _style.color.length > 0){
                //表示没有新增数据
                if(_style.color.length >= colorsLength){
                    //修改数据长度
                    _style.color.length = colorsLength;
                    for(var c=0,cLen=colorsLength;c<cLen;c++){
                        //添加新的颜色
                        $(inputHtml).attr("id","chart-bar-color-select-"+c).val(_style.color[c])
                            .appendTo($("#chart-bar-color-container"));
                    }
                }else{
                    //有新增的数据
                    for(var d=0,dLen=_style.color.length;d<dLen;d++){
                        //添加新的颜色
                        $(inputHtml).attr("id","chart-bar-color-select-"+d).val(_style.color[d])
                            .appendTo($("#chart-bar-color-container"));
                    }

                    var index = _style.color.length;
                    for(var e=index,eLen=colorsLength;e<eLen;e++){
                        //添加新的颜色
                        var cc = currentColors[e%colorsLength];
                        //添加新的颜色
                        $(inputHtml).attr("id","chart-bar-color-select-"+e).val(cc)
                            .appendTo($("#chart-bar-color-container"));
                        //添加新的
                        _style.color.push(cc);
                    }
                }
            }else{
                for(var i = 0; i<colorsLength;i++){
                    //添加新的颜色
                    $(inputHtml).attr("id","chart-bar-color-select-"+i).val(currentColors[i])
                        .appendTo($("#chart-bar-color-container"));
                }
            }//end if(_style.color && _style.color.length > 0) else

            //动态绑定饼颜色
            $("#chart-bar-color-container").off("change",">input");
            $("#chart-bar-color-container").on("change",">input",function(){

                var colorArr = [];
                //找到所有的颜色
                var $inputs = $("#chart-bar-color-container").find(">input");
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

					//是否显示标签
					$("#chart-show-label-check").change(function(){
						var isShow = $(this).is(":checked");
						var series1 = new Array();
						for(i=0;i<chartObj.currentColors.length;i++){
							series1.push({
								"itemStyle": {
									"normal": {
										"label": {
											"show":isShow
										}
									}
								}
							});
						}

						objConfig["option"] = _style = $.extend(true,_style,{
							series:series1
						});
						chartObj.init(objConfig);
					});

                    //重新绑定颜色选择
                    reBindColorSelect(chartObj,objConfig);

					////柱1颜色
					//$("#chart1-bar-color-select").change(function(){
					//	var color = $(this).val();
					//	var color2 = $("#chart2-bar-color-select").val();
                    //
					//	objConfig["option"] = _style = $.extend(true,_style,{
					//		color:[color,color2]
					//	});
					//	chartObj.init(objConfig);
					//});
                    //
					////柱2颜色
					//$("#chart2-bar-color-select").change(function(){
					//	var color = $(this).val();
					//	var color1 = $("#chart1-bar-color-select").val();
                    //
					//	objConfig["option"] = _style = $.extend(true,_style,{
					//		color:[color1,color]
					//	});
					//	chartObj.init(objConfig);
					//});

					//选择上边框倒角大小
					$("#chart-bar-top-border-radius-range").change(function(){
						var size = $(this).val();
						size = parseInt(size);

						var bottomSize = $("#chart-bar-bottom-border-radius-range").val();
						bottomSize = parseInt(bottomSize);

						//设置值
						$("#chart-bar-top-border-radius-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							series :[
								{
									"itemStyle" : {
										"normal": {
											"barBorderRadius":[size,size,bottomSize,bottomSize]
										}
									}
								},{
									"itemStyle" : {
										"normal": {
											"barBorderRadius":[size,size,bottomSize,bottomSize]
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择下边框倒角大小
					$("#chart-bar-bottom-border-radius-range").change(function(){
						var size = $(this).val();
						size = parseInt(size);

						var topSize = $("#chart-bar-top-border-radius-range").val();
						topSize = parseInt(topSize);

						//设置值
						$("#chart-bar-bottom-border-radius-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							series :[
								{
									"itemStyle" : {
										"normal": {
											"barBorderRadius":[topSize,topSize,size,size]
										}
									}
								},{
									"itemStyle" : {
										"normal": {
											"barBorderRadius":[topSize,topSize,size,size]
										}
									}
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


					//选择字体1颜色
					$("#chart1-font-color-select").change(function(){
						var color = $(this).val();
						var color2 = $("#chart2-font-color-select").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"itemStyle": {
										"normal": {
											"label": {
												"textStyle": {
													"color":color
												}
											}
										}
									}
								},{
									"itemStyle": {
										"normal": {
											"label": {
												"textStyle": {
													"color":color2
												}
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
									"itemStyle": {
										"normal": {
											"label": {
												"textStyle": {
													"color":color1
												}
											}
										}
									}
								},{
									"itemStyle": {
										"normal": {
											"label": {
												"textStyle": {
													"color":color
												}
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
									"itemStyle": {
										"normal": {
											"label": {
												"textStyle": {
													"fontSize": size
												}
											}
										}
									}
								},{
									"itemStyle": {
										"normal": {
											"label": {
												"textStyle": {
													"fontSize": size2
												}
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
									"itemStyle": {
										"normal": {
											"label": {
												"textStyle": {
													"fontSize": size1
												}
											}
										}
									}
								},{
									"itemStyle": {
										"normal": {
											"label": {
												"textStyle": {
													"fontSize": size
												}
											}
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体位置
					$("input[name='chart1-font-position-radio']").click(function(){
						var position = $(this).val();
						var position2 = $("input[name='chart2-font-position-radio']:checked").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"itemStyle": {
										"normal": {
											"label": {
												"position": position
											}
										}
									}
								},{
									"itemStyle": {
										"normal": {
											"label": {
												"position": position2
											}
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体位置
					$("input[name='chart2-font-position-radio']").click(function(){
						var position = $(this).val();
						var position1 = $("input[name='chart1-font-position-radio']:checked").val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"itemStyle": {
										"normal": {
											"label": {
												"position": position1
											}
										}
									}
								},{
									"itemStyle": {
										"normal": {
											"label": {
												"position": position
											}
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

					// //x轴字体旋转角度
					$("#chart-x-text-rotate-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-x-text-rotate-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							xAxis : [
								{
									"axisLabel": {
										"rotate": size
									}
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

                    //改变标题
                    $("input[id='chart-name']").change(function(){
                        var val=$(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            "title" :{
                                text : val
                            }
                        });
                        chartObj.init(objConfig);

                    })
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
				var series1 = new Array();
				for(i=0;i<series.length;i++){
					series1.push({
						"itemStyle": {
							"normal": {
								"label": {
									"show":false,
									"position": null,
									"textStyle": {
										"color":null,
										"fontSize": -1
									}
								},
								"barBorderRadius":null
							}
						}
					});
				}
				var seriesStyle= $.extend(true,{},{series:series1},{
					series:series
				});

				//边框倒角
				var barBorderRadius = seriesStyle.series[0].itemStyle.normal.barBorderRadius;
				if(barBorderRadius != null){
					if(barBorderRadius[0] > 0){
						$("#chart-bar-top-border-radius-range").attr("value",barBorderRadius[0]).val(barBorderRadius[0]);
						$("#chart-bar-top-border-radius-text").attr("value",barBorderRadius[0]).val(barBorderRadius[0]);
					}

					if(barBorderRadius[2] > 0){
						$("#chart-bar-bottom-border-radius-range").attr("value",barBorderRadius[2]).val(barBorderRadius[2]);
						$("#chart-bar-bottom-border-radius-text").attr("value",barBorderRadius[2]).val(barBorderRadius[2]);
					}
				}

				//是否显示标签
				var textShowStyle = seriesStyle.series[0].itemStyle.normal.label.show === true;
				if(textShowStyle){
					$("#chart-show-label-check").attr("checked",true);
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
						case "inside":
							radioId = radioId + "5";
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
						case "inside":
							radioId = radioId + "5";
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

			//柱子颜色
			//var lineColorStyle = $.extend(true,{},{
			//	color:[null,null]
			//},{
			//	color:_style.color
			//});
			//if(lineColorStyle.color[0] != null){
			//	$("#chart1-bar-color-select").attr("value",lineColorStyle.color[0]);
			//	var $parent =  $("#chart1-bar-color-select").parent("div");
			//	//保证控件刷新
			//	$parent.html($parent.html());
			//}
			//if(lineColorStyle.color[1] != null){
			//	$("#chart2-bar-color-select").attr("value",lineColorStyle.color[1]);
			//	var $parent =  $("#chart2-bar-color-select").parent("div");
			//	//保证控件刷新
			//	$parent.html($parent.html());
			//}

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
        	setHeight:setHeight,
            reBindColorSelect:reBindColorSelect
        };
    })();


    return EChartBarVerticalMultiStyle;
});