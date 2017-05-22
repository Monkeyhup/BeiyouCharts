/**
 * echart地图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {
	
	var templateHtml = require("js/module/style/echarts/echarts.three.view.html.tpl");
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
				//初始化样式参数时必须放在【添加内容】后面
				if(chartParam != null){
					callback && callback();
				}else{
					//（三视图）默认选中北京市
					$("#chart-map-sn-dropdown >ul.dropdown-menu >li").removeClass("active");
					var $activeLi = $("#chart-map-sn-dropdown >ul.dropdown-menu >li[data-value='110000000000']");
					if($activeLi.length > 0){
						$("#chart-map-sn-dropdown >button.dropdown-toggle >span.text").html($activeLi.find(">a").html());
						$activeLi.addClass("active");
						//重新初始化北京市市一级下拉框
						reInitChartMapShDropdown(2,"110000000000",callback);
					}//end if($activeLi.length > 0)
				}//end if(chartParam != null)
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
					//1.地图

					//修改图的高度
					$("#chart-chart-height-range").change(function(){
						var height = $(this).val();
						//设置值
						$("#chart-chart-height-text").val(height);

						_container["height"] = height;
						objConfig["height"] = height;
						chartObj.init(objConfig);
					});

					//修改地图的宽度
					$("#chart-chart-map-width-range").change(function(){
						var mapWidthPercent = $(this).val();
						//设置值
						$("#chart-chart-map-width-text").val(mapWidthPercent);

						_container["mapWidthPercent"] = mapWidthPercent;
						objConfig["mapWidthPercent"] = mapWidthPercent;
						chartObj.init(objConfig);
					});

					//修改饼图的宽度
					$("#chart-chart-pie-width-range").change(function(){
						var pieWidthPercent = $(this).val();
						//设置值
						$("#chart-chart-pie-width-text").val(pieWidthPercent);

						_container["pieWidthPercent"] = pieWidthPercent;
						objConfig["pieWidthPercent"] = pieWidthPercent;
						chartObj.init(objConfig);
					});

					//修改柱图的宽度
					$("#chart-chart-bar-width-range").change(function(){
						var barWidthPercent = $(this).val();
						//设置值
						$("#chart-chart-bar-width-text").val(barWidthPercent);

						_container["barWidthPercent"] = barWidthPercent;
						objConfig["barWidthPercent"] = barWidthPercent;
						chartObj.init(objConfig);
					});

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

						var theme = $this.attr("data-value");
						if(theme == "china"){
							delete _container["theme"];
							delete objConfig["theme"];
						}else{
							_container["theme"] = objConfig["theme"] = theme;
						}

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
							mapOption:{
								legend:{
									show:isShow
								}
							}
						});
						chartObj.init(objConfig);
					});

					//图列文字颜色
					$("#chart-legend-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							mapOption:{
								legend:{
									textStyle:{
										color:color
									}
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
							mapOption:{
								legend:{
									textStyle:{
										fontSize:size
									}
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
							mapOption:{
								legend: {
									x: position
								}
							}
						});
						chartObj.init(objConfig);
					});

					//是否显示缩放控件
					$("#chart-iscan-zoom-control-check").change(function(){
						var isCan = $(this).is(":checked");

						objConfig["option"] = _style = $.extend(true,_style,{
							mapOption:{
								series:[
									{
										"roam": isCan
									}
								]
							}
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

					//是否显示标签
					$("#chart-show-label-check").change(function(){
						var isShow = $(this).is(":checked");

						//控制是否可以修改
						$("#chart-region-center-color-select").attr("disabled",!isShow);
						$("#chart-region-color-select").attr("disabled",!isShow);
						$("#chart-region-hover-color-select").attr("disabled",!isShow);
						$("#chart-font-size-range").attr("disabled",!isShow);
						$("#chart-hover-font-size-range").attr("disabled",!isShow);

						//修改是否显示标签
						var dataArr = [];
						if(chartObj.map && chartObj.map.option){
							var data = chartObj.map.option.series[0].data;
							if(data){
								for (var i = 0,len=data.length;i<len;i++){
									dataArr.push($.extend(true,{},{
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
									}));
								}
							}
						}

						objConfig["option"] = _style = $.extend(true,_style,{
							mapOption:{
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
										},
										"data":dataArr
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//行政区划原点颜色指标
					$("#chart-region-center-color-select").change(function(){
						var color = $(this).val();

						//修改行政区划原点颜色指标
						var dataArr = [];
						if(chartObj.map && chartObj.map.option){
							var data = chartObj.map.option.series[0].data;
							if(data){
								for (var i = 0,len=data.length;i<len;i++){
									dataArr.push($.extend(true,{},{
										"itemStyle": {
											normal:{
												"areaStyle":{
													color:color
												}
											}
										}
									}));
								}
							}
						}

						objConfig["option"] = _style = $.extend(true,_style,{
							mapOption:{
								series:[
									{
										itemStyle:{
											normal:{
												"areaStyle":{
													color:color
												}
											}
										},
										"data":dataArr
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//选择字体颜色
					$("#chart-region-color-select").change(function(){alert(this);
						var color = $(this).val();
						//修改选择字体颜色
						var dataArr = [];
						if(chartObj.map && chartObj.map.option){
							var data = chartObj.map.option.series[0].data;
							if(data){
								for (var i = 0,len=data.length;i<len;i++){
									dataArr.push($.extend(true,{},{
										"itemStyle": {
											normal : {
												label : {
													textStyle : {
														color:color
													}
												}
											}
										}
									}));
								}
							}
						}
						objConfig["option"] = _style = $.extend(true,_style,{
							mapOption:{
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
										},
										"data":dataArr
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//选择字体大小
					$("#chart-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-font-size-text").val(size);
						//修改选择字体大小
						var dataArr = [];
						if(chartObj.map && chartObj.map.option){
							var data = chartObj.map.option.series[0].data;
							if(data){
								for (var i = 0,len=data.length;i<len;i++){
									dataArr.push($.extend(true,{},{
										"itemStyle": {
											"normal": {
												"label": {
													"textStyle": {
														"fontSize": size
													}
												}
											}
										}
									}));
								}
							}
						}
						objConfig["option"] = _style = $.extend(true,_style,{
							mapOption:{
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
										},
										"data":dataArr
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//选择字体颜色(鼠标覆盖时)
					$("#chart-region-hover-color-select").change(function(){
						var color = $(this).val();

						//修改选择字体大小
						var dataArr = [];
						if(chartObj.map && chartObj.map.option){
							var data = chartObj.map.option.series[0].data;
							if(data){
								for (var i = 0,len=data.length;i<len;i++){
									dataArr.push($.extend(true,{},{
										"itemStyle": {
											emphasis : {
												label : {
													textStyle : {
														"color":color
													}
												}
											}
										}
									}));
								}
							}
						}
						objConfig["option"] = _style = $.extend(true,_style,{
							mapOption:{
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
										},
										"data":dataArr
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//选择字体大小(鼠标覆盖时)
					$("#chart-hover-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-hover-font-size-text").val(size);
						//修改选择字体大小
						var dataArr = [];
						if(chartObj.map && chartObj.map.option){
							var data = chartObj.map.option.series[0].data;
							if(data){
								for (var i = 0,len=data.length;i<len;i++){
									dataArr.push($.extend(true,{},{
										"itemStyle": {
											emphasis : {
												label : {
													textStyle : {
														"fontSize": size
													}
												}
											}
										}
									}));
								}
							}
						}
						objConfig["option"] = _style = $.extend(true,_style,{
							mapOption:{
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
										},
										"data":dataArr
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//2.饼
					//圆饼半径(内)
					$("#chart-pie-r-inner-range").change(function(){
						var r1 = $(this).val();
						var r2 = $("#chart-pie-r-outter-range").val();

						//设置值
						$("#chart-pie-r-inner-text").val(r1);
						objConfig["option"] = _style = $.extend(true,_style,{
							pieOption:{
								series:[
									{
										radius : [r1+'%', r2+'%']
									}
								]
							}
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
							pieOption:{
								series:[
									{
										radius : [r1+'%', r2+'%']
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//是否显示标签
					$("#chart-show-pie-label-check").change(function(){
						var isShow = $(this).is(":checked");

						//控制是否可以修改
						$("#chart-pie-font-color-select").attr("disabled",!isShow);
						$("#chart-pie-font-size-range").attr("disabled",!isShow);

						//控制是否可以修改
						if(isShow){
							$("#chart-pie-font-position-dropdown >button.dropdown-toggle").removeClass("disabled");
						}else{
							$("#chart-pie-font-position-dropdown >button.dropdown-toggle").addClass("disabled");
						}

						objConfig["option"] = _style = $.extend(true,_style,{
							pieOption:{
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
							}
						});
						chartObj.init(objConfig);
					});

					//选择字体大小
					$("#chart-pie-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-pie-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							pieOption:{
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
							}
						});
						chartObj.init(objConfig);
					});

					//调整位置
					$("#chart-pie-font-position-dropdown >ul.dropdown-menu>li").click(function(){
						var $this = $(this);

						$this.siblings().removeClass("active");
						$this.addClass("active");

						//修改内容
						$("#chart-pie-font-position-dropdown >button.dropdown-toggle").html($this.find(">a").html()
						+"<span class=\"caret\"></span>");

						var position = $this.attr("data-value");
						objConfig["option"] = _style = $.extend(true,_style,{
							pieOption:{
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
							}
						});
						chartObj.init(objConfig);
					});

					//选择上边框倒角大小
					$("#chart-bar-top-border-radius-range").change(function(){
						var size = $(this).val();
						size = parseInt(size);

						var bottomSize = $("#chart-bar-bottom-border-radius-range").val();
						bottomSize = parseInt(bottomSize);

						//设置值
						$("#chart-bar-top-border-radius-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								series :[
									{
										"itemStyle" : {
											"normal": {
												"barBorderRadius":[size,size,bottomSize,bottomSize]
											}
										}
									}
								]
							}
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
							barOption:{
								series :[
									{
										"itemStyle" : {
											"normal": {
												"barBorderRadius":[topSize,topSize,size,size]
											}
										}
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//是否显示图列
					$("#chart-show-bar-legend-check").change(function(){
						var isShow = $(this).is(":checked");
						//控制是否可以修改图例文字颜色
						$("#chart-bar-legend-color-select").attr("disabled",!isShow);

						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								legend:{
									show:isShow
								}
							}
						});
						chartObj.init(objConfig);
					});

					//图列颜色
					$("#chart-bar-legend-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								legend:{
									textStyle:{
										color:color
									}
								}
							}
						});
						chartObj.init(objConfig);
					});

					//是否显示标签
					$("#chart-show-bar-label-check").change(function(){
						var isShow = $(this).is(":checked");

						//控制是否可以修改
						$("#chart-bar-font-color-select").attr("disabled",!isShow);
						$("#chart-bar-font-size-range").attr("disabled",!isShow);

						//控制是否可以修改
						if(isShow){
							$("#chart-bar-font-position-dropdown >button.dropdown-toggle").removeClass("disabled");
						}else{
							$("#chart-bar-font-position-dropdown >button.dropdown-toggle").addClass("disabled");
						}

						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								series:[
									{
										"itemStyle": {
											"normal": {
												"label": {
													"show":isShow
												}
											}
										}
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//选择字体颜色
					$("#chart-bar-font-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
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
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//选择字体大小
					$("#chart-bar-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-bar-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
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
							}
						});
						chartObj.init(objConfig);
					});

					//调整位置
					$("#chart-bar-font-position-dropdown >ul.dropdown-menu>li").click(function(){
						var $this = $(this);

						$this.siblings().removeClass("active");
						$this.addClass("active");

						//修改内容
						$("#chart-bar-font-position-dropdown >button.dropdown-toggle").html($this.find(">a").html()
						+"<span class=\"caret\"></span>");

						var position = $this.attr("data-value");
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
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
							}
						});
						chartObj.init(objConfig);
					});

					//x轴位置
					$("input[name='chart-x-position-radio']").click(function(){
						var position = $(this).val();

						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								xAxis: [
									{
										position: position
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//x轴颜色
					$("#chart-x-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								xAxis : [
									{
										"axisLine": {
											"lineStyle": {
												"color": color
											}
										}
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//x轴字体颜色
					$("#chart-x-font-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								xAxis : [
									{
										"axisLabel": {
											"textStyle": {
												"color": color
											}
										}
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//x轴字体大小
					$("#chart-x-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-x-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								xAxis : [
									{
										"axisLabel": {
											"textStyle": {
												"fontSize": size
											}
										}
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//x轴字体旋转角度
					$("#chart-x-text-rotate-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-x-text-rotate-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								xAxis : [
									{
										"axisLabel": {
											"rotate": size
										}
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//y轴位置
					$("input[name='chart-y-position-radio']").click(function(){
						var position = $(this).val();

						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								yAxis: [
									{
										position: position
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//y轴颜色
					$("#chart-y-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								yAxis : [
									{
										"axisLine": {
											"lineStyle": {
												"color": color
											}
										}
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//y轴字体颜色
					$("#chart-y-font-color-select").change(function(){
						var color = $(this).val();
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								yAxis : [
									{
										"axisLabel": {
											"textStyle": {
												"color": color
											}
										}
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//y轴字体大小
					$("#chart-y-font-size-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-y-font-size-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								yAxis : [
									{
										"axisLabel": {
											"textStyle": {
												"fontSize": size
											}
										}
									}
								]
							}
						});
						chartObj.init(objConfig);
					});

					//y轴字体旋转角度
					$("#chart-y-text-rotate-range").change(function(){
						var size = $(this).val();

						//设置值
						$("#chart-y-text-rotate-text").val(size);
						objConfig["option"] = _style = $.extend(true,_style,{
							barOption:{
								yAxis : [
									{
										"axisLabel": {
											"rotate": size
										}
									}
								]
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

			//-------------------1.地图-------------------------------
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

			var mapOptionStyle = _style.mapOption;
			if(mapOptionStyle && mapOptionStyle != null){
				var legendStyle = $.extend(true,{},{
					"legend": {
						"show": false,
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
				if(series && series[0]){
					var seriesStyle= $.extend(true,{},{series:[
						{
							"roam": true,
							"itemStyle": {
								"emphasis": {
									"label": {
										"textStyle": {
											"color": null,
											"fontSize": -1
										}
									}
								},
								"normal": {
									"color":null,
									"label": {
										"show":true,
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
					]},{
						series:series
					});

					//设置是否可以缩放地图
					if(seriesStyle.series[0].roam === false){
						$("#chart-iscan-zoom-control-check").attr("checked",false);
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


			//-------------------2.饼图-------------------------------
			var pieOptionStyle = _style.pieOption;
			if(pieOptionStyle && pieOptionStyle != null){

				var pieSeries = pieOptionStyle.series;
				if(pieSeries && pieSeries[0]){
					//样式
					var pieSeriesStyle= $.extend(true,{},{series:[
						{
							"radius": [null,null],
							"itemStyle": {
								"normal": {
									"label": {
										"show":true,
										"position":null,
										"textStyle": {
											"fontSize": -1
										}
									}
								}
							}
						}
					]},{
						series:pieSeries
					});

					var radius = pieSeriesStyle.series[0].radius;
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
					var textStyle= pieSeriesStyle.series[0].itemStyle.normal.label.show === false;
					if(textStyle){
						$("#chart-show-pie-label-check").attr("checked",false);

						//控制是否可以修改
						$("#chart-pie-font-size-range").attr("disabled",true);
						$("#chart-pie-font-position-dropdown >button.dropdown-toggle").addClass("disabled",true);
					}
					var textStyleFontSize = pieSeriesStyle.series[0].itemStyle.normal.label.textStyle.fontSize;
					if(textStyleFontSize > -1){
						$("#chart-pie-font-size-range").attr("value",textStyleFontSize).val(textStyleFontSize);
						$("#chart-pie-font-size-text").attr("value",textStyleFontSize).val(textStyleFontSize);
					}
					var textStylePosition = pieSeriesStyle.series[0].itemStyle.normal.label.position;
					if(textStylePosition != null){
						$("#chart-pie-font-position-dropdown >ul.dropdown-menu >li").removeClass("active");
						var $activeLi =  $("#chart-pie-font-position-dropdown >ul.dropdown-menu >li[data-value='"+textStylePosition+"']");

						var html1 = $activeLi.find(">a").html();
						$("#chart-pie-font-position-dropdown >button.dropdown-toggle >span.text").html(html1);
						$activeLi.addClass("active");
					}//end if(textStylePosition != null)
				}//end if(pieSeries && pieSeries[0])
			}//end if(pieOptionStyle && pieOptionStyle != null)

			//-------------------3.柱图-------------------------------
			var barOptionStyle = _style.barOption;
			if(barOptionStyle && barOptionStyle != null){
				var barSeries = barOptionStyle.series;
				if(barSeries && barSeries[0]){
					var barSeriesStyle= $.extend(true,{},{series:[
						{
							"itemStyle": {
								"normal": {
									"label": {
										"show":true,
										"position": null,
										"textStyle": {
											"color":null,
											"fontSize": -1
										}
									},
									"barBorderRadius":null
								}
							}
						}
					]},{
						series:barSeries
					});

					//边框倒角
					var barBorderRadius = barSeriesStyle.series[0].itemStyle.normal.barBorderRadius;
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
					if(barSeriesStyle.series[0].itemStyle.normal.label.show === false){
						$("#chart-show-bar-label-check").attr("checked",false);

						//控制是否可以修改
						$("#chart-bar-font-color-select").attr("disabled",true);
						$("#chart-bar-font-size-range").attr("disabled",true);
						$("#chart-bar-font-position-dropdown >button.dropdown-toggle").addClass("disabled",true);
					}
					var textStylePosition = barSeriesStyle.series[0].itemStyle.normal.label.position;
					if(textStylePosition != null){
						$("#chart-bar-font-position-dropdown >ul.dropdown-menu >li").removeClass("active");
						var $activeLi =  $("#chart-bar-font-position-dropdown >ul.dropdown-menu >li[data-value='"+textStylePosition+"']");

						var html1 = $activeLi.find(">a").html();
						$("#chart-bar-font-position-dropdown >button.dropdown-toggle >span.text").html(html1);
						$activeLi.addClass("active");
					}
					var textStyleColor = barSeriesStyle.series[0].itemStyle.normal.label.textStyle.color;
					if(textStyleColor != null){
						$("#chart-bar-font-color-select").attr("value",textStyleColor).val(textStyleColor);
						var $textStyleColorParent =  $("#chart-bar-font-color-select").parent("div");
						//保证控件刷新
						$textStyleColorParent.html($textStyleColorParent.html());
					}
					var textStyleFontSize = barSeriesStyle.series[0].itemStyle.normal.label.textStyle.fontSize;
					if(textStyleFontSize > -1){
						$("#chart-bar-font-size-range").attr("value",textStyleFontSize).val(textStyleFontSize);
						$("#chart-bar-font-size-text").attr("value",textStyleFontSize).val(textStyleFontSize);
					}

				}//end if(series && series[0])

				//是否显示图列
				var legendShow = (barOptionStyle.legend && barOptionStyle.legend.show === false) ? false :true;
				if(!legendShow){
					//控制是否可以修改图例文字颜色
					$("#chart-show-bar-legend-check").attr("checked",false);
					$("#chart-bar-legend-color-select").attr("disabled",true);
				}

				//图列颜色
				var legendColor = $.extend(true,{},{
					legend:{
						textStyle:{
							color:null
						}
					}
				},{
					legend : barOptionStyle.legend || {}
				});
				if(legendColor.legend.textStyle.color != null){
					$("#chart-bar-legend-color-select").attr("value",legendColor.legend.textStyle.color);
					var $parent =  $("#chart-bar-legend-color-select").parent("div");
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
									"fontSize": -1,
									"rotate": -1
								}
							}
						}
					]
				},{
					xAxis:barOptionStyle.xAxis || []
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
				var xAxisStyleTextRotate = xAxisStyle.xAxis[0].axisLabel.textStyle.rotate;
				if(xAxisStyleTextRotate > -1){
					$("#chart-x-text-rotate-range").attr("value",xAxisStyleTextRotate).val(xAxisStyleTextRotate);
					$("#chart-x-text-rotate-text").attr("value",xAxisStyleTextRotate).val(xAxisStyleTextRotate);
				}//end if(xAxisStyleTextRotate != null)

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
									"fontSize": -1,
									"rotate": -1
								}
							}
						}
					]
				},{
					yAxis:barOptionStyle.yAxis || []
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
				var yAxisStyleTextRotate = yAxisStyle.yAxis[0].axisLabel.textStyle.rotate;
				if(yAxisStyleTextRotate > -1){
					$("#chart-y-text-rotate-range").attr("value",yAxisStyleTextRotate).val(yAxisStyleTextRotate);
					$("#chart-y-text-rotate-text").attr("value",yAxisStyleTextRotate).val(yAxisStyleTextRotate);
				}//end if(yAxisStyleTextRotate != null)

			}//end if(barOptionStyle && barOptionStyle != null)

		};
    	
        return {
        	init:init,
        	getStyle:getStyle,
        	getContainer:getContainer,
        	setHeight:setHeight,
			MapDataHanlder:MapDataHanlder
        };
    })();


    return EChartMapStyle;
});