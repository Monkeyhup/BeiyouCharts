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
                    图α角度
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-chart-alpha-range" type="range" value="15" min="0" max="90">
                </span>
                <input id="chart-chart-alpha-text" type="text" class="form-control"  disabled="disabled" value="15" style="width:60px;" >
                <span class="input-group-addon" style="width:auto;">
                    °
                </span>
            </div><!-- /input-group -->
             <br/>
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    图β角度
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-chart-beta-range" type="range" value="15" min="0" max="90">
                </span>
                <input id="chart-chart-beta-text" type="text" class="form-control"  disabled="disabled" value="15" style="width:60px;" >
                <span class="input-group-addon" style="width:auto;">
                    °
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

                <div class="input-group  pull-left">
                    <span class="input-group-addon" style="width:auto;">
                        <input id="chart-is-background-color-check" type="checkbox">
                        背景颜色是否渐变
                    </span>
                </div><!-- /input-group -->
                <br/>
                <br/>
              <div class="input-group">
                    <span class="input-group-addon" style="width:auto;">
                        起始颜色
                    </span>
                    <input id="chart-background-color-begin-select" type="color" class="form-control" style="width:45px;" value="#ffffff" disabled=false/>
                <span class="input-group-addon" style="width:auto;">
                 终止颜色
                 </span>
             <input id="chart-background-color-end-select" type="color" class="form-control" style="width:45px;" value="#ffffff" disabled=false/>
                </div><!-- /input-group -->

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
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	柱深度
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-column-deth-range" type="range" value="25"  max="50" min="0">
		       	</span>
		      	<input id="chart-area-width-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="25" />
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
		    <br/>
		     <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    图例位置
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-font-position-radio-5" name="legend-position-radio" type="radio"  value="left" />
                    <label for="chart-font-position-radio-5">左</label>
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-font-position-radio-6" name="legend-position-radio" type="radio"  value="center" checked="checked" />
                    <label for="chart-font-position-radio-6">中</label>
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-font-position-radio-7" name="legend-position-radio" type="radio"  value="right" />
                    <label for="chart-font-position-radio-7">右</label>
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
		        	<input id="chart-x-isgrid-1" name="chart-x-isgrid" type="radio"  value="true" checked="checked" />
		        	<label for="chart-x-isgrid-1">是</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-x-isgrid-2" name="chart-x-isgrid" type="radio"  value="false" />
		        	<label for="chart-x-isgrid-2">否</label>
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	网格颜色
		      	</span>
		      	<input id="chart-x-grid-color-select" type="color" class="form-control" style="width:45px;" value="#C0C0C0" />
		    </div><!-- /input-group -->
		    <br/>
            <div class="input-group">
                <span class="input-group-addon" style="width:auto;">
                    网格样式
                </span>
                <select name="selectGridStyle" id="selectGridStyle" id="select-xAxis-style" style="height:28px" >
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
                    <input id="chart-x-font-isweight-1" name="chart-x-font-isweight" type="radio"  value="true" checked="checked" />
                    <label for="chart-x-font-isweight-1">是</label>
                </span>
                <span class="input-group-addon" style="width:auto;">
                    <input id="chart-x-font-isweight-2" name="chart-x-font-isweight" type="radio"  value="false" />
                    <label for="chart-x-font-isweight-2">否</label>
                </span>
            </div><!-- /input-group -->

    	</div>
    </div>
  </div>
  <div class="tab-pane" id="panel-y">
  <div class="panel panel-default">
      	<div class="panel-heading">
      		y轴样式
      	</div>
      	<div class="panel-body">
      	<div class="input-group">
             <span class="input-group-addon" style="width:auto;">
                y轴类型
             </span>
             <select name="selectYStyle" id="selectYStyle" style="height:28px">
                 <span class="input-group-addon">
                     <option id="chart-yAxis-type-radio-1" name="chart-yAxis-type-line" value="linear">线性</option>
                 </span>
                 <span class="input-group-addon">
                     <option id="chart-yAxis-type-radio-2" name="chart-yAxis-type-line" value="logarithmic">对数</option>
                 </span>
             </select>
            </div><!-- /input-group -->
      	</div>

      	</div>
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
                        <option id="chart-yAxis-GridLineDashStyle-radio-1" name="chart-yAxis-GridLineDashStyle-line" value="Solid">实线</option>
                    </span>
                    <span class="input-group-addon">
                        <option id="chart-yAxis-GridLineDashStyle-radio-2" name="chart-yAxis-GridLineDashStyle-line" value="Dash">破折号线</option>
                    </span>
                    <span class="input-group-addon">
                        <option id="chart-yAxis-GridLineDashStyle-radio-3" name="chart-yAxis-GridLineDashStyle-line" value="Dot">点线</option>
                    </span>
                    <span class="input-group-addon">
                        <option id="chart-yAxis-GridLineDashStyle-radio-4" name="chart-yAxis-GridLineDashStyle-line" value="DashDot">破折号点线</option>
                    </span>
                </select>
            </div><!-- /input-group -->
            <br/>

                	<div class="input-group">
                           <span class="input-group-addon" style="width:auto;">
                                是否显示次级网格
                           </span>
                           <span class="input-group-addon" style="width:auto;">
                                 <input id="chart-y-issecondarygrid-1" name="chart-y-issecondarygrid" type="radio"  value="true" />
                                 <label for="chart-y-issecondarygrid-1">是</label>
                                  </span>
                           <span class="input-group-addon" style="width:auto;">
                                <input id="chart-y-issecondarygrid-2" name="chart-y-issecondarygrid" type="radio"  value="false" checked="checked"/>
                                <label for="chart-y-issecondarygrid-2">否</label>
                            </span>
                     </div><!-- /input-group -->
                     <br/>
                     <div class="input-group" name="chart-y-SecondaryGridColor">
                        <span class="input-group-addon" style="width:auto;">
                            次级网格颜色
                        </span>
                        <input id="chart-y-Secondarygrid-color-select" type="color" class="form-control" style="width:45px;" value="#C0C0C0" disabled="true" />
                    </div><!-- /input-group -->
                    <br/>
                    <div class="input-group" name="chart-y-SecondaryGridStyle">
                        <span class="input-group-addon" style="width:auto;">
                            次级网格样式
                        </span>
                        <select name="selectYSecondaryGridStyle" id="selectYSecondaryGridStyle" style="height:28px" disabled="disabled">
                            <span class="input-group-addon">
                                <option id="chart-yAxis-minorGridLineDashStyle-radio-1" name="chart-yAxis-minorGridLineDashStyle-line" value="Solid">实线</option>
                            </span>
                            <span class="input-group-addon">
                                <option id="chart-yAxis-minorGridLineDashStyle-radio-2" name="chart-yAxis-minorGridLineDashStyle-line" value="Dash">破折号线</option>
                            </span>
                            <span class="input-group-addon">
                                <option id="chart-yAxis-minorGridLineDashStyle-radio-3" name="chart-yAxis-minorGridLineDashStyle-line" value="Dot">点线</option>
                            </span>
                            <span class="input-group-addon">
                                <option id="chart-yAxis-minorGridLineDashStyle-radio-4" name="chart-yAxis-minorGridLineDashStyle-line" value="DashDot">破折号点线</option>
                            </span>
                        </select>
                    </div><!-- /input-group -->
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
                                   		        	<input id="chart-y-font-isweight-1" name="chart-y-font-isweight" type="radio"  value="true" checked="checked" />
                                   		        	<label for="chart-y-font-isweight-1">是</label>
                                   		      	</span>
                                   		      	<span class="input-group-addon" style="width:auto;">
                                   		        	<input id="chart-y-font-isweight-2" name="chart-y-font-isweight" type="radio"  value="false" />
                                   		        	<label for="chart-y-font-isweight-2">否</label>
                                   		      	</span>
                                   		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
</div>
<div class="clearfix"></div>