/**
 * d3对比图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/d3/d3.category.compare.html.tpl");
	var inputHtml = "<input type=\"color\" class=\"form-control\" style=\"width:45px;\" value=\"#ffffff\" />";
	
	var inputHtml2 = "<span class=\"input-group-addon\" style=\"width:auto;\">x方向偏移</span>"
		+"<input type=\"number\" class=\"form-control x\" style=\"width:80px;margin-right:20px;\" value=\"0\" />";
	var inputHtml3 = "<span class=\"input-group-addon\" style=\"width:auto;\">y方向偏移</span>"
			+"<input type=\"number\" class=\"form-control y\" style=\"width:80px;\" value=\"0\" />";
	
	var spanHtml = "<div class=\"input-group\">"+inputHtml2+inputHtml3+"</div>";
	
    /**
     *
     */
    var D3CategoryCompareStyle = (function(){
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
         * 重新绑定文字xy选择
         */
        var reBindTextXySelect = function(chartObj,objConfig){
        	if(!chartObj || !objConfig){
        		return ;
        	}
        	
        	$("#chart-bar-textxy-color-container").html("");
        	
        	//添加文本偏移
	    	var currentTextXYs = $.extend([],chartObj.currentTextXY || []);
	    	var currentTextXYLength = currentTextXYs.length;
        	
	    	//若已经修改过
        	if(_style.textXY && _style.textXY.length > 0){
        		//表示没有新增数据
        		if(_style.textXY.length >= currentTextXYLength){
        			//修改数据长度
        			_style.textXY.length = currentTextXYLength;
        			for(var c=0,cLen=currentTextXYLength;c<cLen;c++){
        	    		//添加新的
        	    		var $span = $(spanHtml).attr("id","chart-bar-textxy-"+c);
        	    		$span.find(">input.x").val(_style.textXY[c].x);
        	    		$span.find(">input.y").val(_style.textXY[c].y);
        	    		
        	    		$span.appendTo($("#chart-bar-textxy-color-container"));
            		}
        		}else{
        			//有新增的数据
        			for(var d=0,dLen=_style.textXY.length;d<dLen;d++){
        				//添加新的
        	    		var $span = $(spanHtml).attr("id","chart-bar-textxy-"+d);
        	    		$span.find(">input.x").val(_style.textXY[d].x);
        	    		$span.find(">input.y").val(_style.textXY[d].y);
        	    		
        	    		$span.appendTo($("#chart-bar-textxy-color-container"));
            		}
        			
        			var index = _style.textXY.length;
        			for(var e=index,eLen=currentTextXYLength;e<eLen;e++){
        				//添加新的颜色
    					var cc = currentTextXYs[e%colorsLength];
    					//添加新的
        	    		var $span = $(spanHtml).attr("id","chart-bar-textxy-"+e);
        	    		$span.find(">input.x").val(cc.x);
        	    		$span.find(">input.y").val(cc.y);
        	    		
        	    		$span.appendTo($("#chart-bar-textxy-color-container"));
        	    		
	    	    		//添加新的
	    	    		_style.textXY.push(cc);
        			}
        		}
        	}else{
    			for(var i = 0; i<currentTextXYLength;i++){
    	    		//添加新的
    	    		var $span = $(spanHtml).attr("id","chart-bar-textxy-"+i);
    	    		$span.find(">input.x").val(currentTextXYs[i].x);
    	    		$span.find(">input.y").val(currentTextXYs[i].y);
    	    		
    	    		$span.appendTo($("#chart-bar-textxy-color-container"));
    			}
        	}//end if(_style.color && _style.color.length > 0) else
        	
        	//动态绑定饼颜色
        	$("#chart-bar-textxy-color-container").off("change",">.input-group>input");
	    	$("#chart-bar-textxy-color-container").on("change",">.input-group>input",function(){
	    		
	    		var textXYs = [];
	    		//找到所有的颜色
	    		var $inputGroups = $("#chart-bar-textxy-color-container").find(">.input-group");
	    		$inputGroups.each(function(i,o){
	    			var $inputs = $(o).find(">input");
	    			var x = 0;
	    			var y = 0;
	    			$inputs.each(function(ii,oo){
	    				var isX = $(oo).hasClass("x");
	    				if(isX){
	    					x = parseFloat($(oo).val());
	    				}else{
	    					y = parseFloat($(oo).val());
	    				}
	    			});
    				textXYs.push({
    					x:x,
    					y:y
    				});
	    		});
	    		
	    		objConfig["config"] = _style = $.extend(true,_style,{
	    			textXY:textXYs
	    		});
	    		chartObj.init(objConfig);
	    	});
        };

        /**
         * 重新绑定颜色选择
         */
        var reBindColorSelect = function(chartObj,objConfig){
        	reBindTextXySelect(chartObj,objConfig);
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

					//是否显示tooltip
					$("#chart-isShowTooltip-check").change(function(){
						var isShow = $(this).is(":checked");

						if(isShow){
							$("#chart-isShowTooltipTitle-check").attr("disabled",false);
						}else{
							$("#chart-isShowTooltipTitle-check").attr("checked",false).attr("disabled",true);
						}

						var isChecked = $("#chart-isShowTooltipTitle-check").is(":checked");

						objConfig["config"] = _style = $.extend(true,_style,{
							isShowTooltip:isShow,
							isShowTooltipTitle:isChecked
						});
						chartObj.init(objConfig);
					});

					//tooltip是否显示标题
					$("#chart-isShowTooltipTitle-check").change(function(){
						var isShow = $(this).is(":checked");

						objConfig["config"] = _style = $.extend(true,_style,{
							isShowTooltipTitle:isShow
						});
						chartObj.init(objConfig);
					});

					//柱子颜色
					$("#chart-bar-color-select").change(function(){
						var color = $(this).val();

						objConfig["config"] = _style = $.extend(true,_style,{
							barColor:color
						});
						chartObj.init(objConfig);
					});

					//柱文字旋转角度
					$("#chart-d3-bar-textRotate-range").change(function(){
						var value = $(this).val();

						$("#chart-d3-bar-textRotate-text").val(value);

						objConfig["config"] = _style = $.extend(true,_style,{
							textRotate:value
						});
						chartObj.init(objConfig);
					});

					//重新绑定颜色选择
					reBindColorSelect(chartObj,objConfig);

					//饼的半径
					$("#chart-d3-r-range").change(function(){
						var r = $(this).val();
						r = parseInt(r);

						$("#chart-d3-r-text").val(r);

						objConfig["config"] = _style = $.extend(true,_style,{
							pieR:r
						});
						chartObj.init(objConfig);
					});


					//饼1颜色
					$("#chart-pie1-color-select").change(function(){
						var color = $(this).val();

						objConfig["config"] = _style = $.extend(true,_style,{
							pieColors:{
								compare1:color
							}
						});
						chartObj.init(objConfig);
					});

					//饼2颜色
					$("#chart-pie2-color-select").change(function(){
						var color = $(this).val();

						objConfig["config"] = _style = $.extend(true,_style,{
							pieColors:{
								compare2:color
							}
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
			var currentStyle = $.extend(true,{
				"barColor": null,
				"textRotate": null,
				"pieColors": {
					"compare1": null,
					"compare2": null
				},
				"pieR": -1,
				"isShowTooltip":true,
				"isShowTooltipTitle":true
			},_style);

			var barColor = currentStyle.barColor;
			if(barColor != null){
				$("#chart-bar-color-select").attr("value",barColor).val(barColor);
				var $parent = $("#chart-bar-color-select").parent("div");
				$parent.html($parent.html());
			}

			var textRotate = currentStyle.textRotate;
			if(textRotate != null){
				$("#chart-d3-bar-textRotate-range").attr("value",textRotate).val(textRotate);
				$("#chart-d3-bar-textRotate-text").attr("value",textRotate).val(textRotate);
			}
			var pieColorsCompare1 = currentStyle.pieColors.compare1;
			if(pieColorsCompare1 != null){
				$("#chart-pie1-color-select").attr("value",pieColorsCompare1).val(pieColorsCompare1);
				var $parent = $("#chart-pie1-color-select").parent("div");
				$parent.html($parent.html());
			}
			var pieColorsCompare2 = currentStyle.pieColors.compare2;
			if(pieColorsCompare2 != null){
				$("#chart-pie1-color-select").attr("value",pieColorsCompare2).val(pieColorsCompare2);
				var $parent = $("#chart-pie1-color-select").parent("div");
				$parent.html($parent.html());
			}
			var pieR = currentStyle.pieR;
			if(pieR > -1){
				$("#chart-d3-r-range").attr("value",pieR).val(pieR);
				$("#chart-d3-r-text").attr("value",pieR).val(pieR);
			}
			var pieR = currentStyle.pieR;
			if(pieR > -1){
				$("#chart-d3-r-range").attr("value",pieR).val(pieR);
				$("#chart-d3-r-text").attr("value",pieR).val(pieR);
			}
			var isShowTooltip = currentStyle.isShowTooltip === false;
			if(isShowTooltip){
				$("#chart-isShowTooltip-check").attr("checked",false);
				$("#chart-isShowTooltipTitle-check").attr("checked",false).attr("disabled",true);
			}else{
				$("#chart-isShowTooltip-check").attr("checked",true);
				$("#chart-isShowTooltipTitle-check").attr("disabled",false);
			}
			var isShowTooltipTitle = currentStyle.isShowTooltipTitle === false;
			if(isShowTooltipTitle){
				$("#chart-isShowTooltipTitle-check").attr("checked",false);
			}else{
				$("#chart-isShowTooltipTitle-check").attr("checked",true);
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


    return D3CategoryCompareStyle;
});