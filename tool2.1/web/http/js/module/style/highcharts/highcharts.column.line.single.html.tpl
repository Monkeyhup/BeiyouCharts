<h4 style="font-family:微软雅黑;">
	<small>
		可以调整参数后动态改变可视化图样式
	</small>
</h4>
<ul class="nav nav-list bs-docs-sidenav pull-left">
  <li class="active"><a href="#panel-common" data-toggle="tab">通用</a></li>
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
		    <br/>
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                   背景颜色
                </span>
                <input id="chart-background-color-select" type="color" class="form-control" style="width:45px;" value="#ffffff" />
            </div><!-- /input-group -->
            <br/>
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		柱样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	柱颜色
		      	</span>
		      	<input id="chart-column-color-select" type="color" class="form-control" style="width:45px;" value="#7cb5ec" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="clearfix"></div>
    	</div>
    </div>
        <div class="panel panel-default">
        	<div class="panel-heading">
        		折线样式
        	</div>
        	<div class="panel-body">
        		<div class="input-group">
    		    	<span class="input-group-addon" style="width:auto;">
    		        	折线颜色
    		      	</span>
    		      	<input id="chart-line-color-select" type="color" class="form-control" style="width:45px;" value="#000000" />
    		    </div><!-- /input-group -->
    		    <br/>
    		    <div class="clearfix"></div>
    		    <div class="input-group">
                    <span class="input-group-addon" style="width:auto;">
                        转折点样式
                    </span>
                    <select id="select-point-style" style="height:28px">
                        <span class="input-group-addon">
                            <option id="chart-marker-symbol-radio-1" name="chart-marker-symbol" value="circle">圆形</option>
                        </span>
                        <span class="input-group-addon">
                            <option id="chart-marker-symbol-radio-2" name="chart-marker-symbol" value="square">方形</option>
                        </span>
                        <span class="input-group-addon">
                            <option id="chart-marker-symbol-radio-3" name="chart-marker-symbol" value="diamond">菱形</option>
                        </span>
                        <span class="input-group-addon">
                            <option id="chart-marker-symbol-radio-4" name="chart-marker-symbol" value="triangle">三角形</option>
                        </span>
                    </select>
                </div><!-- /input-group -->
                <br/>
                <div class="input-group">
                    <span class="input-group-addon" style="width:auto;">
                        折线样式
                    </span>
                    <select id="select-line-style" style="height:28px">
                        <span class="input-group-addon">
                            <option id="chart-dashStyle-radio-1" name="chart-dashStyle" value="Solid">实线</option>
                        </span>
                        <span class="input-group-addon">
                            <option id="chart-dashStyle-radio-2" name="chart-dashStyle" value="Dash">破折号线</option>
                        </span>
                        <span class="input-group-addon">
                            <option id="chart-dashStyle-radio-3" name="chart-dashStyle" value="Dot">点线</option>
                        </span>
                        <span class="input-group-addon">
                            <option id="chart-dashStyle-radio-4" name="chart-dashStyle" value="DashDot">破折号点线</option>
                        </span>
                    </select>
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
		    <div class="clearfix"></div>
		    <br/>
		     <div class="input-group pull-left">
                <span class="input-group-addon" style="width:auto;">
                    图例字体颜色
                </span>
                <input id="chart-legend-color-select" type="color" class="form-control" style="width:45px;" value="#000000" />
             </div><!-- /input-group -->
             <div class="input-group pull-left" style="margin-left:20px;">
                <span class="input-group-addon" style="width:auto;">
                    图例标签底色
                </span>
                <input id="chart-legend-lable-color-select" type="color" class="form-control" style="width:45px;" value="#ffffff" />
             </div><!-- /input-group -->
		     <div class="clearfix"></div>
		    <br/>
		     <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    图例位置
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-font-position-radio-1" name="legend-position-radio" type="radio"  value="left" checked="checked"/>
                    <label for="chart-font-position-radio-1">左</label>
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-font-position-radio-2" name="legend-position-radio" type="radio"  value="center"  />
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
  <div class="tab-pane" id="panel-x">
    <div class="panel panel-default">
    	<div class="panel-heading">
    		x轴网格样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	是否显示网格
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-x-isgrid-1" name="chart-x-isgrid" type="radio"  value="true"/>
		        	<label for="chart-x-isgrid-1">是</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-x-isgrid-2" name="chart-x-isgrid" type="radio"  value="false" checked="checked"  />
		        	<label for="chart-x-isgrid-2">否</label>
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	网格颜色
		      	</span>
		      	<input id="chart-x-grid-color-select" type="color" class="form-control" style="width:45px;" value="#C0C0C0" disabled="disabled"/>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    网格样式
                </span>
                <select id="select-xAxis-style" style="height:28px" disabled="disabled">
                    <span class="input-group-addon">
                        <option id="chart-xAxis-radio-1" name="chart-xAxis-line" value="Solid">实线</option>
                    </span>
                    <span class="input-group-addon">
                        <option id="chart-xAxis-radio-2" name="chart-xAxis-line" value="Dash">破折号线</option>
                    </span>
                    <span class="input-group-addon">
                        <option id="chart-xAxis-radio-3" name="chart-xAxis-line" value="Dot">点线</option>
                    </span>
                    <span class="input-group-addon">
                        <option id="chart-xAxis-radio-4" name="chart-xAxis-line" value="DashDot">破折号点线</option>
                    </span>
                </select>
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
		        	x轴字体颜色
		      	</span>
		      	<input id="chart-x-font-color-select" type="color" class="form-control" style="width:45px;" value="#606060" />
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
                    是否加粗
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-x-font-isweight-1" name="chart-x-font-isweight" type="radio"  value="true" />
                    <label for="chart-x-font-isweight-1">是</label>
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-x-font-isweight-2" name="chart-x-font-isweight" type="radio"  value="false"  checked="checked" />
                    <label for="chart-x-font-isweight-2">否</label>
                </span>
             </div><!-- /input-group -->

    	</div>
    </div>
  </div>
  <div class="tab-pane" id="panel-y">
  	<div class="panel panel-default">
    	<div class="panel-heading">
    		y轴网格样式
    	</div>
    	<div class="panel-body">
		    <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    是否显示网格
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-y-isgrid-1" name="chart-y-isgrid" type="radio"  value="true" checked="checked" />
                    <label for="chart-y-isgrid-1">是</label>
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-y-isgrid-2" name="chart-y-isgrid" type="radio"  value="false" />
                    <label for="chart-y-isgrid-2">否</label>
                </span>
            </div><!-- /input-group -->
            <br/>
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    网格颜色
                </span>
                <input id="chart-y-grid-color-select" type="color" class="form-control" style="width:45px;" value="#C0C0C0" />
            </div><!-- /input-group -->
            <br/>
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    网格样式
                </span>
                <select name="selectYGridStyle" id="selectYGridStyle" style="height:28px">
                    <span class="input-group-addon">
                        <option id="chart-yAxis-radio-1" name="chart-yAxis-line" value="Solid">实线</option>
                    </span>
                    <span class="input-group-addon">
                        <option id="chart-yAxis-radio-2" name="chart-yAxis-line" value="Dash">破折号线</option>
                    </span>
                    <span class="input-group-addon">
                        <option id="chart-yAxis-radio-3" name="chart-yAxis-line" value="Dot">点线</option>
                    </span>
                    <span class="input-group-addon">
                        <option id="chart-yAxis-radio-4" name="chart-yAxis-line" value="DashDot">破折号点线</option>
                    </span>
                </select>
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
		      	<input id="chart-y-font-color-select" type="color" class="form-control" style="width:45px;" value="#606060" />
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
                    是否加粗
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-y-font-isweight-1" name="chart-y-font-isweight" type="radio"  value="true" />
                    <label for="chart-y-font-isweight-1">是</label>
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-y-font-isweight-2" name="chart-y-font-isweight" type="radio"  value="false" checked="checked" />
                    <label for="chart-y-font-isweight-2">否</label>
                </span>
            </div><!-- /input-group -->
    	</div>
    </div>
  </div>
</div>
<div class="clearfix"></div>