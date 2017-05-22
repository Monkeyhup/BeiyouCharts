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
            背景颜色样式
        </div>
        <div class="panel-body">
            <div class="input-group pull-left">
                <span class="input-group-addon" style="width:auto;">
                    背景颜色
                </span>
                <input id="chart-backgroundColor-select" type="color" class="form-control" style="width:45px;" value="#2c343c" />
            </div><!-- /input-group -->
            <div class="clearfix"></div>
        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading">
            半径大小
        </div>
        <div class="panel-body">
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    半径
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-radius-range" type="range" value="75" min="0" max="100">
                </span>
                <input id="chart-radius-text" type="text" class="form-control"  disabled="disabled" value="75" style="width:60px;" >
                <span class="input-group-addon" style="width:auto;">
                    %
                </span>
            </div><!-- /input-group -->
        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading">
            刻度长度
        </div>
        <div class="panel-body">
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    刻度
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-splitNum-range" type="range" disabled="disabled" value="10" min="5" max="20">
                </span>
                <input id="chart-splitNum-text" type="text" class="form-control"  disabled="disabled" value="10" style="width:60px;" >
            </div><!-- /input-group -->
        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading">
            量程
        </div>
        <div class="panel-body">
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    量程
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-max-range" type="range" value="100" min="50" max="400">
                </span>
                <input id="chart-max-text" type="text" class="form-control"  disabled="disabled" value="100" style="width:60px;" >
            </div><!-- /input-group -->
        </div>
    </div>
  </div>
</div>
<div class="clearfix"></div>