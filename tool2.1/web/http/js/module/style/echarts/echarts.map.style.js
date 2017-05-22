/**
 * echart地图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/echarts/echarts.map.html.tpl");
	//var inputHtml = "<input type=\"color\" class=\"form-control\" style=\"width:45px;\" value=\"#ffffff\" />";

	/**
	 * 地图数据操作
	 */
	var MapDataHanlder = (function(){
		/**
		 * 获取文件路径
		 * @param _level
		 * @param _regionCode
		 */
		var getJsonFilePath = function (_level,_regionCode) {
			var paths = "";

			var basepath = "js/module/map/";

			_level = _level + "";
			switch (_level){
				case "1":	//国家(显示世界各国地图)
					paths = basepath+ "wd/" + "wd.json";
					break;
				case "2":	//省(显示地市)
					paths = basepath+ "sn/sn_" +_regionCode.substring(0,2)+".json";
					break;
				case "3":	//市(显示显示区县)
					paths = basepath + "sh/"+_regionCode.substring(0,2)+"/sh_" + _regionCode.substring(0,4) + ".json";
					break;
			}
			return paths;
		};

		return {
			getJsonFilePath:getJsonFilePath
		}
	})();

    /**
     *
     */
    var EChartMapStyle = (function(){
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
			initEventBind(currentHanlder,function(){
				_isInit = true;
				callback && callback();
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
		 * 重新初始化市一级下拉框
		 * @param snRegionLevel
		 * 			当前级别
		 * @param snRegionCode
		 * 			当前行政区划
		 * @param callback
		 * 			成功后回调
         */
		var reInitChartMapShDropdown = function(snRegionLevel,snRegionCode,callback){
			if(typeof snRegionCode == "undefined" || snRegionCode == null){
				var $ul = $("#chart-map-sh-dropdown >ul.dropdown-menu").html("");
				//选中第一个
				var $firstLi = $($ul.find(">li")[0]);
				callback && callback($firstLi);
			}else{
				var url = "js/module/config/echarts.map.template_"+snRegionCode+".config.json";
				$.getJSON(url,function(data){
					var $ul = $("#chart-map-sh-dropdown >ul.dropdown-menu").html("");
					for(var i= 0;i<data.length;i++){
						$("<li data-value=\""+data[i].value+"\" data-level=\""+data[i].level+"\" ><a href=\"javascript:;\">"+data[i].name+"</a></li>")
							.appendTo($ul);
					}

					//选中第一个
					var $firstLi = $($ul.find(">li")[0]);
					$firstLi.addClass("active");
					$("#chart-map-sh-dropdown>button.dropdown-toggle>span.text").html($firstLi.find(">a").html());

					callback && callback($firstLi);
				});
			}
		};

		/**
		 * 重新初始化自定义地图
		 *
		 * @param callback
         */
		var reInitChartMapUserdefineDropdown = function(callback){
			var url = "js/module/config/echarts.map.template_userdefine.config.json";
			$.getJSON(url,function(data){
				var $ul = $("#chart-map-userdefine-dropdown >ul.dropdown-menu").html("");
				for(var i= 0;i<data.length;i++){
					$("<li data-id=\""+data[i].id+"\" data-url=\""+data[i].url+"\" ><a href=\"javascript:;\">"+data[i].name+"</a></li>")
						.appendTo($ul);
				}

				//选中第一个
				var $firstLi = $($ul.find(">li")[0]);
				$firstLi.addClass("active");
				$("#chart-map-userdefine-dropdown>button.dropdown-toggle>span.text").html($firstLi.find(">a").html());

				callback && callback($firstLi);
			});
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
					//切换地图(省级，直辖市)数据
					$("#chart-map-sn-dropdown >ul.dropdown-menu>li").click(function(){
						var $this = $(this);
						if($this.hasClass("active")){
							return true;
						}

						$this.siblings().removeClass("active");
						$this.addClass("active");

						//修改内容
						$("#chart-map-sn-dropdown >button.dropdown-toggle>span.text").html($this.find(">a").html());
						var regionCode = $this.attr("data-value");
						var regionLevel = $this.attr("data-level");

						//用户自定义地图
						if(regionCode == "userdefine"){
							//不显示市级别下拉，显示自定义地图
							$("#chart-map-sh-dropdown").addClass("hide");
							$("#chart-map-userdefine-dropdown").removeClass("hide");

							//加载前禁止点击
							var $userdefineDropdown = $("#chart-map-userdefine-dropdown >button.dropdown-toggle")
								.attr("disabled",true).addClass("disabled");
							//重新初始化自定义地图下拉框
							reInitChartMapUserdefineDropdown(function($activeUserdefineLi){
								//加载后恢复禁止点击
								$userdefineDropdown.attr("disabled",false).removeClass("disabled");
								if($activeUserdefineLi && $activeUserdefineLi.length >0){

									//取得当前行政区划数据
									var dataId = $activeUserdefineLi.attr("data-id");
									var dataUrl = $activeUserdefineLi.attr("data-url");

									//全国数据不加载
									if(dataId == "map_china" || dataUrl == ""){
										delete _container["map"];
										delete objConfig["map"];
										chartObj.init(objConfig);
										return true;
									}

									//设置地图参数
									_container["map"] = objConfig["map"] = {
										type:dataId,					//地图标识
										url:dataUrl,					//地图地址
										level:"userdefine",				//地图级别（自定义）
										regioncode:null,
										snregioncode:"userdefine",		//父节点(自定义标识)
										snType:null
									};
									chartObj.init(objConfig);
									return true;
								}
							});//end reInitChartMapUserdefineDropdown
						}else{
							//显示市级别下拉,不显示自定义地图
							$("#chart-map-sh-dropdown").removeClass("hide");
							$("#chart-map-userdefine-dropdown").addClass("hide");

							//加载前禁止点击
							var $shDropdown = $("#chart-map-sh-dropdown >button.dropdown-toggle")
								.attr("disabled",true).addClass("disabled");
							//重新初始化市一级下拉框
							reInitChartMapShDropdown(regionLevel,regionCode,function($activeShLi){
								//加载后恢复禁止点击
								$shDropdown.attr("disabled",false).removeClass("disabled");
								if($activeShLi && $activeShLi.length >0){
									//取得当前选中的行政区划编码和级别
									var levelParam = regionLevel;
									var regionCodeParam = regionCode;

									//全国数据不加载
									if("000000000000" == regionCode){
										delete _container["map"];
										delete objConfig["map"];
										chartObj.init(objConfig);
										return true;
									}

									//取得当前行政区划数据
									var dataValue = $activeShLi.attr("data-value");
									var dataLevel = $activeShLi.attr("data-level");
									if(dataValue === "-1" || dataValue === -1){
										//选择省级
										//设置地图参数
										_container["map"] = objConfig["map"] = {
											type:"map_"+regionCodeParam,
											url:MapDataHanlder.getJsonFilePath(levelParam,regionCodeParam),
											level:levelParam,
											regioncode:regionCodeParam,				//当前的行政区划
											snregioncode:"000000000000",			//省级的上一级是全国
											snType:$this.attr("data-sn-type")
										};
									}else{
										//选择市级
										regionCodeParam = dataValue;
										levelParam = dataLevel;
										//设置地图参数
										_container["map"] = objConfig["map"] = {
											type:"map_"+regionCodeParam,
											url:MapDataHanlder.getJsonFilePath(levelParam,regionCodeParam),
											level:levelParam,
											regioncode:regionCodeParam,				//当前的行政区划
											snregioncode:$this.attr("data-value"),	//父节点行政区
											snType:null
										};
									}//end if(dataValue === "-1" || dataValue === -1) else

									chartObj.init(objConfig);
									return true;
								}
							});//end reInitChartMapShDropdown
						}//end if(regionCode == "999999999999")
					});

					//切换地图(地级市)数据
					$("#chart-map-sh-dropdown>.dropdown-menu").on("click",">li",function(){
						var $this = $(this);
						if($this.hasClass("active")){
							return true;
						}

						$this.siblings().removeClass("active");
						$this.addClass("active");
						//修改内容
						$("#chart-map-sh-dropdown >button.dropdown-toggle>span.text").html($this.find(">a").html());

						var regionCode = $this.attr("data-value");
						var regionLevel = $this.attr("data-level");

						var levelParam = regionLevel;
						var regionCodeParam = regionCode;

						//省级选中的数据
						var $snActiveLi = $("#chart-map-sn-dropdown >ul.dropdown-menu>li.active");
						var snDataValue = $snActiveLi.attr("data-value");
						var snDataLevel = $snActiveLi.attr("data-level");

						//选择省级
						if(regionCode === "-1" || regionCode === -1){
							if(snDataValue == "000000000000"){
								delete _container["map"];
								delete objConfig["map"];
								chartObj.init(objConfig);
								return true;
							}

							regionCodeParam = snDataValue;
							levelParam = snDataLevel;

							//设置地图参数
							_container["map"] = objConfig["map"] = {
								type:"map_"+regionCodeParam,
								url:MapDataHanlder.getJsonFilePath(levelParam,regionCodeParam),
								level:levelParam,
								regioncode:regionCodeParam,
								snregioncode:"000000000000",//父节点行政区
								snType:$snActiveLi.attr("data-sn-type")
							};
						}else{
							//设置地图参数
							_container["map"] = objConfig["map"] = {
								type:"map_"+regionCodeParam,
								url:MapDataHanlder.getJsonFilePath(levelParam,regionCodeParam),
								level:levelParam,
								regioncode:regionCodeParam,
								snregioncode:snDataValue,	//父节点行政区
								snType:null
							};
						}//end if(dataValue === "-1" || dataValue === -1)
						chartObj.init(objConfig);
						return true;
					});

					//切换地图(自定义地图)数据
					$("#chart-map-userdefine-dropdown>.dropdown-menu").on("click",">li",function(){
						var $this = $(this);

						$this.siblings().removeClass("active");
						$this.addClass("active");

						//修改内容
						$("#chart-map-userdefine-dropdown >button.dropdown-toggle>span.text").html($this.find(">a").html());

						//取得当前行政区划数据
						var dataId = $this.attr("data-id");
						var dataUrl = $this.attr("data-url");
						//全国数据不加载
						if(dataId == "map_china" || dataUrl == ""){
							delete _container["map"];
							delete objConfig["map"];
							chartObj.init(objConfig);
							return true;
						}

						//设置地图参数
						_container["map"] = objConfig["map"] = {
							type:dataId,					//地图标识
							url:dataUrl,					//地图地址
							level:"userdefine",				//地图级别（自定义）
							regioncode:null,
							snregioncode:"userdefine",		//父节点(自定义标识)
							snType:null
						};
						chartObj.init(objConfig);
						return true;
					});

					//切换主题
					$("#chart-theme-dropdown >ul.dropdown-menu>li").click(function(){
						var $this = $(this);

						$this.siblings().removeClass("active");
						$this.addClass("active");

						//修改内容
						$("#chart-theme-dropdown >button.dropdown-toggle>span.text").html($this.find(">a").html());

						//配置颜色
						var dataColorMax = $this.attr("data-color-max");
						var dataColorMin = $this.attr("data-color-min");
						if(dataColorMax && dataColorMin){
							objConfig["option"] = _style = $.extend(true,_style,{
								dataRange:{
									color:[dataColorMax,dataColorMin]
								}
							});
						}

						chartObj.init(objConfig);
					});

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

						if(isShow){
							$("#chart-legend-position-dropdown >button.dropdown-toggle").removeClass("disabled");
						}else{
							$("#chart-legend-position-dropdown >button.dropdown-toggle").addClass("disabled");
						}
						//控制是否可以修改图例文字颜色
						$("#chart-legend-color-select").attr("disabled",!isShow);
						$("#chart-legend-font-size-range").attr("disabled",!isShow);

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

					//图例字体大小
					$("#chart-legend-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-legend-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							legend:{
								textStyle:{
									fontSize:size
								}
							}
						});
						chartObj.init(objConfig);
					});

					//调整图例位置
					$("#chart-legend-position-dropdown >ul.dropdown-menu>li").click(function(){
						var $this = $(this);

						$this.siblings().removeClass("active");
						$this.addClass("active");

						//修改内容
						$("#chart-legend-position-dropdown >button.dropdown-toggle").html($this.find(">a").html()
						+"<span class=\"caret\"></span>");

						var position = $this.attr("data-value");
						objConfig["option"] = _style = $.extend(true,_style,{
							legend: {
								x: position
							}
						});
						chartObj.init(objConfig);
					});

					//是否显示缩放控件
					$("#chart-iscan-zoom-control-check").change(function(){
						var isCan = $(this).is(":checked");

						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"roam": isCan
								}
							]
						});

						//如果可以缩放
						var $showZoomCheck = $("#chart-show-zoom-control-check");
						if(isCan){
							//设置可以点击
							$showZoomCheck.attr("disabled",false);
							$showZoomCheck.parent("span").attr("title","");
						}else{//如果不可以缩放
							//设置不可以缩放，不选中
							$showZoomCheck.attr("checked",false).attr("disabled",true);
							$showZoomCheck.parent("span").attr("title","要显示控件，先设置可以缩放地图");
							$("#chart-zoom-control-position-dropdown >button.dropdown-toggle").addClass("disabled");
						}

						chartObj.init(objConfig);
					});

					//是否显示数据范围控件
					$("#chart-show-datarange-control-check").change(function(){
						var isShow = $(this).is(":checked");

						//控制是否可以修改
						if(isShow){
							$("#chart-datarange-dropdown >button.dropdown-toggle").removeClass("disabled");
							$("#chart-show-datarange-btn").removeClass("disabled");
							$("#chart-datarange-high-color").attr("disabled",false);
							$("#chart-datarange-low-color").attr("disabled",false);

							//控制拖拽可以
							DataRangeControll.enable();

							$("#chart-show-datarange-range-check").attr("disabled",false);
							$("#chart-show-datarange-range-min").attr("disabled",false);
							$("#chart-show-datarange-range-max").attr("disabled",false);

						}else{
							$("#chart-datarange-dropdown >button.dropdown-toggle").addClass("disabled");
							$("#chart-show-datarange-btn").addClass("disabled");
							$("#chart-datarange-high-color").attr("disabled",true);
							$("#chart-datarange-low-color").attr("disabled",true);

							//控制禁止拖拽
							DataRangeControll.disable();
							$("#chart-show-datarange-range-check").attr("disabled",true);
							$("#chart-show-datarange-range-min").attr("disabled",true);
							$("#chart-show-datarange-range-max").attr("disabled",true);
						}

						objConfig["option"] = _style = $.extend(true,_style,{
							dataRange: {
								show:isShow
							}
						});
						chartObj.init(objConfig);
					});

					//控件文字(范围)
					$("#chart-show-datarange-btn").click(function(){
						var high = $("#chart-show-datarange-high-text").val();
						var low = $("#chart-show-datarange-low-text").val();
						if(!high || high == ""){
							$("#chart-show-datarange-high-text").focus();
							return false;
						}
						if(!low || low == ""){
							$("#chart-show-datarange-low-text").focus();
							return false;
						}

						objConfig["option"] = _style = $.extend(true,_style,{
							dataRange:{
								text: [high,low]
							}
						});
						chartObj.init(objConfig);
						return false;
					});

					//调整数据范围位置
					$("#chart-datarange-dropdown >ul.dropdown-menu>li").click(function(){
						var $this = $(this);

						$this.siblings().removeClass("active");
						$this.addClass("active");

						//修改内容
						$("#chart-datarange-dropdown >button.dropdown-toggle").html($this.find(">a").html()
						+"<span class=\"caret\"></span>");

						var x = $this.attr("data-x");
						var y = $this.attr("data-y");
						objConfig["option"] = _style = $.extend(true,_style,{
							dataRange: {
								x:x,
								y:y
							}
						});
						chartObj.init(objConfig);
					});

					//修改地图颜色(高)
					$("#chart-datarange-high-color").change(function(){
						var color = $(this).val();
						var color2 = $("#chart-datarange-low-color").val();

						objConfig["option"] = _style = $.extend(true,_style,{
							dataRange: {
								color:[color,color2]
							}
						});
						chartObj.init(objConfig);
					});

					//修改地图颜色(低)
					$("#chart-datarange-low-color").change(function(){
						var color2 = $(this).val();
						var color = $("#chart-datarange-high-color").val();

						objConfig["option"] = _style = $.extend(true,_style,{
							dataRange: {
								color:[color,color2]
							}
						});
						chartObj.init(objConfig);
					});

					//是否显示缩放控件
					$("#chart-show-zoom-control-check").change(function(){
						var isShow = $(this).is(":checked");

						//控制是否可以修改
						if(isShow){
							$("#chart-zoom-control-position-dropdown >button.dropdown-toggle").removeClass("disabled");
						}else{
							$("#chart-zoom-control-position-dropdown >button.dropdown-toggle").addClass("disabled");
						}

						objConfig["option"] = _style = $.extend(true,_style,{
							roamController: {
								show: isShow
							}
						});
						chartObj.init(objConfig);
					});

					//调整位置
					$("#chart-zoom-control-position-dropdown >ul.dropdown-menu>li").click(function(){
						var $this = $(this);

						$this.siblings().removeClass("active");
						$this.addClass("active");

						//修改内容
						$("#chart-zoom-control-position-dropdown >button.dropdown-toggle").html($this.find(">a").html()
						+"<span class=\"caret\"></span>");

						var x = $this.attr("data-x");
						var y = $this.attr("data-y");
						objConfig["option"] = _style = $.extend(true,_style,{
							roamController: {
								x:x,
								y:y
							}
						});
						chartObj.init(objConfig);
					});


					//是否显示标签
					$("#chart-show-label-check").change(function(){
						var isShow = $(this).is(":checked");

						//控制是否可以修改
						$("#chart-region-center-color-select").attr("disabled",!isShow);
						$("#chart-region-color-select").attr("disabled",!isShow);
						$("#chart-region-hover-color-select").attr("disabled",!isShow);
						$("#chart-font-size-range").attr("disabled",!isShow);
						$("#chart-hover-font-size-range").attr("disabled",!isShow);

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

					//行政区划原点颜色指标
					$("#chart-region-center-color-select").change(function(){
						var color = $(this).val();

						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									itemStyle:{
										normal:{
											"areaStyle":{
												color:color
											}
										}
									}
								}
							]
						});
						chartObj.init(objConfig);
					});

					//选择字体颜色
					$("#chart-region-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"itemStyle" : {
										normal : {
											label : {
												textStyle : {
													color:color
												}
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

					//选择字体颜色(鼠标覆盖时)
					$("#chart-region-hover-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"itemStyle" : {
										emphasis : {
											label : {
												textStyle : {
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

					//选择字体大小(鼠标覆盖时)
					$("#chart-hover-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-hover-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							series:[
								{
									"itemStyle": {
										emphasis : {
											label : {
												textStyle : {
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
		 * 设置图高度
		 * @param height
         */
    	var setHeight = function(height){
    		if(height && height > 0){
    			_container["height"] = height;
    		}
    	};

		/**
		 *	数据范围控件
		 */
		var DataRangeControll = (function(){
			//当前对象
			var _jRangeObj = null;

			/**
			 * 初始化数据范围控件
			 * @param currentHanlder
			 * 			当前处理的对象（chart.echarts.js
			 * 			或者chart.echarts.edit.js的对象）
			 * @param from
			 * 			最小值
			 * @param to
			 * 			最大值
			 */
			var init = function(currentHanlder,from,to){
				_jRangeObj = null;

				if(typeof from != "undefined" &&
					typeof to != "undefined"){
					var val = from + "," + to;
					//设置当前值域
					$('#chart-show-datarange-range').attr("value",val).val(val);

					var jRangeFrom = from;
					var jRangeTo = to;
					if(from == 0){
						jRangeFrom = 0 - to;		//取最大值负数
						jRangeTo = to * 2;			//取2倍
					}else if(from > 0){
						jRangeFrom = 0 - from;		//取本身负数
						jRangeTo = to * 2;			//取2倍
					}else{
						jRangeFrom = to * 2;		//取最大值负数
						if(to > 0){
							jRangeTo = to * 2;		//取2倍
						}else if(to < 0){
							jRangeTo = Math.abs(to);	//取最大值的绝对值
						}else{
							jRangeTo = Math.abs(from);	//取最小值的绝对值
						}
					}//end if else

					if(currentHanlder){
						//设置值
						$("#chart-show-datarange-range-min").attr("value",from).val(from);
						$("#chart-show-datarange-range-max").attr("value",to).val(to);

						//设置数据范围的控件
						$('#chart-show-datarange-range').jRange({
							from: jRangeFrom,
							to: jRangeTo,
							step: 1,
							scale:[jRangeFrom,from,to,jRangeTo],
							format: '%s',
							width: 230,
							theme:'theme-blue',
							showLabels: true,
							showScale: true,
							onstatechange:function(value){	//滑动后回调事件
								var valueArr = value.toString().split(",");
								if(typeof valueArr[0] != 'undefined' && typeof valueArr[1] != 'undefined'){
									var chartObj = currentHanlder.getChartObj();
									var objConfig = currentHanlder.getChartConfig();
									objConfig["option"] = _style = $.extend(true,_style,{
										dataRange: {
											min:valueArr[0],
											max:valueArr[1]
										}
									});
									chartObj.init(objConfig);
									//设置值
									$("#chart-show-datarange-range-min").attr("value",valueArr[0]).val(valueArr[0]);
									$("#chart-show-datarange-range-max").attr("value",valueArr[1]).val(valueArr[1]);
								}
							},
							afterInit:function(that){	//初始化后回调事件
								_jRangeObj = that;		//保存拖拽当前对象
							}
						});

						/**
						 * 绑定选项卡切换
						 * <p>
						 *		由于当前控件式隐藏的，所以首次
						 *		绘制拖动框的时候进度条计算不正确，故绘制一遍
						 * </p>
						 */
						$("#param-pane ul.nav.nav-list.bs-docs-sidenav>li").click(function(){
							var $this = $(this);
							var a = $this.find(">a")[0];
							if(a && $(a)){
								var hrefVal =  $(a).attr("href");
								if(hrefVal && hrefVal == "#panel-data-range"){
									var circleCheckTimes = 1;	//记录次数
									if(_jRangeObj && _jRangeObj != null){
										circleCheck();
									}

									function circleCheck(){
										var activeId = $("#param-pane div.tab-content.bs-docs-sidenav-content>.tab-pane.active").attr("id");
										if(activeId == "panel-data-range"){
											circleCheckTimes = 1;
											refresh();
										}else{
											circleCheckTimes ++;
											if(circleCheckTimes < 5){
												window.setTimeout(circleCheck,20);
											}
										}
									}
								}
							}//end if(a && $(a))
						});

						/**
						 * 开启精确定位
						 */
						$("#chart-show-datarange-range-check").change(function(){
							var isShow = $(this).is(":checked");
							if(isShow){
								$("#chart-show-datarange-range-min").removeClass("hide");
								$("#chart-show-datarange-range-max").removeClass("hide");
							}else{
								$("#chart-show-datarange-range-min").addClass("hide");
								$("#chart-show-datarange-range-max").addClass("hide");
							}
						});

						/**
                         *	绑定最小值
						 */
						$("#chart-show-datarange-range-min").change(function(){
							var $this = $(this);
							var $max = $("#chart-show-datarange-range-max");
							if(_jRangeObj && _jRangeObj != null){
								var min = $this.val();
								var max = $max.val();
								if(min==""){
									min = jRangeFrom;
								}else if(min < jRangeFrom){
									//太小
									min = jRangeFrom;
								}else if(min > max){
									//太大
									min = max;
								}
								//设置数据（会触发onstatechange）
								_jRangeObj.setValue(min+","+max);
							}
						});

						/**
						 *	绑定最大值
						 */
						$("#chart-show-datarange-range-max").change(function(){
							var $this = $(this);
							var $min = $("#chart-show-datarange-range-min");
							if(_jRangeObj && _jRangeObj != null){
								var min = $min.val();
								var max = $this.val();
								if(max==""){
									max = jRangeTo;
								}else if(max > jRangeTo){
									//太大
									max = jRangeTo;
								}else if(max < min){
									//太小
									max = min;
								}
								//设置数据（会触发onstatechange）
								_jRangeObj.setValue(min+","+max);
							}
						});
					}else{
						console && console.log("错误消息提示：currentHanlder不存在，无法拖动值域！");
					}//end if if(currentHanlder)
				}//end if(typeof from != "undefined"
			};

			/**
			 * 刷新一下数据
			 */
			var refresh = function(){
				if(_jRangeObj && _jRangeObj != null){
					//刷新数据
					_jRangeObj.setValue(_jRangeObj.getValue());
				}
			};

			/**
			 * 允许拖拽
			 */
			var enable = function(){
				if(_jRangeObj && _jRangeObj != null){
					_jRangeObj.enable && _jRangeObj.enable();
				}
			};

			/**
			 * 禁止允许拖拽
			 */
			var disable = function(){
				if(_jRangeObj && _jRangeObj != null){
					_jRangeObj.disable && _jRangeObj.disable();
				}
			};

			return {
				init:init,
				enable:enable,
				disable:disable
			}
		})();

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

			var mapStyle = $.extend(true,{},{
				map:{
					type:null,
					url:null
				},
				theme:null
			},{
				map:_container.map || {},
				theme:_container.theme
			});

			if(mapStyle.map.type != null){
				//省级选中
				if(mapStyle.map.level === "2" || mapStyle.map.level === 2){
					//显示市级别下拉,不显示自定义地图
					$("#chart-map-sh-dropdown").removeClass("hide");
					$("#chart-map-userdefine-dropdown").addClass("hide");

					$("#chart-map-sn-dropdown >ul.dropdown-menu >li").removeClass("active");
					var $activeLi = $("#chart-map-sn-dropdown >ul.dropdown-menu >li[data-value='"+mapStyle.map.regioncode+"']");
					if($activeLi.length > 0){
						$("#chart-map-sn-dropdown >button.dropdown-toggle >span.text").html($activeLi.find(">a").html());
						$activeLi.addClass("active");
						//重新初始化市一级下拉框
						reInitChartMapShDropdown(mapStyle.map.level,
							mapStyle.map.regioncode,null);
					}//end if($activeLi.length > 0)
				}else if(mapStyle.map.level === "3" || mapStyle.map.level === 3){
					//显示市级别下拉,不显示自定义地图
					$("#chart-map-sh-dropdown").removeClass("hide");
					$("#chart-map-userdefine-dropdown").addClass("hide");

					//市级选中
					$("#chart-map-sn-dropdown >ul.dropdown-menu >li").removeClass("active");
					var $activeLi = $("#chart-map-sn-dropdown >ul.dropdown-menu >li[data-value='"+mapStyle.map.snregioncode+"']");
					if($activeLi.length > 0){
						$("#chart-map-sn-dropdown >button.dropdown-toggle >span.text").html($activeLi.find(">a").html());
						$activeLi.addClass("active");
						//重新初始化市一级下拉框
						reInitChartMapShDropdown(mapStyle.map.level
							,mapStyle.map.snregioncode,function(){
								//设置市级别选中
								$("#chart-map-sh-dropdown >ul.dropdown-menu >li").removeClass("active");
								var $shActiveLi = $("#chart-map-sh-dropdown >ul.dropdown-menu >li[data-value='"+mapStyle.map.regioncode+"']");
								if($shActiveLi.length > 0){
									$("#chart-map-sh-dropdown >button.dropdown-toggle >span.text").html($shActiveLi.find(">a").html());
									$shActiveLi.addClass("active");
								}//end if($shActiveLi.length > 0)
							});
					}//end if($activeLi.length > 0)
				}else if(mapStyle.map.level === "userdefine" || mapStyle.map.level === null){
					//自定义地图
					//不显示市级别下拉,显示自定义地图
					$("#chart-map-sh-dropdown").addClass("hide");
					$("#chart-map-userdefine-dropdown").removeClass("hide");

					$("#chart-map-sn-dropdown >ul.dropdown-menu >li").removeClass("active");
					var $activeLi = $("#chart-map-sn-dropdown >ul.dropdown-menu >li[data-value='"+mapStyle.map.snregioncode+"']");
					if($activeLi.length > 0){
						$("#chart-map-sn-dropdown >button.dropdown-toggle >span.text").html($activeLi.find(">a").html());
						$activeLi.addClass("active");
						//重新初始化自定义地图下拉框
						reInitChartMapUserdefineDropdown(function(){
							//设置市级别选中
							$("#chart-map-userdefine-dropdown >ul.dropdown-menu >li").removeClass("active");
							var $userdefineActiveLi = $("#chart-map-userdefine-dropdown >ul.dropdown-menu >li[data-id='"+mapStyle.map.type+"']");
							if($userdefineActiveLi.length > 0){
								$("#chart-map-userdefine-dropdown >button.dropdown-toggle >span.text").html($userdefineActiveLi.find(">a").html());
								$userdefineActiveLi.addClass("active");
							}//end if($shActiveLi.length > 0)
						});
					}//end if($activeLi.length > 0)
				}//end if else
			}//end if(mapStyle.map.type != null)

			if(mapStyle.theme != null){
				$("#chart-theme-dropdown >ul.dropdown-menu >li").removeClass("active");
				var $activeLi = $("#chart-theme-dropdown >ul.dropdown-menu >li[data-value='"+mapStyle.theme+"']");

				$("#chart-theme-dropdown >button.dropdown-toggle >span.text").html($activeLi.find(">a").html());
				$activeLi.addClass("active");
			}

			var mapOptionStyle = _style;
			if(mapOptionStyle && mapOptionStyle != null) {
				var dataRangeStyle = $.extend(true, {}, {
					"dataRange": {
						"color":[null,null],
						"show": true,
						"text": [null, null],
						"x": "left",
						"y": "top"
					}
				}, {
					"dataRange": mapOptionStyle.dataRange || {}
				});

				var dataRangeShow = dataRangeStyle.dataRange.show === false;
				if(dataRangeShow){
					$("#chart-show-datarange-control-check").attr("checked",false);
					$("#chart-datarange-dropdown >button.dropdown-toggle").addClass("disabled");
					$("#chart-show-datarange-btn").addClass("disabled");
					$("#chart-datarange-high-color").attr("disabled",true);
					$("#chart-datarange-low-color").attr("disabled",true);
				}else{
					$("#chart-show-datarange-control-check").attr("checked",true);
					$("#chart-datarange-dropdown >button.dropdown-toggle").removeClass("disabled");
					$("#chart-show-datarange-btn").removeClass("disabled");
					$("#chart-datarange-high-color").attr("disabled",false);
					$("#chart-datarange-low-color").attr("disabled",false);
				}
				var text1 = dataRangeStyle.dataRange.text[0];
				if(text1 != null){
					$("#chart-show-datarange-high-text").attr("value",text1).val(text1);
				}
				var text2 = dataRangeStyle.dataRange.text[1];
				if(text2 != null){
					$("#chart-show-datarange-low-text").attr("value",text2).val(text2);
				}
				var color1 = dataRangeStyle.dataRange.color[0];
				if(color1 != null){
					$("#chart-datarange-high-color").attr("value",color1).val(color1);
				}
				var color2 = dataRangeStyle.dataRange.color[1];
				if(color2 != null){
					$("#chart-datarange-low-color").attr("value",color2).val(color2);
				}

				var X = dataRangeStyle.dataRange.x;
				var Y = dataRangeStyle.dataRange.y;
				if(X != null && Y != null){
					$("#chart-datarange-dropdown >ul.dropdown-menu >li").removeClass("active");
					var $activeLis = $("#chart-datarange-dropdown >ul.dropdown-menu >li[data-x='"+X+"']");
					$activeLis.each(function(i,o){
						var $activeLi = $(o);
						if($activeLi.attr("data-y") == Y){
							var html = $activeLi.find(">a").html()+"<span class='caret'></span>";
							$("#chart-datarange-dropdown >button.dropdown-toggle").html(html);
							$activeLi.addClass("active");
						}
					});
				}

				var legendStyle = $.extend(true,{},{
					"legend": {
						"show": true,
						"textStyle": {
							"color": null,
							"fontSize": -1
						},
						"x": null
					}
				},{
					"legend":mapOptionStyle.legend || {}
				});

				var legendShow = legendStyle.legend.show === false;
				if(legendShow){
					$("#chart-show-legend-check").attr("checked",false);
					$("#chart-legend-color-select").attr("disabled",true);
					$("#chart-legend-font-size-range").attr("disabled",true);

					$("#chart-legend-position-dropdown >button.dropdown-toggle").addClass("disabled");
				}else{
					$("#chart-show-legend-check").attr("checked",true);
					$("#chart-legend-color-select").removeAttr("disabled");
					$("#chart-legend-font-size-range").removeAttr("disabled");

					$("#chart-legend-position-dropdown >button.dropdown-toggle").removeClass("disabled");
				}

				var legendX = legendStyle.legend.x;
				if(legendX != null){
					$("#chart-legend-position-dropdown >ul.dropdown-menu >li").removeClass("active");
					var $activeLi = $("#chart-legend-position-dropdown >ul.dropdown-menu >li[data-value='"+legendX+"']");

					var html1 = $activeLi.find(">a").html()+"<span class='caret'></span>";
					$("#chart-legend-position-dropdown >button.dropdown-toggle").html(html1);
					$activeLi.addClass("active");
				}//end if(legendX != null)

				//图列颜色
				if(legendStyle.legend.textStyle.color != null){
					$("#chart-legend-color-select").attr("value",legendStyle.legend.textStyle.color);
					var $parent =  $("#chart-legend-color-select").parent("div");
					//保证控件刷新
					$parent.html($parent.html());
				}

				//图列字体大小
				var legendFontSize = legendStyle.legend.textStyle.fontSize;
				if(legendFontSize > -1){
					$("#chart-legend-font-size-range").attr("value",legendFontSize).val(legendFontSize);
					$("#chart-legend-font-size-text").attr("value",legendFontSize).val(legendFontSize);
				}

				var series = mapOptionStyle.series;
				if(series && series[0]) {
					var seriesStyle = $.extend(true, {}, {
						series: [
							{
								"roam": true,
								"itemStyle": {
									"emphasis": {
										"label": {
											"textStyle": {
												"color": null,
												"areaStyle": {
													color: null
												},
												"fontSize": -1
											}
										}
									},
									"normal": {
										"color": null,
										"label": {
											"show": true,
											"textStyle": {
												"color": null,
												"fontSize": -1
											}
										},
										"areaStyle":{
											color:null
										}
									}
								}
							}
						]
					}, {
						series: series
					});

					//设置是否可以缩放地图
					//如果可以缩放
					var $showZoomCheck = $("#chart-show-zoom-control-check");
					if(seriesStyle.series[0].roam === false){
						$("#chart-iscan-zoom-control-check").attr("checked",false);

						//设置不可以缩放，不选中
						$showZoomCheck.attr("checked",false).attr("disabled",true);
						$showZoomCheck.parent("span").attr("title","要显示控件，先设置可以缩放地图");
						$("#chart-zoom-control-position-dropdown >button.dropdown-toggle").addClass("disabled");
					}else{
						$("#chart-iscan-zoom-control-check").attr("checked",true);

						//设置可以点击
						$showZoomCheck.attr("disabled",false);
						$showZoomCheck.parent("span").attr("title","");
					}

					//缩放控件
					var roamControllerStyle = $.extend(true, {}, {
						roamController: {
							show: true,
							x:null,
							y:null
						}
					},{
						roamController:mapOptionStyle.roamController || {}
					});

					var isRoamControllerHide = roamControllerStyle.roamController.show === false;
					if(isRoamControllerHide){
						$("#chart-show-zoom-control-check").attr("checked",false);
						$("#chart-zoom-control-position-dropdown >button.dropdown-toggle").addClass("disabled");
					}else{
						$("#chart-show-zoom-control-check").attr("checked",true);
						$("#chart-zoom-control-position-dropdown >button.dropdown-toggle").removeClass("disabled");
					}

					var X = roamControllerStyle.roamController.x;
					var Y = roamControllerStyle.roamController.y;
					if(X != null && Y != null){
						$("#chart-zoom-control-position-dropdown >ul.dropdown-menu >li").removeClass("active");
						var $activeLis = $("#chart-zoom-control-position-dropdown >ul.dropdown-menu >li[data-x='"+X+"']");
						$activeLis.each(function(i,o){
							var $activeLi = $(o);
							if($activeLi.attr("data-y") == Y){
								var html = $activeLi.find(">a").html()+"<span class='caret'></span>";
								$("#chart-zoom-control-position-dropdown >button.dropdown-toggle").html(html);
								$activeLi.addClass("active");
							}
						});
					}

					//是否显示标签
					if(seriesStyle.series[0].itemStyle.normal.label.show === false){
						$("#chart-show-label-check").attr("checked",false);

						//控制是否可以修改
						$("#chart-region-center-color-select").attr("disabled",true);
						$("#chart-region-color-select").attr("disabled",true);
						$("#chart-region-hover-color-select").attr("disabled",true);
						$("#chart-font-size-range").attr("disabled",true);
						$("#chart-hover-font-size-range").attr("disabled",true);
					}
					var textStyleColor = seriesStyle.series[0].itemStyle.normal.label.textStyle.color;
					if(textStyleColor != null){
						$("#chart-region-color-select").attr("value",textStyleColor).val(textStyleColor);
						var $textStyleColorParent =  $("#chart-region-color-select").parent("div");
						//保证控件刷新
						$textStyleColorParent.html($textStyleColorParent.html());
					}
					var textStyleFontSize = seriesStyle.series[0].itemStyle.normal.label.textStyle.fontSize;
					if(textStyleFontSize > -1){
						$("#chart-font-size-range").attr("value",textStyleFontSize).val(textStyleFontSize);
						$("#chart-font-size-text").attr("value",textStyleFontSize).val(textStyleFontSize);
					}
					var centerStyleColor = seriesStyle.series[0].itemStyle.normal.areaStyle.color;
					if(centerStyleColor != null){
						$("#chart-region-center-color-select").attr("value",centerStyleColor).val(centerStyleColor);
						var $centerStyleColorParent =  $("#chart-region-center-color-select").parent("div");
						//保证控件刷新
						$centerStyleColorParent.html($centerStyleColorParent.html());
					}
					var emphasisTextStyleColor = seriesStyle.series[0].itemStyle.emphasis.label.textStyle.color;
					if(emphasisTextStyleColor != null){
						$("#chart-region-hover-color-select").attr("value",emphasisTextStyleColor).val(emphasisTextStyleColor);
						var $textStyleColorParent =  $("#chart-region-hover-color-select").parent("div");
						//保证控件刷新
						$textStyleColorParent.html($textStyleColorParent.html());
					}
					var emphasisTextStyleFontSize = seriesStyle.series[0].itemStyle.emphasis.label.textStyle.fontSize;
					if(emphasisTextStyleFontSize > -1){
						$("#chart-hover-font-size-range").attr("value",emphasisTextStyleFontSize).val(emphasisTextStyleFontSize);
						$("#chart-hover-font-size-text").attr("value",emphasisTextStyleFontSize).val(emphasisTextStyleFontSize);
					}
				}//end if(series && series[0])

			}//end if(mapOptionStyle && mapOptionStyle != null)
		};
    	
        return {
        	init:init,
        	getStyle:getStyle,
        	getContainer:getContainer,
        	setHeight:setHeight,
			initDataRangeControll:DataRangeControll.init,
			MapDataHanlder:MapDataHanlder
        };
    })();


    return EChartMapStyle;
});