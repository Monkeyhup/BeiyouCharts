/**
 * echarts 饼图柱图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");
    var PieSingle = require("./echarts.pie.single");
    var BarHorizontalSingle = require("./echarts.bar.horizontal.single");

    /**
     *
     * @constructor
     */
    var EChartPieBar = function(){
        this.pieSingle = new PieSingle();
        this.barHorizontalSingle = new BarHorizontalSingle();
    };

    /**
     *
     * @type {{}}
     */
    EChartPieBar.prototype = {
        init:function(config){
            var that = this;
            config = $.extend({},config);
            common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);
            $("#"+config.container).css({
            	"position" : "relative"
            });
            var width = parseFloat($("#"+config.container).css("width"));
           
            var id1 = null;
            var $pies = $("div[id^='"+ config.container+"_pie_']");
            if($pies.length > 0){
            	id1 = $($pies[0]).attr("id");
            }else{
            	//创建新的div容器
            	id1 = config.container+"_pie_"+(new Date().getTime());
                $("<div id='"+id1+"'>").css({
                	"position" : "absolute",
                	"left": 0
                }).appendTo($("#"+config.container));
            }
            
            var id2 = null;
            var $bars = $("div[id^='"+ config.container+"_bar_']");
            if($bars.length > 0){
            	id2 = $($bars[0]).attr("id");
            }else{
            	//创建新的div容器
            	id2 = config.container+"_bar_"+(new Date().getTime());
                $("<div id='"+id2+"'>").css({
                	"position" : "absolute",
                	"left": 1.2*width /3
                }).appendTo($("#"+config.container));
            }
            
            //配置饼样式
            var cPieConfig = null,cBarConfig = null;
    		if(config.option){
    			if(config.option.pie){
    				cPieConfig = config.option.pie;
    			}
    			if(config.option.bar){
    				cBarConfig = config.option.bar;
    			}
    			//删除样式
    			delete config.option;
        	}
            
            // 基于准备好的dom，初始化echarts图表
            this.getOptionFromConfig(config,function(re){
            	if(re && re != null){
            		//出饼图
            		var pieConfig = $.extend({},config,{container:id1,width:1.4*width/3,isShowLegend:false});
            		pieConfig.url = null;
            		pieConfig.data = re.pie;
            		//配置饼样式
            		if(cPieConfig && cPieConfig != null){
            			pieConfig.option = cPieConfig;
                	}
            		that.pieSingle.init(pieConfig);
            		
            		//出柱图
            		var barConfig = $.extend({},config,{container:id2,width:2*width/3});
            		barConfig.url = null;
            		barConfig.data = re.bar;
            		if(cBarConfig && cBarConfig != null){
            			barConfig.option = cBarConfig;
                	}
            		that.barHorizontalSingle.init(barConfig);
            	}else{
            		console.log("消息提示：没有数据");
            	}
            });
        },
        getOptionFromConfig:function(config,callback){
            var that = this;
            if(typeof config.data == "object" && config.data != null){
            	this.getDataFromData(config.data,function(re){
                    callback && callback(re);
            	});
            }else{
            	this.getDataFromConfig(config.url,function(re){
                    callback && callback(re);
                });
            }
        },
        getDataFromConfig:function(url,callback){
        	var that = this;
            common.Ajax.getJsonData(url,function(data){
            	that.getDataFromData(data,callback);
            });
        },
        getDataFromData:function(data,callback){
        	if(data && data != null){
        		var re = {
        			pie:[],
        			bar:[]
        		};
        		
                for (var i = 0; i < data.length; i++) {
                	//第一行为表头
                    if (i == 0) {
                    	re.pie.push(data[i]);
                    	re.bar.push(data[i]);
                    }else{
                    	//条形图
                        if (!isNaN(data[i].value)) {
                        	re.bar.push(data[i]);
                        }else{
                        	re.pie.push({
                        		name:data[i].name,
                        		value:parseFloat(data[i].value)
                        	});
                        }
                    }//end if (i == 0)
                }
                
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };


    return EChartPieBar;
});