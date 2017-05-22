<h4 style="font-family:微软雅黑;">
	<small>
		可以调整参数后动态改变可视化图样式
	</small>
</h4>
<ul class="nav nav-list bs-docs-sidenav pull-left">
  <li class="active"><a href="#panel-common" data-toggle="tab">通用</a></li>
  <li><a href="#panel-pie" data-toggle="tab">饼</a></li>
  <li><a href="#panel-bar" data-toggle="tab">柱</a></li>
  <li><a href="#panel-x" data-toggle="tab">柱X轴</a></li>
  <li><a href="#panel-y" data-toggle="tab">柱y轴</a></li>
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
    	</div>
    </div>
  </div>
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
		       		<input id="chart-pie-r-inner-range" type="range" value="50" max="100" min="0">
		       	</span>
		      	<input id="chart-pie-r-inner-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="50">
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
		       		<input id="chart-pie-r-outter-range" type="range" value="70" max="100" min="0">
		       	</span>
		      	<input id="chart-pie-r-outter-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="70">
		      	<span class="input-group-addon" style="width:auto;">
		        	%
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		饼系列颜色样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group pull-left">
		    	<span class="input-group-addon" style="width:auto;">
		        	饼系列颜色
		      	</span>
		    </div>
		    <div class="input-group pull-left" style="margin-left:20px;">
		    	<span id="chart-pie-color-container" data-index="1">
		      	</span>
		    </div>
		    <div class="clearfix"></div>
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		图例样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-pie-legend-check" type="checkbox" >
		        	是否显示图例
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
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-pie-font-position-radio-1" name="chart-pie-font-position-radio" type="radio"  value="top" checked="checked" />
		        	<label for="chart-pie-font-position-radio-1">外</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-pie-font-position-radio-2" name="chart-pie-font-position-radio" type="radio"  value="inside" />
		        	<label for="chart-pie-font-position-radio-2">内</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-pie-font-position-radio-3" name="chart-pie-font-position-radio" type="radio"  value="insideLeft" />
		        	<label for="chart-pie-font-position-radio-3">内左</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-pie-font-position-radio-4" name="chart-pie-font-position-radio" type="radio"  value="insideRight" />
		        	<label for="chart-pie-font-position-radio-4">内右</label>
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
  <div class="tab-pane" id="panel-bar">
  	<div class="panel panel-default">
    	<div class="panel-heading">
    		条形样式
    	</div>
    	<div class="panel-body"> 
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	条形颜色
		      	</span>
		      	<input id="chart-bar-color-select-0" type="color" class="form-control" style="width:45px;" value="#FF7F50" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	条形左边框倒角
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-bar-left-border-radius-range" type="range" value="0" max="20" min="0">
		       	</span>
		      	<input id="chart-bar-left-border-radius-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="0" />
		    	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	条形右边框倒角
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-bar-right-border-radius-range" type="range" value="0" max="20" min="0">
		       	</span>
		      	<input id="chart-bar-right-border-radius-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="0" />
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
		        	<input id="chart-show-legend-check" type="checkbox" checked="checked">
		        	是否显示图例
		      	</span>
		    </div><!-- /input-group -->
		    <div class="input-group pull-left" style="margin-left:20px;">
		    	<span class="input-group-addon" style="width:auto;">
		        	图例字体颜色
		      	</span>
		      	<input id="chart-legend-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
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
		        	<input id="chart-show-label-check" type="checkbox" checked="checked">
		        	是否显示文字
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
	    	<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体颜色
		      	</span>
		      	<input id="chart-font-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
	    	<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <div class="clearfix"></div>
    		<br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体位置：
		      	</span>
		    </div><!-- /input-group -->
		    <div class="input-group">
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-font-position-radio-1" name="chart-font-position-radio" type="radio"  value="top"/>
		        	<label for="chart-font-position-radio-1">上</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-font-position-radio-2" name="chart-font-position-radio" type="radio"  value="bottom" />
		        	<label for="chart-font-position-radio-2">下</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-font-position-radio-3" name="chart-font-position-radio" type="radio"  value="left" />
		        	<label for="chart-font-position-radio-3">左</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-font-position-radio-4" name="chart-font-position-radio" type="radio"  value="right" checked="checked"  />
		        	<label for="chart-font-position-radio-4">右</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-font-position-radio-5" name="chart-font-position-radio" type="radio"  value="inside" />
		        	<label for="chart-font-position-radio-5">中</label>
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
  <div class="tab-pane" id="panel-x">
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
		      	<input id="chart-x-text-rotate-text" type="text" class="form-control" disabled="disabled" style="width:50px;" value="0" />
		      	<span class="input-group-addon" style="width:auto;">
		        	度（°）
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
  <div class="tab-pane" id="panel-y">
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
		      	<input id="chart-y-text-rotate-text" type="text" class="form-control" disabled="disabled" style="width:50px;" value="0" />
		      	<span class="input-group-addon" style="width:auto;">
		        	度（°）
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
</div>
<div class="clearfix"></div>