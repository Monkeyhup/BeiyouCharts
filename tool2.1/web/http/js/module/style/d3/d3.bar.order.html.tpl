<h4 style="font-family:微软雅黑;">
	<small>
		可以调整参数后动态改变可视化图样式
	</small>
</h4>
<ul class="nav nav-list bs-docs-sidenav pull-left">
  <li class="active"><a href="#panel-common" data-toggle="tab">通用</a></li>
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
		        	最大值
		      	</span>
		      	<input id="chart-d3-max-text" type="number" class="form-control" min="0" value="0" style="width:80px;" >
		      	<span class="input-group-addon" style="width:auto;">
		        	（设置为0 ，则不显示）
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	动画延时
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		      		<input id="chart-d3-timeout-range" type="range"  min="500" max="2000" step="500" value="2000" >
		      	</span>
		      	<input id="chart-d3-timeout-text" type="text" class="form-control" disabled="disabled" style="width:60px;" value="2000" />
		      	<span class="input-group-addon" style="width:auto;">
		        	毫秒
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	排序文字
		      	</span>
		      	<input id="chart-d3-order-name-text" type="text" class="form-control" value="排序" style="width:120px;" >
		      	<a id="chart-d3-order-name-btn" class="btn btn-primary" style="margin-left:5px;" >确定</a>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		柱系列颜色样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	柱系列颜色
		      	</span>
		    </div>
		    <br/>
		    <div class="input-group">
		    	<span id="chart-bar-color-container" data-index="1">
		      	</span>
		    </div>
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		x轴文字样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	旋转角度
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		      		<input id="chart-d3-textRotate-range" type="range"  min="-90" max="90" value="45" >
		      	</span>
		      	<input id="chart-d3-textRotate-text" type="text" class="form-control" disabled="disabled" style="width:50px;" value="45" />
		      	<span class="input-group-addon" style="width:50px;">
		        	度（°）
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group pull-left">
		    	<span class="input-group-addon">
		        	x轴下方文字偏移:<br/><small>以下调整顺序对应x轴从左到右的文字的偏移值</small>
		      	</span>
		    </div>
		    <div class="clearfix"></div>
		    <br/>
		    <div id="chart-textxy-color-container" class="input-group">
		    </div>
    	</div>
    </div>
  </div>
</div>
<div class="clearfix"></div>