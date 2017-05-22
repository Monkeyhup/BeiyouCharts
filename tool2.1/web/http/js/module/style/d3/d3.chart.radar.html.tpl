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
		       		<input id="chart-d3-height-range" type="range" value="550" min="550" max="900">
		       	</span>
		      	<input id="chart-d3-height-text" type="text" class="form-control"  disabled="disabled" value="400" style="width:60px;" >
		       	<span class="input-group-addon" style="width:auto;">
		       		px
		       	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
                    		路径颜色及形状
                    	</div>
    	<div class="panel-body">
    	<div class="input-group">

        		    	<span class="input-group-addon" style="width:auto;">
        		        	路径颜色
        		      	</span>
        		      	<div class="input-group">
                                		    	<span id="chart-path-color-container" data-index="1"  class="input-group-addon" style="width:auto;">
                                		    	</span>
                                		    </div>


        		    </div><!-- /input-group -->

        		    <br/>

    		<div class="input-group">

		    	<span class="input-group-addon" style="width:auto;">
		        	路径形状
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
                		        	<input id="chart-path-shape-radio-1" name="chart-path-shape-radio" type="radio"  value="circle" checked="checked" />
                		        	<label for="chart-path-shape-radio-1">圆</label>
                </span>
                <span class="input-group-addon" style="width:auto;">
                		        	<input id="chart-path-shape-radio-2" name="chart-path-shape-radio" type="radio"  value="tip" />
                		        	<label for="chart-path-shape-radio-2">尖</label>
                		      	</span>
		    </div><!-- /input-group -->
    	</div>

    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		背景样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
                		        	背景透明度
                		      	</span>

                		       	<span class="input-group-addon" style="width:auto;">
                		       		<input id="chart-d3-opacityCircles-range" type="range" value="1" min="0" max="10">
                		       	</span>
                		      	<input id="chart-d3-opacityCircles-text" type="text" class="form-control"  disabled="disabled" value="0.1" style="width:60px;" >
		    </div><!-- /input-group -->
<br/>
				<div class="input-group" >
            		    	<span class="input-group-addon" style="width:auto;" >
                            		        	雷达圈数
                            		      	</span>

                           <span class="input-group-addon" style="width:auto;">
                            		     <input id="chart-d3-CircleNums-range" type="range" value="5" min="0" max="10">
                            		       	</span>
           <input id="chart-d3-CircleNums-text" type="text" class="form-control"  disabled="disabled" value="5" style="width:60px;" >

            </div>




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
		    <div class="input-group" id="chart-font-size-text">
		    	<span class="input-group-addon" style="width:auto;" id="chart-font-size-text">
		        	字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;" id="chart-font-size-text">
		       		<input id="chart-font-size-range" type="range" value="10"  max="20" min="5">
		       	</span>
				<span class="input-group-addon" style="width:auto;" id="chart-font-size-text" >
		      	<input id="chart-font-size-text1" type="text" class="form-control"  style="width:60px;border-style:none;"  disabled="disabled" value="10" />
				</span>
		      	<span class="input-group-addon" style="width:auto;" id="chart-font-size-text">
		        	px
		      	</span>
		    </div><!-- /input-group -->
    		<br/>
		    <div class="input-group" id="chart-font-family-radio">
		    	<span class="input-group-addon" style="width:auto;" id="chart-font-family-radio">
		        	字体样式
		      	</span>
		      	<span class="input-group-addon" style="width:auto;" >
		        	<input id="chart-font-position-radio-1" name="chart-font-family-radio"  type="radio"  value="SimSun" checked="checked" />
		        	<label for="chart-font-position-radio-1">宋体</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;" id="chart-font-family-radio">
		        	<input id="chart-font-position-radio-2" name="chart-font-family-radio"  type="radio"  value="SimHei" />
		        	<label for="chart-font-position-radio-2">黑体</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;" id="chart-font-family-radio">
		        	<input id="chart-font-position-radio-3" name="chart-font-family-radio"  type="radio"  value="KaiTi" />
		        	<label for="chart-font-position-radio-3">楷体</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;" id="chart-font-family-radio">
		        	<input id="chart-font-position-radio-4" name="chart-font-family-radio"  type="radio"  value="MingLiU" />
		        	<label for="chart-font-position-radio-4">细明体</label>
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
  </div>
</div>
<div class="clearfix"></div>