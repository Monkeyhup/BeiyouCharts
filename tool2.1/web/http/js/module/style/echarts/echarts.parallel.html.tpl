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
            		      	<input id="background-color-select" type="color" class="form-control" style="width:45px;" value="#404a59" />
            		    </div><!-- /input-group -->
    	</div>
    </div>
    <div class="panel panel-default">
    	<div class="panel-heading">
    		图例样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group ">
		    	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-show-legend-check" type="checkbox" checked="checked">
		        	是否显示图例
		      	</span>
		    </div><!-- /input-group -->
		    <br/>

		    <div class="input-group" style="width:auto;">
		    	<span class="input-group-addon" style="width:auto;">
		        	图例字体颜色
		      	</span>
		      	<input id="chart-legend-color-select" type="color" class="form-control" style="width:45px;" value="#ffffff" />
		    </div><!-- /input-group -->
		  <br/>

		    <div class="input-group" style="width:auto;">
            	<span class="input-group-addon" style="width:auto;">
            		        	图例字体大小
            	</span>
            	<span class="input-group-addon" style="width:auto;">
                   <input id="input-legend-font-range" type="range" value="14"  max="30" min="5">
                </span>
                   <input id="input-legend-font-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="14" />
                 <span class="input-group-addon" style="width:auto;">
                            		        	px
                  </span>
            </div><!-- /input-group -->
		    <div class="clearfix"></div>
    	</div>
    </div>
    </div>

  <div class="tab-pane" id="panel-x">
    <div class="panel panel-default">
    	<div class="panel-heading">
    		x轴样式
    	</div>
    	<div class="panel-body">
    		<div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	x轴位置
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-x-position-radio-1" name="chart-x-position-radio" type="radio"  value="end" checked="checked" />
		        	<label for="chart-x-position-radio-1">上面</label>
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		        	<input id="chart-x-position-radio-2" name="chart-x-position-radio" type="radio"  value="start" />
		        	<label for="chart-x-position-radio-2">下面</label>
		      	</span>
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	x轴距离
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
                     <input id="input-x-level-range" type="range" value="20"  max="30" min="10"/>
                </span>
               <input id="input-x-level-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="20" />
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
		        	x轴字体颜色
		      	</span>
		      	<input id="chart-x-font-color-select" type="color" class="form-control" style="width:45px;" value="#FFFFFF" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
		    	<span class="input-group-addon" style="width:auto;">
		        	x轴字体大小
		      	</span>
		      	<span class="input-group-addon" style="width:auto;">
		       		<input id="chart-x-font-size-range" type="range" value="12"  max="30" min="10">
		       	</span>
		      	<input id="chart-x-font-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
		      	<span class="input-group-addon" style="width:auto;">
		        	px
		      	</span>
		    </div><!-- /input-group -->
    	</div><!-- /input-panel-body -->
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
		        	坐标轴颜色
		      	</span>
		      	<input id="chart-y-color-select" type="color" class="form-control" style="width:45px;" value="#A1A1A3" />
		    </div><!-- /input-group -->
		    <br/>
		    <div class="input-group">
            	<span class="input-group-addon" style="width:auto;">
            		  坐标轴线宽
            	</span>
            	<br/>
            	<span class="input-group-addon" style="width:auto;">
                  <input id="chart-y-line-size-range" type="range" value="1"  max="10" min="0">
                </span>
                <input id="chart-y-line-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="1" />
                  <span class="input-group-addon" style="width:auto;">
                         px
                   </span>
                	</div><!-- /input-group -->
                	<br/>
                	 <div class="input-group ">
                                      <span class="input-group-addon" style="width:auto;">
                                            <input id="chart-show-y-shadow-check" type="checkbox" >
                                                  是否设置阴影
                                       </span>
                                   </div><!-- /input-group -->
                                    <br/>
                                    <div class="input-group">
                                       <span class="input-group-addon" style="width:auto;">
                                          阴影模糊度
                                       </span>
                                         <br/>
                                       <span class="input-group-addon" style="width:auto;">
                                           <input id="charty-shadow-range" type="range" value="0"  max="50" min="0" disabled="disabled">
                                       </span>
                                       <input id="charty-shadow-range-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="0" />
                                           <span class="input-group-addon" style="width:auto;">
                                                 px
                                           </span>
                                       </div><!-- /input-group -->
                                       <br/>
                                    <div class="input-group">
                                                        <span class="input-group-addon" style="width:auto;">
                                                               阴影颜色
                                                        </span>
                                              <input id="chart-y-shadow-color-select" type="color" class="form-control"  disabled="disabled" style="width:45px;" value="#777777" />
                                        </div><!-- /input-group -->
                </div>
		    </div>

		    <div class="panel panel-default">
		    <div class="panel-heading">
                		y轴刻度点样式
             </div>
             	<div class="panel-body">
		   		 <div class="input-group ">
            		    	<span class="input-group-addon" style="width:auto;">
            		        	<input id="chart-show-y-calibration-point-check" type="checkbox" checked="checked">
            		        	是否显示刻度点
            		      	</span>
            		    </div><!-- /input-group -->
            		    <br/>
		    		<div class="input-group">
            		    	<span class="input-group-addon" style="width:auto;">
            		        	坐标轴刻度点颜色
            		      	</span>
            		<input id="chart-y-calibration-point-color-select" type="color" class="form-control" style="width:45px;" value="#777777" />
             		</div><!-- /input-group -->
            	</div>
            </div>

            		    <div class="panel panel-default">
            		     <div class="panel-heading">
                                        		y轴标签样式
                                        	</div>
                                        	<div class="panel-body">
            		    		 <div class="input-group ">
                                    		    	<span class="input-group-addon" style="width:auto;">
                                    		        	<input id="chart-show-y-label-check" type="checkbox" checked="checked">
                                    		        	是否显示y轴标签
                                    		      	</span>
                         </div><!-- /input-group -->
                           <br/>

            		    <div class="input-group">
                        <span class="input-group-addon" style="width:auto;">
                        	坐标轴标签字体颜色
                        </span>
                        <input id="chart-y-label-color-select" type="color" class="form-control" style="width:45px;" value="#FFFFFF" />
                        </div><!-- /input-group -->
                        <br/>
					<div class="input-group">
                           <span class="input-group-addon" style="width:auto;">
                                 坐标轴标签字体大小
                            </span>
                           <br/>
                        <span class="input-group-addon" style="width:auto;">
                       <input id="charty-label-size-range" type="range" value="12"  max="20" min="0">
                       </span>
                    <input id="charty-label-size-text" type="text" class="form-control" disabled="disabled" style="width:45px;" value="12" />
                     <span class="input-group-addon" style="width:auto;">
                           px
                      </span>
                      </div><!-- /input-group -->
    	</div>
<div class="clearfix"></div>