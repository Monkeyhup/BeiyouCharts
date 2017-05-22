/**
 * echart散点图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/echarts/echarts.scatter.html.tpl");
	var inputHtml = "<input type=\"color\" class=\"form-control\" style=\"width:45px;\" value=\"#ffffff\" />";
	var selectHtml = "<select class=\"form-control\" style=\"width:80px;margin-right:5px;\">"
			+"<option value=\"circle\" selected>圆</option>"
			+"<option value=\"rectangle\">矩形</option>"
			+"<option value=\"triangle\">三角形</option>"
			+"<option value=\"pin\">标注</option>"
			+"<option value=\"droplet\">水滴</option>"
			+"<option value=\"heart\">心形</option>"
			+"<option value=\"star\">星星</option>"
			+"<option value=\"emptyCircle\">空心圆</option>"
			+"<option value=\"arrow\">箭头</option>"
		+"</select>";
	
    /**
     *
     */
    var EChartScatterStyle = (function(){
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
         * 重新绑定散点标记图
         */
        var reBindSymbolSelect = function(chartObj,objConfig){
        	if(!chartObj || !objConfig){
        		return ;
        	}
        	
        	$("#chart-scatter-symbol-container").html("");
        	//添加散点的颜色
	    	var currentSymbols = $.extend([],chartObj.currentSymbols || []);
	    	var symbolLength = currentSymbols.length;
	    	
	    	//若已经修改过图标，直接显示图标的
	    	if(_style.series && _style.series.length > 0 && _style.series[0].symbol){
        		//表示没有新增数据
        		if(_style.series.length >= symbolLength){
        			//修改数据长度
        			_style.series.length = symbolLength;
        			for(var c=0,cLen=symbolLength;c<cLen;c++){
        				//添加新的标记图
        	    		$(selectHtml).attr("id","chart-scatter-symbol-select-"+c).val(_style.series[c].symbol)
        	    			.appendTo($("#chart-scatter-symbol-container"));
            		}
        		}else{
        			//有新增的数据
        			for(var d=0,dLen=_style.series.length;d<dLen;d++){
        				//添加新的标记图
        	    		$(selectHtml).attr("id","chart-scatter-symbol-select-"+d).val(_style.series[d].symbol)
        	    			.appendTo($("#chart-scatter-symbol-container"));
            		}
        			
        			var index = _style.series.length;
        			for(var e=index,eLen=symbolLength;e<eLen;e++){
        				//添加新的标记图
    					var cc = currentSymbols[e%symbolLength];
    					//添加新的标记图
        	    		$(selectHtml).attr("id","chart-scatter-symbol-select-"+e).val(cc)
        	    			.appendTo($("#chart-scatter-symbol-container"));
	    	    		//添加新的
        	    		var newSymbol = $.extend(true,{},_style.series[0] || {},{
        	    			 "symbol":cc
        	    		});
	    	    		_style.series.push(newSymbol);
        			}
        		}
	    	}else{
		    	for(var i = 0; i<symbolLength;i++){
		    		//添加新的标记图
		    		$(selectHtml).attr("id","chart-scatter-symbol-select-"+i).val(currentSymbols[i])
		    			.appendTo($("#chart-scatter-symbol-container"));
				}
	    	}
	    	
        	//动态绑定标记图
        	$("#chart-scatter-symbol-container").off("change",">select");
	    	$("#chart-scatter-symbol-container").on("change",">select",function(){
	    		
	    		var serierArr = [];
	    		//找到所有的颜色
	    		var $inputs = $("#chart-scatter-symbol-container").find(">select");
	    		$inputs.each(function(i,o){
	    			var c = $(o).val();
	    			if(c && c != ""){
	    				serierArr.push({
    	    				"symbol":$(o).val()
    	    			});
	    			}
	    		});
	    		
	    		objConfig["option"] = _style = $.extend(true,_style,{
	    			series:serierArr
	    		});
	    		chartObj.init(objConfig);
	    	});
        };
        
        /**
         * 重新绑定颜色选择
         */
        var reBindColorSelect = function(chartObj,objConfig){
        	if(!chartObj || !objConfig){
        		return ;
        	}
        	
        	$("#chart-scatter-color-container").html("");
        	//添加散点的颜色
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
        	    		$(inputHtml).attr("id","chart-scatter-color-select-"+c).val(_style.color[c])
        	    			.appendTo($("#chart-scatter-color-container"));
            		}
        		}else{
        			//有新增的数据
        			for(var d=0,dLen=_style.color.length;d<dLen;d++){
        				//添加新的颜色
        	    		$(inputHtml).attr("id","chart-scatter-color-select-"+d).val(_style.color[d])
        	    			.appendTo($("#chart-scatter-color-container"));
            		}
        			
        			var index = _style.color.length;
        			for(var e=index,eLen=colorsLength;e<eLen;e++){
        				//添加新的颜色
    					var cc = currentColors[e%colorsLength];
    					//添加新的颜色
        	    		$(inputHtml).attr("id","chart-scatter-color-select-"+e).val(cc)
        	    			.appendTo($("#chart-scatter-color-container"));
	    	    		//添加新的
	    	    		_style.color.push(cc);
        			}
        		}
        	}else{
    			for(var i = 0; i<colorsLength;i++){
    	    		//添加新的颜色
    	    		$(inputHtml).attr("id","chart-scatter-color-select-"+i).val(currentColors[i])
    	    			.appendTo($("#chart-scatter-color-container"));
    			}
        	}//end if(_style.color && _style.color.length > 0) else
	    	
        	//动态绑定饼颜色
        	$("#chart-scatter-color-container").off("change",">input");
	    	$("#chart-scatter-color-container").on("change",">input",function(){
	    		
	    		var colorArr = [];
	    		//找到所有的颜色
	    		var $inputs = $("#chart-scatter-color-container").find(">input");
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
	    	
	    	//重新绑定散点标记图
	    	reBindSymbolSelect(chartObj,objConfig);
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

					//设置小标记的大小
					$("#chart-chart-symbol-size-range").change(function(){
						var size = $(this).val();
						size = parseInt(size);

						//设置值
						$("#chart-chart-symbol-size-text").val(size);

						var series = [];
						var seriesLen = chartObj.option.series.length;
						for(var i=0;i<seriesLen;i++){
							series.push({
								symbolSize:size
							});
						}

						objConfig["option"] = _style = $.extend(true,_style,{
							series:series
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

					//图列颜色
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
						"symbolSize":-1
					}
				]},{
					series:series
				});

				var symbolSize = seriesStyle.series[0].symbolSize;
				if(symbolSize > -1){
					$("#chart-chart-symbol-size-range").attr("value",symbolSize).val(symbolSize);
					$("#chart-chart-symbol-size-text").attr("value",symbolSize).val(symbolSize);
				}
			}//end if(series && series[0])

			//是否显示图列
			var legendShow = (_style.legend && _style.legend.show === false) ? false :true;
			if(!legendShow){
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
						}
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


    return EChartScatterStyle;
});