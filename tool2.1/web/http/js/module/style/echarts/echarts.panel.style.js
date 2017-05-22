/**
 * echart柱形折线图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/echarts/echarts.panel.html.tpl");
    /**
     *
     */
    var EChartBarLineStyle = (function(){
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

					//修改半径大小
					$("#chart-radius-range").change(function(){
						var radius = $(this).val();
						//设置值
						$("#chart-radius-text").val(radius);
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									radius : radius+'%'
								}
							]
						});
						chartObj.init(objConfig);
					});

					//修改刻度
					$("#chart-splitNum-range").change(function(){
						var split = $(this).val();
						//设置值
						$("#chart-splitNum-text").val(split);
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"splitNumber" : split
								}
							]
						});
						chartObj.init(objConfig);
					});

					//修改量程
					$("#chart-max-range").change(function(){
						var max = $(this).val();
						//设置值
						$("#chart-max-text").val(max);
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									max : max
								}
							]
						});
						chartObj.init(objConfig);
					});


					//修改背景颜色
					$("#chart-backgroundColor-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							"backgroundColor":color
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
            //保存编辑背景颜色
            if(_style.backgroundColor) {
                var piePanelStyle = $.extend(true,{},{
                    backgroundColor: null //背景颜色
                },{
                    backgroundColor:_style.backgroundColor || []
                });

                var piePanelStyleBackgroundColor = piePanelStyle.backgroundColor;
                if(piePanelStyleBackgroundColor != null) {
                    $("#chart-backgroundColor-select").attr("value",piePanelStyleBackgroundColor).val(piePanelStyleBackgroundColor);
                    var $piePanelStyleBackgroundColorParent =  $("#chart-backgroundColor-select").parent("div");
                    $piePanelStyleBackgroundColorParent.html($piePanelStyleBackgroundColorParent.html());
                    //保证控件刷新
                }
            }
            //保存半径，刻度，量程编辑
            var series = _style.series;
            if(series && series[0]){
                //样式
                var seriesStyle= $.extend(true,{},{series:[
                    {
                        "radius": null, //半径
                        "splitNumber": -1, //刻度
                        "max": -1 //量程
                    }
                ]},{
                    series:series
                });
                //半径
                var radius = seriesStyle.series[0].radius;
                if(radius != null){
                    var r = radius;
                    if(typeof r == "string"){
                        r = r.replace("%","");
                    }
                    $("#chart-radius-range").attr("value",r).val(r);
                    $("#chart-radius-text").attr("value",r).val(r);
                }
                //量程
                var max = seriesStyle.series[0].max;
                if(max > -1){
                    $("#chart-max-range").attr("value",max).val(max);
                    $("#chart-max-text").attr("value",max).val(max);
                }
                //刻度
                var splitNum = seriesStyle.series[0].splitNumber;
                if(splitNum > -1){
                    $("#chart-splitNum-range").attr("value",splitNum).val(splitNum);
                    $("#chart-splitNum-text").attr("value",splitNum).val(splitNum);
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


    return EChartBarLineStyle;
});