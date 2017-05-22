/**
 * echart饼嵌套图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartPieNesting = function(){
    	this.currentColors = {
    		inner:[],
    		outter:[]
    	};
    	this.colors = ["#ff7f50", "#87cefa", "#da70d6", 
    	               "#32cd32", "#6495ed", "#ff69b4", 
    	               "#ba55d3", "#cd5c5c", "#ffa500", 
    	               "#40e0d0", "#1e90ff", "#ff6347", 
    	               "#7b68ee", "#00fa9a", "#ffd700", 
    	               "#6699FF", "#ff6666", "#3cb371", 
    	               "#b8860b", "#30e0e0"];
    	
        this.option = {
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                "axisPointer": {
                    "type": "shadow"
                }
            },
            legend: {
                data:[''],
                orient : 'vertical',
                x : 'left',
                "textStyle": {
                    "fontSize": 12,
                    "fontFamily": "微软雅黑",
                    "color": "#26C0C0",
                    "fontWeight": "bold"
                },
                "selectedMode": true,
                "show": true
            },
            series : [
                {
                    "name":"",
                    "type":"pie",
                    "radius" : [0, 70],
                    selectedMode: 'single',
                    radius : [0, 70],
                    x: '20%',
                    width: '40%',
                    funnelAlign: 'right',
                    "data":[]   //数据
                }
            ]
        };
    };

    /**
     *
     * @type {{}}
     */
    EChartPieNesting.prototype = {
        init:function(config){
            var that = this;
            config = $.extend({},config);
            common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);

            // 基于准备好的dom，初始化echarts图表
            var myChart = common.myECharts.getChart(config.container);
            if(myChart){
                this.getOptionFromConfig(config,function(){
                	if(config.option){
                    	that.option = $.extend(true,that.option,config.option || {});
                	}
                    myChart.setOption(that.option);
                });
            }
        },
        getOptionFromConfig:function(config,callback){
            var that = this;
            if(typeof config.data == "object" && config.data != null){
            	this.getDataFromData(config.data,function(re){
            		goTo(re);
                    callback && callback();
            	});
            }else{
            	this.getDataFromConfig(config.url,function(re){
                	goTo(re);
                    callback && callback();
                });
            }
            
            //
            function goTo(re){
            	if(re && re != null){
                    that.option.legend.data = re.legendData;
                    
                    //初始化
                    that.currentColors = {
                		inner:[],
                		outter:[]
                	};
                    
                    //获取颜色参数
                    var color = [];
                    var colorLen = that.colors.length;
                    var leftLen = re.seriesData.left.length;
                    var rightLen = re.seriesData.right.length;
                    var len = leftLen+rightLen;
                    for(var i=0;i<len;i++){
                    	var c = that.colors[i%colorLen];
                    	if(i < leftLen){
                    		that.currentColors.inner.push(c);
                    	}else{
                    		that.currentColors.outter.push(c);
                    	}
                    	color.push(c);
                    }
                    that.option.color = color;
                    
                    that.option.series = [
                        {
                            "name":re.seriesName,
                            "type":"pie",
                            "radius" : ["0%", "35%"],
                            "selectedMode": 'single',
                            "x": '20%',
                            "width": '40%',
                            "funnelAlign": 'left',
                            "data":re.seriesData.left,
                            "itemStyle" : {
                                normal : {
                                    label : {
                                        show : true,	//显示指标文字
                                        position : 'inner',
                                        textStyle : {
                                            fontSize : '12',
                                            fontWeight : 'bold',
                                            "fontFamily": "微软雅黑"
                                        }
                                    },
                                    labelLine : {
                                        show : false	//不显示指标线
                                    }
                                }
                            }
                        },
                        {
                            "name":re.seriesName,
                            "type":"pie",
                            "radius" : ["45%", "60%"],
                            "selectedMode": 'single',
                            "x": '60%',
                            "width": '35%',
                            "funnelAlign": 'right',
                            "data":re.seriesData.right,
                            "itemStyle" : {
                                normal : {
                                    label : {
                                        show : true,	//显示指标文字
                                        position : 'outter',
                                        textStyle : {
                                            fontSize : '12',
                                            fontWeight : 'bold',
                                            "fontFamily": "微软雅黑"
                                        },
                                        formatter : '{b}: {c}'+re.unit+'({d}%)'
                                    },
                                    labelLine : {
                                        show : true	//显示指标线
                                    }
                                }
                            }
                        }
                    ];
                }
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
                var legendData = [];

                var seriesName = "";
                var seriesDataLeft = [];
                var seriesDataRight = [];

                var unit = "";

                var regex = /\([^\)]+\)/g;
                for (var i = 0; i < data.length; i++) {
                    //第一行为表头
                    if (i == 0) {
                        //数据指标名称
                        seriesName = data[i].value || "";

                        var v = regex.exec(seriesName);
                        if(v && v[0]){
                            unit = v[0];
                            seriesName = seriesName.split(v)[0] || "";
                        }
                        
                        continue;
                    }//end if (i == 0)
                    
                    //数据指标名称
                    legendData.push(data[i].name);
                    
                    if (!isNaN(data[i].value)) {
                    	//外环
                    	seriesDataRight.push({
                        	name:data[i].name,
                        	value:data[i].value
                        });
                    }else{
                    	//内环
                    	seriesDataLeft.push({
                        	name:data[i].name,
                        	value:parseFloat(data[i].value)	
                        });
                    }
                }
                var re = {
                    legendData : legendData,
                    seriesName : seriesName,
                    seriesData :{
                    	left:seriesDataLeft,
                    	right:seriesDataRight
                    },
                    unit : unit
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };


    return EChartPieNesting;
});