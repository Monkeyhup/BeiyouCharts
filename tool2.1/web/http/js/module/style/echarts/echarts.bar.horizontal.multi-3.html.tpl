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
    	<div class="panel-heading">
    		对比条形样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	对比条形颜色
		      	</span>
		      	<input id="chart1-bar-color-select" type="color" class="form-control" style="width:45px;" value="#c23531" />
		      	<input id="chart2-bar-color-select" type="color" class="form-control" style="width:45px;" value="#2f4554" />
		    </div><!-- /input-group -->
		    <br/>
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	条形左边框倒角
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-bar-left-border-radius-range" type="range" value="5"  max="20" min="0">
		       	</span>
		      	<input id="chart-bar-left-border-radius-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="5" />
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
		       		<input id="chart-bar-right-border-radius-range" type="range" value="5"  max="20" min="0">
		       	</span>
		      	<input id="chart-bar-right-border-radius-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="5" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
    	</div>
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