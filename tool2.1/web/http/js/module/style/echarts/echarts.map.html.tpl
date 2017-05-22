<h4 style="font-family:微软雅黑;">
	<small>
		可以调整参数后动态改变可视化图样式
	</small>
</h4>
<ul class="nav nav-list bs-docs-sidenav pull-left">
  <li class="active"><a href="#panel-common" data-toggle="tab">通用</a></li>
  <li><a href="#panel-region" data-toggle="tab">区划</a></li>
  <li><a href="#panel-data-range" data-toggle="tab">范围</a></li>
</ul>		
<div class="tab-content bs-docs-sidenav-content pull-left">
  <div class="tab-pane active" id="panel-common">
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
				      <li class="active" data-value="default" data-color-max="#BF444C" data-color-min="#F6EFA6"><a href="javascript:;">默认主题</a></li>
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
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		图例样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-legend-check" type="checkbox" checked="checked">
		        	是否显示图例
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	图例字体颜色
		      	</span>
		      	<input id="chart-legend-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	图例字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-legend-font-size-range" type="range" value="12"  max="40" min="9">
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
				    <button type="button" class="btn btn-default dropdown-toggle"  style="width:60px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
    		缩放控件样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-zoom-control-check" type="checkbox" checked="checked">
		        	是否显示控件
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	控件的位置
		      	</span>
		    	<div id="chart-zoom-control-position-dropdown" class="btn-group" role="group" style="margin-left:10px;">
				    <button type="button" class="btn btn-default dropdown-toggle" style="width:60px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				      	右上 <span class="caret"></span>
				    </button>
				    <ul class="dropdown-menu">
				      <li class="active" data-x="right" data-y="top"><a href="javascript:;">右上</a></li>
				      <li data-x="left" data-y='top' ><a href="javascript:;">左上</a></li>
				      <li data-x="center" data-y='top' ><a href="javascript:;">中上</a></li>
				      <li data-x="left" data-y='bottom' ><a href="javascript:;">左下</a></li>
				      <li data-x="right" data-y='bottom' ><a href="javascript:;">右下</a></li>
				    </ul>
			  	</div>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
  <div class="tab-pane" id="panel-region">
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
		        	鼠标覆盖字体大小
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
  </div>
  <div class="tab-pane" id="panel-data-range">
  	<div class="panel panel-default">
    	<div class="panel-heading">
    		数据范围控件样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-datarange-control-check" type="checkbox" checked="checked">
		        	是否显示控件
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	控件文字
		      	</span>
		    	<input id="chart-show-datarange-high-text" type="text" class="form-control" style="width:45px;" value="高">
		    	<input type="text" class="form-control" disabled="disabled" style="width:30px;" value="~">
		    	<input id="chart-show-datarange-low-text" type="text" class="form-control" style="width:45px;" value="低">
		    	<a id="chart-show-datarange-btn" class="btn btn-primary" style="margin-left:5px;">确定</a>
		    </div><!-- /input-group -->
		    <br/>
			<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	控件的位置
		      	</span>
		    	<div id="chart-datarange-dropdown" class="btn-group" role="group" style="margin-left:10px;">
				    <button type="button" class="btn btn-default dropdown-toggle" style="width:60px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				      	左下 <span class="caret"></span>
				    </button>
				    <ul class="dropdown-menu">
				      <li data-x="right" data-y="top"><a href="javascript:;">右上</a></li>
				      <li class="active" data-x="left" data-y='top' ><a href="javascript:;">左上</a></li>
				      <li data-x="center" data-y='top' ><a href="javascript:;">中上</a></li>
				      <li data-x="left" data-y='bottom' ><a href="javascript:;">左下</a></li>
				      <li data-x="right" data-y='bottom' ><a href="javascript:;">右下</a></li>
				    </ul>
			  	</div>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	颜色范围(高~低)
		      	</span>
		    	<input id="chart-datarange-high-color" type="color" class="form-control" style="width:45px;" value="#BF444C">
		    	<input id="chart-datarange-low-color" type="color" class="form-control" style="margin-left:10px;width:45px;" value="#F6EFA6">
		    </div><!-- /input-group -->
			<br/>
			<div class="input-group">
				<span class="input-group-addon" style="width:auto;">
		        	数据值域范围
		      	</span>
			</div>
			<div class="input-group">
				<span class="input-group-addon" style="width:auto;">
					<div style="padding: 1.5em 50px 1.5em 0px;">
						<input id="chart-show-datarange-range" type="hidden" class="single-slider" value="0,100" />
					</div>
				</span>
			</div><!-- /input-group -->
			<div class="input-group">
				<span class="input-group-addon" style="width:auto;">
					值域输入
		        	<input id="chart-show-datarange-range-check" type="checkbox" />
				</span>
				<input id="chart-show-datarange-range-min" class="form-control hide" type="number" style="width:102px;"  value="0" />
				<input id="chart-show-datarange-range-max" class="form-control hide" type="number" style="width:106px;"  value="100" />
			</div><!-- /input-group -->
    	</div>
    </div>
  </div>
</div>
<div class="clearfix"></div>