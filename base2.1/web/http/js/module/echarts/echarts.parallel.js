/**
 * echart平行线图
 *
 * Created by lmy on 2016/5/9
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartParrallel = function(){
        var lineStyle = {
            normal: {
                width: 1,
                opacity: 0.5
            }
        };
        this.option = {
            backgroundColor: '#404a59',
            legend: {
                bottom: 30,
                data: [],
                itemGap: 20,
                textStyle: {
                    color: '#fff',
                    fontSize: 14
                }
            },
            tooltip: {
                padding: 10,
                backgroundColor: '#222',
                borderColor: '#777',
                borderWidth: 1,
                formatter: function (obj) {
                    var value = obj[0].value;
                    return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                        + obj[0].seriesName + ' ' + value[0] + '日期：'
                        + value[7]
                        + '</div>'
                        + schema[1].text + '：' + value[1] + '<br>'
                        + schema[2].text + '：' + value[2] + '<br>'
                        + schema[3].text + '：' + value[3] + '<br>'
                        + schema[4].text + '：' + value[4] + '<br>'
                        + schema[5].text + '：' + value[5] + '<br>'
                        + schema[6].text + '：' + value[6] + '<br>';
                }
            },
            // dataZoom: {
            //     show: true,
            //     orient: 'vertical',
            //     parallelAxisIndex: [0]
            // },
            parallelAxis: [],
            visualMap: {
                show: true,
                min: 0,
                max: 150,
                dimension: 1,
                inRange: {
                    color: ['#d94e5d','#eac736','#50a3ba'].reverse(),
                }
            },
            parallel: {
                left: '5%',
                right: '18%',
                bottom: 100,
                parallelAxisDefault: {
                    type: 'value',
                    name: 'AQI指数',
                    nameLocation: 'end',
                    nameGap: 20,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#aaa'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#777'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                }
            },
            series: []
        };
    };

    /**
     *
     * @type {{}}
     */
    EChartParrallel.prototype = {
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
                    that.option.parallelAxis = re.parallelAxisData;
                    that.option.legend.data=re.legendData;
                    that.option.series=[];
                    for(var i=0;i<re.legendData.length;i++){
                        that.option.series.push({
                            "name":re.legendData[i],
                            "type": "parallel",
                            "lineStyle": "lineStyle",
                            "data":re.seriesData[i]
                        })
                    }
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
            if(data && data != null) {
                var DataSum = data.length;    //数据个数
                var children2Sum = data[0].children[0].children.length; //children2数据个数
                var children1Sum = data[0].children.length;  //children1数据个数
                var schema = [];                         //存储x轴数据(index,text)
                var legendData = [];                    //储存legendData
                var seriesData = [];                      //储存serierData
                var level = [];                           //储存level type
                var parallelAxisData = [];                //储存parallelAxisData
                //x轴数据
                for (var i = 0; i < children2Sum; i++) {
                    schema.push({
                        "index": i,
                        "text": data[0].children[0].children[i].name
                    });
                }

                //构建legendData、seriesData
                for (var k = 0; k < DataSum; k++) {
                    var seriesData1 = [];//储存children1
                    //legend数据
                    legendData.push(data[k].name);
                    /* console.log(legendData);*/
                    for (var i = 0; i < children1Sum; i++) {
                        //储存children2数据
                        var seriesData2 = [];//储存children2数据[1,55,9,56,0.46,18,6,"良"]
                        seriesData2.push(data[k].children[i].date);
                        for (var j = 0; j < children2Sum; j++) {
                            seriesData2.push(data[k].children[i].children[j].value);
                            if (j == children2Sum - 1) {
                                if (level.indexOf(data[k].children[i].children[j].value) == -1) {
                                    level.push(data[k].children[i].children[j].value);
                                }

                            }
                        };
                        seriesData1.push(seriesData2);
                    }
                    seriesData.push(seriesData1);
                };
                //构建parallelAxis
                parallelAxisData.push({
                    "dim":0,
                    "name":"日期",
                    "inverse": "true",
                    "max": "children2Sum",
                    "nameLocation": "start"
                });
                for(var i=1;i<children2Sum;i++){
                    parallelAxisData.push({
                        "dim":i,
                        "name":schema[i-1].text,
                    })
                };
                parallelAxisData.push({
                    "dim":children2Sum,
                    "name":schema[children2Sum-1].text,
                    "type": "category",
                    "data": level
                });


                var re = {
                    schema:schema,
                    legendData : legendData,
                    seriesData : seriesData,
                    parallelAxisData:parallelAxisData,
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };

    return EChartParrallel;
});