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
		        	标签字体颜色
		      	</span>
		      	<input id="chart1-font-color-select" type="color" class="form-control" style="width:45px;" value="#FF7F50" />
		      	<input id="chart2-font-color-select" type="color" class="form-control" style="width:45px;" value="#ffffff" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	外漏斗字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart1-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart1-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
		    <div class="clearfix"></div>
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	外漏斗字体位置
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart1-font-position-radio-1" name="chart1-font-position-radio" type="radio"  value="left" />
		        	<label for="chart1-font-position-radio-1">左</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart1-font-position-radio-2" name="chart1-font-position-radio" type="radio"  value="inside" />
		        	<label for="chart1-font-position-radio-2">中</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart1-font-position-radio-3" name="chart1-font-position-radio" type="radio"  value="right"  checked="checked" />
		        	<label for="chart1-font-position-radio-3">右</label>
		      	</span>
		    </div><!-- /input-group -->
    		<br/>
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	内漏斗字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart2-font-size-range" type="range" value="12"  max="40" min="9">
		       	</span>
		      	<input id="chart2-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
    		<br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	内漏斗字体位置
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart2-font-position-radio-1" name="chart2-font-position-radio" type="radio"  value="left" />
		        	<label for="chart2-font-position-radio-1">左</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart2-font-position-radio-2" name="chart2-font-position-radio" type="radio"  value="inside"  checked="checked" />
		        	<label for="chart2-font-position-radio-2">中</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart2-font-position-radio-3" name="chart2-font-position-radio" type="radio"  value="right" />
		        	<label for="chart2-font-position-radio-3">右</label>
		      	</span>
		    </div><!-- /input-group -->
		    <div class="clearfix"></div>
    	</div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading">
            边框样式
        </div>
        <div class="panel-body">
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    漏斗边框颜色
                </span>
                <input id="chart1-line-color-select" type="color" class="form-control" style="width:45px;" value="#ffffff" />
                <input id="chart2-line-color-select" type="color" class="form-control" style="width:45px;" value="#ffffff" />
            </div><!-- /input-group -->
            <br/>
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    外漏斗边框宽度
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart1-line-width-range" type="range" value="1"  max="5" min="1">
                </span>
                <input id="chart1-line-width-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="1" />
                <span class="input-group-addon" style="width:auto;">
                    px
                </span>
            </div><!-- /input-group -->
            <div class="clearfix"></div>
            <br/>
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    内漏斗边框宽度
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart2-line-width-range" type="range" value="2"  max="5" min="1">
                </span>
                <input id="chart2-line-width-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="2" />
                <span class="input-group-addon" style="width:auto;">
                    px
                </span>
            </div><!-- /input-group -->
            <div class="clearfix"></div>
        </div>
    </div>
    <br/>
    <div class="panel panel-default">
        <div class="panel-heading">
            漏斗系列颜色样式
        </div>
        <div class="panel-body">
            <div class="input-group pull-left">
                <span class="input-group-addon" style="width:auto;">
                    外漏斗系列颜色
                </span>
            </div>
            <div class="input-group pull-left" style="margin-left:20px;">
                <span id="chart-pie-color-container-0" data-index="1">
                </span>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="panel-body">
            <div class="input-group pull-left">
                <span class="input-group-addon" style="width:auto;">
                    内漏斗系列颜色
                </span>
            </div>
            <div class="input-group pull-left" style="margin-left:20px;">
                <span id="chart-pie-color-container-1" data-index="1">
                </span>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
  </div>
</div>
<div class="clearfix"></div>