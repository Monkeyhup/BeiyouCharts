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
            <div class="input-group pull-left" >
                <span class="input-group-addon" style="width:auto;">
                    背景颜色
                </span>
                <input id="chart-backgroundColor-select" type="color" class="form-control" style="width:45px;" value="#ffffff" />
            </div><!-- /input-group -->
            <div class="clearfix"></div>
        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading">
            圆饼半径
        </div>
        <div class="panel-body">
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    (内边框)
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-inner-pie-r-inner-range" type="range" value="0" max="100" min="0">
                </span>
                <input id="chart-inner-pie-r-inner-text" type="text" class="form-control" disabled="disabled" style="width:60px;" value="0">
                <span class="input-group-addon" style="width:auto;">
                    %
                </span>
            </div><!-- /input-group -->
            <br/>
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    (外边框)
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-inner-pie-r-outter-range" type="range" value="55" max="100" min="0">
                </span>
                <input id="chart-inner-pie-r-outter-text" type="text" class="form-control" disabled="disabled" style="width:60px;" value="55">
                <span class="input-group-addon" style="width:auto;">
                    %
                </span>
            </div><!-- /input-group -->
        </div>
    </div>

    <div class="panel panel-default">
    	<div class="panel-heading">
    		标签样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-label-check" type="checkbox" checked="checked">
		        	是否显示标签
		      	</span>
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
		      	 <span class="input-group-addon" style="width:auto;">
                字体颜色
                </span>
                <input id="chart-textColor-select" type="color" class="form-control" style="width:45px;" value="#000000" />
		    </div><!-- /input-group -->
    		<br/>
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
                        字体大小
                    </span>
                    <span class="input-group-addon" style="width:auto;">
                        <input id="legend-font-size-range" type="range" value="12"  max="40" min="9">
                    </span>
                    <input id="legend-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
                    <span class="input-group-addon" style="width:auto;">
                        px
                    </span>
                     <span class="input-group-addon" style="width:auto;">
                        字体颜色
                    </span>
                    <input id="chart-legend-color-select" type="color" class="form-control" style="width:45px;" value="#000000" />
                </div><!-- /input-group -->
                <br/>

                <div class="input-group">
                    <span class="input-group-addon" style="width:auto;">
                        图例位置
                    </span>
                    <span class="input-group-addon" style="width:auto;">
                        <input id="chart-font-position-radio-1" name="chart-position-style" type="radio"  value="left"/>
                        <label for="chart-font-position-radio-1">left</label>
                    </span>
                    <span class="input-group-addon" style="width:auto;">
                        <input id="chart-font-position-radio-2" name="chart-position-style" type="radio"  value="center" checked="checked"/>
                        <label for="chart-font-position-radio-2">middle</label>
                    </span>
                    <span class="input-group-addon" style="width:auto;">
                        <input id="chart-font-position-radio-3" name="chart-position-style" type="radio"  value="right" />
                        <label for="chart-font-position-radio-3">right</label>
                    </span>
                </div><!-- /input-group -->
            </div>
        </div>
    </div>
  </div>
</div>
<div class="clearfix"></div>