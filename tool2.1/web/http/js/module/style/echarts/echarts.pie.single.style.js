/**
 * echart单一饼图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/echarts/echarts.pie.single.html.tpl");
	var inputHtml = "<input type=\"color\" class=\"form-control\" style=\"width:45px;\" value=\"#ffffff\" />";
	
    /**
     *
     */
    var EChartPieSingleStyle = (function(){
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
        	
        	$("#chart-pie-color-container").html("");
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
        	    		$(inputHtml).attr("id","chart-pie-color-select-"+c).val(_style.color[c])
        	    			.appendTo($("#chart-pie-color-container"));
            		}
        		}else{
        			//有新增的数据
        			for(var d=0,dLen=_style.color.length;d<dLen;d++){
        				//添加新的颜色
        	    		$(inputHtml).attr("id","chart-pie-color-select-"+d).val(_style.color[d])
        	    			.appendTo($("#chart-pie-color-container"));
            		}
        			
        			var index = _style.color.length;
        			for(var e=index,eLen=colorsLength;e<eLen;e++){
        				//添加新的颜色
    					var cc = currentColors[e%colorsLength];
    					//添加新的颜色
        	    		$(inputHtml).attr("id","chart-pie-color-select-"+e).val(cc)
        	    			.appendTo($("#chart-pie-color-container"));
	    	    		//添加新的
	    	    		_style.color.push(cc);
        			}
        		}
        	}else{
    			for(var i = 0; i<colorsLength;i++){
    	    		//添加新的颜色
    	    		$(inputHtml).attr("id","chart-pie-color-select-"+i).val(currentColors[i])
    	    			.appendTo($("#chart-pie-color-container"));
    			}
        	}//end if(_style.color && _style.color.length > 0) else
        	
	    	//动态绑定饼颜色
        	$("#chart-pie-color-container").off("change",">input");
	    	$("#chart-pie-color-container").on("change",">input",function(){
	    		
	    		var colorArr = [];
	    		//找到所有的颜色
	    		var $inputs = $("#chart-pie-color-container").find(">input");
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

					//圆饼半径(内)
					$("#chart-pie-r-inner-range").change(function(){
						var r1 = $(this).val();
						var r2 = $("#chart-pie-r-outter-range").val();

						//设置值
						$("#chart-pie-r-inner-text").val(r1);
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									radius : [r1+'%', r2+'%']
								}
							]
						});
						chartObj.init(objConfig);
					});

					//圆饼半径(内)
					$("#chart-pie-r-outter-range").change(function(){
						var r1 = $("#chart-pie-r-inner-range").val();
						var r2 = $(this).val();

						//设置值
						$("#chart-pie-r-outter-text").val(r2);
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									radius : [r1+'%', r2+'%']
								}
							]
						});
						chartObj.init(objConfig);
					});

					//重新绑定颜色选择
					reBindColorSelect(chartObj,objConfig);


					//是否显示图列
					$("#chart-show-legend-check").change(function(){
						var isShow = $(this).is(":checked");

						objConfig["option"] = _style = $.extend(true,_style,{
							legend:{
								show:isShow
							}
						});
						chartObj.init(objConfig);
					});

					//是否显示标签
					$("#chart-show-label-check").change(function(){
						var isShow = $(this).is(":checked");

						//控制是否可以修改
						$("#chart-font-color-select").attr("disabled",!isShow);
						$("#chart-font-size-range").attr("disabled",!isShow);
						$("input[name='chart-font-position-radio']").attr("disabled",!isShow);

						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"itemStyle": {
										"normal": {
											"label": {
												"show":isShow
											},
											"labelLine": {
												"show":isShow
											}
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体大小
					$("#chart-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-font-size-text").val(size);
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
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体位置
					$("input[name='chart-font-position-radio']").click(function(){
						var position = $(this).val();

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
			if(series && series[0]){
				//样式
				var seriesStyle= $.extend(true,{},{series:[
					{
						"radius": [null,null],
						"itemStyle": {
							"normal": {
								"label": {
									"show":true,
									"textStyle": {
										"fontSize": -1
									}
								}
							}
						}
					}
				]},{
					series:series
				});

				var radius = seriesStyle.series[0].radius;
				if(radius[0] != null){
					var r = radius[0];
					if(typeof r == "string"){
						r = r.replace("%","");
					}
					$("#chart-pie-r-inner-range").attr("value",r).val(r);
					$("#chart-pie-r-inner-text").attr("value",r).val(r);
				}
				if(radius[1] != null){
					var r = radius[1];
					if(typeof r == "string"){
						r = r.replace("%","");
					}
					$("#chart-pie-r-outter-range").attr("value",r).val(r);
					$("#chart-pie-r-outter-text").attr("value",r).val(r);
				}

				//是否显示标签
				var textStyle= seriesStyle.series[0].itemStyle.normal.label.show === false;
				if(textStyle){
					$("#chart-show-label-check").attr("checked",false);

					//控制是否可以修改
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
						case "inside":
							radioId = radioId + "2";
							break;
						case "insideLeft":
							radioId = radioId + "3";
							break;
						case "insideRight":
							radioId = radioId + "4";
							break;
					}
					$("input[name='chart-font-position-radio']").removeAttr("checked");
					$("input#"+radioId).attr("checked",true);
					var $span = $("input#"+radioId).parent(".input-group-addon");
					$span.html($span.html());
				}
				var textStyleFontSize = seriesStyle.series[0].itemStyle.normal.label.textStyle.fontSize;
				if(textStyleFontSize > -1){
					$("#chart-font-size-range").attr("value",textStyleFontSize).val(textStyleFontSize);
					$("#chart-font-size-text").attr("value",textStyleFontSize).val(textStyleFontSize);
				}

			}//end if(series && series[0])

			//是否显示图列
			var legendShow = (_style.legend && _style.legend.show === false) ? false :true;
			if(!legendShow){
				$("#chart-show-legend-check").attr("checked",false);
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


    return EChartPieSingleStyle;
});