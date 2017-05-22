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
                           <input id="chart-backgroundColor-select" type="color" class="form-control" style="width:45px;" value="#E3F7FF" />
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
                                          内边框大小
                          </span>
                          <span class="input-group-addon" style="width:auto;">
                                <input id="chart-border-range" type="range" value="1" min="0" max="10">
                          </span>
                          <input id="chart-border-text" type="text" class="form-control"  disabled="disabled" value="1" style="width:60px;" >
                       </div><!-- /input-group -->
                            <br/>
                        <div class="input-group">
                            <span class="input-group-addon" style="width:auto;">
                                    内边框颜色
                            </span>
                            <input id="chart-borderColor-select" type="color" class="form-control" style="width:45px;" value="#156ACF" />
                        </div><!-- /input-group -->
                        <br/>
                        <div class="input-group">
                             <span class="input-group-addon" style="width:auto;">
                                    内边框阴影颜色
                             </span>
                               <input id="chart-inner-shadowColor-select" type="color" class="form-control" style="width:45px;" value="#D1D1D1" />
                       </div><!-- /input-group -->
                        <br/>
                        <div class="input-group">
                            <span class="input-group-addon" style="width:auto;">
                                   内边框阴影大小
                            </span>
                             <span class="input-group-addon" style="width:auto;">
                                <input id="chart-inner-shadowborder-range" type="range" value="8" min="0" max="50">
                             </span>
                           <input id="chart-inner-shadowborder-text" type="text" class="form-control"  disabled="disabled" value="8" style="width:60px;" >
                         </div><!-- /input-group -->
                           <br/>
                        <div class="input-group">
                        	<span class="input-group-addon" style="width:auto;">
                                  外边框大小
                            </span>
                            <span class="input-group-addon" style="width:auto;">
                                   <input id="chart-out-border-range" type="range" value="8" min="0" max="20">
                            </span>
                            <input id="chart-out-border-text" type="text" class="form-control"  disabled="disabled" value="8" style="width:60px;" >
                        </div><!-- /input-group -->
                        <br/>
                        <div class="input-group">
                             <span class="input-group-addon" style="width:auto;">
                                     外边框颜色
                             </span>
                              <input id="chart-out-borderColor-select" type="color" class="form-control" style="width:45px;" value="#30539C" />
                        </div><!-- /input-group -->
                              <br/>
                        <div class="input-group">
                             <span class="input-group-addon" style="width:auto;">
                                    外边框阴影颜色
                             </span>
                               <input id="chart-outter-shadowColor-select" type="color" class="form-control" style="width:45px;" value="#D1D1D1" />
                       </div><!-- /input-group -->
                        <br/>
                        <div class="input-group">
                            <span class="input-group-addon" style="width:auto;">
                                   外边框阴影大小
                            </span>
                             <span class="input-group-addon" style="width:auto;">
                                <input id="chart-outter-shadowborder-range" type="range" value="50" min="0" max="50">
                             </span>
                           <input id="chart-outter-shadowborder-text" type="text" class="form-control"  disabled="disabled" value="50" style="width:60px;" >
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
                    <input id="chart-radius-range" type="range" value="70" min="0" max="100">
                </span>
                <input id="chart-radius-text" type="text" class="form-control"  disabled="disabled" value="70" style="width:60px;" >
                <span class="input-group-addon" style="width:auto;">
                    %
                </span>
            </div><!-- /input-group -->
        </div>
    </div>
    <div class="panel panel-default">
            <div class="panel-heading">
                波纹样式
            </div>
            <div class="panel-body">
               <div class="input-group">
                   <span class="input-group-addon" style="width:auto;">
                      <input id="chart-rock-check" type="checkbox" checked="checked">
                        		        	是否摆动
                    </span>
               </div><!-- /input-group -->
                <br/>
                <div class="input-group">
                    <span class="input-group-addon" style="width:auto;">
                             波浪弧度
                    </span>
                    <span class="input-group-addon" style="width:auto;">
                        <input id="chart-radian-range" type="range" value="10" min="0" max="20">
                    </span>
                    <input id="chart-radian-text" type="text" class="form-control"  disabled="disabled" value="10" style="width:60px;" >
                    <span class="input-group-addon" style="width:auto;">
                    %
                    </span>
                </div>
              <br/>
                <div class="input-group">
                     <span class="input-group-addon" style="width:auto;">
                           波浪颜色
                     </span>
                     <input id="chart-wave1-select" type="color" class="form-control" style="width:45px;" value="#2A4887" />
                     <input id="chart-wave2-select" type="color" class="form-control" style="width:45px;" value="#1255A6" />
                     <input id="chart-wave3-select" type="color" class="form-control" style="width:45px;" value="#1A84CA" />
                     <input id="chart-wave4-select" type="color" class="form-control" style="width:45px;" value="#42B8F9" />
               </div><!-- /input-group -->

            </div>
        </div>


  </div>
</div>
<div class="clearfix"></div>