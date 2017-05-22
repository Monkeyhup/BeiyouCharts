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
		    <br/>
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                       背景颜色
                </span>
                <input id="chart-background-color-select" type="color" class="form-control" style="width:45px;" value="#FFFFFF" />
            </div><!-- /input-group -->
            <br>
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		饼图样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group  pull-left">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-3dDoublePie-check" type="checkbox">
		        	是否切换至双饼图
		      	</span>
		    </div><!-- /input-group -->
		    <div class="clearfix"></div>
		    <br>
            <div class="input-group  pull-left">
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-show-3dPie-select-check" type="checkbox" checked="checked">
                    是否允许单个扇形选择
                </span>
            </div><!-- /input-group -->
		    <div class="clearfix"></div>
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		标签样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group  pull-left">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-label-check" type="checkbox" checked="checked">
		        	是否显示标签
		      	</span>
		    </div><!-- /input-group -->
		     <div class="input-group pull-left" style="margin-left:20px;">
                <span class="input-group-addon" style="width:auto;">
                    标签字体颜色
                </span>
                <input id="chart-label-color-select" type="color" class="form-control" style="width:45px;" value="#000000" />
             </div><!-- /input-group -->
		     <div class="clearfix"></div>
		    <br/>
		     <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    标签字体大小
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-label-size-range" type="range" value="11"  max="30" min="0">
                </span>
                <input id="chart-label-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="11" />
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
                <input id="chart-legend-color-select" type="color" class="form-control" style="width:45px;" value="#000000" />
            </div><!-- /input-group -->
		     <div class="clearfix"></div>
		    <br/>
		     <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    图例位置
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-font-position-radio-1" name="legend-position-radio" type="radio"  value="left" />
                    <label for="chart-font-position-radio-1">左</label>
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-font-position-radio-2" name="legend-position-radio" type="radio"  value="center" checked="checked" />
                    <label for="chart-font-position-radio-2">中</label>
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-font-position-radio-3" name="legend-position-radio" type="radio"  value="right" />
                    <label for="chart-font-position-radio-3">右</label>
                </span>
            </div><!-- /input-group -->

    	</div>
    </div>
    <br/>
  </div>
</div>
<div class="clearfix"></div>