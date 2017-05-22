<h4 style="font-family:微软雅黑;">
	<small>
		可以调整参数后动态改变可视化图样式
	</small>
</h4>
<ul class="nav nav-list bs-docs-sidenav pull-left">
  <li class="active"><a href="#panel-common" data-toggle="tab">通用</a></li>
  <li><a href="#panel-map" data-toggle="tab">地图</a></li>
  <li><a href="#panel-pie" data-toggle="tab">饼</a></li>
  <li><a href="#panel-bar" data-toggle="tab">柱</a></li>
</ul>		
<div class="tab-content bs-docs-sidenav-content pull-left">
  <div class="tab-pane active" id="panel-common">
    <div class="panel panel-default">
    	<div class="panel-body">
	  		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	图高度
		      	</span>
		       	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-chart-height-range" type="range" value="200" min="200" max="800">
		       	</span>
		      	<input id="chart-chart-height-text" type="text" class="form-control"  disabled="disabled" value="200" style="width:60px;" >
		       	<span class="input-group-addon" style="width:auto;">
		       		px
		       	</span>
		    </div><!-- /input-group -->
			<br/>
			<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	地图宽度
		      	</span>
		       	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-chart-map-width-range" type="range" value="55" min="10" max="100">
		       	</span>
				<input id="chart-chart-map-width-text" type="text" class="form-control"  disabled="disabled" value="55" style="width:55px;" >
		       	<span class="input-group-addon" style="width:auto;">
		       		%
		       	</span>
			</div><!-- /input-group -->
			<br/>
			<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	饼图宽度
		      	</span>
		       	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-chart-pie-width-range" type="range" value="55" min="10" max="100">
		       	</span>
				<input id="chart-chart-pie-width-text" type="text" class="form-control"  disabled="disabled" value="55" style="width:55px;" >
		       	<span class="input-group-addon" style="width:auto;">
		       		%
		       	</span>
			</div><!-- /input-group -->
			<br/>
			<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	柱图宽度
		      	</span>
		       	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-chart-bar-width-range" type="range" value="45" min="10" max="100">
		       	</span>
				<input id="chart-chart-bar-width-text" type="text" class="form-control"  disabled="disabled" value="45" style="width:55px;" >
		       	<span class="input-group-addon" style="width:auto;">
		       		%
		       	</span>
			</div><!-- /input-group -->
    	</div>
    </div>
  </div>
  <div class="tab-pane" id="panel-map">
  	<div class="panel panel-default">
    	<div class="panel-body">
	  		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	选择当前地图：
		      	</span>
				<div id="chart-map-sn-dropdown" class="btn-group" role="group" style="margin-left:10px;">
					<button type="button" class="btn btn-default dropdown-toggle"  style="min-width:100px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<span class="text">全国</span>
						<span class="caret"></span>
					</button>
					<ul class="dropdown-menu" style="max-height: 400px;overflow-y: auto;">
						<li class="active" data-value="000000000000" data-level="2" ><a href="javascript:;">全国</a></li>
						<li data-value="110000000000" data-level="2" data-sn-type="北京"><a href="javascript:;">北京市</a></li>
						<li data-value="120000000000" data-level="2" data-sn-type="天津"><a href="javascript:;">天津市</a></li>
						<li data-value="130000000000" data-level="2" data-sn-type="河北"><a href="javascript:;">河北省</a></li>
						<li data-value="140000000000" data-level="2" data-sn-type="山西"><a href="javascript:;">山西省</a></li>
						<li data-value="150000000000" data-level="2" data-sn-type="内蒙古"><a href="javascript:;">内蒙古自治区</a></li>
						<li data-value="210000000000" data-level="2" data-sn-type="辽宁"><a href="javascript:;">辽宁省</a></li>
						<li data-value="220000000000" data-level="2" data-sn-type="吉林"><a href="javascript:;">吉林省</a></li>
						<li data-value="230000000000" data-level="2" data-sn-type="黑龙江"><a href="javascript:;">黑龙江省</a></li>
						<li data-value="310000000000" data-level="2" data-sn-type="上海"><a href="javascript:;">上海市</a></li>
						<li data-value="320000000000" data-level="2" data-sn-type="江苏"><a href="javascript:;">江苏省</a></li>
						<li data-value="330000000000" data-level="2" data-sn-type="浙江"><a href="javascript:;">浙江省</a></li>
						<li data-value="340000000000" data-level="2" data-sn-type="安徽"><a href="javascript:;">安徽省</a></li>
						<li data-value="350000000000" data-level="2" data-sn-type="福建"><a href="javascript:;">福建省</a></li>
						<li data-value="360000000000" data-level="2" data-sn-type="江西"><a href="javascript:;">江西省</a></li>
						<li data-value="370000000000" data-level="2" data-sn-type="山东"><a href="javascript:;">山东省</a></li>
						<li data-value="410000000000" data-level="2" data-sn-type="河南"><a href="javascript:;">河南省</a></li>
						<li data-value="420000000000" data-level="2" data-sn-type="湖北"><a href="javascript:;">湖北省</a></li>
						<li data-value="430000000000" data-level="2" data-sn-type="湖南"><a href="javascript:;">湖南省</a></li>
						<li data-value="440000000000" data-level="2" data-sn-type="广东"><a href="javascript:;">广东省</a></li>
						<li data-value="450000000000" data-level="2" data-sn-type="广西"><a href="javascript:;">广西壮族自治区</a></li>
						<li data-value="460000000000" data-level="2" data-sn-type="海南"><a href="javascript:;">海南省</a></li>
						<li data-value="500000000000" data-level="2" data-sn-type="重庆"><a href="javascript:;">重庆市</a></li>
						<li data-value="510000000000" data-level="2" data-sn-type="四川"><a href="javascript:;">四川省</a></li>
						<li data-value="520000000000" data-level="2" data-sn-type="贵州"><a href="javascript:;">贵州省</a></li>
						<li data-value="530000000000" data-level="2" data-sn-type="云南"><a href="javascript:;">云南省</a></li>
						<li data-value="540000000000" data-level="2" data-sn-type="西藏"><a href="javascript:;">西藏自治区</a></li>
						<li data-value="610000000000" data-level="2" data-sn-type="陕西"><a href="javascript:;">陕西省</a></li>
						<li data-value="620000000000" data-level="2" data-sn-type="甘肃"><a href="javascript:;">甘肃省</a></li>
						<li data-value="630000000000" data-level="2" data-sn-type="青海"><a href="javascript:;">青海省</a></li>
						<li data-value="640000000000" data-level="2" data-sn-type="宁夏"><a href="javascript:;">宁夏回族自治区</a></li>
						<li data-value="650000000000" data-level="2" data-sn-type="新疆"><a href="javascript:;">新疆维吾尔族自治区</a></li>
						<li data-value="710000000000" data-level="2" data-sn-type="台湾"><a href="javascript:;">台湾省</a></li>
						<li data-value="810000000000" data-level="2" data-sn-type="香港"><a href="javascript:;">香港特别行政区</a></li>
						<li data-value="820000000000" data-level="2" data-sn-type="澳门"><a href="javascript:;">澳门特别行政区</a></li>
						<li data-value="userdefine" data-level="-1" data-sn-type="--自定义地图--"><a href="javascript:;">--自定义地图--</a></li>
					</ul>
				</div>
				<div id="chart-map-sh-dropdown" class="btn-group" role="group" style="margin-left:10px;">
					<button type="button" class="btn btn-default dropdown-toggle"  style="min-width:100px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<span class="text">-所有省-</span>
						<span class="caret"></span>
					</button>
					<ul class="dropdown-menu" style="max-height: 400px;overflow-y: auto;">
						<li class="active" data-value="-1" data-level="4" ><a href="javascript:;">-所有省-</a></li>
					</ul>
				</div>
				<div id="chart-map-userdefine-dropdown" class="btn-group hide" role="group" style="margin-left:10px;">
					<button type="button" class="btn btn-default dropdown-toggle"  style="min-width:100px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<span class="text">全国</span>
						<span class="caret"></span>
					</button>
					<ul class="dropdown-menu" style="max-height: 400px;overflow-y: auto;">
						<li class="active" data-value="-1" data-level="4" ><a href="javascript:;">全国</a></li>
					</ul>
				</div>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-body">
	  		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	主题风格：
		      	</span>
		       	<div id="chart-theme-dropdown" class="btn-group" role="group" style="margin-left:10px;">
				    <button type="button" class="btn btn-default dropdown-toggle"  style="min-width:100px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				      	<span class="text">默认主题</span> 
				      	<span class="caret"></span>
				    </button>
					<ul class="dropdown-menu">
						<li class="active" data-value="default" data-color-max="#006EDD" data-color-min="#E0FFFF"><a href="javascript:;">默认主题</a></li>
						<li data-value="macarons" data-color-max="#5AB1EF" data-color-min="#E0FFFF"><a href="javascript:;">macarons</a></li>
						<li data-value="infographic" data-color-max="#C1232B" data-color-min="#FCCE10"><a href="javascript:;">infographic</a></li>
						<li data-value="shine" data-color-max="#1790CF" data-color-min="#A2D4E6"><a href="javascript:;">shine</a></li>
						<li data-value="dark" data-color-max="#FFF808" data-color-min="#21BCF9"><a href="javascript:;">dark</a></li>
						<li data-value="blue" data-color-max="#1178AD" data-color-min="#72BBD0"><a href="javascript:;">blue</a></li>
						<li data-value="green" data-color-max="#1F610A" data-color-min="#97B58D"><a href="javascript:;">green</a></li>
						<li data-value="red" data-color-max="#BD0707" data-color-min="#FFD2D2"><a href="javascript:;">red</a></li>
						<li data-value="gray" data-color-max="#636363" data-color-min="#DCDCDC"><a href="javascript:;">gray</a></li>
						<li data-value="helianthus" data-color-max="#E42B6D" data-color-min="#F9AD96"><a href="javascript:;">helianthus</a></li>
						<li data-value="roma" data-color-max="#E01F54" data-color-min="#E7DBC3"><a href="javascript:;">roma</a></li>
						<li data-value="mint" data-color-max="#93BC92" data-color-min="#BEF0BB"><a href="javascript:;">mint</a></li>
						<li data-value="macarons2" data-color-max="#CB8E85" data-color-min="#E7DAC9"><a href="javascript:;">macarons2</a></li>
						<li data-value="sakura" data-color-max="#E52C3C" data-color-min="#F7B1AB"><a href="javascript:;">sakura</a></li>
					</ul>
			  	</div>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		图例样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-legend-check" type="checkbox">
		        	是否显示图例
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	图例字体颜色
		      	</span>
		      	<input id="chart-legend-color-select" type="color" class="form-control" disabled="disabled" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	图例字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-legend-font-size-range" type="range" disabled="disabled" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart-legend-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	图例的位置
		      	</span>
		    	<div id="chart-legend-position-dropdown" class="btn-group" role="group" style="margin-left:10px;">
				    <button type="button" class="btn btn-default dropdown-toggle disabled"  style="width:60px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				      	左边 <span class="caret"></span>
				    </button>
				    <ul class="dropdown-menu">
				      <li class="active" data-value="left"><a href="javascript:;">左边</a></li>
				      <li data-value="right"><a href="javascript:;">右边</a></li>
				      <li data-value="center"><a href="javascript:;">中间</a></li>
				    </ul>
			  	</div>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-iscan-zoom-control-check" type="checkbox" checked="checked">
		        	是否可以缩放地图
		      	</span>
		    </div><!-- /input-group -->
		</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		行政区划文字样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-label-check" type="checkbox" checked="checked">
		        	是否行政区划显示文字
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	行政区划中心点颜色
		      	</span>
		       	<input id="chart-region-center-color-select" class="form-control" type="color" value="#CDC9C9" style="width:60px;" >
		    </div><!-- /input-group -->
		    <br/>
	  		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	行政区划字体颜色
		      	</span>
		       	<input id="chart-region-color-select" class="form-control" type="color" value="#8B4513" style="width:60px;" >
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	行政区划字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <br/>
	  		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	鼠标覆盖时字体颜色
		      	</span>
		       	<input id="chart-region-hover-color-select" class="form-control" type="color" value="#26C0C0" style="width:60px;" >
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	鼠标覆盖时字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-hover-font-size-range" type="range" value="13"  max="40" min="9">
		       	</span>
		      	<input id="chart-hover-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="13" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div><!-- end#panel-map -->
  <div class="tab-pane" id="panel-pie">
  	<div class="panel panel-default">
    	<div class="panel-heading">
    		圆饼半径
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	圆饼半径(内)
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-pie-r-inner-range" type="range" value="25" max="100" min="0">
		       	</span>
		      	<input id="chart-pie-r-inner-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="25">
		      	<span class="input-group-addon" style="width:auto;">
		        	%
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	圆饼半径(外)
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-pie-r-outter-range" type="range" value="50" max="100" min="0">
		       	</span>
		      	<input id="chart-pie-r-outter-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="50">
		      	<span class="input-group-addon" style="width:auto;">
		        	%
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <br/>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		文字样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-pie-label-check" type="checkbox" checked="checked">
		        	是否显示文字
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-pie-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart-pie-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
    		<br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体位置
		      	</span>
		      	<div id="chart-pie-font-position-dropdown" class="btn-group" role="group" style="margin-left:10px;">
				    <button type="button" class="btn btn-default dropdown-toggle"  style="min-width:60px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				      	<span class="text">外部</span> 
				      	<span class="caret"></span>
				    </button>
				    <ul class="dropdown-menu">
				      <li class="active" data-value="top"><a href="javascript:;">外部</a></li>
				      <li data-value="inside"><a href="javascript:;">内部</a></li>
				      <li data-value="insideLeft"><a href="javascript:;">内部左边</a></li>
				      <li data-value="insideRight"><a href="javascript:;">内部右边</a></li>
				    </ul>
			  	</div>
		    </div><!-- /input-group -->
    	</div>
    </div>	
  </div><!-- end#panel-pie -->
  <div class="tab-pane" id="panel-bar">
  	<div class="panel panel-default">
    	<div class="panel-heading">
    		柱样式
    	</div>
    	<div class="panel-body">
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	柱上边框倒角
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-bar-top-border-radius-range" type="range" value="0" max="20" min="0">
		       	</span>
		      	<input id="chart-bar-top-border-radius-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="0" />
		    	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	柱下边框倒角
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-bar-bottom-border-radius-range" type="range" value="0" max="20" min="0">
		       	</span>
		      	<input id="chart-bar-bottom-border-radius-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="0" />
		    	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		图例样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group  pull-left">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-bar-legend-check" type="checkbox" checked="checked">
		        	是否显示图例
		      	</span>
		    </div><!-- /input-group -->
		    <div class="input-group pull-left" style="margin-left:20px;">
		    	<span class="input-group-addon" style="width:auto;">
		        	图例字体颜色
		      	</span>
		      	<input id="chart-bar-legend-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <div class="clearfix"></div>
    	</div>
    </div>
    <br/>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		文字样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-bar-label-check" type="checkbox" checked="checked">
		        	是否显示文字
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
	    	<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体颜色
		      	</span>
		      	<input id="chart-bar-font-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
	    	<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-bar-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart-bar-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <div class="clearfix"></div>
    		<br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体位置
		      	</span>
		      	<div id="chart-bar-font-position-dropdown" class="btn-group" role="group" style="margin-left:10px;">
				    <button type="button" class="btn btn-default dropdown-toggle"  style="min-width:60px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				      	<span class="text">上面</span> 
				      	<span class="caret"></span>
				    </button>
				    <ul class="dropdown-menu">
				      <li class="active" data-value="top"><a href="javascript:;">上面</a></li>
				      <li data-value="bottom"><a href="javascript:;">下面</a></li>
				      <li data-value="left"><a href="javascript:;">左边</a></li>
				      <li data-value="right"><a href="javascript:;">右边</a></li>
				      <li data-value="inside"><a href="javascript:;">中间</a></li>
				    </ul>
			  	</div>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		x轴样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	x轴坐标位置
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-x-position-radio-1" name="chart-x-position-radio" type="radio"  value="bottom" checked="checked" />
		        	<label for="chart-x-position-radio-1">下面</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-x-position-radio-2" name="chart-x-position-radio" type="radio"  value="top" />
		        	<label for="chart-x-position-radio-2">上面</label>
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	x轴坐标颜色
		      	</span>
		      	<input id="chart-x-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		x轴字体样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	x轴字体颜色
		      	</span>
		      	<input id="chart-x-font-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	x轴字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-x-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart-x-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	x轴字体旋转
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-x-text-rotate-range" type="range" value="0"  max="90" min="-90">
		       	</span>
		      	<input id="chart-x-text-rotate-text" type="text" class="form-control" disabled="disabled" style="width:60px;" value="0" />
		      	<span class="input-group-addon" style="width:auto;">
		        	度（°）
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		y轴样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴坐标位置
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-y-position-radio-1" name="chart-y-position-radio" type="radio"  value="left" checked="checked" />
		        	<label for="chart-y-position-radio-1">左边</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-y-position-radio-2" name="chart-y-position-radio" type="radio"  value="right" />
		        	<label for="chart-y-position-radio-2">右边</label>
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴坐标颜色
		      	</span>
		      	<input id="chart-y-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		y轴字体样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴字体颜色
		      	</span>
		      	<input id="chart-y-font-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-y-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart-y-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴字体旋转
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-y-text-rotate-range" type="range" value="0"  max="90" min="-90">
		       	</span>
		      	<input id="chart-y-text-rotate-text" type="text" class="form-control" disabled="disabled" style="width:60px;" value="0" />
		      	<span class="input-group-addon" style="width:auto;">
		        	度（°）
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div><!-- end#panel-bar -->
</div>
<div class="clearfix"></div>