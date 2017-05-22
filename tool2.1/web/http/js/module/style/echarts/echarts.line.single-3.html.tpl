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
		       		<input id="chart-chart-height-range" type="range" value="200" min="200" max="800">
		       	</span>
		      	<input id="chart-chart-height-text" type="text" class="form-control"  disabled="disabled" value="200" style="width:50px;" >
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
		        	<input id="chart-show-smooth-check" type="checkbox">
		        	折线为平滑曲线
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		折线样式
    	</div>
    	<div class="panel-body">
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
    		文字样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-label-check" type="checkbox">
		        	是否显示文字
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
	    	<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体颜色
		      	</span>
		      	<input id="chart-font-color-select" type="color" disabled = "disabled" class="form-control" style="width:45px;" value="#000000" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-font-size-range" type="range" disabled = "disabled" value="12"  max="40" min="9">
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
		        	字体位置
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-font-position-radio-1" disabled = "disabled" name="chart-font-position-radio" type="radio"  value="top"  />
		        	<label for="chart-font-position-radio-1">上</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-font-position-radio-2" disabled = "disabled" name="chart-font-position-radio" type="radio"  value="bottom" />
		        	<label for="chart-font-position-radio-2">下</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-font-position-radio-3" disabled = "disabled" name="chart-font-position-radio" type="radio"  value="left" />
		        	<label for="chart-font-position-radio-3">左</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-font-position-radio-4" disabled = "disabled" name="chart-font-position-radio" type="radio"  value="right" />
		        	<label for="chart-font-position-radio-4">右</label>
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
<div class="clearfix"></div>