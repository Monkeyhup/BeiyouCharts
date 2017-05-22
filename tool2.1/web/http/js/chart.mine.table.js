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
			$("#my-gallery-tbody").html("");
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
											bindBigImgLook();
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
						bindBigImgLook();
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
				var html = "<tr>";

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

				html += "<td class='single line'>";
				html += "<div class='ui ribbon label'>"+index+"</div>";
				html += "<a href='"+url+"' title='查看："+info.chartName+"' target='_blank'>"+info.chartName+"</a>";
				html += "</td>";

				//目录
				var chartMome = (!info.chartMome || info.chartMome == null || info.chartMome == "null" )
					? "" : info.chartMome;
				html += "<td>"+chartMome+"</td>";

				html += "<td><div class='text-center'>"+info.tgalleryCatalog.catalogName+"</div></td>";
				html += "<td>";
				html += "<a class='ui big-img thumbnail' href='javascript:;' title='查看大图'>";
				html += "<div class='text-center'>";
				html += "<img width='120' data-holder-rendered='true' data-title='"+info.chartName+"' src='"+info.chartImagePath+"' />";
				html += "</div>";
				html += "</a>";
				html += "</td>";

				//图类型
				var chartTypeChart = (info.chartIsfromSgis === 1 || info.chartIsfromSgis === "1")
					? "成果保存" : (chartNameConfig[info.chartTypeChart] || info.chartTypeChart);
				html += "<td><div class='text-center'>"+chartTypeChart+"</div></td>";
				html += "<td><div class='text-center'>"+chartIsfromSgis+"</div></td>";
				html += "<td>"+SGIS.Time.longTimeToFullStringTime(info.createTime,"<br/>")+"</td>";
				html += "<td>"+SGIS.Time.longTimeToFullStringTime(info.modifyTime,"<br/>")+"</td>";
				html += "<td><div class='text-center'>"+info.chartShareCount+"</div></td>";

				html += "</tr>";

				$("#my-gallery-tbody").append(html);
			}
		};

		/**
		 * 绑定
		 */
		var bindBigImgLook = function(){

			$("#my-gallery-tbody a.big-img").off("click");
			$("#my-gallery-tbody a.big-img").on("click",function(){
				var $this = $(this);
				var $img = $this.find("img");

				if($img.length > 0){
					var src = $($img[0]).attr("src");
					if(src && src != ""){
						$("#img-modal").modal("show");

						$("#myModalLabel span").html($($img[0]).attr("data-title") || "");
						var img = "<img width='100%' src='"+src+"' />";
						$("#img-modal-img").html(img);
					}
				}
			});
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









