/***********************************************************************/
/**
 * 制图
 */
define(function(require, exports, module) {
	var _isIe = false;

	/**
	 * 修改IE样式
	 * @constructor
	 */
	var IEStyle = function(){
		$("input[type='range']").parent("span.input-group-addon").css({"width":"200px"});
		$("input.form-control[type='text']").css({"height":"75px"});
		$("input.form-control[type='color']").css({"width":"75px"});
	};

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
			_isIe = true;

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
		_isIe = true;
		$("#top-alert-container").show();
	};
	
	/**
	 * 表格处理
	 */
	var HandsontableExcel = (function(){

		var _handsontableObj = null;//handsontable对象
		var _currentData = null;
		var _isExcelInit = false;
		var _isEditedData = false;	//是否编辑过数据
		var _isRightData = true;	//是否数据正常
		
		var init = function(){

			_handsontableObj = null;
	        _isEditedData = false;
	        _isRightData = true;
	  
		};
		
		/**
		 * 取得当前的数据
		 */
		var getCurrentData = function(callback){
			var data = removeNullData(_currentData);
			if(data != null){
				toChartData(data,callback);
			}else{
				callback && callback(null);
			}
		};
		
		/**
		 * 移除空数据
		 */
		var removeNullData = function(data){
			data = $.extend([],data || _currentData);
			
			//获取数据
			var dataLen = data.length;
			if(dataLen > 0){
				//1.去掉所有null行
				var tempData = [];
				for(var h=0,len0=data.length;h<len0;h++){
					var row = data[h];
					
					var colNullCount = 0;
					var len1=row.length;
					for(var c=0; c<len1; c++){
						var item = row[c];
						if(item === null || item === "null" || item === ""){
							colNullCount++;
						}
					}
					//当前行全列为null
					if(colNullCount == len1){
						continue;
					}
					
					tempData.push(row);
				}
				data = tempData;
				dataLen = data.length;
				
				if(dataLen > 0){
					//列宽
					var colLen = data[0].length;
					
					//2.去掉所有的null列
					var noColIndexs = [];
					for(var i=0;i<colLen;i++){
						var rowNullCount = 0;
						for(var j=0;j<dataLen;j++){
							var item = data[j][i];
							if(item === null || item === "null" || item === ""){
								rowNullCount ++; 
							}
						}
						//当前列全行为null
						if(rowNullCount == dataLen){
							//存储列号
							noColIndexs.push(i);
						}
					}
					
					//3.填充数据
					if(noColIndexs.length > 0){
						var newData = [];
						for(var m=0;m<dataLen;m++){
							if(!newData[m]){
								newData[m] = [];
							}
							for(var n=0,nLen=data[m].length;n<nLen;n++){
								//不存在的
								if(noColIndexs.indexOf(n) == -1){
									newData[m].push(data[m][n]);
								}
							}
						}
						data = newData;
						dataLen = data.length;
					}
				}
			}
	
			//校验数据
			for(var a=0;a<dataLen;a++){
				var row = data[a];
				for(var b=0,len3=row.length;b<len3;b++){
					var item = row[b];
					if(item === null || item === "null" || item === ""){
						SGIS.UI.alert("请输入正确的数据！<br/><br/>提示：检查是否有空单元格!",
							null,false,function(modal){
							modal.css({
								"top":"40%",
								"height":"90px",
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

						//标记数据正确
						_isRightData = false;
						return null;
					}
				}
			}
			//标记数据正确
			_isRightData = true;
			
			return data;
		};
		
		/**
		 * 转换为图表数据
		 */
		var toChartData = function(data,callback){
			$.ajax({
				url:"excelformat",
	            type : "POST",
	            data : {
	            	action:'highcharts.format',
	            	data:encodeURI(JSON.stringify(data))
	            },
	            dataType : "json",
	            success: function (re) {
	            	if(re && re.code == 0){
						var result = {
							chartData:re.data,
							excelData:re.data			//注意此处，与d3的差别（此处保存为chartData一样，因为会转换）
						};
	            		callback && callback(result);
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
	            		callback && callback(null);
	            	}
	            },
	            error : function(re){
	            	
	            }
			});
		};
		
		/**
	    * 转换为handsontable数据
	    */
		var jsonToHandsontableExcel = function(data){
			var excelData = [];	
			
			if(data.length >1){
				for(var i=0,len=data.length;i<len;i++){
					excelData.push([data[i].name,data[i].value]);
				}
		   	}else{
		   		if(data.length ==1 && data[0].name instanceof Array){
					var cData = data[0].name;
					for(var i=0,len=cData.length;i<len;i++){
						var excelRow = [];
						for ( var j = 0,len2=cData[i].length; j < len2; j++) {
							excelRow.push(cData[i][j]);
						}
						excelData.push(excelRow);
					}
		   		}else{
	 		   		for(var i=0,len=data.length;i<len;i++){
						excelData.push([data[i].name,data[i].value]);
					}
		   		}
		   	}
			
			//得到表格数据
			_currentData = $.extend([],excelData);
			var height = $(window).height()-270;
			if(height < 100){
				height = 100;
			}

			$("#excel-data").attr("data-height",$(window).height()/3);
			if(_isExcelInit){
				//初始化后
				$("#excel-data").handsontable("loadData",excelData);  
			}else{
				//初始化数据表格
		        $("#excel-data").handsontable({
		        	fixedRowsTop:1,			//头部不动
		        	fixedColumnsLeft:1,		//第一列不动
		        	startRows : 20,
					startCols : 12,
					height : height,
					width : '90%',
					colHeaders : true,
					rowHeaders : true,
					stretchH:'all',
					columnSorting : true,
					contextMenu : true,
		        	minSpareRows: 1,
		        	autoWrapRow: true,
		        	contextMenu: true,
		        	data:excelData,
					afterChange : function(change, source) {
						if(_handsontableObj == null){
							_handsontableObj = this;
						}
						if(source == 'edit'){
							_isEditedData = true;
							
							//得到表格数据
							_currentData = this.getData();	
						}
					}
		        });
		        
		        _isExcelInit = true;
			}
		};
		
		var isRightData = function(){
			return _isRightData;
		};
		
		var isEditedData = function(){
			return _isEditedData;
		};
		
		var setCurrentData = function(data){
			_currentData = data;
		};

		var getHandsontableObj = function(){
			return _handsontableObj;
		};
		
		return {
			init:init,
			jsonToHandsontableExcel:jsonToHandsontableExcel,
			getCurrentData:getCurrentData,
			isRightData:isRightData,
			isEditedData:isEditedData,
			setCurrentData:setCurrentData,
			getHandsontableObj:getHandsontableObj
		};
	})();
	
	
	/**
	 * 登录信息
	 */
	var LoginInfo = (function(){
		
		var _userInfo = null;
		
		var setUserInfo = function(userInfo){
			_userInfo = userInfo;
		};
		
		var getUserInfo = function(){
			return _userInfo;
		};
		
		var init = function(){
			_userInfo = null;
			
			eventBind();
		};
		
		var eventBind = function(){
			//登录弹出
			$("a[data-target='#login-modal']").click(function(){
				//判断是否保存用户名
				checkIsSaveUserLogin();
			});

			// 回车事件
			$("#login-modal input[name='user_login'],#login-modal input[name='user_password']")
				.on("keypress", function(e) {
					if (e.keyCode && e.keyCode == 13) {
						//登录
						login();
					}
				});

			//登录提交
			$("#login_submit").click(function(){
				//登录
				login();
			});
	
			//注销
			$("#logout-btn").click(function(){
				logout();
			});
		};
		
		/**
		 * 注销
		 */
		var logout = function(){
			SGIS.API.get("user/logout").json(function(re){
				if(re && re.code == 0){
					SGIS.UI.alert("注销成功!",null,false,function(modal){
						modal.css({
							"top":"5%",
							"height":"60px",
							"width":"300px",
							"margin-left":"-20px",
							"overflow":"hidden",
							"background-color":"transparent",
							"border":"none"
						});

						modal.find(".content>.ui.label").css({
							"font-size":"18px"
						});
					});

					UserInfo.init();
					//删除信息
					setUserInfo(null);
					//展示注销后
					showLoginWindow();
				}
			});
		};
		
		/**
		 * 用户登录
		 */
		var login = function(){
			var $useruLogin = $("input[name='user_login']");
			var $userPassword = $("input[name='user_password']");
			var $loginMessage = $("#login-message");
	
			var userLogin = $useruLogin.val();
			var userPassword = $userPassword.val();
			if(!userLogin || userLogin == ""){
				$loginMessage.html("登录名不能为空！");
				var $error = $useruLogin.parent(".field").addClass("error");
				setTimeout(function(){
					$error.removeClass("error");
					$loginMessage.html("");
					$useruLogin.focus();
				},1500);
				return ;
			}
	
			if(!userPassword || userPassword == ""){
				$loginMessage.html("密码不能为空！");
				var $error2 = $userPassword.parent(".field").addClass("error");
				setTimeout(function(){
					$error2.removeClass("error");
					$loginMessage.html("");
					$userPassword.focus();
				},1500);
				return ;
			}
			$("#login_submit").button("loading");
			SGIS.API.get("user/login").data({
				"userLogin":userLogin,
				"userPassword":userPassword
			}).json(function(re){
				$("#login_submit").button("reset");
				var userInfo = null;
				setUserInfo(userInfo);
				if(re && re.code == 0){
					if(re.data){
						//保存用户信息
						userInfo = re.data;
						setUserInfo(userInfo);
						if(userInfo != null){
							//设置是否保存用户名
							setIsSaveUserLogin(userInfo.userLogin);
							//已经登录
							showUserInfo(userInfo.userName);

							//登录提示
							$loginMessage.html("登录成功！");
							setTimeout(function(){
								$loginMessage.html("");
								$('#login-modal').modal("hide");
							},500);
						}else{
							$loginMessage.html("登录失败，用户名或者密码错误！");
							setTimeout(function(){
								$loginMessage.html("");
							},1500);
						}
					}else{
						$loginMessage.html("登录失败，用户名或者密码错误！");
						setTimeout(function(){
							$loginMessage.html("");
						},1500);
					}
				}else{
					$loginMessage.html(re.message || "登录失败，用户名或者密码错误！");
					setTimeout(function(){
						$loginMessage.html("");
					},1500);
				}
			});
		};
		
		/**
		 * 展示登录窗口
		 */
		var showLoginWindow = function(){
			$('#login-span').removeClass("hide");
			$('#logout-span').addClass("hide");
	
			//删除登录名
			$("#login-name").html("");
			
			//隐藏
			$("#save_image").addClass("hide");
			$("#my_images").addClass("hide");

			//判断是否保存用户名
			checkIsSaveUserLogin();
		};

		/**
		 * 判断是否保存用户名
		 */
		var checkIsSaveUserLogin = function(){
			var cookie = Cookie.getCookies();
			if(cookie && cookie[0]){
				$("#login_form input[name='user_login']").val(cookie[0]);
				$("#login_form input[type='checkbox']").attr("checked",true);
			}else{
				$("#login_form input[name='user_login']").val("");
				$("#login_form input[name='user_password']").val("");
				$("#login_form input[type='checkbox']").attr("checked",false);
			}
			$("#login-modal input[name='user_login']").focus();
		};

		/**
		 * 设置是否保存用户名
		 *
		 * @param userLogin
		 */
		var setIsSaveUserLogin = function(userLogin){
			var isCheck = $("#login_form input[type='checkbox']").is(":checked");
			if(isCheck){
				Cookie.addCookie(userLogin);
			}else{
				Cookie.clearCookie();
			}
		};
		
		/**
		 * 展示用户信息
		 */
		var showUserInfo = function(userName){
			$('#login-span').addClass("hide");
			$('#logout-span').removeClass("hide");
			$('#login-name').html(userName || "");
			
			//显示
			$("#save_image").removeClass("hide");
			$("#my_images").removeClass("hide");
		};
		
		
		return {
			init:init,
			setUserInfo:setUserInfo,
			getUserInfo:getUserInfo,
			showUserInfo:showUserInfo,
			showLoginWindow:showLoginWindow
		};
	})();
	
	/**
	 * 保存可视化图
	 */
	var SaveChart = (function(){

		/**
		 * 保存
		 */
		var init = function(){
			$("#save_image").click(function(){
				var alertMsg = "<a class='ui blue button save' type='button' style='margin-right: 8px;' >保存</a>"+
					"<a class='ui button cancle' type='button'>取消</a>";
				SGIS.UI.alert(alertMsg,
					null,true,function(modal,close){
						modal.css({
							"top":"40%",
							"width":"300px",
							"margin-left":"-20px",
							"height":"100px",
							"overflow":"hidden"
						});

						modal.find(".header>i").addClass("hide");
						modal.find(".header>.ui.label").css({
							"font-size":"14px",
							"background-color":"transparent"
						}).html("确定保存到图集吗?");
						modal.find(".content>.ui.label").removeClass("blue").css({
							"font-size":"14px",
							"background-color":"transparent"
						});

						modal.find(".content>.ui.label>a.save").off("click");
						modal.find(".content>.ui.label>a.save").on("click",function(){
							//关闭
							close && close();
							submit();
						});

						modal.find(".content>.ui.label>a.cancle").off("click");
						modal.find(".content>.ui.label>a.cancle").on("click",function(){
							close && close();
						});
					});
			});
		};

		/**
		 * 提交
		 *
		 * @param callback
		 */
		var submit = function(callback){
			//取得表单信息
			getSubmitInfo(function(formInfo){
				if(!formInfo || formInfo == null){
					callback && callback(false);
					return null;
				}

				//截图
				$("#save_image").button("loading");

				var containerId = getImageStreamId();
				getImageStream(containerId,function(canvas){
					var image = canvas.toDataURL("image/png");
					if(image){
						//保存截图
						formInfo["chartImage"] = image;

						//取得数据
						HandsontableExcel.getCurrentData(function(newData){
							if(newData != null){
								//保存数据
								formInfo["chartJson"] = JSON.stringify(newData);

								SGIS.API.post("chart/add/private")
									.data(JSON.stringify(formInfo))
									.json(function(re){
										$("#save_image").button("reset");
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
										if(re.code == 0 && re.data){
											if(typeof callback == "function" && callback){
												callback(true);
											}else{
												setTimeout(function(){
													window.location = "edithighcharts?chart-id="+re.data.id;
												},2000);
											}
										}
									});
							}else{
								SGIS.UI.alert("请输入正确的数据！",
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
								$("#save_image").button("reset");
								callback && callback(false);
							}
						});

					}else{
						SGIS.UI.alert("无法截取图片，请重试！",
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
						$("#save_image").button("reset");
						callback && callback(false);
					}
				});
			});
		};

		/**
		 * 取得表单信息
		 */
		var getSubmitInfo = function(callback){

			var $chartName = $("form#save-form input[name='chart-name']");
			var $chartMome = $("form#save-form textarea[name='chart-memo']");
			var $chartType = $("form#save-form input[name='chartType']");
			var $chartTypeChart = $("form#save-form input[name='chartTypeChart']");

			var chartName = $chartName.val();
			if(!chartName || chartName == ""){
				SGIS.UI.alert("图集名称不能为空！",
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
				$chartName.click();

				callback && callback(null);
				return;
			}

			var styleUrl = "tool/js/module/style/highcharts/"+$chartTypeChart.val()+".style";
			seajs.use(styleUrl,function(style){
				var re = {
					chartName:$.trim(chartName),
					chartMome:$.trim($chartMome.val()),
					chartType:$chartType.val(),
					chartTypeChart:$chartTypeChart.val()
				};
				if(style){
					re["chartParam"] =JSON.stringify({
						style:style.getStyle(),
						container:style.getContainer()
					});
				}
				callback && callback(re);
			});
		};

		var getImageStreamId = function(){
			var $svg = $('#content').children("svg");
			var id = 'content';
			if($svg.length == 0){
				$svg = $('#content').children("div").children("svg");
				id = $("#content").children("div").attr("id");
			}
			return id;
		};

		/**
		 * 截图操作
		 */
		var getImageStream = function(containerId,callback){
			containerId = containerId || 'content';

			$("#svg-to-canvas").remove();
			$("<canvas id='svg-to-canvas'></canvas>").addClass("hide").appendTo($("body"));

			/*var $svgs = $('#'+containerId).children("svg");
			if($svgs.length == 0){
				$svgs = $('#'+containerId).children("div").children("svg");
			}

			var svgHtml = "";
			for ( var i = 0; i < $svgs.length; i++) {
				var $svg = $($svgs[i]);

				var svg = "<svg";
				//
				var classS = $svg.attr("class");
				if(classS && classS != ""){
					svg += " class='"+classS+"' ";
				}
				//
				var width = $svg.attr("width");
				if(width && width != ""){
					svg += " width='"+width+"' ";
				}
				//
				var height = $svg.attr("height");
				if(height && height != ""){
					svg += " height='"+height+"' ";
				}

				//
				var style = $svg.attr("style");
				if(style && style != ""){
					svg += " style='"+style+"' ";
				}

				svgHtml += svg+" >"+$svg.html()+"</svg>";
			}

			canvg('svg-to-canvas',svgHtml,{
				ignoreMouse: true,
				ignoreAnimation: true
			});*/
			$("#svg-to-canvas").empty() ;  //containerId
			var svg = document.querySelector("#"+containerId+' svg');
			var serializer = new XMLSerializer();
			var svgString = serializer.serializeToString(svg);

			var canvas = document.getElementById("svg-to-canvas");
			canvg(canvas, svgString);

			var canvas = document.getElementById("svg-to-canvas");
			callback && callback(canvas);
		};

		return {
			init:init,
			submit:submit
		};
	})();
	
	/**
	 * 上传文件
	 */
	var Upload = (function() {
		
		/**
		 * 初始化
		 */
		var init = function(){
			//绑定事件
			bindUploadEvent(false);
			
			//校验是否可以选择
			$("#form input[name=file]").click(function(){
				var dataLoading = $("#infont_inmput_name").attr("data-loading");
				if(dataLoading === "1"){
					return false;
				}
				return true;
			});
		};
		
		/**
		 * 绑定上传事件
		 */
		var bindUploadEvent = function(reBind){
			if(reBind){
				//重置上传文件空间
				
				var file = "<span id='infont_inmput_name' data-loading='0'>导入excel数据</span>";
				file += "<input name='file' type='file' accept='.xls,.xlsx' style='cursor: pointer;'>";
				$("#infont_inmput").html(file);
				
				//重置绑定iframe
				var index = "-"+(new Date()).getTime()+"-"+(Math.floor(Math.random()*10000));
				var iframeId = "upload-frame"+index;

				$("form#form").attr("target",iframeId);
				var $iframe =  $("<iframe id='"+iframeId+"' name='"+iframeId+"' style='display:none;'></iframe>").appendTo($("#iframe-container").html(""));
				$iframe.one("load", function(){
		            var c = $(this).contents().find("body");
		            var re = $.trim(c.text());

					$("#infont_inmput_name").html("导入excel数据").attr("data-loading","0");
		            if (re){
		                getUploadResult(re);
		            }else{
						SGIS.UI.alert("文件上传失败！",
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
		            //重置一下
		            reset();	
		            c.empty();
		            
		            //重新绑定
		            bindUploadEvent(true);
				});
			}else{
				$("#upload-frame").one("load", function(){
		            var c = $(this).contents().find("body");
		            var re = $.trim(c.text());

					$("#infont_inmput_name").html("导入excel数据").attr("data-loading","0");
		            if (re){
		                getUploadResult(re);
		            }else{
						SGIS.UI.alert("文件上传失败！",
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
		            //重置一下
		            reset();	
		            c.empty();
		            
		            //重新绑定
		            bindUploadEvent(true);
				});
			}
			
			//选择文件
			$("#form input[name=file]").off("change");
			$("#form input[name=file]").change(function() {	
				var $this = $(this);
				var file = $this.val();
				var isOk = valiation();
				if(isOk){
					$("#infont_inmput_name").html("请稍后...").attr("data-loading","1");
					var dom =document.getElementById("form");
					if(dom){
						dom.submit();
					}else{
						$("#infont_inmput_name").html("导入excel数据").attr("data-loading","0");
					}
				}else{
					$("#infont_inmput_name").html("导入excel数据").attr("data-loading","0");
				}
			});
		};
		
		/**
		 * 重置表单
		 */
		var reset = function(){
			var dom =document.getElementById("form");
			if(dom){
				dom.reset();
			}
			$("#form input[name=file]").val("");
		};
		
		/**
		 * 取得上传结果
		 */
		var getUploadResult = function(re){
			var re = JSON.parse(re);
			if(re){
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
					if(re.excelFileName){
						var data = $.extend([],re.excelFileName);
						
						//保存数据
						HandsontableExcel.setCurrentData(data);
						//初始化后
						$("#excel-data").handsontable("loadData",data); 
						//刷新数据
						$("#refresh_json").click();
					}else{
						var url = require.resolve("/uploads/json/"+re.fileName);
						$.getJSON(url,function(data){
							//excel数据
				      	   	HandsontableExcel.jsonToHandsontableExcel(data);
							//刷新数据
							$("#refresh_json").click();
						});
					}
				}
			}else{
				SGIS.UI.alert("文件上传失败！",
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
		};
		
		/**
		 * 验证
		 */
		var valiation = function(){
			var file =  $("#form input[name=file]").val();
			if(!file || file == ""){
				SGIS.UI.alert("请先选择文件！",
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
				return false;
			}
			var suffix = file.substr(file.lastIndexOf(".")).toLowerCase();
			if(suffix != ".xls" && suffix != ".xlsx"){
				SGIS.UI.alert("请选择excel文件！",
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
				return false;
			}
			
			return true;
		};
		
		
		return {
			init:init
		};
	})();
	
	
	/**
	 * 接口
	 */
	var Hanlder = (function() {
		//当前的图形类型
		var _chartTypeChart = null;
		var _chartObj = null;
		var _chartConfig = null;
		
		/**
		 * 上传图标初始化
		 */
		var init = function(isCanInit) {
			browerHanlder();
			beforeInit();
			if(!isCanInit)
                return ;

			_chartTypeChart = $("#form input[name=chart-type-chart]").val();
			setNameAndMemoAndImg(function(){
				bindEvent();

				UserInfo.getUserInfo(function(info){
					LoginInfo.init();
					HandsontableExcel.init();
					SaveChart.init();
					Upload.init();

					//获取模板数据
					getTemplateData(function(){
						if(_isIe){
							//修改样式
							IEStyle();
						}
					});

					if(info && info != null){
						LoginInfo.setUserInfo(info);
						LoginInfo.showUserInfo(info.userName);
					}else{
						LoginInfo.setUserInfo(null);
						LoginInfo.showLoginWindow();
					}
				});
			});
		};
		
		/**
		 * 设置填写的提示信息
		 * @param callback
		 */
		var setNameAndMemoAndImg = function(callback){
			var configUrl = "js/config/chart.name.config.json";
			$.getJSON(configUrl,function(config){
				var name  = null;
				if(config && config.highcharts){
					name = config.highcharts[_chartTypeChart];
				}
				if(!name || name == null){
					name = "";
				}

				$("input#chart-name").val(name+$("input#chart-name").val());
				$("input#chart-name").attr("placeholder",$("input#chart-name").val());
				$("textarea#chart-memo").attr("placeholder",name+$("textarea#chart-memo").attr("placeholder"));

				$("<img style='max-width:100%' src='./image/highcharts/"+_chartTypeChart+".excel.png' />").appendTo($("#code-api"));

				callback && callback();
			});
		};
		
		/**
		 * 初始化之前
		 */
		var beforeInit = function(){
			$("#change_image").click(function() {
				UserInfo.getUserInfo(function(userInfo){
					//未登录直接跳转
					if(userInfo == null){
						//去模板页面
						window.location = "index.html";
						return false;
					}

					//
					var alertMsg = "<a class='ui blue button save' type='button' style='margin-right: 8px;' >保存</a>"+
						"<a class='ui blue button un-save' type='button' style='margin-right: 8px;' >不保存</a>"+
						"<a class='ui button cancle' type='button'>取消</a>";
					SGIS.UI.alert(alertMsg,
						null,true,function(modal,close){
							modal.css({
								"top":"40%",
								"width":"300px",
								"margin-left":"-20px",
								"height":"100px",
								"overflow":"hidden"
							});

							modal.find(".header>i").addClass("hide");
							modal.find(".header>.ui.label").css({
								"font-size":"14px",
								"background-color":"transparent"
							}).html("确定更换模板？选择以下操作：");
							modal.find(".content>.ui.label").removeClass("blue").css({
								"font-size":"14px",
								"background-color":"transparent"
							});

							modal.find(".content>.ui.label>a.save").off("click");
							modal.find(".content>.ui.label>a.save").on("click",function(){
								//关闭
								close && close();
								SaveChart.submit(function(isSave){
									if(isSave){
										window.setTimeout(function(){
											//去模板页面
											window.location = "index.html";
										},500);
									}
								});
							});

							modal.find(".content>.ui.label>a.un-save").off("click");
							modal.find(".content>.ui.label>a.un-save").on("click",function(){
								//去模板页面
								window.location = "index.html";
							});

							modal.find(".content>.ui.label>a.cancle").off("click");
							modal.find(".content>.ui.label>a.cancle").on("click",function(){
								//关闭
								close && close();
							});
						});
				});
			});
			
			$("#go_gallery").click(function() {
				var url = SGIS.API.getURL("")+"http/";
				window.open(url, "_blank");
			});

			$("#my_images").click(function() {
				var alertMsg = "<a class='ui blue button save' type='button' style='margin-right: 8px;' >保存</a>"+
					"<a class='ui blue button un-save' type='button' style='margin-right: 8px;' >不保存</a>"+
					"<a class='ui button cancle' type='button'>取消</a>";
				SGIS.UI.alert(alertMsg,
					null,true,function(modal,close){
						modal.css({
							"top":"40%",
							"height":"60px",
							"width":"300px",
							"margin-left":"-20px",
							"height":"100px",
							"overflow":"hidden"
						});

						modal.find(".header>i").addClass("hide");
						modal.find(".header>.ui.label").css({
							"font-size":"14px",
							"background-color":"transparent"
						}).html("确定查看我的作品？选择以下操作：");
						modal.find(".content>.ui.label").removeClass("blue").css({
							"font-size":"14px",
							"background-color":"transparent"
						});

						modal.find(".content>.ui.label>a.save").off("click");
						modal.find(".content>.ui.label>a.save").on("click",function(){
							//关闭
							close && close();
							SaveChart.submit(function(isSave){
								if(isSave){
									window.setTimeout(function(){
										//去我的作品
										window.location = "chart.mine.thumbnail.html";
									},500);
								}
							});
						});

						modal.find(".content>.ui.label>a.un-save").off("click");
						modal.find(".content>.ui.label>a.un-save").on("click",function(){
							//去我的作品
							window.location = "chart.mine.thumbnail.html";
						});

						modal.find(".content>.ui.label>a.cancle").off("click");
						modal.find(".content>.ui.label>a.cancle").on("click",function(){
							//关闭
							close && close();
						});
					});
			});
		};
		
		/**
		 * 绑定事件
		 */
		var bindEvent = function(){
			/**
			 * 绑定事件
			 */
			$("input#chart-name,textarea#chart-memo").on("click",function(){
				var $this = $(this);
				
				$this.attr("readonly",false);
				$this.removeClass("read-only");
			}).on("blur",function(){
				var $this = $(this);
				
				$this.attr("readonly",true);
				$this.addClass("read-only");
			});
			
			$("#download_excel_template_btn").click(function(){
				var url = "excelTemplate/highcharts/"+_chartTypeChart+".template.xlsx";
				window.open(url,"_blank");
			});

			$("#code-api-switch").change(function(){
				var height = $(window).height()-270;
				var isCheck = $(this).is(":checked");
				if(isCheck){
					$("#code-api-panel").fadeIn(100);
					var dataHeight = $("#excel-data").attr("data-height");
					if(dataHeight && dataHeight != "" && parseFloat(dataHeight) > 0){
						height = parseFloat(dataHeight);
					}
				}else{
					$("#code-api-panel").fadeOut(100);
				}

				//修改样式
				var handsontableObj = HandsontableExcel.getHandsontableObj();
				if(handsontableObj != null && typeof handsontableObj.updateSettings == "function"){
					if(height < 100){
						height = 100;
					}

					handsontableObj.updateSettings({"height":height});
				}
			});
		};
		
		/**
		 * 取得模板数据
		 */
		var getTemplateData = function(callback){
			var url = SGIS.Config.BASE_MODULE_URL + "js/module/highcharts/"
				+_chartTypeChart+".text.json";
	        $.getJSON(url,function(data){
	        	//excel数据
	      	   	HandsontableExcel.jsonToHandsontableExcel(data);
	      	   	
	      	   	//出图
	      	   	var jsUrl = "base/js/module/highcharts/"+_chartTypeChart;
	      	   	var styleUrl = "tool/js/module/style/highcharts/"+_chartTypeChart+".style";
				seajs.use([jsUrl,styleUrl],function(re,style){
					if(re){
						
						var obj = new re();
						var height = $(window).height()-290;
						
						var objConfig = {
							container:'content',
							width:$("#content").parent().width()-46,	//36->46
							height:(height < 400) ? 400 : height,
							data:data
						};
						

						obj.init(objConfig);
				    	
				    	$("#refresh_json").click(function(){
				    		//获取当前数据
				    		HandsontableExcel.getCurrentData(function(newData){
				    			if(newData != null){
									if(newData.chartData){
										objConfig["data"] = newData.chartData;
									}else{
										objConfig["data"] = newData;
									}
				                	obj.init(objConfig);

				                	if(style && typeof style.reBindColorSelect == "function"){
				                		//重新绑定颜色选择器
				                		style.reBindColorSelect(obj,objConfig);
				                	}
				        		}
				    		});
				    	});
				    	
				    	//保存信息		
						_chartObj = obj;
						_chartConfig = objConfig;
				    	
				    	if(style){
							//注意style的init方法必须放在【_chartObj，_chartConfig】被初始化以后
				    		style.init(Hanlder,null,function(){
				    			console.log("消息提示：初始化完成！");
				    			
				    			//设置图形的高度
	        	    			var height = objConfig.height;
				    			$("#chart-chart-height-range").val(height);
				    			$("#chart-chart-height-text").val(height);
				    			
								style.setHeight(height);


								//地图模块初始化数据值域
								if(style.initDataRangeControll &&
									typeof style.initDataRangeControll == "function"){
									if(_chartObj.option && _chartObj.option.dataRange){
										var dataRange = $.extend(true,{},_chartObj.option.dataRange);
										if(typeof dataRange.min != "undefined" &&
											typeof dataRange.max != "undefined"){
											style.initDataRangeControll(Hanlder,dataRange.min,dataRange.max);
										}//end if(typeof dataRange.min
									}//end if(_chartObj.option
								}//end if(style.initDataRangeControll

								//响应式刷新图
								$(window).resize(SGIS.Util.throttle(function(){
									_chartConfig["width"]= $("#content").parent().width()-46;	//36->46
									_chartObj.init(_chartConfig);
								},2000));
				    		});
				    	}
					}else{
						SGIS.UI.alert("未找到数据！该图无法显示！",
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
	        });
		};
		
		/**
		 * 取得出图对象
		 */
		var getChartObj = function(){
			return _chartObj;
		};
		
		/**
		 * 取得出图对象配置参数
		 */
		var getChartConfig = function(){
			return _chartConfig;
		};
	
		return {
			init : init,
			getChartObj:getChartObj,
			getChartConfig:getChartConfig
		};
	})();
	
	
	return Hanlder;
});









