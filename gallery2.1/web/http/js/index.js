/**
 * 首页
 */
define(function(require, exports, module) {
	//tool的模块基本url
	var TOOL_URL = SGIS.Config.TOOL_MODULE_URL;

	var ThirdChartsConfig = require("js/component/third.charts.config");
	var chartListLiTemplate = require("template/chart.list.li.html.tpl");

	/**
	 * 视图类
	 */
	var UI = (function(){
		//判断是否被iframe引用
		var _isIframe = false;

		/**
		 * 初始化
		 */
		var init = function(){
			//当前页面被iframe引用
			if(top.location !== location){
				_isIframe = true;

				$(".cn_left>.my-fixed").addClass('iframe');
				$(".cn_right>.my-fixed").addClass('iframe');
				$(".cn_right>.clear-my-fixed").addClass('iframe');
				$("body").css({"padding-top":"50px"});
			}else{
				_isIframe = false;

				$(".cn_left>.my-fixed").removeClass('iframe');
				$(".cn_right>.my-fixed").removeClass('iframe');
				$(".cn_right>.clear-my-fixed").removeClass('iframe');
				$("body").css({"padding-top":"0px"});
			}
		};

		/**
		 * 判断是否当前页面被iframe引用
		 */
		var isIframe = function(){
			return _isIframe;
		};
		
		/**
		 * 获得浏览器高度
		 */
		var browerHeight = function() {
			// 不同显示屏显示浏览器的高度
			var windowHeight = $(window).height();
			setTimeout(function() {
				var chartListHeight = $("#tj_wrapper").height();
				var winHeight = windowHeight;
				if (chartListHeight < winHeight-140) {
					winHeight = winHeight - 10;
				} else {
					winHeight = chartListHeight+128;
				}

				//取得当前目录
				var currentCatalogId = GalleryCatalog.getCurrentCatalogId();
				$(".cn_left").css("min-height", currentCatalogId >0 ? winHeight+45 : winHeight);
				$(".cn_right").css("min-height",winHeight);
				$("#tj_container").css("min-height",winHeight-128);
			}, 100);
		};
		
		var showLoading = function(text){
			$("#loading").addClass("active");
			if(text){
				$("#loading>div.loader").html(text);
			}
		};
		
		var hideLoading = function(){
			$("#loading").removeClass("active");
			$("#loading>div.loader").html($("#loading>div.loader").attr("data-loading"));
		};
		
		/**
		 * 重置css样式
		 * @param biggerOrsamllOrList
		 * 			样式方式
		 */
		var resetChartGridCss = function(biggerOrsamllOrList){
			if(!biggerOrsamllOrList || biggerOrsamllOrList == ""){
				biggerOrsamllOrList = $("#icon-change >.menu .item.active").attr("id");
				if(!biggerOrsamllOrList || biggerOrsamllOrList == ""){
					return ;
				}
			}

			var $chartList = $("#chart-list");
			if(biggerOrsamllOrList == "bigger"){
				$("ul.tj_gallery li.image .circular.link").off("click");
				//移除列表形式
				$chartList.removeClass("list-title").removeClass("list-detail");

				$(".image img").css({
					"width" : 250,
					"height" : 240
				});
				$(".grid figure").css({
					"width" : 250,
					"height" : 240
				});
				
				$(".circular.heart.icon.link").each(function(re, element) {
					var chartName = $(element).attr("data-value");
					
					if(chartName && chartName.length > 21){
						chartName = chartName.substr(0,17);
						chartName += "...";
					}
					$(element).html(chartName);
				});
			}else if(biggerOrsamllOrList == "small"){
				$("ul.tj_gallery li.image .circular.link").off("click");
				//移除列表形式
				$chartList.removeClass("list-title").removeClass("list-detail");

				$(".image img").css({
					"width" : 183,
					"height" : 170
				});
				$(".grid figure").css({
					"width" : 183,
					"height" : 170
				});
				
				$(".circular.heart.icon.link").each(function(re, element) {
					var chartName = $(element).attr("data-value");
					
					if(chartName && chartName.length > 15){
						chartName = chartName.substr(0,12);
						chartName += "...";
					}
					$(element).html(chartName);
				});
			}else if(biggerOrsamllOrList == "list-title"){
				//使用列表形式
				$chartList.removeClass("list-detail").addClass("list-title");

				$(".image img").css({
					"width" : 185,
					"height" : 170
				});
				$(".grid figure").css({
					"width" : 185,
					"height" : 165
				});

				$(".circular.heart.icon.link").each(function(re, element) {
					var chartName = $(element).attr("data-value");
					$(element).html(chartName);
				});

				//绑定事件
				$("ul.tj_gallery.list-detail li.image .circular.link").off("click");
				var $linkTitle = $("ul.tj_gallery.list-title li.image .circular.link");
				$linkTitle.off("click");
				$linkTitle.on("click",function(){
					var $this = $(this);

					var $parent = $this.parent("div.grid-right").parent("li.image");
					if($parent.length>0){
						$parent.find(">a.grid>figure>img").click();
					}
				});
			}else if(biggerOrsamllOrList == "list-detail"){
				//使用列表形式
				$chartList.removeClass("list-title").addClass("list-detail");

				$(".image img").css({
					"width" : 185,
					"height" : 170
				});
				$(".grid figure").css({
					"width" : 185,
					"height" : 165
				});

				$(".circular.heart.icon.link").each(function(re, element) {
					var chartName = $(element).attr("data-value");
					$(element).html(chartName);
				});

				//绑定事件
				$("ul.tj_gallery.title-title li.image .circular.link").off("click");
				var $linkDetail = $("ul.tj_gallery.list-detail li.image .circular.link");
				$linkDetail.off("click");
				$linkDetail.on("click",function(){
					var $this = $(this);

					var $parent = $this.parent("div.grid-right").parent("li.image");
					if($parent.length>0){
						$parent.find(">a.grid>figure>img").click();
					}
				});
			}//else if(biggerOrsamllOrList == "bigger")

			//重置一下样式
			browerHeight();
		};
		
		return {
			init:init,
			isIframe:isIframe,
			browerHeight:browerHeight,
			showLoading:showLoading,
			hideLoading:hideLoading,
			resetChartGridCss:resetChartGridCss
		};
	})();
	
	/**
	 * 用户信息
	 */
	var UserInfo = (function(){
		var userInfo = null;
		
		/**
		 * 获取用户信息
		 */
		var getUserInfo = function(callback){
			if(userInfo != null){
				callback && callback(userInfo);
				return;
			}
			SGIS.API.get("user/is/login").json(function(re){
				if(re && re.code == 0){
					userInfo = re.data;
				}else{
					userInfo = null;
				}
				callback && callback(userInfo);
			});
		};
		
		return {
			getUserInfo:getUserInfo
		};
	})();
	
	
	/**
	 * 绑定图点击
	 */
	var GalleryImgClick = (function(){
		
		var bindImgClick = function(){
			//绑定标题气泡
			$('.circular.heart.icon.link').popup({
				on : 'hover',
				position : 'top center'
			});
			
			//页面跳转
			$("#chart-list img").off("click");
			$("#chart-list img").click(function(re) {
				var $this = $(this);

				//如果开启排序,禁止跳转
				if(SortableHanlder.isOpenSortable()){
					SGIS.UI.alert("请拖动排序！",
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
					return true;
				}//end if(SortableHanlder.isOpenSortable())
				
				//检索关键字
				var searchText = $("input#searchText").val();
				var cCatalogId = GalleryCatalog.getCurrentCatalogId();
				
				var id = $this.attr("data-id");
				var chartIsFromSgis = $this.attr("data-is-form-sgis");
				var chartIsThirdCharts = $this.attr("data-is-third-charts");

				//拼接参数
				var urlParam = "chart-id="+id+"&chart-catalog="+cCatalogId+"&keyword="+searchText;
				if(chartIsThirdCharts === 1 || chartIsThirdCharts === "1"){
					//取得当前使用第三方的长度
					var currentUsedLength = ThirdChartsConfig.getCurrentUsedLength();
					//总个数
					var totalCount = $("#chart-list img").length;
					//数据库中图
					if(totalCount > currentUsedLength){
						//找到当前的数据库中的第一个，用于翻页使用
						var $firstDbGallery = $($("#chart-list img")[currentUsedLength]);

						var chartId1 = $firstDbGallery.attr("data-id");
						var chartIsFromSgis1 = $firstDbGallery.attr("data-is-form-sgis");
						if(chartIsFromSgis1 === 1 || chartIsFromSgis1 === "1"){
							urlParam += "&url=sgis.html&url-id="+chartId1;
						}else{
							urlParam += "&url=chart.html&url-id="+chartId1;
						}
					}//end if(totalCount > currentUsedLength)

					var dataUrl = $this.attr("data-url");
					if(dataUrl.indexOf("?") > -1){
						//配置地址中已经存在参数了，只要拼接参数就行
						urlParam = "&" + urlParam;
					}else{
						urlParam = "?" + urlParam;
					}

					//重定向
					var url = dataUrl + urlParam;
					window.location.href = url;
				}else if(chartIsFromSgis === 1 || chartIsFromSgis === "1"){
					//重定向
					window.location.href = "./sgis.html?"+urlParam;
				}else{
					//重定向
					window.location.href = "./chart.html?"+urlParam;
				}
			});
		};
		
		return {
			bindImgClick:bindImgClick
		};
	})();
	
	/**
	 * 图库
	 */
	var Gallery = (function() {
		/**是否开启滚动加载*/
		var IS_OPEN_SCROLL_LOAD = false;
		/**是否正在加载*/
		var IS_SCROLLING = false;

		/**
		 * 设置是否能加载
		 */
		var setIsopenScrollLoad = function(isopenScrollLoad){
			IS_OPEN_SCROLL_LOAD = isopenScrollLoad;

			if(!IS_OPEN_SCROLL_LOAD){
				$("#my-gallery-loading").removeClass("hide");
				$("#my-gallery-loading #load-data").addClass("hide");
				$("#my-gallery-loading #no-data").removeClass("hide");
			}
		};

		/**
		 * 设置是否在加载
		 */
		var setIsScrolling = function(isScrolling,isShow){
			IS_SCROLLING = isScrolling;

			if(isShow){
				if(IS_SCROLLING){
					$("#my-gallery-loading").removeClass("hide");
					$("#my-gallery-loading #load-data").removeClass("hide");
					$("#my-gallery-loading #no-data").addClass("hide");
				}else{
					$("#my-gallery-loading").addClass("hide");
					$("#my-gallery-loading #load-data").removeClass("hide");
					$("#my-gallery-loading #no-data").addClass("hide");
				}
			}
		};
		
		/**
		 * 初始化
		 */
		var init = function(){
			UI.showLoading();
			UI.browerHeight();

			UserInfo.getUserInfo(function(userInfo){
				//判断是否是管理员
				var isAdmin = (userInfo != null && userInfo.userAdmin === 1);

				//先使用根
				GalleryCatalog.setCurrentCatalogId(0);
				GalleryCatalog.initGallertCatalog(userInfo,function(){
					UI.browerHeight();
					//获取参数
					var urlParam = window.location.hash.replace(/^#!\/?/,"");
					if(urlParam && urlParam != null){
						var urlParamArr = urlParam.split("/");
						if(urlParamArr.length == 1){
							if(typeof urlParamArr[0] == "string"
								|| typeof urlParamArr[0] == "number"){
								var CCatalogId = parseInt(urlParamArr[0]);
								if(CCatalogId > 0){
									GalleryCatalog.setCurrentCatalogId(CCatalogId);
									//选中目录
									GalleryCatalog.setFirstClassCatalogActiveIfExist(CCatalogId);
								}//end if(CCatalogId > 0)
							}//end if
						}else if(urlParamArr.length >= 2){
							if(typeof urlParamArr[0] == "string"
								|| typeof urlParamArr[0] == "number"){
								var CCatalogId = parseInt(urlParamArr[0]);
								if(CCatalogId > 0){
									GalleryCatalog.setCurrentCatalogId(CCatalogId);
									//选中目录
									GalleryCatalog.setFirstClassCatalogActiveIfExist(CCatalogId);
								}//end if(CCatalogId > 0)
							}//end if
							var text = urlParamArr[1];
							if(text){
								text = $.trim(text);
								if(text != "null" && text != "undefined"){
									//设置文本
									$("input#searchText").attr("value", text).val(text);
								}
							}//end if(text)
						}//end if(urlParamArr.length == 1) else
					}//end if(urlParam && urlParam != null)
					
					//取得当前的目录
					var cCatalogId = GalleryCatalog.getCurrentCatalogId();

					UI.showLoading();
					Gallery.setIsScrolling(true,false);
					//必须是管理员并且选中指定目录内排序
					SortableHanlder.init(isAdmin,cCatalogId,function(){{
						//取得对应结果
						GalleryChart.getGalleryChartsBycatalogId(new SGIS.PageInfo(1,15),
							cCatalogId,userInfo,function(currentCount){

								//绑定图点击
								GalleryImgClick.bindImgClick();
								Gallery.setIsScrolling(false,false);

								UI.hideLoading();
								UI.browerHeight();

								if(currentCount < 15){
									setIsopenScrollLoad(false);
								}else{
									setIsopenScrollLoad(true);
								}
								bindScrollScroll();
							});
					}});
				});
			});
			
			bindEvent();
		};

		/**
		 * 绑定滚动加载时间
		 */
		var bindScrollScroll = function(){
			//滚动高度
			var offsetHeight = UI.isIframe() ? 25 : 65;

			/*返回顶部*/
			$('#roll_top').hide();
			//绑定
			$(window).scroll(function(){
				var scrollHeight = $(window).scrollTop();
				if(scrollHeight >= offsetHeight){
					$(".cn_left>.my-fixed").addClass('active');
					$(".cn_right>.my-fixed").addClass('active');
					$(".cn_right>.clear-my-fixed").addClass('active');
				}else{
					$(".cn_left>.my-fixed").removeClass('active');
					$(".cn_right>.my-fixed").removeClass('active');
					$(".cn_right>.clear-my-fixed").removeClass('active');
				}

				if (scrollHeight > 300) {
					//当滑动栏向下滑动时，按钮渐现的时间
					$('#roll_top').fadeIn(400);
				} else {
					//当页面回到顶部第一屏时，按钮渐隐的时间
					$('#roll_top').fadeOut(0);
				}
				if($(window).scrollTop() >= ($(document).height()-$(window).height())){
					//是否开启滚动加载
					if(IS_OPEN_SCROLL_LOAD){
						window.scrollTo(0,parseInt($(window).scrollTop())-20);
						//正在加载
						if(IS_SCROLLING){
							console.log("正在加载");
							return ;
						}
						//启动加载
						setIsScrolling(true,true);

						//下一页
						var pageInfo = GalleryChart.getPageInfo();
						pageInfo.pageNumber = pageInfo.pageNumber+1;

						//取得当前的目录
						var cCatalogId = GalleryCatalog.getCurrentCatalogId();
						UserInfo.getUserInfo(function(userInfo){
							//取得对应结果
							GalleryChart.getGalleryChartsBycatalogId(pageInfo,
								cCatalogId,userInfo,function(currentCount){
									//绑定图点击
									GalleryImgClick.bindImgClick();
									UI.browerHeight();

									//停止加载
									setIsScrolling(false,true);

									//没有下一页了
									if(currentCount < 15){
										setIsopenScrollLoad(false);
									}else{
										setIsopenScrollLoad(true);
									}
								},true);
						});
					}else{
						$("#my-gallery-loading").removeClass("hide");
						$("#my-gallery-loading #load-data").addClass("hide");
						$("#my-gallery-loading #no-data").removeClass("hide");
					}
				}//end  if...
			});
		};
		
		/**
		 * 
		 */
		var bindEvent = function(){
			//下拉注册
			$(".ui.selection.dropdown").dropdown();

			//checkbox事件
			$('.ui.checkbox').checkbox();

			//开始排序，关闭排序
			$("input[name='sortable-switch-input']").change(function(){
				var $this = $(this);
				var $next = $this.next("label");
				var $chartList = $("#chart-list");
				if($this.is(":checked")){
					$next.find("b").text($next.attr("data-open"));
					$chartList.addClass("tj_gallery_drag_on");
					SortableHanlder.createSortable();
				}else{
					$next.find("b").text($next.attr("data-close"));
					$chartList.removeClass("tj_gallery_drag_on");
					SortableHanlder.destroySortable();
				}
			});
			
			//切换css
			$("#icon-change .menu >div").click(function(){
				var id = $(this).attr("id");
				UI.resetChartGridCss(id);
			});

			//回到顶部
			$('#roll_top').click(function () {
				//返回顶部所用的时间 返回顶部也可调用goto()函数
				$('html,body').animate({
					scrollTop : '0px'
				}, 300);
			});

			//跳转到工具
			$("#goto-tool-btn").click(function(){
				window.open(TOOL_URL,"_blank");
			});
			
			// 点击事件
			$("button#searchBtn").click(function() {
				//-----------------------------用户信息-------------------------------------------
				//取得对应结果
				UI.showLoading();
				//取得当前的目录
				var cCatalogId = GalleryCatalog.getCurrentCatalogId();
				UserInfo.getUserInfo(function(userInfo){
					Gallery.setIsScrolling(true,false);
					GalleryChart.getGalleryChartsBycatalogId(new SGIS.PageInfo(1,15),
						cCatalogId,userInfo,function(currentCount){
					
						//绑定图点击
						GalleryImgClick.bindImgClick();
						Gallery.setIsScrolling(false,false);
						
						UI.hideLoading();
						UI.browerHeight();

						if(currentCount < 15){
							setIsopenScrollLoad(false);
						}else{
							setIsopenScrollLoad(true);
						}

					});
				});
				//------------------------------------------------------------------------
			});
			// 回车事件
			$("input#searchText").on("keypress", function(e) {
				if (e.keyCode && e.keyCode == 13) {
					//-----------------------------用户信息-------------------------------------------
					//取得对应结果
					UI.showLoading();
					//取得当前的目录
					var cCatalogId = GalleryCatalog.getCurrentCatalogId();
					UserInfo.getUserInfo(function(userInfo){
						Gallery.setIsScrolling(true,false);
						GalleryChart.getGalleryChartsBycatalogId(new SGIS.PageInfo(1,15),
							cCatalogId,userInfo,function(currentCount){
						
							//绑定图点击
							GalleryImgClick.bindImgClick();
							Gallery.setIsScrolling(false,false);
							
							UI.hideLoading();
							UI.browerHeight();

							if(currentCount < 15){
								setIsopenScrollLoad(false);
							}else{
								setIsopenScrollLoad(true);
							}

						});
					});
					//------------------------------------------------------------------------
				}
			});
			
			//点击事件
			$("input#searchText").on("click", function(e) {
				this.select();
			});
		};
		
		return {
			init:init,
			setIsScrolling:setIsScrolling,
			setIsopenScrollLoad:setIsopenScrollLoad
		};
	})();
	
	/**
	 * 图集目录
	 */
	var GalleryCatalog = (function(){
		//var classes= ["browser icon", "user icon",
		//	"yen icon","truck icon", "building icon",
		//	"rocket icon","laptop icon", "puzzle piece icon",
		//	"sitemap icon","bookmark icon", "male icon" ];
		//var subClasses = [ "wrench icon", "building icon",
		//	"cart basic icon","food icon", "hospital icon",
		//	"gift icon", "trello icon","trello icon" ];
		
		var _currentCatalogId = 0;	//根
		
		/**
		 * 设置当前的根节点
		 * @param catalogId
		 * 			获取用户的id
		 */
		var setCurrentCatalogId = function(catalogId){
			_currentCatalogId = catalogId;
		};
		
		/**
		 * 取得当前的根节点
		 */
		var getCurrentCatalogId = function(){
			return _currentCatalogId;
		};
		
		/**
		 * 获取图集目录
		 * @param userInfo 当前用户信息
		 * @param callback 回调函数
		 */
		var initGallertCatalog = function(userInfo,callback){
			//获取根下的所有
			var catalogId = getCurrentCatalogId();	
			var $catalogList = $("#catalog-list").html("");

			UserInfo.getUserInfo(function(userInfo){
				var isAdmin = (userInfo != null && userInfo.userAdmin === 1);
				$("#catalog-manger").html("");
				SGIS.API.get("catalog/list/?/next/children",catalogId).json(function(re){
					if(re && re.code == 0){
						var data = re.data;
						if(data){
							var privateCatalogs = [];
							var index = 0;
							//显示公共目录
							for(var i=0,len=data.length;i<len;i++){
								if(data[i].catalogPrivate == 1){
									privateCatalogs.push(data[i]);
								}else{
									append(data[i],i,isAdmin);
								}
								index = i+1;
							}

							//用户已经登录，私人目录放在最下面
							if(userInfo && privateCatalogs.length > 0){
								for(var j=0,len2=privateCatalogs.length;j<len2;j++){
									//私人目录不提供置顶操作
									append(privateCatalogs[j],(j+index),false);
								}
							}

							if(isAdmin){
								//增加管理
								addCatalogManger();
							}
						}

						callback && callback();
					}else{
						SGIS.UI.alert(re ? re.message : "无法获取图集目录！",
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

					//绑定事件
					bindEvent();
				});

				function append(d,i,isAdmin){
					var text = "<div class='add_title' loading='1' data-value='" + d.id+"' >"

						+ "<ol>"
						+ "<li>"
						+ "<a class='btn-catalog' >"
						+ "<i class='icon plus'></i>" //icon plus -->> "+classes[i%classes.length]+ "
						+ "</a>"
						+ "<a class='btn-chart'>"
						+ d.catalogName
						+"</a>";

					if(isAdmin){
						text = text+ "<a class='btn-top' title='置顶'>"
								+ "<i class='level up icon'></i>"
								+ "<span>置顶</span>"
								+ "</a>";
					}

					text = text+ "</li>"
						+"</ol>"
						+"</div>";

					$catalogList.append(text);
				}
			});
		};

		/**
		 * 增加目录管理
		 */
		var addCatalogManger = function(){
			var html = "<div class=\"ui ignored message\" title=\"点击管理目录\" >"+
				"<ul>"+
					"<li>"+
						"<p>"+
							"<i class=\"icon setting\"></i>"+
							"分类管理"+
						"</p>"+
					"</li>"+
					"</ul>"+
				"</div>";

			$("#catalog-manger").html(html);
		};

		/**
		 * 设置一级目录选中，如果存在的话
		 *
		 * @param catalogId
         */
		var setFirstClassCatalogActiveIfExist = function(catalogId){
			$("#catalog-list >.add_title").removeClass("active");
			var lis = $("#catalog-list >.add_title");
			if(lis && lis.length > 0){
				lis.each(function(i,o){
					var $o = $(o);
					var dataValue = $o.attr("data-value");
					if(dataValue == catalogId){
						$o.addClass("active");
					}
				});
			}
		};
		
		/**
		 * 绑定事件
		 */
		var bindEvent = function(){
			//点击一级目录
			$("#catalog-list >.add_title>ol:first-child a.btn-catalog").click(function(){
				var addTitles = $(this).parent("li").parent("ol").parent(".add_title");
				if(addTitles.length > 0){
					var $addTitle = $(addTitles[0]);
					var $i = $(this).find(">i");
					
					var catalogId =  $addTitle.attr("data-value");
					
					var loading = $addTitle.attr("loading");
					if(loading == "1"){
						$addTitle.attr("loading","0");
						$i.removeClass("plus").addClass("minus");
						
						//获取下级目录
						getGallertCatalogBycatalogId($addTitle,catalogId,bindChildEvent);
					}else{
						var isHidden = $addTitle.find(">ul.addchild").is(":hidden");
						if(isHidden){
							$addTitle.find(">ul.addchild").show(200);
							$i.removeClass("plus").addClass("minus");
						}else{
							$addTitle.find(">ul.addchild").hide(200);
							$i.removeClass("minus").addClass("plus");
						}
					}
				}
			});

			//点击一级目录节点
			$("#catalog-list >.add_title>ol:first-child a.btn-chart").click(function(){
				var addTitles = $(this).parent("li").parent("ol").parent(".add_title");
				if(addTitles.length > 0){
					var $addTitle = $(addTitles[0]);
					
					//清除子节点选中
					$("#catalog-list >.add_title .add_sub_title>ol:first-child").removeClass("active");
					$("#catalog-list >.add_title").removeClass("active");
					$addTitle.addClass("active");
					
					var catalogId =  $addTitle.attr("data-value");
					//设置当前的id
					GalleryCatalog.setCurrentCatalogId(catalogId);
					
					//获取选中的目录名称
					$("#tj_title >p").html($addTitle.find(">ol:first-child a.btn-chart").text());
					
					//-----------------------------用户信息-------------------------------------------
					//取得对应结果
					UI.showLoading();
					UserInfo.getUserInfo(function(userInfo){
						//判断是否是管理员
						var isAdmin = (userInfo != null && userInfo.userAdmin === 1);
						//取得当前的目录
						var cCatalogId = GalleryCatalog.getCurrentCatalogId();
						Gallery.setIsScrolling(true,false);
						SortableHanlder.init(isAdmin,cCatalogId,function(){{
							GalleryChart.getGalleryChartsBycatalogId(new SGIS.PageInfo(1,15),
								catalogId,userInfo,function(currentCount){

									//绑定图点击
									GalleryImgClick.bindImgClick();
									Gallery.setIsScrolling(false,false);

									UI.hideLoading();
									UI.browerHeight();

									if(currentCount < 15){
										Gallery.setIsopenScrollLoad(false);
									}else{
										Gallery.setIsopenScrollLoad(true);
									}
								});
						}});
					});
					//------------------------------------------------------------------------
				}
			});

			//点击一级目录节点
			$("#catalog-list >.add_title>ol:first-child a.btn-top").click(function(){
				var addTitles = $(this).parent("li").parent("ol").parent(".add_title");

				if(addTitles.length > 0){
					var $addTitle = $(addTitles[0]);

					var catalogId =  $addTitle.attr("data-value");
					SGIS.API.put("catalog/?/to/top",catalogId).json(function(re){
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
						if(re.code == 0){
							window.location.href = window.location;
						}
					});
				}
			});

			//绑定目录管理覆盖事件
			$("#catalog-manger").on("mouseover",function(){
				$("#catalog-list").addClass("manager-active");
			}).on("mouseout",function(){
				$("#catalog-list").removeClass("manager-active");
			});

			//关闭目录管理弹出
			$("#chart-manager-modal .close").on("click",function(){
				var dataValue = $(this).attr("data-value");
				//判断是否操作过
				if(dataValue === "1" || dataValue === 1){
					window.location.href = window.location;
				}
			});

			//绑定目录管理
			$("#catalog-manger").on("click",function(){
				$("#chart-manager-modal").modal('setting', 'closable', false).modal("show");
				//标记为未操作
				$("#chart-manager-modal .close").attr("data-value","0");

				//管理树初始化
				MangerTree.init();
			});

			//绑定目录管理（新增打开）
			$("#chart-manager-add-btn").on("click",function(){
				var that = this;
				var managerTree = MangerTree.getManagerTreeObj();
				if(managerTree){

					//清空消息
					var $message = $("#chart-manager-modal .move-msg").html("");

					//取得选中的catalog的id
					var selectedId = managerTree.getSelectedItemId();
					if(selectedId !== "0" && selectedId !== 0){
						SGIS.API.get("catalog/?/is/can/create",selectedId).json(function(re){
							if(re && re.code == 0){
								var data = re.data;
								if(data.isCanCreate){
									goOn();
								}else{
									$message.html(re.message);
									setTimeout(function(){
										$message.html("");
									},1500);
								}
							}else{
								$message.html(re.message);
								setTimeout(function(){
									$message.html("");
								},1500);
							}
						});
					}else{
						goOn();
					}

					function goOn(){
						//隐藏新增打开
						$(that).addClass("hide");
						$("#chart-manager-add-panel").removeClass("hide");
						$("#chart-manager-edit-panel").addClass("hide");
						$("#chart-manager-move-panel").addClass("hide");

						//清空
						$("form#chart-manager-add-form input[name='catalogName']").attr("value","").val("");

						//切换操作显示
						MangerTree.switchOperationShow();
					}
				}
			});

			//绑定目录管理（新增取消）
			$("form#chart-manager-add-form button[name='cancel']").on("click",function(){
				$("#chart-manager-add-panel").addClass("hide");
				$("#chart-manager-edit-panel").addClass("hide");
				$("#chart-manager-move-panel").addClass("hide");

				//切换操作显示
				MangerTree.switchOperationShow();
			});

			//绑定目录管理（新增提交）
			$("form#chart-manager-add-form button[name='submit']").on("click",function(){
				//新增提交
				CatalogOperationHanlder.addSubmit();
			});

			//绑定目录管理（编辑打开）
			$("#chart-manager-edit-btn").on("click",function(){
				var that = this;
				var managerTree = MangerTree.getManagerTreeObj();
				if(managerTree){
					//隐藏编辑打开
					$(that).addClass("hide");
					$("#chart-manager-add-panel").addClass("hide");
					$("#chart-manager-edit-panel").removeClass("hide");
					$("#chart-manager-move-panel").addClass("hide");

					//切换操作显示
					MangerTree.switchOperationShow();
				}
			});

			//绑定目录管理（编辑取消）
			$("form#chart-manager-edit-form button[name='cancel']").on("click",function(){
				$("#chart-manager-add-panel").addClass("hide");
				$("#chart-manager-edit-panel").addClass("hide");
				$("#chart-manager-move-panel").addClass("hide");

				//切换操作显示
				MangerTree.switchOperationShow();
			});

			//绑定目录管理（编辑提交）
			$("form#chart-manager-edit-form button[name='submit']").on("click",function(){
				//编辑提交
				CatalogOperationHanlder.editSubmit();
			});

			//绑定目录管理（移动打开）
			$("#chart-manager-move-btn").on("click",function(){
				var that = this;
				var managerTree = MangerTree.getManagerTreeObj();
				if(managerTree){
					//隐藏移动打开
					$(that).addClass("hide");

					$("#chart-manager-add-panel").addClass("hide");
					$("#chart-manager-edit-panel").addClass("hide");
					$("#chart-manager-move-panel").removeClass("hide");

					var isSelectedRoot = true;

					//切换操作显示
					MangerTree.switchOperationShow();
					//加载管理移动树
					MangerMoveTree.getManagerMoveTree(function(){
						var mangerMoveTree = MangerMoveTree.getManagerMoveTreeObj();
						if(mangerMoveTree){
							if(isSelectedRoot){
								mangerMoveTree.selectItem("0");
								isSelectedRoot = false;
							}
						}//end if(mangerMoveTree)
					});
				}
			});

			//绑定目录管理（移动取消）
			$("form#chart-manager-move-form button[name='cancel']").on("click",function(){
				$("#chart-manager-add-panel").addClass("hide");
				$("#chart-manager-edit-panel").addClass("hide");
				$("#chart-manager-move-panel").addClass("hide");

				//切换操作显示
				MangerTree.switchOperationShow();
			});

			//绑定目录管理（移动提交）
			$("form#chart-manager-move-form button[name='submit']").on("click",function(){
				//移动提交
				CatalogOperationHanlder.moveSubmit();
			});

			//绑定目录管理（删除）
			$("#chart-manager-delete-btn").on("click",function(){
				$("#chart-manager-add-panel").addClass("hide");
				$("#chart-manager-edit-panel").addClass("hide");
				$("#chart-manager-move-panel").addClass("hide");
				//切换操作显示
				MangerTree.switchOperationShow();

				var selectedText = MangerTree.getManagerTreeObj().getSelectedItemText();

				var alertMsg = "<a class='ui blue button save' type='button' style='margin-right: 8px;' >确定</a>"+
					"<a class='ui button cancle' type='button'>取消</a>";
				SGIS.UI.alert(alertMsg,null,true,function(modal,close){
					modal.css({
						"top":"40%",
						"width":"300px",
						"margin-left":"-20px",
						"height":"100px",
						"overflow":"hidden"
					});
					modal.find(".header").css({
						"width":"270px",
						"height":"30px",
						"background-color":"transparent"
					});
					modal.find(".header>i").addClass("hide");
					modal.find(".header>.ui.label").css({
						"font-size":"14px",
						"background-color":"transparent"
					}).html("确定删除["+selectedText+"]分类？删除后不可恢复！");
					modal.find(".content>.ui.label").removeClass("blue").css({
						"font-size":"14px",
						"background-color":"transparent"
					});

					modal.find(".content>.ui.label>a.save").off("click");
					modal.find(".content>.ui.label>a.save").on("click",function(){
						//关闭
						close && close();
						//删除
						CatalogOperationHanlder.deleteSubmit();
					});

					modal.find(".content>.ui.label>a.cancle").off("click");
					modal.find(".content>.ui.label>a.cancle").on("click",function(){
						close && close();
					});
				});
			});
		};
		
		/**
		 * 绑定子节点事件
		 */
		var bindChildEvent = function(){
			/**
			 * 点击下级目录
			 */
			$("#catalog-list >.add_title .add_sub_title>ol:first-child a.btn-catalog").off("click");
			$("#catalog-list >.add_title .add_sub_title>ol:first-child a.btn-catalog").click(function(){
				
				var addTitles = $(this).parent("li").parent("ol").parent(".add_sub_title");
				if(addTitles.length > 0){
					var $addTitle = $(addTitles[0]);
					var $i = $(this).find(">i");
					
					var catalogId =  $addTitle.attr("data-value");
					
					var loading = $addTitle.attr("loading");
					if(loading == "1"){
						$addTitle.attr("loading","0");
						$i.removeClass("plus").addClass("minus");
						
						//获取下级目录
						getGallertCatalogBycatalogId($addTitle,catalogId,bindChildEvent,true);
					}else{
						var isHidden = $addTitle.find(">ul.addchild").is(":hidden");
						if(isHidden){
							$addTitle.find(">ul.addchild").show(200);
							$i.removeClass("plus").addClass("minus");
						}else{
							$addTitle.find(">ul.addchild").hide(200);
							$i.removeClass("minus").addClass("plus");
						}
					}
				}
			});
			
			/**
			 * 点击下级目录节点
			 */
			$("#catalog-list >.add_title .add_sub_title>ol:first-child a.btn-chart").off("click");
			$("#catalog-list >.add_title .add_sub_title>ol:first-child a.btn-chart").click(function(){

				var addTitles = $(this).parent("li").parent("ol").parent(".add_sub_title");
				if(addTitles.length > 0){
					var $addTitle = $(addTitles[0]);
					
					//清楚一级父节点的选中
					$("#catalog-list >.add_title").removeClass("active");
					$("#catalog-list >.add_title .add_sub_title>ol:first-child").removeClass("active");
					$(this).parent("li").parent("ol").addClass("active");
					
					var catalogId =  $addTitle.attr("data-value");
					//设置当前的id
					GalleryCatalog.setCurrentCatalogId(catalogId);
					
					//获取选中的目录名称
					$("#tj_title >p").html($addTitle.find(">ol:first-child a").text());
					
					//-----------------------------用户信息-------------------------------------------
					//取得对应结果
					UI.showLoading();
					UserInfo.getUserInfo(function(userInfo){
						//判断是否是管理员
						var isAdmin = (userInfo != null && userInfo.userAdmin === 1);
						//取得当前的目录
						var cCatalogId = GalleryCatalog.getCurrentCatalogId();
						Gallery.setIsScrolling(true,false);
						//必须是管理员并且选中指定目录内排序
						SortableHanlder.init(isAdmin,cCatalogId,function(){{
							GalleryChart.getGalleryChartsBycatalogId(new SGIS.PageInfo(1,15)
								,catalogId,userInfo,function(currentCount){

									//绑定图点击
									GalleryImgClick.bindImgClick();
									Gallery.setIsScrolling(false,false);

									UI.hideLoading();
									UI.browerHeight();

									if(currentCount < 15){
										Gallery.setIsopenScrollLoad(false);
									}else{
										Gallery.setIsopenScrollLoad(true);
									}
								});
						}});
					});
					//------------------------------------------------------------------------
					
				}
			});
		};
		
		/**
		 * 获取指定节点的子目录
		 * @param catalogId
		 * 				父节点目录
		 * @param callback
		 * 				回调函数
		 */
		var getGallertCatalogBycatalogId = function($addTitle,catalogId,callback,flag){
			SGIS.API.get("catalog/list/?/next/children",catalogId).json(function(re){
				if(re && re.code == 0){
					var data = re.data;
					if(data){
						
						var parentText = "<ul class='addchild'>";
						
						for ( var i = 0, len = data.length; i < len; i++) {
							var li = "<li>"
									+"<div class='add_sub_title "+(flag ? "add_sub_title2" : "")+"' loading='1' data-value='"+data[i].id+"' >"
									
									//----
									+ "<ol>"
									+ "<li style='list-style-type: none;margin-left: -20px;'>"
									+ "<a class='btn-catalog' >"
									+ "<i style = 'font-size: 1.0em;color: #52525A;margin-top:5px;'class='icon plus'></i>"
									+ "</a>"
									+ "<a class='btn-chart' style='padding-left:4%;margin-top:7px;line-height:30px;color: #52525A;'>"
									+ data[i].catalogName
									+"</a>"
									+ "</li>" 
									+ "</ol>"
									//----
									+"</div>"
								+"</li>";
							
							parentText += li;
						}
						
						parentText += "</ul>";
						
						$addTitle.append(parentText);
					}
					
					callback && callback();
				}else{
					SGIS.Log(re ? re.message : "无法获取图集目录！");
				}
			});
		};
		
		return {
			setCurrentCatalogId:setCurrentCatalogId,
			getCurrentCatalogId:getCurrentCatalogId,
			initGallertCatalog:initGallertCatalog,
			setFirstClassCatalogActiveIfExist:setFirstClassCatalogActiveIfExist
		};
	})();

	/**
	 * 目录操作接口
	 */
	var CatalogOperationHanlder = (function(){

		/**
		 * 初始化
		 */
		var init = function(){
			$("#chart-manager-add-panel").addClass("hide");
			$("#chart-manager-edit-panel").addClass("hide");
			$("#chart-manager-move-panel").addClass("hide");

			$("#chart-manager-modal .actions").addClass("hide");
		};

		/**
		 * 初始化完
		 */
		var afterInit = function(){
			$("#chart-manager-modal .actions").removeClass("hide");
		};

		/**
		 * 新增目录分类提交
		 * @callback
		 */
		var addSubmit = function(callback){
			var $message = $("#chart-manager-modal .move-msg");
			var $catalogName = $("form#chart-manager-add-form input[name='catalogName']");
			var $parentId = $("form#chart-manager-add-form input[name='parentId']");

			var catalogName = $catalogName.val();
			if(!catalogName || $.trim(catalogName) == ""){

				$message.html("目录名称不能为空！");
				$catalogName.focus();
				setTimeout(function(){
					$message.html("");
				},1000);
				return ;
			}

			var parentId = parseInt($parentId.val());
			if(parentId > -1){
				var $submitBtn = $("form#chart-manager-add-form button[name='submit']").addClass("disabled");
				SGIS.API.post("catalog/add").data(JSON.stringify({
					catalogName: $.trim(catalogName),
					createTime: 0,
					modifyTime: 0,
					parentId: parentId,
					catalogPrivate: 0
				})).json(function(re){
					$submitBtn.removeClass("disabled");
					$message.html(re.message);
					if(re && re.code==0){
						setTimeout(function(){
							$message.html("");
							//标记为未操作
							$("#chart-manager-modal .close").attr("data-value","1");

							//管理树初始化
							MangerTree.init();
						},1500);
					}else{
						$catalogName.selectAll();
						$catalogName.focus();
						setTimeout(function(){
							$message.html("");
						},1500);
					}

					callback && callback();
				});
			}else{
				$message.html("请先选择父节点！");
				$catalogName.focus();
				setTimeout(function(){
					$message.html("");
				},1000);
				return ;
			}
		};

		/**
		 * 编辑分类提交
		 * @callback
		 */
		var editSubmit = function(callback){
			var $message = $("#chart-manager-modal .move-msg");
			var $catalogName = $("form#chart-manager-edit-form input[name='catalogName']");

			var selectedId = MangerTree.getManagerTreeObj().getSelectedItemId();
			var catalogName = $catalogName.val();
			if(!catalogName || $.trim(catalogName) == ""){
				$message.html("目录名称不能为空！");
				$catalogName.focus();
				setTimeout(function(){
					$message.html("");
				},1000);
				return ;
			}

			var $submitBtn = $("form#chart-manager-edit-form button[name='submit']").addClass("disabled");
			SGIS.API.put("catalog/?",selectedId)
				.data({
					catalogName: $.trim(catalogName)
				}).json(function(re){
					$submitBtn.removeClass("disabled");
					$message.html(re.message);
					if(re && re.code==0){
						setTimeout(function(){
							$message.html("");
							//标记为未操作
							$("#chart-manager-modal .close").attr("data-value","1");

							//管理树初始化
							MangerTree.init();
						},1500);
					}else{
						$catalogName.select();
						$catalogName.focus();
						setTimeout(function(){
							$message.html("");
						},1500);
					}

					callback && callback();
			});
		};

		/**
		 * 移动分类提交
		 * @callback
		 */
		var moveSubmit = function(callback){
			var $message = $("#chart-manager-modal .move-msg");

			var selectedId = MangerTree.getManagerTreeObj().getSelectedItemId();
			var parentId = MangerMoveTree.getManagerMoveTreeObj().getSelectedItemId();

			var $submitBtn = $("form#chart-manager-move-form button[name='submit']").addClass("disabled");
			SGIS.API.put("catalog/?/move",selectedId)
				.data({
					parentId:parentId
				})
				.json(function(re){
					$submitBtn.removeClass("disabled");
					$message.html(re.message);
					if(re && re.code==0){
						setTimeout(function(){
							$message.html("");
							//标记为未操作
							$("#chart-manager-modal .close").attr("data-value","1");

							//管理树初始化
							MangerTree.init();
						},1500);
					}else{
						setTimeout(function(){
							$message.html("");
						},1500);
					}

					callback && callback();
				});
		};

		/**
		 * 删除分类
		 * @callback
		 */
		var deleteSubmit = function(callback){
			var $message = $("#chart-manager-modal .move-msg");

			var $submitBtn = $("#chart-manager-delete-btn").addClass("disabled");
			var selectedId = MangerTree.getManagerTreeObj().getSelectedItemId();
			SGIS.API.del("catalog/?",selectedId)
				.json(function(re){
					$submitBtn.removeClass("disabled");
					$message.html(re.message);
					if(re && re.code==0){
						setTimeout(function(){
							$message.html("");
							//标记为未操作
							$("#chart-manager-modal .close").attr("data-value","1");

							//管理树初始化
							MangerTree.init();
						},1500);
					}else{
						setTimeout(function(){
							$message.html("");
						},1500);
					}

					callback && callback();
				});
		};

		return {
			init:init,
			afterInit:afterInit,
			addSubmit:addSubmit,
			editSubmit:editSubmit,
			moveSubmit:moveSubmit,
			deleteSubmit:deleteSubmit
		};
	})();

	/**
	 * 管理树
	 */
	var MangerTree = (function(){
		var managerTree;
		var callback;

		/**
		 * 初始化
		 */
		var init = function(){
			//标记是否初始化
			var isInitCatalogOperationHanlder = true;
			CatalogOperationHanlder.init();

			//取得管理树对象
			getManagerTree(function(){
				var managerTree = getManagerTreeObj();
				if(managerTree){
					if(isInitCatalogOperationHanlder){
						//打开隐藏
						CatalogOperationHanlder.afterInit();

						//选中跟节点
						managerTree.selectItem("0");
						//切换操作显示
						MangerTree.switchOperationShow();

						isInitCatalogOperationHanlder = false;
					}//end if(isInitCatalogOperationHanlder)
				}
			});
		};

		var actions = {
			onClick:function(id){
				//判断当前选中的节点的可操作性
				switchOperationShow();
			}
		};

		/**
		 * 判断当前选中的节点的可操作性
		 */
		var switchOperationShow = function(){
			if(managerTree){
				//清空消息
				var $message = $("#chart-manager-modal .move-msg").html("");

				var $managerAddBtn = $("#chart-manager-add-btn");
				var $managerEditBtn = $("#chart-manager-edit-btn");
				var $managerMoveBtn = $("#chart-manager-move-btn");
				var $managerDeleteBtn = $("#chart-manager-delete-btn");

				var $managerAddPanel = $("#chart-manager-add-panel");
				var $managerEditPanel = $("#chart-manager-edit-panel");
				var $managerMovePanel = $("#chart-manager-move-panel");

				//取得选中的id
				var selectedId = managerTree.getSelectedItemId();
				var selectedText = managerTree.getSelectedItemText();
				var catalogPrivate = managerTree.getUserData(selectedId,"catalogPrivate");

				//根节点
				if(selectedId === "0" || selectedId === 0){
					//允许操作
					if($managerAddPanel.is(":hidden")){
						$managerAddBtn.removeClass("hide");
					}

					//禁止操作
					$managerEditBtn.addClass("hide");
					$managerMoveBtn.addClass("hide");
					$managerDeleteBtn.addClass("hide");

					$managerEditPanel.addClass("hide");
					$managerMovePanel.addClass("hide");

					$message.html("根节点只支持新增操作！");
					setTimeout(function(){
						$message.html("");
					},1000);
				}else if(catalogPrivate === "1" || catalogPrivate === 1){
					//私有节点禁止操作
					$managerAddBtn.addClass("hide");
					$managerEditBtn.addClass("hide");
					$managerMoveBtn.addClass("hide");
					$managerDeleteBtn.addClass("hide");

					$managerAddPanel.addClass("hide");
					$managerEditPanel.addClass("hide");
					$managerMovePanel.addClass("hide");

					$message.html("【"+selectedText+"】禁止任何操作！");
					setTimeout(function(){
						$message.html("");
					},1000);
				}else{
					//允许操作
					if($managerAddPanel.is(":hidden")){
						$managerAddBtn.removeClass("hide");
					}
					if($managerEditPanel.is(":hidden")){
						$managerEditBtn.removeClass("hide");
					}
					if($managerMovePanel.is(":hidden")){
						$managerMoveBtn.removeClass("hide");
					}
					$managerDeleteBtn.removeClass("hide");
				}//end if(selectedId === "0" || selectedId === 0)

				//表单赋值
				$("form#chart-manager-add-form input[name='parentId']").attr("value",selectedId).val(selectedId);
				$("form#chart-manager-add-form input[name='parentIdText']").attr("value",selectedText).val(selectedText);

				$("form#chart-manager-edit-form input[name='catalogName']").attr("value",selectedText).val(selectedText);


				$("#chart-manager-move-panel>h4>span").html("["+selectedText+"]");

				//判断是否可以移动到选中的节点(如果存在的话)
				if(!$managerMovePanel.is(":hidden")){
					MangerMoveTree.checkIsCanMoveTo();
				}//end if(!$managerMovePanel.is(":hidden"))
			}//end if(managerTree)
		};

		/**
		 * 判断是否还有load节点
		 * @param obj
		 * @param id
		 * @returns {boolean}
		 */
		var hasTempNode = function (obj, id) {
			var tempnode = obj.getAllSubItems(id).indexOf("load");
			if (tempnode == 0) {
				return true;//未加载
			}
			return false;
		};


		/**
		 * 懒加载模式
		 */
		var lazyLoad= function(obj,id){
			if(id === "0" || id === 0){
				return ;
			}
			if(hasTempNode(obj, id)){
				//删除子节点
				obj.deleteChildItems(id);
				SGIS.API.get("catalog/?/next/tree/xml",id).json(function(re){
					if(re.code == 0){
						managerTree && managerTree.loadXMLString(re.data);
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
			}
		};

		/**
		 * 取得移动树
		 */
		var getManagerTree = function(_callback){
			var $loading = $("#chart-catalog-manager-loading").removeClass("hide");
			SGIS.API.get("catalog/?/next/tree/xml",0).json(function(re){
				if(re.code == 0){
					managerTree&&managerTree.destructor();
					managerTree = SGIS.Tree.create("chart-catalog-manager-tree", re.data,actions, lazyLoad);
					//打开根节点
					managerTree.openItem("0");
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

				$loading.addClass("hide");
				callback = _callback;
				callback && callback();
			});
		};

		var getManagerTreeObj = function(){
			return managerTree;
		};

		return {
			init:init,
			getManagerTree:getManagerTree,
			getManagerTreeObj:getManagerTreeObj,
			switchOperationShow:switchOperationShow
		};
	})();

	/**
	 * 管理移动树
	 */
	var MangerMoveTree = (function(){
		var managerMoveTree;
		var callback;

		var actions = {
			onClick:function(id){
				//判断是否可以移动到选中的节点
				checkIsCanMoveTo();
			}
		};

		/**
		 * 判断是否可以移动到选中的节点
		 */
		var checkIsCanMoveTo = function(){
			if(managerMoveTree){
				//清空消息
				var $message = $("#chart-manager-modal .move-msg").html("");
				//提交按钮
				var $submitBtn = $("form#chart-manager-move-form button[name='submit']").addClass("disabled");

				//取得选中的id
				var selectedId = managerMoveTree.getSelectedItemId();
				var selectedText = managerMoveTree.getSelectedItemText();
				var catalogPrivate = managerMoveTree.getUserData(selectedId,"catalogPrivate");

				//要移动的节点id
				var oldSelectedId = MangerTree.getManagerTreeObj().getSelectedItemId();

				//是否为当前节点
				if(selectedId==oldSelectedId){
					//不能移动到当前节点
					$message.html("消息提示：不能移动到当前节点！");

					setTimeout(function(){
						//选中根节点
						managerMoveTree.selectItem("0");
						$message.html("");
						$submitBtn.removeClass("disabled");
					},1000)
				}else if(catalogPrivate === "1" || catalogPrivate === 1){
					var oldSelectedText = $("#chart-manager-move-panel>h4>span").text();
					//私有节点禁止操作
					$message.html("消息提示："+oldSelectedText+"->["+selectedText+"]下非法！");

					setTimeout(function(){
						//选中根节点
						managerMoveTree.selectItem("0");
						$message.html("");
						$submitBtn.removeClass("disabled");
					},1000)
				}else{
					//判断是否移动到其子节点

					//要移动的节点的所有子节点
					var cSelectedAllSubIds = managerMoveTree.getAllSubItems(oldSelectedId);
					if(cSelectedAllSubIds && cSelectedAllSubIds != ""){
						var array = cSelectedAllSubIds.split(",");
						for(var i= 0,len=array.length;i<len;i++){
							var item = array[i];
							if(item > -1 && (item == selectedId)){
								//不能移动到当前节点
								$message.html("消息提示：不能移动到其子节点下！");
								setTimeout(function(){
									//选中根节点
									managerMoveTree.selectItem("0");
									$message.html("");
									$submitBtn.removeClass("disabled");
								},1000);
								return ;
							}
						}
					}

					//校验
					if(selectedId === "0" || selectedId === 0){
						$submitBtn.removeClass("disabled");
					}else{
						SGIS.API.get("catalog/?/is/can/create",selectedId).json(function(re){
							if(re && re.code == 0){
								var data = re.data;
								if(data.isCanCreate){
									//$submitBtn.removeClass("disabled");
								}else{
									$message.html(re.message);
									setTimeout(function(){
										//选中根节点
										managerMoveTree.selectItem("0");
										$message.html("");
										$submitBtn.removeClass("disabled");
									},1000);
								}
							}else{
								$message.html(re.message);
								setTimeout(function(){
									//选中根节点
									managerMoveTree.selectItem("0");
									$message.html("");
									$submitBtn.removeClass("disabled");
								},1000);
							}
						});
					}
				}
			}//end if(managerMoveTree)
		};

		/**
		 * 判断是否还有load节点
		 * @param obj
		 * @param id
		 * @returns {boolean}
		 */
		var hasTempNode = function (obj, id) {
			var tempnode = obj.getAllSubItems(id).indexOf("load");
			if (tempnode == 0) {
				return true;//未加载
			}
			return false;
		};


		/**
		 * 懒加载模式
		 */
		var lazyLoad= function(obj,id){
			if(id === "0" || id === 0){
				return ;
			}
			if(hasTempNode(obj, id)){
				//删除子节点
				obj.deleteChildItems(id);
				SGIS.API.get("catalog/?/next/tree/xml",id).json(function(re){
					if(re.code == 0){
						managerMoveTree && managerMoveTree.loadXMLString(re.data);
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
			}
		};

		/**
		 * 取得移动树
		 */
		var getManagerMoveTree = function(_callback){
			var $loading = $("#chart-catalog-manager-move-loading").removeClass("hide");
			SGIS.API.get("catalog/?/next/tree/xml",0).json(function(re){
				if(re.code == 0){
					managerMoveTree&&managerMoveTree.destructor();
					managerMoveTree = SGIS.Tree.create("chart-catalog-manager-move-tree", re.data,actions, lazyLoad);
					//打开根节点
					managerMoveTree.openItem("0");
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

				$loading.addClass("hide");
				callback = _callback;
				callback && callback();
			});
		};

		var getManagerMoveTreeObj = function(){
			return managerMoveTree;
		};

		return {
			getManagerMoveTree:getManagerMoveTree,
			getManagerMoveTreeObj:getManagerMoveTreeObj,
			checkIsCanMoveTo:checkIsCanMoveTo
		};
	})();

	/**
	 * 拖动排序操作
	 *
	 * @type {{reset}}
     */
	var SortableHanlder = (function(){
		//拖动排序对象
		var _sortable = null;
		var _isShowSortableSwitch = false;
		//默认参数
		var _param = {
			handle: ".drag-on",
			draggable: ".drag-on",
			ghostClass:'drag-on-high-light',	// 拖动的元素高亮
			onStart: function (evt) {}, 		// 拖拽开始
			onEnd: function (evt) {}, 			// 拖拽结束
			onRemove: function (evt){},			// 拖拽移除
			onUpdate: function (evt){			// 拖拽更新后
				//当前拖拽的html元素
				var itemEl = evt.item;
				if(itemEl){
					//当前操作的id
					var currChartId  = $(itemEl).find("img").attr("data-id");

					SGIS.UI.alert("操作中，请稍后...",null,true,function(modal,close){
						modal.css({
							"top":"40%",
							"width":"300px",
							"margin-left":"-20px",
							"height":"60px",
							"overflow":"hidden"
						});
						modal.find(".header").css({
							"width":"270px",
							"height":"0px",
							"background-color":"transparent"
						});
						modal.find(".header").addClass("hide");
						modal.find(".content>.ui.label").removeClass("blue").css({
							"font-size":"14px",
							"background-color":"transparent"
						});

						//找到拖拽到的后一个（作为基础）
						var $nextObj = $(itemEl).next(".image.drag-on");
						if($nextObj.length >0){
							var baseChartId  = $($nextObj[0]).find("img").attr("data-id");

							//将当前的图移动到某个的前面
							SGIS.API.put("chart/?/sortable/?",currChartId,baseChartId)
								.data({"isAfterBaseChart":false}).json(function(re){
									modal.find(".content>.ui.label").html(re.message);
									setTimeout(function(){
										modal.find(".header").removeClass("hide");
										close && close();
									},1200);
							});
						}else{
							var $prevObj = $(itemEl).prev(".image.drag-on");
							if($prevObj.length>0){
								var baseChartId  = $($prevObj[0]).find("img").attr("data-id");

								//将当前的图移动到某个的后面
								SGIS.API.put("chart/?/sortable/?",currChartId,baseChartId)
									.data({"isAfterBaseChart":true}).json(function(re){
										modal.find(".content>.ui.label").html(re.message);
										setTimeout(function(){
											modal.find(".header").removeClass("hide");
											close && close();
										},1200);
								});
							}else{
								modal.find(".content>.ui.label").html("消息提示：排序失败....");
								setTimeout(function(){
									modal.find(".header").removeClass("hide");
									close && close();
								},1200);
							}
						}//end if($nextObj.length >0) else
					});
				}//end if(itemEl)
			}
		};

		/**
		 *
		 * 初始化拖拽排序
		 * <p style="color:red;">
		 *     只有是管理者并且分类目录为叶子节点的时候，才能
		 * </p>
		 * @param isAdmin
		 * @param cCatalogId
         * @param callback
         */
		var init = function(isAdmin,cCatalogId,callback){
			//必须放在前面
			$("input:radio[name='sortable-switch-input']").attr("checked",false);
			$("#sortable-switch").removeClass("checked");
			$("#sortable-switch>label>b").text($("#sortable-switch>label").attr("data-close"));
			$("#chart-list").removeClass("tj_gallery_drag_on");
			//end 必须放在前面

			if(isAdmin && cCatalogId > 0){
				//校验是否可以移动到该点(判断该点是否是叶子节点)
				SGIS.API.get("catalog/?/is/leaf/node",cCatalogId).json(function(re){
					if(re && re.code == 0){
						var data = re.data;
						if(data.isLeafNode){
							//显示拖拽排序开关
							_isShowSortableSwitch = true;
							$("#sortable-title,#sortable-switch").removeClass("hide");
						}else{
							_isShowSortableSwitch = false;
							$("#sortable-title,#sortable-switch").addClass("hide");
						}
					}else{
						_isShowSortableSwitch = false;
						$("#sortable-title,#sortable-switch").addClass("hide");
					}
					callback && callback();
				});
			}else{
				_isShowSortableSwitch = false;
				$("#sortable-title,#sortable-switch").addClass("hide");
				callback && callback();
			}
		};

		/**
		 * 获取拖动排序对象
		 *
		 * @returns {*}
         */
		var getSortable = function(){
			return _sortable;
		};

		/**
		 *
		 * @param dom
		 * 			html节点对象
		 * @param cParam
		 * 			参数
         * @returns {*}
         */
		var createSortable = function(cParam){
			//重置对象
			destroySortable();

			//创建对象
			var dom = document.getElementById("chart-list");
			var param = $.extend(true,{},_param,cParam || {});
			_sortable = new Sortable(dom,param);

			return _sortable;
		};

		/**
		 * 销毁对象
		 */
		var destroySortable = function(){
			if(_sortable != null){
				_sortable.destroy && _sortable.destroy();
				_sortable = null;
			}
		};

		/**
		 * 判断是否开启排序
		 *
		 * @returns {*|jQuery}
         */
		var isOpenSortable = function(){
			return $("input[name='sortable-switch-input']").is(":checked");
		};

		/**
		 * 是否显示拖拽排序
		 *
		 * @returns {boolean}
         */
		var isShowSortableSwitch = function(){
			return _isShowSortableSwitch;
		};

		return {
			init:init,
			getSortable:getSortable,
			createSortable:createSortable,
			destroySortable:destroySortable,
			isOpenSortable:isOpenSortable,
			isShowSortableSwitch:isShowSortableSwitch
		};
	})();


	/**
	 * 获取图集
	 */
	var GalleryChart = (function(){
		var _pageInfo = null;

		/**
		 * 取得当前的分页信息
		 * @returns {*}
		 */
		var getPageInfo = function(){
 			return _pageInfo;
		};

		/**
		 * 获取图集
		 * @param pageInfo
		 * 				分页
		 * @param catalogId
		 * 				父节点目录
		 * @param callback
		 * 				回调函数
		 * @param isCrollLoad
		 * 				是否
		 */
		var getGalleryChartsBycatalogId = function(pageInfo,catalogId,userInfo,callback,isCrollLoad){
			//保存当前的分页
			_pageInfo = pageInfo;

			//检索关键字
			var searchText = $("input#searchText").val();
			//消息提示
			var $chartMessage = $("#tj_container #chart-message").addClass("hide");

			//先获取外部的图
			getThirdCharts(catalogId,searchText,isCrollLoad,function(thirdChartsCount){
				SGIS.API.get("chart/?/list/all",catalogId)
					.data({"keyword":searchText})
					.data(JSON.stringify({
						pageNumber: pageInfo.getPageNumber(),
						pageSize: pageInfo.getPageSize()
					}))
					.json(function(re){
						var count = 0;
						if(re && re.code == 0){
							var data = re.data;
							if(data && data.length > 0){
								//取得是否排序
								var isShowSortableSwitch = SortableHanlder.isShowSortableSwitch();

								var $chartList = $("#chart-list");
								for(var i=0,len=data.length;i<len;i++){
									var item = data[i];

									//-div--
									var name = item.chartName;
									if (name.length > 21) {
										name = name.substr(0, 17);
										name += "...";
									}

									var chartIsfromSgisText = (item.chartIsfromSgis === 1
										|| item.chartIsfromSgis ==="1") ? "是":"否";
									//当前目录才能拖拽
									var liClassName = (isShowSortableSwitch && item.tgalleryCatalog.id == catalogId)
										? 'drag-on' : 'drag-off';

									var templateData = $.extend(true,{},item,{
										figcaption:getOperationHtml(item,userInfo),
										shortChartName:name,
										chartMemo:item.chartMemo || item.chartMome,
										catalogName:item.tgalleryCatalog.catalogName,
										userName:item.tgalleryUser.userName,
										chartIsfromSgisText:chartIsfromSgisText,
										isThirdCharts:0,
										dataUrl:"",
										createTimeText:SGIS.Time.longTimeToFullStringTime(item.createTime),
										modifyTimeText:SGIS.Time.longTimeToFullStringTime(item.modifyTime),
										liClassName:liClassName							//可以拖拽
									});

									var html = SGIS.Util.template(chartListLiTemplate,templateData);
									$chartList.append(html);

									//计算个数
									count ++;
								}//end for

								//修改样式
								UI.resetChartGridCss();

								//绑定图集操作事件
								bindChartOperateEvent();
							}else{
								if(thirdChartsCount == 0){
									$chartMessage.removeClass("hide").html("无图集！");
								}else{
									//修改样式
									UI.resetChartGridCss();
								}
							}

							//校验是是否开启排序
							if(SortableHanlder.isOpenSortable()){
								//创建排序对象
								SortableHanlder.createSortable();
							}else{
								//重置排序
								SortableHanlder.destroySortable();
							}//end if(SortableHanlder.isOpenSortable())
						}else{
							$chartMessage.removeClass("hide").html(re.message);
						}
						callback && callback(count);
					});
			});//end getThirdCharts(searchText,function()
		};

		/**
		 * 获取外部的图集
		 * @param catalogId
		 * @param searchText
		 * @param isCrollLoad
		 * @param callback
		 */
		var getThirdCharts = function(catalogId,searchText,isCrollLoad,callback){
			if(isCrollLoad){
				callback && callback(-1);
				return ;
			}
			//取得第三方配置文件
			ThirdChartsConfig.getConfig(function(result){
				//过滤数据
				result = ThirdChartsConfig.filterConfigBycatalogIdAndkeyword(result
					,catalogId,searchText);
				//保存过滤后的长度
				ThirdChartsConfig.setCurrentUsedLength(result.length);

				var $chartList = $("#chart-list").html("");
				if(result && result.length){
					var len = result.length;
					for(var i= 0;i<len;i++){
						var item = result[i];

						if((searchText && searchText != "")
							&& item.title.indexOf(searchText) == -1){
							continue;
						}//end if

						//-div--
						var name = item.title;
						if (name.length > 21) {
							name = name.substr(0, 17);
							name += "...";
						}

						var templateData = $.extend(true,{},{
							figcaption:"",
							chartName:item.title,
							shortChartName:name,
							chartMemo:item.memo || "",
							catalogName:"未分类",
							userName:"系统管理员",
							chartIsfromSgisText:"否",
							isThirdCharts:1,
							chartIsfromSgis:0,
							chartImagePath:item.img,
							dataUrl:item.url,
							id:item.id,
							createTimeText:item.createTime || "-",
							modifyTimeText:item.modifyTime || "-",
							liClassName:'drag-off'					//不可以拖拽
						});

						var html = SGIS.Util.template(chartListLiTemplate,templateData);
						$chartList.append(html);
					}//end for(var i= 0,len=result.length;i<len;i++)
					callback && callback(len);
				}else{
					callback && callback(0);
				}
			});
		};

		
		/**
		 * 获取操作按钮
		 * 
		 */
		var getOperationHtml = function(item,userInfo){
			if(!item){
				return "";
			}
			
			var html = "";
			
			//当前用户
			if(userInfo && userInfo != null){
				//是管理员
				if(userInfo.userAdmin == 1){
					html += "<button data-value='"+item.id+"' data-catalog='"+(item.tgalleryCatalog.id)+"'  data-oper='move' type='button' class='btn btn-success' style='margin-top:10px' >移动</button>";
					if(!(item.chartIsfromSgis === "1" || item.chartIsfromSgis === 1)){
						html += "<button data-value='"+item.id+"' data-chart-type='"+item.chartType+"' data-oper='edit' type='button' class='btn btn-primary' style='margin-left:7px;margin-top:10px;'>编辑</button>";
					}
					html += "<button data-value='"+item.id+"' data-oper='delete' type='button' class='btn btn-danger' style='margin-left:7px;margin-top:10px'>删除</button>";
				//普通用户(只有自己才能被删除)	
				}else{
					var currentUserId = userInfo.id;
					var chartUserId = item.tgalleryUser.id;
					if(currentUserId == chartUserId){
						html += "<button data-value='"+item.id+"' data-catalog='"+(item.tgalleryCatalog.id)+"' data-oper='move' type='button' class='btn btn-success' style='margin-top:10px'>移动</button>";
						if(!(item.chartIsfromSgis === "1" || item.chartIsfromSgis === 1)){
							html += "<button data-value='"+item.id+"' data-chart-type='"+item.chartType+"' data-oper='edit' type='button' class='btn btn-primary' style='margin-left:7px;margin-top:10px;'>编辑</button>";
						}
						html += "<button data-value='"+item.id+"' data-oper='delete' type='button' class='btn btn-danger' style='margin-left:7px;margin-top:10px'>删除</button>";
					}
				}
			}
			
			return html;
		};	
		
		/**
		 * 绑定图集操作事件
		 */
		var bindChartOperateEvent = function(){
			//绑定按钮事件
			$("#chart-list >li figcaption.figcaption").off("click","button");
			$("#chart-list >li figcaption.figcaption").on("click","button",function(){
				var $this = $(this);
				
				var dataChartId = $this.attr("data-value");
				var dataOper = $this.attr("data-oper");

				//保存当前的图id
				ChartOperationHanlder.setCurrentChartId(dataChartId);

				switch (dataOper) {
				case "move":
					$('#chart-move-modal').modal('setting', 'closable', false).modal('show');
					var dataCatalogId = $this.attr("data-catalog");
					//取得移动树
					MoveTree.getMoveTree(function(){
						var moveTree = MoveTree.getMoveTreeObj();
						if(moveTree){
							moveTree.selectItem(dataCatalogId);
							moveTree.setItemColor(dataCatalogId,"#ff0000","#ffffff");
						}
					});
					break;
				case "edit":
					var chartType = $this.attr("data-chart-type");
					ChartOperationHanlder.editChart(chartType);
					break;
				case "delete":
					var alertMsg = "<a class='ui blue button save' type='button' style='margin-right: 8px;' >确定</a>"+
						"<a class='ui button cancle' type='button'>取消</a>";
					SGIS.UI.alert(alertMsg,null,true,function(modal,close){
						modal.css({
							"top":"40%",
							"width":"300px",
							"margin-left":"-20px",
							"height":"150px",
							"overflow":"hidden"
						});
						modal.find(".header").css({
							"width":"270px",
							"height":"30px",
							"background-color":"transparent"
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

						modal.find(".content>.ui.label>a.save").off("click");
						modal.find(".content>.ui.label>a.save").on("click",function(){
							//关闭
							close && close();
							UI.showLoading("删除中，请稍后....");
							ChartOperationHanlder.removeChart(function(re){
								UI.hideLoading();
								if(re){
									//移除当前节点
									$("#li-chart-"+dataChartId).remove()
								}
							});
						});

						modal.find(".content>.ui.label>a.cancle").off("click");
						modal.find(".content>.ui.label>a.cancle").on("click",function(){
							close && close();
						});
					});
					break;
				}
			});
			
			//确定移动
			$("#chart-move-btn").off("click");
			$("#chart-move-btn").click(function(){
				var moveTree = MoveTree.getMoveTreeObj();
				if(moveTree){
					var catalogId = moveTree.getSelectedItemId();
					if(catalogId === 0 || catalogId === "0"){
						var $msg = $("#chart-move-modal .move-msg").html("消息提示：不能移动根节点上");
						setTimeout(function(){
							$msg.html("");
						},1500);
					}else {
						//校验是否可以移动到该点(判断该点是否是叶子节点)
						SGIS.API.get("catalog/?/is/leaf/node",catalogId).json(function(re){
							if(re && re.code == 0){
								var data = re.data;
								if(data.isLeafNode){
									//只能移动到叶子节点上（移动操作）
									ChartOperationHanlder.moveCatalog(catalogId,function(){
										$('#chart-move-modal').modal('hide');
									});
								}else{
									var $msg = $("#chart-move-modal .move-msg").html("消息提示：不能移动到分类目录上！");
									setTimeout(function(){
										$msg.html("");
									},1500);
								}
							}else{
								var $msg = $("#chart-move-modal .move-msg").html(re.message);
								setTimeout(function(){
									$msg.html("");
								},1500);
							}
						});
					}
				}
				return false;
			});
		};
		
		return {
			getPageInfo:getPageInfo,
			getGalleryChartsBycatalogId:getGalleryChartsBycatalogId
		};
	})();
	
	/**
	 * 图集操作
	 */
	var ChartOperationHanlder = (function(){
		var currentChartId;
		
		var setCurrentChartId = function(_currentChartId){
			currentChartId = _currentChartId;
		};
		
		/**
		 * 移动图集
		 */
		var moveCatalog = function(catalogId,callback){
			//禁止点击
			var $btn = $("#chart-move-btn").addClass("disabled").removeClass("btn-success").addClass("btn-default");
			var loadText = $btn.attr("data-loading-text");
			$btn.attr("data-loading-text","移动").html(loadText);
			
			SGIS.API.put("chart/?/move/?/catalog",currentChartId,catalogId).json(function(re){
				//恢复点击	
				$btn.removeClass("disabled").removeClass("btn-default").addClass("btn-success")
					.html($btn.attr("data-loading-text")).attr("data-loading-text",loadText);
				if(re.code == 0){
					//重新检索
					$("button#searchBtn").click();
				}
				
				var $msg = $("#chart-move-modal .move-msg").html("消息提示："+re.message);
				setTimeout(function(){
					$msg.html("");
					
					callback && callback();
				},1500);
			});
		};
		
		/**
		 * 删除图集
		 */
		var removeChart = function(callback){
			if(currentChartId && currentChartId != ""){
				SGIS.API.del("chart/?",currentChartId).json(function(re){
					var isDel = false;
					if(re.code == 0){
						isDel = true;
					}

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
					callback && callback(isDel);
				});
			}else{
				SGIS.UI.alert("请选择要删除图！",
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
				callback && callback(false);
			}
		};

		/**
		 * 编辑图集
		 *
		 * @param chartType
		 */
		var editChart = function(chartType){
			if(currentChartId && currentChartId != ""){
				var url = TOOL_URL;
				if(chartType === "1" || chartType === 1){
					url += "editd3?chart-id="+currentChartId;
				}else if(chartType === 0 || chartType === "0"){
                    //echarts图
                    url += "editecharts?chart-id="+currentChartId;
                }else if(chartType === 2 || chartType === "2"){
                    //highcharts图
                    url += "edithighcharts?chart-id="+currentChartId;
                }
				window.open(url,"_blank");
			}
		};
		
		return {
			setCurrentChartId:setCurrentChartId,
			moveCatalog:moveCatalog,
			removeChart:removeChart,
			editChart:editChart
		};
	})();
	
	/**
	 * 移动树
	 */
	var MoveTree = (function(){
		var moveTree;
		var callback;
		
		var actions = {
			onClick:function(id){
				if(id === 0 || id === "0"){
					var $msg = $("#chart-move-modal .move-msg").html("消息提示：不能移动根节点上");
					setTimeout(function(){
						$msg.html("");
					},1500);
				}
			}	
		};
		
		/**
         * 判断是否还有load节点
         * @param obj
         * @param id
         * @returns {boolean}
         */
        var hasTempNode = function (obj, id) {
            var tempnode = obj.getAllSubItems(id).indexOf("load");
            if (tempnode == 0) {
                return true;//未加载
            }
            return false;
        };
        
		
		/**
		 * 懒加载模式
		 */
		var lazyLoad= function(obj,id){
			if(id === "0" || id === 0){
                return ;
            }
			if(hasTempNode(obj, id)){
				//删除子节点
	            obj.deleteChildItems(id);
	            SGIS.API.get("catalog/?/next/tree/xml",id).json(function(re){
					if(re.code == 0){
						moveTree && moveTree.loadXMLString(re.data);
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
	        }
		};
	
		/**
		 * 取得移动树
		 */
		var getMoveTree = function(_callback){
			var $loading = $("#chart-catalog-move-loading").removeClass("hide");
			SGIS.API.get("catalog/?/next/tree/xml",0).json(function(re){
				if(re.code == 0){
					moveTree&&moveTree.destructor();
	                moveTree = SGIS.Tree.create("chart-catalog-move-tree", re.data,actions, lazyLoad);
	                //打开根节点
	                moveTree.openItem("0");
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

				$loading.addClass("hide");

				callback = _callback;
				callback && callback();
			});
		};
		
		var getMoveTreeObj = function(){
			return moveTree;
		};
		
		return {
			getMoveTree:getMoveTree,
			getMoveTreeObj:getMoveTreeObj
		};
	})();
	
	/**
	 * 入口调用方法
	 */
	$(function(){
		UI.init();
		ThirdChartsConfig.init();
		Gallery.init();
	});
});