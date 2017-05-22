<h4 style="font-family:微软雅黑;">
	<small>
		可以调整参数后动态改变可视化图样式
	</small>
</h4>
<ul class="nav nav-list bs-docs-sidenav pull-left">
  <li class="active"><a href="#panel-common" data-toggle="tab">通用</a></li>
  <li><a href="#panel-bar" data-toggle="tab">柱</a></li>
  <li><a href="#panel-pie" data-toggle="tab">饼</a></li>
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
		       		<input id="chart-d3-height-range" type="range" value="200" min="200" max="800">
		       	</span>
		      	<input id="chart-d3-height-text" type="text" class="form-control"  disabled="disabled" value="200" style="width:60px;" >
		       	<span class="input-group-addon" style="width:auto;">
		       		px
		       	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-isShowTooltip-check" type="checkbox" checked="checked" />
		        	是否显示tooltip
		      	</span>
		    </div>
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-isShowTooltipTitle-check" type="checkbox" checked="checked"  />
		        	tooltip是否显示标题
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		      		（当是否显示tooltip选中时有效）
		      	</span>
		    </div>
    	</div>
    </div>
  </div>
  <div class="tab-pane" id="panel-bar">
  	<div class="panel panel-default">
    	<div class="panel-body">
	  		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	柱颜色
		      	</span>
		      	<input id="chart-bar-color-select" type="color" class="form-control" style="width:45px;" value="#EBAC00" />
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		柱文字样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	旋转角度
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		      		<input id="chart-d3-bar-textRotate-range" type="range"  min="-90" max="90" value="45" >
		      	</span>
		      	<input id="chart-d3-bar-textRotate-text" type="text" class="form-control" disabled="disabled" style="width:50px;" value="45" />
		      	<span class="input-group-addon" style="width:auto;">
		        	度（°）
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group pull-left">
		    	<span class="input-group-addon" style="width:auto;">
		        	柱下方文字偏移:<small>以下调整顺序对应x轴从左到右的文字的偏移值</small>
		      	</span>
		    </div>
		    <div class="clearfix"></div>
		    <br/>
		    <div id="chart-bar-textxy-color-container" class="input-group">
		    </div>
    	</div>
    </div>
  </div>
  <div class="tab-pane" id="panel-pie">
  	<div class="panel panel-default">
    	<div class="panel-body">
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	饼半径
		      	</span>
		       	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-d3-r-range" type="range" value="100" min="0" max="400">
		       	</span>
		      	<input id="chart-d3-r-text" type="text" class="form-control"  disabled="disabled" value="100" style="width:60px;" >
		       	<span class="input-group-addon" style="width:auto;">
		       		px
		       	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-body">
	  		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	饼1颜色
		      	</span>
		      	<input id="chart-pie1-color-select" type="color" class="form-control" style="width:45px;" value="#807dba" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	饼2颜色
		      	</span>
		      	<input id="chart-pie2-color-select" type="color" class="form-control" style="width:45px;" value="#41ab5d" />
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
</div>
<div class="clearfix"></div>