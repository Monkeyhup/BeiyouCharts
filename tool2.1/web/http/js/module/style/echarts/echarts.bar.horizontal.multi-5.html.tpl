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
  		    <br>
  		    <div class="input-group">
  					<span class="input-group-addon" style="width:auto;">
                  	X轴起始刻度
  					</span>
  					<span class="input-group-addon" style="width:auto;">
  						<input id="chart-xaxis-change" type="number" style="width:50px" value="0" >
  					</span>
  			</div><!-- /input-group -->
      	</div>
      </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		对比条形样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	对比条形颜色
		      	</span>
		      	<input id="chart1-bar-color-select" type="color" class="form-control" style="width:45px;" value="#FF7F50" />
		      	<input id="chart2-bar-color-select" type="color" class="form-control" style="width:45px;" value="#87CEFA" />
		    </div><!-- /input-group -->
		    <br/>
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
    		    <div class="input-group pull-left" style="margin-left:10px;">
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
    		      	<input id="chart1-font-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
    		      	<input id="chart2-font-color-select" type="color" class="form-control" style="width:45px;" value="#26C0C0" />
    		    </div><!-- /input-group -->
    		    <br/>
    		    <div class="input-group">
    		    	<span class="input-group-addon" style="width:auto;">
    		        	条形1字体大小
    		      	</span>
    		      	<span class="input-group-addon" style="width:auto;">
    		       		<input id="chart1-font-size-range" type="range" value="12"  max="40" min="9">
    		       	</span>
    		      	<input id="chart1-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
    		      	<span class="input-group-addon" style="width:auto;">
    		        	px
    		      	</span>
    		    </div><!-- /input-group -->
    		    <br/>
    		    <div class="input-group">
    		    	<span class="input-group-addon" style="width:auto;">
    		        	条形1字体位置
    		      	</span>
    		    </div><!-- /input-group -->
    		    <div class="input-group">
    		      	<span class="input-group-addon" style="width:auto;">
    		        	<input id="chart1-font-position-radio-1" name="chart1-font-position-radio" type="radio"  value="top"/>
    		        	<label for="chart1-font-position-radio-1">上</label>
    		      	</span>
    		      	<span class="input-group-addon" style="width:auto;">
    		        	<input id="chart1-font-position-radio-2" name="chart1-font-position-radio" type="radio"  value="bottom" />
    		        	<label for="chart1-font-position-radio-2">下</label>
    		      	</span>
    		      	<span class="input-group-addon" style="width:auto;">
    		        	<input id="chart1-font-position-radio-3" name="chart1-font-position-radio" type="radio"  value="left" />
    		        	<label for="chart1-font-position-radio-3">左</label>
    		      	</span>
    		      	<span class="input-group-addon" style="width:auto;">
    		        	<input id="chart1-font-position-radio-4" name="chart1-font-position-radio" type="radio"  value="right" checked="checked"  />
    		        	<label for="chart1-font-position-radio-4">右</label>
    		      	</span>
    		      	<span class="input-group-addon" style="width:auto;">
    		        	<input id="chart1-font-position-radio-5" name="chart1-font-position-radio" type="radio"  value="inside" />
    		        	<label for="chart1-font-position-radio-5">中</label>
    		      	</span>
    		    </div><!-- /input-group -->
    		    <br/>
    		    <br/>
    		    <div class="input-group">
    		    	<span class="input-group-addon" style="width:auto;">
    		        	条形2字体大小
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
    		        	条形2字体位置
    		      	</span>
    		    </div><!-- /input-group -->
    		    <div class="input-group">
    		      	<span class="input-group-addon" style="width:auto;">
    		        	<input id="chart2-font-position-radio-1" name="chart2-font-position-radio" type="radio"  value="top" />
    		        	<label for="chart2-font-position-radio-1">上</label>
    		      	</span>
    		      	<span class="input-group-addon" style="width:auto;">
    		        	<input id="chart2-font-position-radio-2" name="chart2-font-position-radio" type="radio"  value="bottom" />
    		        	<label for="chart2-font-position-radio-2">下</label>
    		      	</span>
    		      	<span class="input-group-addon" style="width:auto;">
    		        	<input id="chart2-font-position-radio-3" name="chart2-font-position-radio" type="radio"  value="left" />
    		        	<label for="chart2-font-position-radio-3">左</label>
    		      	</span>
    		      	<span class="input-group-addon" style="width:auto;">
    		        	<input id="chart2-font-position-radio-4" name="chart2-font-position-radio" type="radio"  value="right" checked="checked"  />
    		        	<label for="chart2-font-position-radio-4">右</label>
    		      	</span>
    		      	<span class="input-group-addon" style="width:auto;">
    		        	<input id="chart2-font-position-radio-5" name="chart2-font-position-radio" type="radio"  value="inside" />
    		        	<label for="chart2-font-position-radio-5">中</label>
    		      	</span>
    		    </div><!-- /input-group -->
        	</div>
        </div>
    <br/>
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