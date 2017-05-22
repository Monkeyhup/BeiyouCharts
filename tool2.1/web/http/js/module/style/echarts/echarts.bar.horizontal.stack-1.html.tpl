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
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		堆叠柱样式
    	</div>
    	<div class="panel-body">
    	    <div class="input-group pull-left">
                <span class="input-group-addon" style="width:auto;">
                    柱系列颜色
                </span>
            </div>
            <div class="input-group pull-left" style="margin-left:20px;">
                <span id="chart-bar-color-container" data-index="1">
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
		      	<input id="chart-legend-color-select" type="color" class="form-control" style="width:45px;" value="#333333" />
		    </div><!-- /input-group -->
		    <div class="clearfix"></div>
    	</div>
        <div class="panel panel-default">
            <div class="panel-heading">
                x轴字体样式
            </div>
            <div class="panel-body">
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
            </div>
        </div>
  </div>
</div>
<div class="clearfix"></div>