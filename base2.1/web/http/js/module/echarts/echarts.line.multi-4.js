/**
 * echart多折线图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartLineMulti = function(){
        this.option = {
            //color:['#fd9902','#0000ff'],
            color:['#7875a4','#1587af'],
            title:{
                show: true,
                text : ''

            },
            tooltip: {
                show: true,
                "trigger": "axis",
                "axisPointer": {
                    "type": "line"
                }
            },
            "grid": {
                "borderWidth": 0,
                "containLabel": true
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                top:"5%",
                left:"right",
                data:[''],
                "textStyle": {
                    "fontSize": 12,
                    "fontFamily": "微软雅黑",
                    "color": "#000000",
                    "fontWeight": "bold"
                },
                "selectedMode": true,
                "show": true
            },
            xAxis : [
                {
                    type : 'category',
                    data : [],  //数据
                    "axisLabel": {
                        "rotate": 0,
                        "interval": "auto",
                        "textStyle": {
                            "fontSize": 12,
                            "fontFamily": "微软雅黑",
                            "color": "#000000",
                            "fontWeight": "bold"
                        }
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#000000"
                        }
                    },
                    positionOffset:{
                        x:0,
                        y:0
                    },
                    "isShowXAxisText" : false
                }
            ],
            yAxis : [
                {
                    splitArea:{
                        show:true,
                        areaStyle:{color:["gray","white"],
                            opacity:0.3
                        }
                    },
                    type : 'value',
                    "axisLabel": {
                        "textStyle": {
                            "fontSize": 12,
                            "fontFamily": "微软雅黑",
                            "color": "#000000",
                            "fontWeight": "bold"
                        },
                        "formatter": "{value}"
                    },
                    "nameTextStyle": {
                        "fontSize": 12,
                        "fontFamily": "微软雅黑",
                        "color": "#000000",
                        "fontWeight": "bold"
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#000000"
                        }
                    },
                    name:""     //数据
                }
            ],
            series : [
                {
                    "name":"",
                    "type":"line",
                    "data":[]   //数据
                }
            ]
        };
    };
    /**
     *
     * @type {{}}
     */
    EChartLineMulti.prototype = {
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
                    //增加自定义x轴(必须放在getOptionFromConfig后面)
                    that.appendXAxis($("#"+config.container),config,that.getRotateFromConfig(config));
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

                    that.option.title={
                        show: true,
                        text : "全国大陆总人口" ,
                        left : "center",
                        "top" : "0"
                    }

                    $.extend(that.option.xAxis[0],{
                        type : 'category',
                        data : re.xAxisData
                    });
                    $.extend(that.option.yAxis[0],{
                        name : re.unit
                    });
                    
                    that.option.series = [];
                    
                    var positions = ["top","bottom","left","right"];
                    that.option.yAxis = [
                        {
                            splitArea:{
                                show:true,
                                areaStyle:{color:["gray","white"],
                                    opacity:0.3
                                }
                            },
                            type : 'value',
                            "axisLabel": {
                                "textStyle": {
                                    "fontSize": 12,
                                    "fontFamily": "微软雅黑",
                                    "color": "#000000",
                                    "fontWeight": "bold"
                                },
                                "formatter": "{value}"
                            },
                            "nameTextStyle": {
                                "fontSize": 12,
                                "fontFamily": "微软雅黑",
                                "color": "#000000",
                                "fontWeight": "bold"
                            },
                            "splitLine": {
                                "show": false
                            },
                            "axisLine": {
                                "lineStyle": {
                                    "color": "#000000"
                                }
                            },
                            "min":getYaxisDataMin(re.series[0].data)<getYaxisDataMin(re.series[1].data)
                             ?getYaxisDataMin(re.series[0].data):getYaxisDataMin(re.series[1].data),
                            "max":getYaxisDataMax(re.series[0].data)>getYaxisDataMax(re.series[1].data)?getYaxisDataMax(re.series[0].data):getYaxisDataMax(re.series[1].data),

                            //"min": function(){
                            //    var datamin=getYaxisDataMin(re.series[0].data);
                            //    for(var i=0; i< re.series.length;i++){
                            //        if(datamin>getYaxisDataMin(re.series[i].data)){
                            //            datamin=getYaxisDataMin(re.series[i].data);
                            //        }
                            //    }
                            //    return datamin;
                            //
                            //}()

                        }
                    ];
                    for(var i=0; i< re.series.length;i++){


                    	that.option.series.push({
                            "markPoint":{
                                "data":[
                                    {type:'max',name:'最大值'},
                                    {type:'min',name:'最小值'}]
                            },
                    		"name":re.series[i].name,
                            "type":"line",
                            "data":re.series[i].data,
                            "itemStyle": {
                            	"normal": {
                                    "label": {
                                        "show": true,
                                        "position": "bottom",
                                        "textStyle": {
                                            "color":"#000000",
                                            "fontSize": 12,
                                            "fontFamily": "微软雅黑",
                                            "fontWeight": "bold"
                                        }
                                    }
                                }
                            }
                    	});
                    }
                }
            }
            //function getYaxisDataMin(data) {
            //    //for(var m=0;m<data.length;m++){
            //    //    data[m]=[];
            //    //}
            //    var min = data[1][1];
            //    var a;
            //    var b;
            //    for (var i =1; i < data.length; i++) {
            //        for(var j=1;j<data.length;j++) {
            //            if (min > data[i][j]) {
            //                min = data[i][j];
            //            }
            //        }
            //    }
            //    if (min < 1) {
            //        min = 0;
            //        return min;
            //    }
            //    a = Math.log10(min) + 1;
            //    if (a < 3) {
            //        min = min - (min % 10);
            //        return min;
            //    } else {
            //        b = Math.pow(10, a - 2);
            //        min = min - (min % b);
            //    }
            //
            //    return min;
            //}
            function getYaxisDataMin(data) {
                var min = data[0];
                var a;
                var b;
                for (var i = 1; i < data.length; i++) {
                    if (min > data[i]) {
                        min = data[i];
                    }
                }
                if (min < 1) {
                    min = 0;
                    return min;
                }
                a = Math.log10(min) + 1;
                if (a < 3) {
                    min = min - (min % 10);
                    return min;
                } else {
                    b = Math.pow(10, a - 2);
                    min = min - (min % b);
                }

                return min;
            }
            function getYaxisDataMax(data){           //保证标记不超过纵轴
                var max=data[0];var a; var b;
                for(var i=1;i<data.length;i++)
                {
                    if(max<data[i]){
                        max=data[i];
                    }
                }
                if(max<1){
                    return 1.1*max;
                }
                a=Math.log10(max)+1;             //a为位数
                if(a<3)
                {
                    max=max-(max%10)+10;
                    return 1.1*max;
                }else{
                    b=Math.pow(10,a-2);
                    max=max-(max%b)+b;
                }
                return 1.1*max;
            }
        },

        getDataFromConfig:function(url,callback){
        	var that = this;
            common.Ajax.getJsonData(url,function(data){
            	that.getDataFromData(data,callback);
            });
        },
        getDataFromData:function(data,callback){
        	if(data && data != null && data[0]){
        		var data2 = data[0].name;
        		var titleName=data.title;
                var heads = [];		//头部
                var bodys = [];		//同一年份不同指标分组
                		
                //数据转换
                var regex = /\([^\)]+\)/g;
                for (var i = 0; i < data2.length; i++) {
                    var rowData = data2[i];
                    
                    for(var j=0;j<rowData.length;j++){
                    	//如果是第一行，则为表头
                    	if(i == 0){
                    		heads.push(rowData[j]);
                    	}else{
                    		if(!bodys[j]){
                    			var arr = [];
                    			arr.push(rowData[j]);
                    			bodys[j] = arr;
                    		}else{
                    			bodys[j].push(rowData[j]);
                    		}
                    		
                    	}
                    }
                }

                var xAxisData = [];
                var legendData = [];
                var series = [];
                var unit = "";
                if(heads.length > 1){
                	//1.取单位
                	unit = heads[1];
                	var v = regex.exec(unit);
                    if(v && v[0]){
                        unit = v[0];
                    }
                    
                    //去掉头部单位
                    for(var b=0;b<heads.length;b++){
                    	///\([^\)]+\)/g 设置为局部，防止全局事件
                    	var v = /\([^\)]+\)/g.exec(heads[b]);
                        if(v && v[0]){
                            heads[b] = heads[b].split(v)[0] || heads[b];
                        }
                    }
                    

                    //2.取图例
                    for(var k=1;k<heads.length;k++){
                    	legendData.push(heads[k]);
                    }
                    
                    //3.取x轴
                    xAxisData = bodys[0];
                    
                    //4.取数据
                    for(var m=1;m<bodys.length;m++){
                    	series.push({
                    		name:heads[m],		//取对比的年份
                    		data:bodys[m]		//取指定年份对应的数据
                    	});
                    }
                }//end if(heads.length > 1)
                
               
                var re = {
                    xAxisData : xAxisData,
                    legendData : legendData,
                    series : series,
                    titleName:titleName,
                    unit : unit
                };
                
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        },
        appendXAxis:function($container,config,angle){
            var that = this;
            if(that.option.xAxis[0].isShowXAxisText) {
                //找到出图容器的父节点对象
                var $containerParent = $container.parent();
                if ($containerParent.find(">#x1").length > 0) {
                    //如果存在div,清除
                    $containerParent.find(">#x1").remove();
                }
                //重新添加
                var html = "<div class=\"x1\" id=\"x1\" style=\"width:100%;position:relative; left:9%;top:-50px;display:none\">";
                $container.after(html);

                //设置xAxisLabel
                $("#x1").html("").css({"display": "block", "height": "20px"});

                var xLabelTextNum = parseInt(that.option.xAxis[0].data.length);//x轴字段数量
                var xLabelText = that.option.xAxis[0].data;
                var xLabelWide = config.width * 0.81 / xLabelTextNum;
                var xLabelTextSize = that.option.xAxis[0].axisLabel.textStyle.fontSize;
                var xLabelTextColor = that.option.xAxis[0].axisLabel.textStyle.color;
                var xLabelTextfontFamily = that.option.xAxis[0].axisLabel.textStyle.fontFamily;

                for (var i = 0; i < xLabelTextNum; i++) {
                    $("#x1").append("<div class='x1_" + i + "' id='x1_" + i + " ' style=' position:relative;border: 0px solid #a0ff4f;width: " + xLabelWide + "px;float:left;'></div>");
                }
                //为x轴字段添加span
                for (var i = 0; i < xLabelTextNum; i++) {
                    $(".x1_" + i).append("<div class='x1_text' id='x1_text' style='border: 0px solid #a0ff4f;height:" + (parseInt(xLabelTextSize) + 8) + "px;width: 500px;position:relative;font-size: " + xLabelTextSize + "px;color:" + xLabelTextColor + ";font-family:" + xLabelTextfontFamily + ";display: inline-block;-webkit-transform: rotate(" + angle + "deg);overflow:hidden;float:left;'>" + xLabelText[i] + "</div>")
                }

                //取得x轴的偏移量
                var xLabelPositionOffset = that.option.xAxis[0].positionOffset;
                //绘制x轴的偏移量
                if (xLabelPositionOffset.x != "") {
                    $("#x1 .x1_text").css("left", xLabelPositionOffset.x + "px");
                }
                if (xLabelPositionOffset.y != "") {
                    $("#x1 .x1_text").css("top", xLabelPositionOffset.y + "px");
                }
            }
        },
        getRotateFromConfig:function(config){
            var angle = 0;  //默认为0
            if(config.option && config.option.xAxis &&　config.option.xAxis[0]){
                if(config.option.xAxis[0].axisLabel && config.option.xAxis[0].axisLabel.rotate > -180){
                    //取得当前的旋转角度
                    angle = config.option.xAxis[0].axisLabel.rotate;
                }
            }
            return angle;
        }
    };


    return EChartLineMulti;
});