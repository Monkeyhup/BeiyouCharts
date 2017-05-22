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
            		        	<input id="chart-show-yuanhuan-check" type="checkbox">
            		        	是否显示圆环图
            		      	</span>
            		    </div><!-- /input-group -->
                	</div>
    	<div class="panel-body">
	  		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	饼图半径大小
		      	</span>
		       	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-chart-pie-radius" type="range" value="75" min="50" max="150">
		       	</span>
		      	<input id="chart-chart-pie-radius-text" type="text" class="form-control"  disabled="disabled" value="75" style="width:60px;" >
		       	<span class="input-group-addon" style="width:auto;">
		       		px
		       	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>

    <div class="panel panel-default">
    	<div class="panel-heading">
    		图像设置
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-3d-check" type="checkbox">
		        	是否3D光效果
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    	<div class="panel-body">
            		<div class="input-group">
        		    	<span class="input-group-addon" style="width:auto;">
        		        	<input id="chart-show-percent-check" type="checkbox">
        		        	是否显示百分比
        		      	</span>
        		    </div><!-- /input-group -->
            	</div>
	<div class="panel-body">
            		<div class="input-group">
        		    	<span class="input-group-addon" style="width:auto;">
        		        	<input id="chart-skip-overlap-check" type="checkbox">
        		        	是否跳过重叠的标签
        		      	</span>
        		    </div><!-- /input-group -->
            	</div>
    <div class="panel-body">
            	  		<div class="input-group">
            		    	<span class="input-group-addon" style="width:auto;">
            		        	标明线宽度
            		      	</span>
            		       	<span class="input-group-addon" style="width:auto;">
            		       		<input id="chart-slicing-distance" type="range" value="2" min="0" max="10">
            		       	</span>
            		      	<input id="chart-slicing-distance-text" type="text" class="form-control"  disabled="disabled" value="2" style="width:60px;" >
            		       	<span class="input-group-addon" style="width:auto;">
            		       		px
            		       	</span>
            		    </div><!-- /input-group -->
            		     <br/>
            		                 	  		<div class="input-group">
                                     		    	<span class="input-group-addon" style="width:auto;">
                                     		        	标明线的透明度
                                     		      	</span>
                                     		       	<span class="input-group-addon" style="width:auto;">
                                     		       		<input id="chart-text-touming" type="range" value="100" min="0" max="100">
                                     		       	</span>
                                     		      	<input id="chart-text-touming-text" type="text" class="form-control"  disabled="disabled" value="100" style="width:60px;" >
                                     		       	<span class="input-group-addon" style="width:auto;">
                                     		       	</span>
                                     		    </div><!-- /input-group -->
                                     		     <br/>
                                     		     	<div class="input-group">
                                                         		    	<span class="input-group-addon" style="width:auto;">
                                                         		        	<input id="chart-line-slant-check" type="checkbox">
                                                         		        	标明线是否倾斜
                                                   </span>
                                                 </div><!-- /input-group -->
                                       <br/>

                                       <div class="input-group">
                                         <span class="input-group-addon" style="width:auto;">
                                              图像开始的角度
                                         </span>
                                          <span class="input-group-addon" style="width:auto;">
                                            <input id="chart-jiaodu-range" type="range" value="0"  max="180" min="0">

                                             	</span>
                                            <input id="chart-jiaodu-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="0" />
                                            <span class="input-group-addon" style="width:auto;">
                                                  °
                                             </span>
                                            </div><!-- /input-group -->
                	</div>
    <br/>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		图例样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-legend-check" type="checkbox">
		        	是否显示图例
		      	</span>
		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		文字样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-label-check" type="checkbox" checked="checked">
		        	是否显示文字与图像之间的线条
		      	</span>
		    </div><!-- /input-group -->
		    <br/>

    	</div>
    </div>
  </div>
</div>
<div class="clearfix"></div>