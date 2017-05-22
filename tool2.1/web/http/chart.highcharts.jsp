<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.supermap.http.Parameters"%>
<%@ page import="com.supermap.service.HighchartsService"%>
<%
	Parameters parameters = new Parameters(request);
	String chartTypeChart = parameters.getParameter("chart-type-chart");
%>
<!DOCTYPE html>
<html>
<head>
	<title>在线工具制图</title>
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="this is my page">
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
	<link href="/base2.1/http/lib/bootstrap/css/bootstrap.css" rel="stylesheet">
	<link href="/base2.1/http/lib/semantic/css/semantic.css" rel="stylesheet">
	<link href="/base2.1/http/lib/handsontable/handsontable.full.min.css" rel="stylesheet">
	<link href="css/upload.css" rel="stylesheet">
	<link href="css/chart.css" rel="stylesheet">
	
	<script type="text/javascript" src="/base2.1/http/lib/jquery-1.11.1.js"></script>
    <script type="text/javascript" src="/base2.1/http/lib/bootstrap/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/json2.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/html2canvas.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/json.show.format.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/handsontable/handsontable.min.js"></script>
	
	<!--[if IE]>
	<script type="text/javascript" src="/base2.1/http/lib/canvg-master/flashcanvas.js"></script>
	<![endif]-->	
	<script type="text/javascript" src="/base2.1/http/lib/canvg-master/StackBlur.js" ></script>
	<script type="text/javascript" src="/base2.1/http/lib/canvg-master/rgbcolor.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/canvg-master/canvg.js"></script>
	
	<script type="text/javascript" src="/base2.1/http/lib/Highcharts/Highcharts-4.2.3/highcharts.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/Highcharts/Highcharts-4.2.3/highcharts-3d.js"></script>
	<script type="text/javascript" src="/base2.1/http/js/common/SGIS.Base.js"></script>
</head>
<body>
	<div id="top-alert-container" class="IEindecl" style="display:none;position: fixed;top:0px;z-index:100000;width: 100%;height: 50px;background: #FFC125;font-family: 微软雅黑;font-size: 1.3em;">
		<div style="padding-top:15px;padding-left:10px;float:left;">
		<p>
			您正在使用的浏览器可能不能得到很好的体验，为了得到更好的体检，建议您安装
				<a target="_blank" href="../browers/ChromeStandalone_V45.0.2454.101_Setup.1443151805.exe" style="text-decoration: none;">谷歌浏览器(Chrome)</a>
				/ <a target="_blank" href="../browers/Firefox_V39.0.0.5659_setup.1435906049.exe" style="text-decoration: none;">火狐浏览器(FireFox)</a>
				等主流浏览器
		</p>
		</div>
		<div style="float:right;padding-top:15px;padding-right:20px;cursor: pointer;">
			<a id="remove-top-btn" title="点击关闭" href="javascript:;">
				<i id="remove_cion" class="remove icon" ></i>
			</a>
		</div>
		<div class="clearfix"></div>
	</div>

	<!--顶部导航-->
	<nav class="navbar navbar-inverse navbar-fixed-top" id="navbar" role="navigation" style="background-color:#123c5f;height:60px;">
	</nav>
<%
	if(chartTypeChart == null || chartTypeChart.isEmpty()){
 %>
	<!-- #container-1 -->
	<div class="container" style="padding-top: 60px;width:1000px;">
	 	<div class="form_up">
	 		<h1>参数错误！</h1>
	 	</div>
	</div>
<% 
	}else{
		if(!HighchartsService.isRightHighchartsType(chartTypeChart)){
%>
		 	<div class="container" style="padding-top: 60px;width:1000px;">
				<div class="form_up container" style="margin:auto;width:1000px;">
				 	<h1>请选择正确的图集！</h1>
				</div>
			</div>
<% 	
		}else{
%>
		<div class="container-fluid" style="padding-top: 60px;">
			<!-- 左右 -->
			<div class="row">
			  <div class="col-xs-12 col-md-6">
				<!-- 选项卡 -->
				<ul class="nav nav-tabs">
				  <li class="active">
				  	<a href="#data-pane" data-toggle="tab">数据编辑</a>
				  </li>
				  <li>
				  	<a href="#param-pane" data-toggle="tab">参数编辑</a>
				  </li>
				  <li class="pull-right">
						<div class="pull-left">
							<button type="button" class="btn btn-success" style='margin-right: 8px;' id="refresh_json">
									刷新数据
							</button>
						</div>
				  		<div class="pull-left">
				  			<div class="form_up">
								<form id="form" name="form" target="upload-frame" method="post" enctype="multipart/form-data" action="upload">
									<div id="infont_inmput" class="ui primary button">
										<span id="infont_inmput_name" data-loading='0'>导入excel数据</span>
										<input name="file" type="file" accept=".xls,.xlsx" style="cursor: pointer;">
									</div>
									<input type="hidden" name="chart-type-chart" value="<%=chartTypeChart %>" >
									<input type="hidden" name="action" value="highcharts" >
								</form>
								<div id="iframe-container">
									<iframe name="upload-frame" id="upload-frame" style="display: none;"></iframe>
								</div>
							</div>
				  		</div>
				  </li>
				</ul>
				<div class="tab-content">
				  <div class="tab-pane active" id="data-pane">
						<h4 style="font-family:微软雅黑;">
							<small>
								可以编辑正确的数据后点击【刷新数据】按钮绘图
								<a id="download_excel_template_btn" href="javascript:;">下载EXCEL模板</a>
							</small>
						</h4>
				  		<div id="excel-data"></div>
				  		
				  		<br/>
						<hr/>
						<h4 style="font-family:微软雅黑;">
							表格格式说明：-<small>按照以下表格格式填写数据</small>
							<label class="pull-right">
								<input id="code-api-switch" type="checkbox" />
								<small>打开说明</small>
							</label>
							<div class="clearfix"></div>
						</h4>
						<br/>
						<div id="code-api-panel" class="panel panel-default"  style="display: none;">
						  <div class="panel-body">
							<!-- api doc-->  
							<div id="code-api"></div> 
						  </div>
						</div>
				  </div>
				  <div class="tab-pane" id="param-pane">
				  		参数编辑
				  </div>
				</div><!-- .tab-content -->
			  </div><!-- .col-xs-5 -->
			  <div class="col-xs-12 <%=chartTypeChart.equalsIgnoreCase("d3.bar.drill") ? "col-md-12" : "col-md-6" %>">
				<form id="save-form" name="save-form" action="javascript:;">
			  		<div class="pull-left">
				  		<h4 style="font-family:微软雅黑;">
				  			<i class="leaf icon" style="font-size: 1.5em;margin: 0px 8px 0px -3px;padding-bottom:10px;"></i>
				  		</h4>
			  		</div>
			  		<div class="pull-left" style="width:90%;">
			  			<h4 style="font-family:微软雅黑;">
			  				<input id="chart-name"  name="chart-name" class="read-only" type="text" readonly="readonly" placeholder="图集标题，点击编辑..." value="" />
			  			</h4>
			  		</div>
			  		<div class="hide">
						<input type="hidden" name="chartType" value="2" >
						<input type="hidden" name="chartTypeChart" value="<%=chartTypeChart %>" >
			  		</div>
			  		<div class="clearfix" style="padding-left:36px;margin-top:10px;">
						<textarea id="chart-memo" name="chart-memo" class="read-only" readonly="readonly" placeholder="图集标题说明，点击编辑..." ></textarea>
			  		</div>
			  		<div style="padding-left:36px;margin-top:10px;">
				  		<!-- 图 -->
				  		<div id="content" style="width:100%;" class="imageID"></div>
			  		</div>
			  	</form>
			  </div><!-- .col-xs-7 -->
			</div>
		</div>
			
		<!-- 模态框（Modal） -->
	    <div class="modal fade" id="login-modal" tabindex="-1" role="dialog" data-backdrop="static"  aria-hidden="true">
	        <div class="modal-dialog">
	            <div class="modal-content">
	                <div class="modal-header">
	                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
	                        &times;
	                    </button>
	                    <h4 class="modal-title" id="myModalLabel">
	                        <i class="icon user"></i>用户登录
	                    </h4>
	                </div>
	                <div class="modal-body">
	                    <div style="margin: 0 auto;">
	                        <form role="form" name="login_form" id="login_form">
	                            <div class="ui form" style="padding-left: 100px;padding-right: 100px;">
	                                <div class="inline fields">
	                                    <div class="field">
	                                        <label>用户名：</label>
	                                        <input type="text" name="user_login"  id="user_login" placeholder="请输入用户登录名">
	                                    </div>
	                                </div>
	                                <div class="inline fields">
	                                    <div class="field">
	                                        <label>密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
	                                        <input type="password" name="user_password" id="user_password" placeholder="请输入用户密码">
	                                    </div>
	                                </div>
	                                <div class="inline fields">
	                                    <div class="field">
	                                        <label></label>
	                                        <input type="checkbox"> 记住用户名
	                                    </div>
	                                </div>
	                                <div class="inline fields">
	                                    <div class="field">
	                                        <p id="login-message" class="help-block"></p>
	                                    </div>
	                                </div>
									<div class="inline fields pull-right">
										<div class="field">
											<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
										</div>
										<div class="field">
											<button id="login_submit" type="button" class="btn btn-primary" data-loading-text="正在登录...">登录</button>
										</div>
									</div>
									<div class="clear-fix"></div>
									<div class="inline fields">
										<div class="field">
										</div>
									</div>
	                            </div>
	                        </form>
	                    </div>
	                </div><!--modal-body-->
	                <div class="modal-footer"></div>
	            </div><!-- /.modal-content -->
	        </div><!-- /.modal-dialog -->
	    </div><!-- /.modal -->
	    <!-- end.模态框（Modal） -->
<% 
		}
	}
 %>
</body>
<script type="text/javascript" src="js/cookie.js"></script>
<script type="text/javascript" src="js/user.info.js"></script>
<script type="text/javascript">
	//是否初始化
	var IS_CAN_INIT = <%= !(chartTypeChart == null || chartTypeChart.isEmpty()) ? true : false %> ; 
</script>

<link href="/tool2.1/http/css/navBar.css" rel="stylesheet">
<script type="text/javascript" src='/base2.1/http/lib/icon/iconfont.js'></script>
<script type="text/javascript" src="/tool2.1/http/js/narBar.js"></script>

<script type="text/javascript" src="/base2.1/http/lib/seajs/sea.js"></script>
<script type="text/javascript" src="/base2.1/http/lib/seajs/seajs-text.js"></script>
<script>
	seajs.config({
		base : SGIS.Config.TOOL_MODULE_URL,			//基础路径
		paths:{
			base:SGIS.Config.BASE_MODULE_URL,		//跨目录的base路径
			tool:SGIS.Config.TOOL_MODULE_URL,		//跨目录的tool路径
			gallery:SGIS.Config.GALLERY_MODULE_URL	//跨目录的gallery路径
		},
		map : [ [ '.json', '.json?t=' + new Date().getTime() ],
//				[ '.js', '.js?t=' + new Date().getTime() ],
				[ '.css', '.css?t=' + new Date().getTime() ] ]
	});
	seajs.use('js/chart.highcharts',function(obj){
        obj.init(IS_CAN_INIT);
    });
	seajs.use('/tool2.1/http/js/navBarJSP',function(obj){
		obj.into();
	});
</script>
</html>
