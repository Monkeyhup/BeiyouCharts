<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.supermap.http.Parameters"%>
<%
	Parameters parameters = new Parameters(request);
	String chartId = parameters.getParameter("chart-id");
%>
<!DOCTYPE html>
<html>
<head>
	<title>在线工具制图-编辑</title>
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="this is my page">
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link href="/base2.1/http/lib/bootstrap/css/bootstrap.css" rel="stylesheet">
	<link href="/base2.1/http/lib/semantic/css/semantic.css" rel="stylesheet">
	<link href="/base2.1/http/lib/handsontable/handsontable.full.min.css" rel="stylesheet">
	<link href="css/upload.css" rel="stylesheet">
	<link href="css/chart.css" rel="stylesheet">
	<link href='/base2.1/http/lib/spectrum-master/spectrum.css'rel='stylesheet' />
	<link href='/base2.1/http/lib/jquery.range.css' rel='stylesheet'/>

	<script type="text/javascript" src="/base2.1/http/lib/jquery-1.11.1.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/jquery.range.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/bootstrap/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/json2.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/html2canvas.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/json.show.format.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/handsontable/handsontable.min.js"></script>
	<script type="text/javascript" src='/base2.1/http/lib/spectrum-master/spectrum.js'></script>
	<%--<script type="text/javascript" src="/base2.1/http/lib/Echarts/echarts-2.2.7/echarts-all.js"></script>--%>
	<script type="text/javascript" src="/base2.1/http/lib/Fusioncharts/fusioncharts-3.5.1/fusioncharts.js"></script>
	<script type="text/javascript" src="/base2.1/http/lib/Fusioncharts/fusioncharts-3.5.1/themes/fusioncharts.theme.fint.js"></script>
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
<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation" style="background-color:rgb(27, 88, 87);">
	<div class="container-fluid">
		<div class="navbar-header">
			<button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#bs-navbar" aria-controls="bs-navbar" aria-expanded="false">
				<span class="sr-only">图集选择</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand">
				<i class="icon photo"></i>可视化制图-编辑
			</a>
		</div>
		<nav id="bs-navbar" class="collapse navbar-collapse">
			<ul class="nav navbar-nav">
				<li>
					<a type="button" class="btn"  id="go_gallery">
						<i class="icon photo"></i>
						查看图库
					</a>
				</li>
				<li>
					<a type="button" class="btn"  id="change_image">
						<i class="icon home"></i>
						更换模板
					</a>
				</li>
				<li>
					<a type="button" class="btn" id="my_images">
						<i class="icon user"></i>
						我的作品
					</a>
				</li>
				<li>
					<a type="button" class="btn" data-loading-text="正在更新..."  id="save_image">
						<i class="icon save"></i>
						更&nbsp;&nbsp;新
					</a>
				</li>
			</ul>
			<ul id="navbar" class="nav navbar-nav navbar-right">
				<li>
						<span id="logout-span" class="navbar-brand hide" style='float: right !important;'>
							欢迎您:
							<span id="login-name"></span>
						</span>
					<div class="clearfix"></div>
				</li>
			</ul>
		</nav>
	</div>
</nav>
<%
	if(chartId == null || chartId.isEmpty()){
%>
<!-- #container-1 -->
<div class="container" style="padding-top: 60px;width:1000px;">
	<div class="form_up">
		<h1>参数错误！</h1>
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
								<input type="hidden" name="chart-type-chart" value="" >
								<input type="hidden" name="action" value="fusioncharts" >
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
					<%--<form id="save-form" name="save-form" action="javascript:;">--%>
					<%--<div class="pull-left">--%>
					<%--<h4 style="font-family:微软雅黑;">--%>
					<%--<i class="leaf icon" style="font-size: 1.5em;margin: 0px 8px 0px -3px;padding-bottom:10px;"></i>--%>
					<%--</h4>--%>
					<%--</div>--%>
					<%--<div class="pull-left" style="width:90%;">--%>
					<%--<h4 style="font-family:微软雅黑;">--%>
					<%--<input id="chart-name"  name="chart-name" class="read-only" type="text" readonly="readonly" placeholder="图集标题，点击编辑..." value="图集标题，点击编辑..." />--%>
					<%--</h4>--%>
					<%--</div>--%>
					<%--<div class="hide">--%>
					<%--<input type="hidden" name="chartId" value="<%=chartId%>" >--%>
					<%--<input type="hidden" name="chartType" value="0" >--%>
					<%--<input type="hidden" name="chartTypeChart" value="" >--%>
					<%--</div>--%>
					<%--<div class="clearfix" style="padding-left:36px;margin-top:10px;">--%>
					<%--<textarea id="chart-memo" name="chart-memo" class="read-only" readonly="readonly" placeholder="图集标题说明，点击编辑..." ></textarea>--%>
					<%--</div>--%>
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
					<div id="code-api-panel" class="panel panel-default" style="display: none;">
						<div class="panel-body">
							<!-- api doc-->
							<div id="code-api"></div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="param-pane">
					<h4 style="font-family:微软雅黑;">
						<small>
							可以调整参数后动态改变可视化图样式
						</small>
					</h4>
				</div>
			</div><!-- .tab-content -->
		</div><!-- .col-xs-5 -->
		<div class="col-xs-12 col-md-6">
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
					<input type="hidden" name="chartId" value="<%=chartId%>" >
					<input type="hidden" name="chartType" value="3" >
					<input type="hidden" name="chartTypeChart" value="" >
				</div>
				<div class="clearfix" style="padding-left:36px;margin-top:10px;">
					<textarea id="chart-memo" name="chart-memo" class="read-only" readonly="readonly" placeholder="图集标题说明，点击编辑..." ></textarea>
				</div>
				<div style="padding-left:36px;margin-top:100px;">
					<!-- 图 -->
					<div id="content" style="width:100%;top:100px;" class="imageID"></div>
				</div>
			</form>
		</div><!-- .col-xs-7 -->
	</div>
</div>
<%
	}
%>
</body>
<script type="text/javascript" src="js/user.info.js"></script>
<script type="text/javascript">
	//是否初始化
	var IS_CAN_INIT = <%= !(chartId == null || chartId.isEmpty()) ? true : false %> ;
</script>
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
//				[ '.tpl', '.tpl?t=' + new Date().getTime() ],
			[ '.css', '.css?t=' + new Date().getTime() ] ]
	});
	seajs.use('js/chart.fusioncharts.edit',function(obj){
		obj.init(IS_CAN_INIT);
	});
</script>
</html>
