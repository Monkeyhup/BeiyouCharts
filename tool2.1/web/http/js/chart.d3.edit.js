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
	            	action:'d3.format',
	            	type:Hanlder.getChartTypeChart(),
	            	data:encodeURI(JSON.stringify(data))
	            },
	            dataType : "json",
	            success: function (re) {
	            	if(re && re.code == 0){
						var result = {
							chartData:re.data,
							excelData:data			//注意此处，与echarts的差别（保存为excel数据）
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
			
			//得到表格数据
			_currentData = $.extend([],data);
			
			var excelData = _currentData;

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
	 * 保存可视化图
	 */
	var SaveChart = (function(){
		
		/**
		 * 保存
		 */
		var init = function(){
			$("#save_image").click(function(){
				var alertMsg = "<a class='ui blue button save' type='button' style='margin-right: 8px;' >更新</a>"+
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
						}).html("确定更新图集吗?");
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

								var chartId = $("form#save-form input[name='chartId']").val();
								SGIS.API.put("chart/?",chartId)
									.data(JSON.stringify({
										chartName:formInfo.chartName,
										chartMome:formInfo.chartMome,
										chartParam:formInfo.chartParam,
										chartJson:formInfo.chartJson,
										chartImage:formInfo.chartImage
									}))
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
					        		if(re.code == 0){
										if(typeof callback == "function" && callback){
											callback(true);
										}else{
											var alertMsg = "<a class='ui blue button save' type='button' style='margin-right: 8px;' >确定</a>"+
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
													}).html(re.message+"-是否现在查看？");
													modal.find(".content>.ui.label").removeClass("blue").css({
														"font-size":"14px",
														"background-color":"transparent"
													});

													modal.find(".content>.ui.label>a.save").off("click");
													modal.find(".content>.ui.label>a.save").on("click",function(){
														//关闭
														close && close();

														var url = SGIS.API.getURL("")+"http/chart.html?chart-id="+chartId;
														window.location = url;
													});

													modal.find(".content>.ui.label>a.cancle").off("click");
													modal.find(".content>.ui.label>a.cancle").on("click",function(){
														close && close();
														window.location.href = window.location;
													});
												});
										}//end if(typeof callback == "function" && callback) else
					        		}
				        		});
		          			}else{
								SGIS.UI.alert("请输入正确的数据!",
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
			
			var styleUrl = "tool/js/module/style/d3/"+$chartTypeChart.val()+".style";
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
	 * 读取信息
	 */
	var ChartInfo = (function(){
		var _chartInfo = null;

		/**
		 * 取得图集信息
		 * @param chartId
		 * @param callback
		 */
		var getChartInfo = function(chartId,callback){
			if(_chartInfo != null){
				callback && callback(_chartInfo);
				return ;
			}
			SGIS.API.get("chart/?",chartId)
				.json(function(re){
					_chartInfo == null
					if(re && re.code == 0 && re.data){
						var chartIsfromSgis = re.data.chartIsfromSgis;
						if(chartIsfromSgis === "1" || chartIsfromSgis === 1){
							SGIS.UI.alert("提示：不能编辑成果保存图！",
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
							return ;
						}
						var chartType = re.data.chartType;
						if(chartType === "0" || chartType === 0){
							//此图为d3图
							window.location = "editecharts?chart-id="+chartId;
							return ;
						}

						_chartInfo = $.extend(true,{},re.data);	//保存数据
						callback && callback(_chartInfo);
					}else{
						SGIS.UI.alert(re.message || "读取图集失败！",
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
				});
		};

		return {
			getChartInfo:getChartInfo
		};
	})();

	
	/**
	 * 接口
	 */
	var Hanlder = (function(){
		//当前的图形类型
		var _chartTypeChart = null;
		var _chartObj = null;
		var _chartConfig = null;
		var _module = null;
		
		/**
		 * 上传图标初始化
		 */
		var init = function(isCanInit) {
			browerHanlder();
			beforeInit();
			if(!isCanInit)
	            return ;

			//取得id
			var chartId = $("#save-form input[name='chartId']").val();
			if(!chartId || chartId == ""){
				return ;
			}

			//获取用户信息
			UserInfo.getUserInfo(function(info){
				if(info && info != null){
					$("#logout-span").removeClass("hide");
					$("#logout-span #login-name").html(info.userName);
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


				//获取信息
				ChartInfo.getChartInfo(chartId,function(chartInfo){
					if(chartInfo == null){
						if(!window.close()){
							window.location.href = "index.html";
						}
						return ;
					}

					//保存图类型
					_chartTypeChart = chartInfo.chartTypeChart;
					if(!_chartTypeChart || _chartTypeChart == ""){
						return ;
					}

					//初始化数据
					$("form#save-form input[name=chart-name]").val(chartInfo.chartName);
					$("form#save-form input[name=chart-name]").attr("value",chartInfo.chartName);
					$("form#save-form textarea[name=chart-memo]").val(chartInfo.chartMome || "");
					$("form#save-form textarea[name=chart-memo]").html(chartInfo.chartMome || "");
					$("form#save-form input[name=chartTypeChart]").val(_chartTypeChart);
					$("form#form input[name=chart-type-chart]").val(_chartTypeChart);
					var img = "<img style='max-width:100%' src='./image/d3/"+_chartTypeChart+".excel.png' />";
					$(img).appendTo($("#code-api"));

					bindEvent();

					//钻取图
					if(_chartTypeChart == "d3.bar.drill"){
						$("div.container-fluid>div.row>div.col-xs-12")
							.removeClass("col-md-6").addClass("col-md-12");
					}//end if(_chartTypeChart == "d3.bar.drill")

					HandsontableExcel.init();
					SaveChart.init();
					Upload.init();

					//获取模板数据
					initData(chartInfo,function(){
						if(_isIe){
							//修改样式
							IEStyle();
						}
					});
				});
			});
		};

		/**
		 * 初始化之前
		 */
		var beforeInit = function(){
			$("#change_image").click(function() {
				var alertMsg = "<a class='ui blue button save' type='button' style='margin-right: 8px;' >更新</a>"+
					"<a class='ui blue button un-save' type='button' style='margin-right: 8px;' >不更新</a>"+
					"<a class='ui button cancle' type='button'>取消</a>";
				SGIS.UI.alert(alertMsg,
					null,true,function(modal,close){
						modal.css({
							"top":"40%",
							"width":"300px",
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
			
			$("#go_gallery").click(function() {
				var url = SGIS.API.getURL("")+"http/";
				window.open(url, "_blank");
			});

			$("#my_images").click(function() {
				var alertMsg = "<a class='ui blue button save' type='button' style='margin-right: 8px;' >更新</a>"+
					"<a class='ui blue button un-save' type='button' style='margin-right: 8px;' >不更新</a>"+
					"<a class='ui button cancle' type='button'>取消</a>";
				SGIS.UI.alert(alertMsg,
					null,true,function(modal,close){
						modal.css({
							"top":"40%",
							"width":"300px",
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
				var url = "excelTemplate/d3/"+_chartTypeChart+".template.xls";
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
		var initData = function(chartInfo,callback){
			//excel数据(初始化)
			var data = JSON.parse(chartInfo.chartJson);
			//excel数据
			if(data.excelData){
				HandsontableExcel.jsonToHandsontableExcel(data.excelData);
			}else{
				SGIS.UI.alert("消息提示：此图为旧版本<br/>时制作的图！无法初始化<br/>excel表格，请手动填写！",
					null,false,function(modal){
						modal.css({
							"top":"40%",
							"height":"90px",
							"overflow":"hidden",
							"background-color":"transparent",
							"border":"none"
						});

						modal.find(".content>.ui.label").css({
							"font-size":"12px"
						});
					});
				HandsontableExcel.jsonToHandsontableExcel([["该图为旧版本数据，无法初始化数据","请手动初始化数据"]]);
			}

			//出图
			var jsUrl = "base/js/module/d3/"+_chartTypeChart;
			var styleUrl = "tool/js/module/style/d3/"+_chartTypeChart+".style";
			seajs.use([jsUrl,styleUrl],function(re,style){
				if(re){
					_module = re;
					var obj = new re();
					var height = $(window).height()-290;

					var config = {
						containerId:"#content",
						data:data.chartData ? data.chartData : data,		//判断数据
						url:null,
						dataType:"data1",									//默认的数据
						w:$("#content").parent().width()-72,
						h:(height < 620) ? 620 : height
					};

					if(_chartTypeChart == "d3.bar.order"){
						$.extend(config,{
							yMax:0,
							timeOut:100,                   //100ms
							margin:{
								right:60,
								bottom:200
							},
							textRotate:60,
							textXY:[
								{x:20,y:15},
								{x:20,y:15},
								{x:100,y:10},
								{x:35,y:10},
								{x:50,y:10},
								{x:85,y:5},
								{x:50,y:5},
								{x:110,y:15},
								{x:20,y:15},
								{x:20,y:15},
								{x:60,y:15},
								{x:60,y:15},
								{x:80,y:15},
								{x:90,y:15},
								{x:20,y:15},
								{x:50,y:15},
								{x:60,y:15},
								{x:90,y:15}
							]
						});
					}else if(_chartTypeChart == "d3.bar.drill"){
						config["textWidth"] = 400;	//文字宽度
						config["w"] = 1105;			//图宽度

						//修改样式(排版)
						//setTimeout(function(){
						//	//目录置顶
						//	$("html,body").animate({
						//		scrollTop : $("form#save-form").offset().top - 100
						//	}, 500);
						//},2000);
					}else if(_chartTypeChart == "d3.category.compare"){
						config = {
							containerId:"#content",
							data:data.chartData ? data.chartData : data,		//判断数据
							dataType:"data1",        			//当前数据类型
							url:null,
							w:$("#content").parent().width()-252,	//72->252
							h:520,                      		//图的高度
							margin:{
								top : 80,						//top
								right : 30,						//right
								bottom : 30,					//bottom
								left : 100						//left
							},
							textXY:[                			//文字的xy坐标默认(x，y)
								{x:55,y:10},
								{x:55,y:10},
								{x:55,y:10},
								{x:55,y:10},
								{x:45,y:10},
								{x:43,y:10}
							]
						};
					}

					//要初始化的参数
					var myChartParam = null;
					var chartParamStr = chartInfo.chartParam;
					if(chartParamStr && chartParamStr != null && chartParamStr != "null"){
						var chartParam = JSON.parse(chartParamStr);
						if(chartParam){
							myChartParam = $.extend(true,{},chartParam);

							//添加宽度
							if(chartParam.container && chartParam.container.width && chartParam.container.width > 0){
								config["w"] = chartParam.container.width;
							}
							//添加高度
							if(chartParam.container && chartParam.container.height && chartParam.container.height > 0){
								config["h"] = chartParam.container.height;
							}

							//添加样式
							if(chartParam.style && chartParam.style){
								config["config"] = chartParam.style;
							}
						}
					}

					obj.init(config);

					$("#refresh_json").click(function(){
						//获取当前数据
						HandsontableExcel.getCurrentData(function(newData){
							if(newData != null){
								//重新初始化
								obj = new re();
								if(newData.chartData){
									config["data"] = newData.chartData;
								}else{
									config["data"] = newData;
								}
								obj.init(config);
								if(style && typeof style.reBindColorSelect == "function"){
									//重新绑定颜色选择器
									style.reBindColorSelect(obj,config);
								}
							}
						});
					});

					//保存信息
					_chartObj = obj;
					_chartConfig = config;

					if(style){
						if(myChartParam == null){
							console && console.log("消息提示：chartParam参数为null,无法初始化参数控件！");
						}

						//注意style的init方法必须放在【_chartObj，_chartConfig】被初始化以后
						style.init(Hanlder,myChartParam,function(){
							console.log("消息提示：初始化完成！");

							//设置图形的高度
							var height = config.h;
							$("#chart-d3-height-range").val(height);
							$("#chart-d3-height-text").val(height);
							style.setHeight(height);

							//设置图形的宽度
							if(typeof style.setWidth == "function"){
								var width = config.w;
								if(width > 0){
									$("#chart-d3-width-range").val(width);
									$("#chart-d3-width-text").val(width);
									style.setWidth(width);
								}
							}else{
								//响应式刷新图
								$(window).resize(SGIS.Util.throttle(function(){
									var width = $("#content").parent().width()-72;
									if(_chartTypeChart == "d3.category.compare"){
										width = $("#content").parent().width()-252;	//72->252
									}
									//重新初始化
									obj = new re();
									_chartObj = obj;

									_chartConfig["w"]= width;
									_chartObj.init(_chartConfig);
								},2000));
							}
						});
					}
				}else{
					SGIS.UI.alert("未找到数据！该图无法显示！",
						null,false,function(modal){
							modal.css({
								"top":"40%",
								"height":"90px",
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
		};
		
		/**
		 * 取得当前图类型
		 */
		var getChartTypeChart = function(){
			return _chartTypeChart;
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
		
		/**
		 * 返回当前的module
		 */
		var getModule = function(){
			return _module;
		};
		
		return {
			init : init,
			getChartTypeChart:getChartTypeChart,
			getChartObj:getChartObj,
			getChartConfig:getChartConfig,
			getModule:getModule
		};
	})();
	
	return Hanlder;
});
