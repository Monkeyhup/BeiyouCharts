<h4 style="font-family:微软雅黑;">
	<small>
		可以调整参数后动态改变可视化图样式
	</small>
</h4>
<ul class="nav nav-list bs-docs-sidenav pull-left">
  <li class="active"><a href="#panel-common" data-toggle="tab">通用</a></li>
  <li><a href="#panel-bar" data-toggle="tab">柱形</a></li>
  <li><a href="#panel-line" data-toggle="tab">折线</a></li>
  <li><a href="#panel-x" data-toggle="tab">X轴</a></li>
  <li><a href="#panel-y" data-toggle="tab">y轴</a></li>
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
  </div>
  <div class="tab-pane" id="panel-bar">
  	<div class="panel panel-default">
    	<div class="panel-heading">
    		柱样式
    	</div>
    	<div class="panel-body">
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	柱颜色
		      	</span>
		      	<input id="chart-bar-color-select-0" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
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
    		柱文字样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-bar-show-label-check" type="checkbox" checked="checked">
		        	是否显示文字
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
	    	<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体颜色
		      	</span>
		      	<input id="chart-bar-font-color-select" type="color" class="form-control" style="width:45px;" value="#000000" />
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
		        	字体位置：
		      	</span>
		    </div><!-- /input-group -->
		    <div class="input-group">
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-bar-font-position-radio-0" name="chart-bar-font-position-radio" type="radio"  value="insideTop" checked="checked" />
		        	<label for="chart-bar-font-position-radio-0">内顶</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-bar-font-position-radio-1" name="chart-bar-font-position-radio" type="radio"  value="top" />
		        	<label for="chart-bar-font-position-radio-1">上</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-bar-font-position-radio-3" name="chart-bar-font-position-radio" type="radio"  value="left" />
		        	<label for="chart-bar-font-position-radio-3">左</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-bar-font-position-radio-4" name="chart-bar-font-position-radio" type="radio"  value="right" />
		        	<label for="chart-bar-font-position-radio-4">右</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-bar-font-position-radio-5" name="chart-bar-font-position-radio" type="radio"  value="inside" />
		        	<label for="chart-bar-font-position-radio-5">中</label>
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
  <div class="tab-pane" id="panel-line">
  	<div class="panel panel-default">
    	<div class="panel-heading">
    		折线样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-smooth-check" type="checkbox">
		        	折线为平滑曲线
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	折线颜色
		      	</span>
		      	<input id="chart-line-color-select" type="color" class="form-control" style="width:45px;" value="#FF7F50" />
		    </div><!-- /input-group -->
		    <br/>
	    	<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	折线线宽
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-line-width-range" type="range" value="2"  max="5" min="1">
		       	</span>
		      	<input id="chart-line-width-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="2" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <div class="clearfix"></div>
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		折线文字样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-line-show-label-check" type="checkbox" checked="checked">
		        	是否显示文字
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
	    	<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体颜色
		      	</span>
		      	<input id="chart-line-font-color-select" type="color" class="form-control" style="width:45px;" value="#FF7F50" />
		    </div><!-- /input-group -->
		    <br/>
	    	<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-line-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart-line-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
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
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-line-font-position-radio-1" name="chart-line-font-position-radio" type="radio"  value="top" checked="checked" />
		        	<label for="chart-line-font-position-radio-1">上</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-line-font-position-radio-2" name="chart-line-font-position-radio" type="radio"  value="bottom" />
		        	<label for="chart-line-font-position-radio-2">下</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-line-font-position-radio-3" name="chart-line-font-position-radio" type="radio"  value="left" />
		        	<label for="chart-line-font-position-radio-3">左</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-line-font-position-radio-4" name="chart-line-font-position-radio" type="radio"  value="right" />
		        	<label for="chart-line-font-position-radio-4">右</label>
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
		      	<input id="chart-x-color-select" type="color" class="form-control" style="width:45px;" value="#666666" />
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
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		    		<input id="chart-y-position-check" type="checkbox">
		        	y轴坐标交换
		      	</span>
		    </div><!-- /input-group -->
    	</div>
  	</div>
  	<div class="panel panel-default">
    	<div class="panel-heading">
    		y轴样式
    	</div>
    	<div class="panel-body">
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴(柱)坐标颜色
		      	</span>
		      	<input id="chart-y-bar-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴(折线)坐标颜色
		      	</span>
		      	<input id="chart-y-line-color-select" type="color" class="form-control" style="width:45px;" value="#E96633" />
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		y轴(柱)字体样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴(柱)字体颜色
		      	</span>
		      	<input id="chart-y-bar-font-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴(柱)字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-y-bar-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart-y-bar-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴(柱)字体旋转
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-y-bar-text-rotate-range" type="range" value="0"  max="90" min="-90">
		       	</span>
		      	<input id="chart-y-bar-text-rotate-text" type="text" class="form-control" disabled="disabled" style="width:50px;" value="0" />
		      	<span class="input-group-addon" style="width:auto;">
		        	度（°）
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		y轴(折线)字体样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴(折线)字体颜色
		      	</span>
		      	<input id="chart-y-line-font-color-select" type="color" class="form-control" style="width:45px;" value="#E96633" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴(折线)字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-y-line-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart-y-line-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	y轴(折线)字体旋转
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-y-line-text-rotate-range" type="range" value="0"  max="90" min="-90">
		       	</span>
		      	<input id="chart-y-line-text-rotate-text" type="text" class="form-control" disabled="disabled" style="width:50px;" value="0" />
		      	<span class="input-group-addon" style="width:auto;">
		        	度（°）
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
</div>
<div class="clearfix"></div>