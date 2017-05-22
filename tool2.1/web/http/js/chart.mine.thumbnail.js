/***********************************************************************/
/**
 * 制图
 */
define(function(require, exports, module) {
	/**
	 * 浏览器判断
	 */
	var browerHanlder = function() {
		var agent = navigator.userAgent.toLowerCase();
		var regStr_ie = /msie [\d.]+;/gi;
		var regStr_ff = /firefox\/[\d.]+/gi;
		var regStr_chrome = /chrome\/[\d.]+/gi;
		var regStr_saf = /safari\/[\d.]+/gi;
		
		// IE
		var userAgent = navigator.userAgent.toLowerCase();
		jQuery.browser = {
			version : (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
			safari : /webkit/.test(userAgent),
			opera : /opera/.test(userAgent),
			msie : /msie/.test(userAgent) && !/opera/.test(userAgent),
			mozilla : /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
		};
		
		$("#remove-top-btn").click(function() {
			$("#top-alert-container").hide();
		});
		//IE 不支持
		if (agent.indexOf("msie") > 0) {
			var test = jQuery.browser.version;
			var version = parseInt(test);
//			if (version < 10) {
//			} else {
//				$("#top-alert-container").hide();
//			}

			$("#top-alert-container").show();
			return version;
		}
		
		//edge不支持
		if(agent.indexOf("edge") > 0){
			$("#top-alert-container").show();
			return "edge";
		}
		
		// Chrome
		if (agent.indexOf("chrome") > 0) {
			$("#top-alert-container").hide();
			return agent.match(regStr_chrome);
		}
		// firefox
		if (agent.indexOf("firefox") > 0) {
			$("#top-alert-container").hide();
			return agent.match(regStr_ff);
		}
		
		// Safari
		if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
			$("#top-alert-container").hide();
			return agent.match(regStr_saf);
		}
		
		//默认不支持
		$("#top-alert-container").show();
	};

	/**
	 * 配置文件操作
	 */
	var ConfigHanlder = (function(){
		var _config = null;

		var getConfig = function(callback){
			if(_config != null){
				callback && callback(_config);
				return ;
			}

			var configUrl = "js/config/chart.name.config.json";
			$.getJSON(configUrl,function(config){
				_config = config.echarts || {};

				if(config.d3){
					for(var key in config.d3){
						if(key){
							_config[key] = config.d3[key];
						}
					}
				}
				callback && callback(_config);
			});
		};

		return {
			getConfig:getConfig
		};
	})();

	/**
	 * 获取图库列表
	 */
	var MyGalleryList = (function(){

		/**
		 * 初始化我的图库
		 */
		var init = function(){
			//清空列表
			$("#my-gallery-thumbnail").html("");

			$("#my-gallery-thumbnail").off("click","a.data-dtail");
			$("#my-gallery-thumbnail").on("click","a.data-dtail",function(){
				var $panel = $(this).parent("span.ui").parent("div.panel-heading").parent("div.panel");
				$(this).html("<i class='icon angle up icon' style='margin-right: 0;'></i>收起");
				var isHide = $panel.find("ul.list-group").hasClass("hide");
				if(isHide){
					$(this).html("<i class='icon angle up icon' style='margin-right: 0;'></i>收起");
					$panel.find("ul.list-group").removeClass("hide");
				}else{
					$(this).html("<i class='icon angle down icon' style='margin-right: 0;'></i>详情");
					$panel.find("ul.list-group").addClass("hide");
				}
			});

			$("#my-gallery-thumbnail").off("click","a.data-edit,a.data-delete");
			$("#my-gallery-thumbnail").on("click","a.data-edit,a.data-delete",function(){
				var $this = $(this);

				var isEdit = $this.hasClass("data-edit");
				if(isEdit){
					var currentChartId = $this.attr("data-id");
					var chartType = $this.attr("data-chart-type");
					if(!currentChartId || currentChartId == ""){
						return ;
					}
					var url = null;
					if(chartType === 1 || chartType === "1"){
						//d3图
						url = "editd3?chart-id="+currentChartId;
					}else if(chartType === 0 || chartType === "0"){
						//echarts图
						url = "editecharts?chart-id="+currentChartId;
					}else if(chartType === 2 || chartType === "2"){
						//echarts图
						url = "edithighcharts?chart-id="+currentChartId;
					}
					else if(chartType === 3 || chartType === "3"){
						//echarts图
						url = "editfusioncharts?chart-id="+currentChartId;
					}
					window.open(url,"_blank");
				}else{
					var isDel = $this.hasClass("data-delete");
					if(isDel){
						var currentChartId = $this.attr("data-id");
						if(!currentChartId || currentChartId == ""){
							return ;
						}

						var alertMsg = "<a class='ui blue button delete' type='button' style='margin-right: 8px;' >删除</a>"+
							"<a class='ui button cancle' type='button'>取消</a>";
						SGIS.UI.alert(alertMsg,
							null,true,function(modal,close){
								modal.css({
									"top":"10%",
									"width":"300px",
									"margin-left":"-20px",
									"height":"100px",
									"overflow":"hidden"
								});

								modal.find(".header>i").addClass("hide");
								modal.find(".header>.ui.label").css({
									"font-size":"14px",
									"background-color":"transparent"
								}).html("确定要删除此图?删除后不可恢复！");
								modal.find(".content>.ui.label").removeClass("blue").css({
									"font-size":"14px",
									"background-color":"transparent"
								});

								modal.find(".content>.ui.label>a.delete").off("click");
								modal.find(".content>.ui.label>a.delete").on("click",function(){
									//关闭
									close && close();

									SGIS.API.del("chart/?",currentChartId).json(function(re){
										SGIS.UI.alert(re.message,
											null,false,function(modal){
												modal.css({
													"top":"10%",
													"height":"60px",
													"width":"300px",
													"margin-left":"-20px",
													"overflow":"hidden",
													"background-color":"transparent",
													"border":"none"
												});

												modal.find(".content>.ui.label").css({
													"font-size":"16px"
												});
											});
										if(re.code == 0){
											init();
											//获取列表信息
											getMyGalleryList(new SGIS.PageInfo(1,10),
												function(isEmpty){
													if(isEmpty){
														init();
													}
													//启动加载
													$("#my-gallery-loading").removeClass("hide");
												},function(){
													//隐藏加载
													$("#my-gallery-loading").addClass("hide");
												}
											);
										}
									});
								});

								modal.find(".content>.ui.label>a.cancle").off("click");
								modal.find(".content>.ui.label>a.cancle").on("click",function(){
									close && close();
								});
							});
					}//end if(isDel) else
				}//end if(isEdit) else
			});
		};

		/**
		 * 获取我的图库列表
		 */
		var getMyGalleryList = function(pageInfo,beforesend,callback){
			if(!pageInfo || pageInfo==null){
				//默认第一页，每页10条
				pageInfo = new SGIS.PageInfo(1,10);
			}

			beforesend && beforesend(false);

			//读取配置
			ConfigHanlder.getConfig(function(chartNameConfig){
				SGIS.API.get("chart/my/gallery/list")
					.data(JSON.stringify({
						pageNumber:pageInfo.getPageNumber(),
						pageSize:pageInfo.getPageSize()
					}))
					.json(function(re){
						if(re && re.code == 0){
							if(re.data){
								var total = re.data.total;
								var list = re.data.list;
								var start =  re.data.start;

								if(list && list.length > 0){
									for(var i=0,len=list.length;i<len;i++){
										showMyGalleryListInfo((start+i+1),list[i],chartNameConfig);
									}
								}

								var paging = new Paging("my-gallery-paging",pageInfo,total);
								paging.setClickEvent(function(pageNumber){
									beforesend && beforesend(true);
									//翻页查询
									SGIS.API.get("chart/my/gallery/list")
										.data(JSON.stringify({
											pageNumber:pageNumber,
											pageSize:pageInfo.getPageSize()
										}))
										.json(function(re){
											if(re && re.code == 0){
												if(re.data){
													var list = re.data.list;
													var start =  re.data.start;

													if(list && list.length > 0){
														for(var i=0,len=list.length;i<len;i++){
															showMyGalleryListInfo((start+i+1),list[i],chartNameConfig);
														}
													}
												}
											}else{
												SGIS.UI.alert(re.message,
													null,false,function(modal){
														modal.css({
															"top":"40%",
															"height":"60px",
															"width":"300px",
															"margin-left":"-20px",
															"overflow":"hidden",
															"background-color":"transparent",
															"border":"none"
														});

														modal.find(".content>.ui.label").css({
															"font-size":"16px"
														});
													});
											}
											callback && callback();
										});
								});//end paging.setClickEvent
							}
						}else{
							SGIS.UI.alert(re.message,
								null,false,function(modal){
									modal.css({
										"top":"40%",
										"height":"60px",
										"width":"300px",
										"margin-left":"-20px",
										"overflow":"hidden",
										"background-color":"transparent",
										"border":"none"
									});

									modal.find(".content>.ui.label").css({
										"font-size":"16px"
									});
								});
						}
						callback && callback();
					});
			});//end ConfigHanlder.getConfig(function(chartNameConfig)
		};

		/**
		 * 显示列表信息
		 * @param index
		 * @param info
		 * @param chartNameConfig
		 */
		var showMyGalleryListInfo = function(index,info,chartNameConfig){
			if(info){

				//查看图库地址
				var url = SGIS.API.getURL("");
				var chartIsfromSgis = "";
				if(info.chartIsfromSgis === 1 || info.chartIsfromSgis === "1"){
					url += "http/sgis.html?chart-id="+info.id;
					chartIsfromSgis = "是";
				}else {
					url += "http/chart.html?chart-id="+info.id;
					chartIsfromSgis = "否";
				}
				//目录
				var chartMome = (!info.chartMome || info.chartMome == null || info.chartMome == "null" )
					? "" : info.chartMome;

				//图类型
				var chartTypeChart = (info.chartIsfromSgis === 1 || info.chartIsfromSgis === "1")
					? "成果保存" : (chartNameConfig[info.chartTypeChart] || info.chartTypeChart);

				//缩略图
				var content = "<div class='col-sm-6 col-md-3'>"+
						"<div class='thumbnail'>"+
							"<div class='ui ribbon label' style='font-weight: bold;'>"+index+"</div>"+
							"<h4>"+
								"<a class='ui' href='"+url+"' target='_blank' title='查看："+info.chartName+"'>"+
									"<i class='icon photo'></i>"+info.chartName+"</h4>"+
								"</a>"+
							"</h4>"+
							"<a class='ui big-img thumbnail' href='"+url+"' target='_blank' title='查看："+info.chartName+"'>"+
								"<img src='"+info.chartImagePath+"' alt='"+info.chartName+"' />"+
							"</a>"+
							"<div class='caption'>"+
								"<p class='chart-mome' title='"+chartMome+"'>"+chartMome+"</p>"+
								"<div class='panel panel-default'>"+
									"<div class='panel-heading'>"+
										"<span class='ui pull-left'>"+
											"<a href='javascript:;' title='详细信息' class='ui link blue data-dtail'><i class='angle down icon' style='margin-right: 0;'></i>详情</a>"+
										"</span>"+
										"<span class='ui pull-right'>";
				//成果保存不可编辑
				if(!(info.chartIsfromSgis === "1" || info.chartIsfromSgis === 1)){
					content += 				"<a href='javascript:;' title='编辑可视化图' data-id='"+info.id+"' data-chart-type='"+info.chartType+"' class='ui link blue data-edit'><i class='icon edit'></i></a>";
				}
					content +=				"<a href='javascript:;' title='删除可视化图' data-id='"+info.id+"' class='ui link red data-delete' style='margin-left:5px;'><i class='icon delete'></i></a>"+
										"</span>"+
										"<div class='clearfix'></div>"+
									"</div>"+
									"<ul class='list-group hide' style='position:absolute;z-index:10000;'>"+
										"<li class='list-group-item'>"+
											"<span class='badge'>分类目录</span>"+
											info.tgalleryCatalog.catalogName+
										"</li>"+
										"<li class='list-group-item'>"+
											"<span class='badge'>图类型</span>"+
											chartTypeChart+
										"</li>"+
										"<li class='list-group-item'>"+
											"<span class='badge'>来自成果保存</span>"+
											chartIsfromSgis+
										"</li>"+
										"<li class='list-group-item'>"+
											"<span class='badge'>创建时间</span>"+
											SGIS.Time.longTimeToFullStringTime(info.createTime," ")+
										"</li>"+
										"<li class='list-group-item'>"+
											"<span class='badge'>修改时间</span>"+
											SGIS.Time.longTimeToFullStringTime(info.modifyTime," ")+
										"</li>"+
										"<li class='list-group-item'>"+
											"<span class='badge'>分享次数</span>"+
											info.chartShareCount+
										"</li>"+
									"</ul>"+
								"</div>"+
							"</div>"+
						"</div>"+
					"</div>";

				$(content).appendTo($("#my-gallery-thumbnail"));
			}
		};

		return {
			init:init,
			getMyGalleryList:getMyGalleryList
		};
	})();

	/**
	 * 接口
	 */
	var Hanlder = (function() {
		
		/**
		 * 上传图标初始化
		 */
		var init = function(isCanInit) {
			browerHanlder();
			beforeInit();
			if(!isCanInit)
                return ;
             
			UserInfo.getUserInfo(function(info){
				MyGalleryList.init();
				
				if(info && info != null){
					$("#logout-span").removeClass("hide");
					$("#logout-span #login-name").html(info.userName);

					//获取列表信息
					MyGalleryList.getMyGalleryList(new SGIS.PageInfo(1,10),
						function(isEmpty){
							if(isEmpty){
								MyGalleryList.init();
							}
							//启动加载
							$("#my-gallery-loading").removeClass("hide");
						},function(){
							//隐藏加载
							$("#my-gallery-loading").addClass("hide");
						}
					);
				}else{
					$("#logout-span").addClass("hide");
					$("#logout-span #login-name").html("");
					SGIS.UI.alert("用户未登录！",
						null,false,function(modal){
							modal.css({
								"top":"40%",
								"height":"60px",
								"width":"300px",
								"margin-left":"-20px",
								"overflow":"hidden",
								"background-color":"transparent",
								"border":"none"
							});

							modal.find(".content>.ui.label").css({
								"font-size":"16px"
							});
						});
					setTimeout(function(){
						if(!window.close()){
							window.location.href = "index.html";
						}
					},1500);
				}
			});
		};

		/**
		 * 初始化之前
		 */
		var beforeInit = function(){
			$("#change_image").click(function() {
				window.location = "index.html";
			});
			
			$("#go_gallery").click(function() {
				var url = SGIS.API.getURL("")+"http/";
				window.open(url, "_blank");
			});
		};

		return {
			init : init
		};
	})();
	
	
	return Hanlder;
});









