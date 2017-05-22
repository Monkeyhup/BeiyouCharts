/**
 * fusionchart旋转饼图样式调整
 *
 * Created by Linhao on 2015/9/14.
 * 图的半径大小
 * 是否显示图例
 * 标签线条
 *
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/fusioncharts/fusioncharts.pie.rotate.html.tpl");
	var inputHtml = "<input type=\"color\" class=\"form-control\" style=\"width:45px;\" value=\"#ffffff\" />";
	
    /**
     *
     */
    var FusionChartPieRotateStyle = (function(){
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
					dataSource:{
						"chart":{
							"smartLineColor":colorArr
						}
					}
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
				seajs.use("chart.fusioncharts",function(hanlder){
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
                    //修改饼图半径的大小
                    $("#chart-chart-pie-radius").change(function(){
                        var radius = $(this).val();
                        //设置值
                        $("#chart-chart-pie-radius-text").val(radius);

                        objConfig["option"] = _style = $.extend(true,_style,{
                            // dataSource:[
                            // 			{
                            // 				"pieRadius":radius
                            // 			}
                            // 		]
                            dataSource:{
								"chart":{
									"pieRadius":radius
								}
							}
                            	});
                        chartObj.init(objConfig);
                    });
					$("#chart-jiaodu-range").change(function(){
						var radius = $(this).val();
						//设置值
						$("#chart-jiaodu-text").val(radius);

						objConfig["option"] = _style = $.extend(true,_style,{
							// dataSource:[
							// 			{
							// 				"pieRadius":radius
							// 			}
							// 		]
							dataSource:{
								"chart":{
									"startingAngle":radius
								}
							}
						});
						chartObj.init(objConfig);
					});
					$("#chart-text-touming").change(function(){
						var radius = $(this).val();
						//设置值
						$("#chart-text-touming-text").val(radius);

						objConfig["option"] = _style = $.extend(true,_style,{
							// dataSource:[
							// 			{
							// 				"pieRadius":radius
							// 			}
							// 		]
							dataSource:{
								"chart":{
									"smartLineAlpha":radius
								}
							}
						});
						chartObj.init(objConfig);
					});
					$("#chart-chart-height-range").change(function(){
						var radius = $(this).val();
						//设置值
						$("#chart-chart-height-text").val(radius);

						objConfig["option"] = _style = $.extend(true,_style,{
							// dataSource:[
							// 			{
							// 				"pieRadius":radius
							// 			}
							// 		]
							height:radius
						});
						chartObj.init(objConfig);
					});
					$("#chart-slicing-distance").change(function(){
						var radius = $(this).val();
						//设置值
						$("#chart-slicing-distance-text").val(radius);

						objConfig["option"] = _style = $.extend(true,_style,{
							// dataSource:[
							// 			{
							// 				"pieRadius":radius
							// 			}
							// 		]
							dataSource:{
								"chart":{
									"smartLineThickness":radius
								}
							}
						});
						chartObj.init(objConfig);
					});
					//修改切片里中心距离的大小
					// $("#chart-slicing-distance").change(function(){
					// 	var d = $(this).val();
					// 	//设置值
					// 	$("#chart-slicing-distance-text").val(d);
                    //
					// 	objConfig["option"] = _style = $.extend(true,_style,{
					// 		// dataSource:[
					// 		// 			{
					// 		// 				"pieRadius":radius
					// 		// 			}
					// 		// 		]
					// 		dataSource:{
					// 			"chart":{
					// 				"slicingDistance": d
					// 			}
					// 		}
					// 	});
					// 	chartObj.init(objConfig);
					// });
					//修改图的半径大小
					// $("#chart-pie-r-inner-range").change(function(){
					// 	var r1 = $(this).val();
					// 	var r2 = $("#chart-pie-r-outter-range").val();
                    //
					// 	//设置值
					// 	$("#chart-pie-r-inner-text").val(r1);
					// 	objConfig["option"] = _style = $.extend(true,_style,{
					// 		series:[
					// 			{
					// 				radius : [r1+'%', r2+'%']
					// 			}
					// 		]
					// 	});
					// 	chartObj.init(objConfig);
					// });
                    //
					// //圆饼半径(内)
					// $("#chart-pie-r-outter-range").change(function(){
					// 	var r1 = $("#chart-pie-r-inner-range").val();
					// 	var r2 = $(this).val();
                    //
					// 	//设置值
					// 	$("#chart-pie-r-outter-text").val(r2);
					// 	objConfig["option"] = _style = $.extend(true,_style,{
					// 		series:[
					// 			{
					// 				radius : [r1+'%', r2+'%']
					// 			}
					// 		]
					// 	});
					// 	chartObj.init(objConfig);
					// });
                    //
					// //重新绑定颜色选择
					// reBindColorSelect(chartObj,objConfig);
                    //
                    //
                    // 是否显示图列

					$("#chart-show-legend-check").change(function(){
						var isShow = $(this).is(":checked");
						var ishow1 = 1;
						// 	//控制是否可以修改
						// 	$("#chart-font-color-select").attr("disabled",!isShow);
						// 	$("#chart-font-size-range").attr("disabled",!isShow);
						// 	$("input[name='chart-font-position-radio']").attr("disabled",!isShow);
						//
						if (isShow)
							ishow1 = 1;
						else
							ishow1 = 0;
						objConfig["option"] = _style = $.extend(true,_style,{
							dataSource:
							{
								"chart": {
									"showLegend":ishow1
								}
							}

						});
						chartObj.init(objConfig);
					});
					$("#chart-line-slant-check").change(function(){
						var isShow = $(this).is(":checked");
						var ishow1 = 1;
						// 	//控制是否可以修改
						// 	$("#chart-font-color-select").attr("disabled",!isShow);
						// 	$("#chart-font-size-range").attr("disabled",!isShow);
						// 	$("input[name='chart-font-position-radio']").attr("disabled",!isShow);
						//
						if (isShow)
							ishow1 = 1;
						else
							ishow1 = 0;
						objConfig["option"] = _style = $.extend(true,_style,{
							dataSource:
							{
								"chart": {
									"isSmartLineSlanted":ishow1
								}
							}

						});
						chartObj.init(objConfig);
					});
					$("#chart-show-yuanhuan-check").change(function(){
						var isShow = $(this).is(":checked");
						var ishow1 = 1;
						// 	//控制是否可以修改
						// 	$("#chart-font-color-select").attr("disabled",!isShow);
						// 	$("#chart-font-size-range").attr("disabled",!isShow);
						// 	$("input[name='chart-font-position-radio']").attr("disabled",!isShow);
						//
						if (isShow)
							ishow1 = 'doughnut2d';
						else
							ishow1 ='pie2d';
						objConfig["option"] = _style = $.extend(true,_style,{
						type:ishow1

						});
						chartObj.init(objConfig);
					});
					//是否显示3D光效果
					$("#chart-show-3d-check").change(function(){
						var isShow = $(this).is(":checked");
						var ishow1 = 1;
					// 	//控制是否可以修改
					// 	$("#chart-font-color-select").attr("disabled",!isShow);
					// 	$("#chart-font-size-range").attr("disabled",!isShow);
					// 	$("input[name='chart-font-position-radio']").attr("disabled",!isShow);
                    //
						if (isShow)
							ishow1 = 1;
						else
							ishow1 = 0;
						objConfig["option"] = _style = $.extend(true,_style,{
							dataSource:
								{
									"chart": {
										"use3DLighting":ishow1
									}
								}

						});
						chartObj.init(objConfig);
					});
					$("#chart-skip-overlap-check").change(function(){
						var isShow = $(this).is(":checked");
						var ishow1 = 1;
						// 	//控制是否可以修改
						// 	$("#chart-font-color-select").attr("disabled",!isShow);
						// 	$("#chart-font-size-range").attr("disabled",!isShow);
						// 	$("input[name='chart-font-position-radio']").attr("disabled",!isShow);
						//
						if (isShow)
							ishow1 = 1;
						else
							ishow1 = 0;
						objConfig["option"] = _style = $.extend(true,_style,{
							dataSource:
							{
								"chart": {
									"skipOverlapLabels":ishow1
								}
							}

						});
						chartObj.init(objConfig);
					});
					//是否显示3D光效果
					$("#chart-show-label-check").change(function(){
						var isShow = $(this).is(":checked");
						var ishow1 = 1;
						// 	//控制是否可以修改
						// 	$("#chart-font-color-select").attr("disabled",!isShow);
						// 	$("#chart-font-size-range").attr("disabled",!isShow);
						// 	$("input[name='chart-font-position-radio']").attr("disabled",!isShow);
						//
						if (isShow)
							ishow1 = 1;
						else
							ishow1 = 0;
						objConfig["option"] = _style = $.extend(true,_style,{
							dataSource:
							{
								"chart": {
									"enableSmartLabels":ishow1
								}
							}

						});
						chartObj.init(objConfig);
					});
					//是否显示百分比
					$("#chart-show-percent-check").change(function(){
						var isShow = $(this).is(":checked");
						var ishow1 = 1;
						// 	//控制是否可以修改
						// 	$("#chart-font-color-select").attr("disabled",!isShow);
						// 	$("#chart-font-size-range").attr("disabled",!isShow);
						// 	$("input[name='chart-font-position-radio']").attr("disabled",!isShow);
						//
						if (isShow)
							ishow1 = 1;
						else
							ishow1 = 0;
						objConfig["option"] = _style = $.extend(true,_style,{
							dataSource:
							{
								"chart": {
									"showPercentValues":ishow1
								}
							}

						});
						chartObj.init(objConfig);
					});
                    //
					// //选择字体大小
					// $("#chart-font-size-range").change(function(){
					// 	var size = $(this).val();
                    //
					// 	//设置值
					// 	$("#chart-font-size-text").val(size);
					// 	objConfig["option"] = _style = $.extend(true,_style,{
					// 		series:[
					// 			{
					// 				"itemStyle": {
					// 					"normal": {
					// 						"label": {
					// 							"textStyle": {
					// 								"fontSize": size
					// 							}
					// 						}
					// 					}
					// 				}
					// 			}
					// 		]
					// 	});
					// 	chartObj.init(objConfig);
					// });
                    //
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
                    //
					// //改变标题
					// $("input[id='chart-name']").change(function(){
					// 	var val=$(this).val();
					// 	objConfig["option"] = _style = $.extend(true,_style,{
					// 		"title" :{
					// 			text : val
					// 		}
					// 	})
					// 	chartObj.init(objConfig);
                    //
					// })
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
			var series = _style.dataSource;
			if(series && series[0]){
				//样式
				var seriesStyle= $.extend(true,{},{dataSource:
						{
							'chart':{
								"showLegend": 1
							}
						}
				},{
				dataSource:dataSource
				});



				var pieRadius= $.extend(true,{},{dataSource:
					{
						"chart":{
							"pieRadius":-1
						}
					}
				},{
					dataSource:dataSource
				});
				var r = pieRadius.dataSource[0].chart.pieRadius;
				if(r > -1){
					$("#chart-chart-pie-radius").attr("value",r).val(r);
					$("#chart-chart-pie-radius-text").attr("value",r).val(r);
				}
				var slicingDistance= $.extend(true,{},{dataSource:
				{
					"chart":{
						"slicingDistance":-1
					}
				}
				},{
					dataSource:dataSource
				});
				var d = slicingDistance.dataSource[0].chart.slicingDistance;
				if(d > -1){
					$("#chart-slicing-distance").attr("value",d).val(d);
					$("#chart-slicing-distance-text").attr("value",d).val(d);
				}





				var radius = dataSource.dataSource[0].pieRadius;
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

				//是否显示3D光效果
				var textStyle= seriesStyle.dataSource[0].chart.use3DLighting === 0;
				if(textStyle){
					$("#chart-show-3d-check").attr("checked",0);

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
			var legendShow = (_style.type && _style.type === 'pie2d') ? 'pie2d' :'doughnut2d';
			if( legendShow != 'doughnut2d'){
				$("#chart-show-legend-check").attr("checked",'pie2d');
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


    return FusionChartPieRotateStyle;
});