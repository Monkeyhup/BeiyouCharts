/**
 * d3钻取图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/d3/d3.bar.drill.html.tpl");
	
	
    /**
     *
     */
    var D3BarDrillStyle = (function(){
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
				//默认选择（chart.d3）
				seajs.use("chart.d3",function(hanlder){
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
					$("#chart-d3-height-range").change(function(){
						var height = $(this).val();
						//设置值
						$("#chart-d3-height-text").val(height);

						_container["height"] = height;
						objConfig["h"] = height;
						chartObj.init(objConfig);
					});

					//修改图的宽度
					$("#chart-d3-width-range").change(function(){
						var width = $(this).val();
						//设置值
						$("#chart-d3-width-text").val(width);

						_container["width"] = width;
						objConfig["w"] = width;
						chartObj.init(objConfig);
					});

					//修改文字宽度
					$("#chart-d3-text-width-range").change(function(){
						var width = $(this).val();
						width = parseInt(width);

						//设置值
						$("#chart-d3-text-width-text").val(width);

						objConfig["config"] = _style = $.extend(true,_style,{
							textWidth:width
						});
						chartObj.init(objConfig);
					});

					//修改文字旋转角度
					$("#chart-d3-textRotate-range").change(function(){
						var rotate = $(this).val();
						rotate = parseInt(rotate);

						//设置值
						$("#chart-d3-textRotate-text").val(rotate);

						objConfig["config"] = _style = $.extend(true,_style,{
							textRotate:rotate
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

		var setWidth = function(width){
			if(width && width > 0){
				_container["width"] = width;
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

			var currentStyle = $.extend(true,{
				"textWidth": -1,
				"textRotate": null
			},_style);

			var textWidth = currentStyle.textWidth;
			if(textWidth > -1){
				$("#chart-d3-text-width-range").attr("value",textWidth).val(textWidth);
				$("#chart-d3-text-width-text").attr("value",textWidth).val(textWidth);
			}

			var textRotate = currentStyle.textRotate;
			if(textRotate != null){
				$("#chart-d3-textRotate-range").attr("value",textRotate).val(textRotate);
				$("#chart-d3-textRotate-text").attr("value",textRotate).val(textRotate);
			}

		};
    	
        return {
        	init:init,
        	getStyle:getStyle,
        	getContainer:getContainer,
        	setHeight:setHeight,
			setWidth:setWidth
        };
    })();


    return D3BarDrillStyle;
});