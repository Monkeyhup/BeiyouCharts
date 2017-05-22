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
		      	<input id="chart-chart-height-text" type="text" class="form-control"  disabled="disabled" value="200" style="width:60px;" >
		       	<span class="input-group-addon" style="width:auto;">
		       		px
		       	</span>
		    </div><!-- /input-group -->
    	</div>
    	<div class="panel-body">
			<div class="input-group">
				<span class="input-group-addon" style="width:auto;">
				Y轴起始刻度
				</span>
				<span class="input-group-addon" style="width:auto;">
					<input id="chart-yaxis-change" type="number" style="width:50px" value="0" >
				</span>
			</div><!-- /input-group -->
		</div>

    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		面积样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	面积颜色
		      	</span>
		      	<input id="chart-area-color-select" type="color" class="form-control" style="width:45px;" value="#f5c482" />
		    </div><!-- /input-group -->
		    <br/>
			<div class="input-group">
				<span class="input-group-addon" style="width:auto;">
					区域不透明度
				</span>
				<span class="input-group-addon" style="width:auto;">
					<input id="chart-area-opacity-range" type="range" step="0.1" value="0.6"  max="1" min="0">
				</span>
				<input id="chart-area-opacity-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="0.6" />
			</div><!-- /input-group -->
			<br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	面积线宽
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-area-width-range" type="range" value="2"  max="5" min="1">
		       	</span>
		      	<input id="chart-area-width-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="2" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <div class="clearfix"></div>
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
		      	<input id="chart-legend-color-select" type="color" class="form-control" style="width:45px;" value="#000000" />
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
		      	<input id="chart-font-color-select" type="color" class="form-control" style="width:45px;" value="#514100" />
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
		        	字体位置
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-font-position-radio-1" name="chart-font-position-radio" type="radio"  value="top" checked="checked" />
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
		        	<input id="chart-font-position-radio-4" name="chart-font-position-radio" type="radio"  value="right" />
		        	<label for="chart-font-position-radio-4">右</label>
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
</div>
<div class="clearfix"></div>