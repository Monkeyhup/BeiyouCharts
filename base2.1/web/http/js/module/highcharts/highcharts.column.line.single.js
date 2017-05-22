/**
 * highcharts 3d单柱形图
 *
 * Created by lmy 2016/4/10
 */
define(function(require, exports, module) {

    var common = require("./highcharts.common");

    /**
     *
     * @constructor
     */
    var HighChartsCoulmnline = function(){
        this.option = {
            chart: {
                backgroundColor:'#ffffff',
                zoomType: 'xy'
            },
            plotOptions: {
                column: {
                    color:'#7cb5ec'
                },
                spline: {
                    color: '#000000',
                    dashStyle:'Solid',
                    marker:{
                        symbol:'circle'
                    }
                }
            },
            title: {
                text: '',
                style: {
                    "fontSize":"18px",
                    "fontWeight": "bold"
                }
            },
            xAxis: {
                categories: [],
                gridLineWidth: 0,
                crosshair: true
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '',
                    gridLineWidth:1,
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: '',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '',
                    gridLineWidth:1,
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x:120,
                verticalAlign: 'top',
                y: 60,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            credits:{
                enabled:false
            },
            series: [{
                name: '',
                yAxis: 1,
                data: [],
                tooltip: {
                    valueSuffix: ''
                }
            }, {
                name: '',
                data: [],
                tooltip: {
                    valueSuffix: ''
                }
            }]

        };
    };

    /**
     *
     * @type {{}}
     */
    HighChartsCoulmnline.prototype = {
        init:function(config){
            var that = this;
            config = $.extend({},config);
            common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);

            // 基于准备好的dom，初始化highcharts图表
            var myChart = common.myHighCharts.getChart(config.container);
            if(config.container!=null){
                this.getOptionFromConfig(config,function(){
                    if(config.option){
                        that.option = $.extend(true,that.option,config.option || {});
                    }
                    $(function () {
                        $(myChart).highcharts(that.option);
                        //$(myChart).highcharts(common.theme.gray);
                    });
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

                    $.extend(that.option.xAxis,{
                        categories: re.xAxisData,
                        crosshair: true

                    });
                    $.extend(that.option.yAxis,[{
                        labels: {
                            format: '{value}'+re.units[0],
                            gridLineWidth:1,
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: re.series[0].name,
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        }
                    }, { // Secondary yAxis
                        title: {
                            text: re.series[1].name,
                            style: {
                                color: Highcharts.getOptions().colors[0]
                            }
                        },
                        labels: {
                            format: '{value}'+re.units[1],
                            gridLineWidth:1,
                            style: {
                                color: Highcharts.getOptions().colors[0]
                            }
                        },
                        opposite: true

                    }]);
                    $.extend(that.option.series,[
                        {
                            name: re.series[0].name,
                            type: 'column',
                            data: re.series[0].data,
                            tooltip: {
                                valueSuffix: re.units[0]
                            }

                        }, {
                            name: re.series[1].name,
                            type: 'spline',
                            yAxis: 1,
                            data: re.series[1].data,
                            tooltip: {
                                valueSuffix: re.units[1]
                            }
                        }
                    ]);
                    $.extend(that.option.title,{
                        text:"2008-2012全国“十一”旅游收入"
                    });

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
            if(data && data != null && data[0]){
                var data2 = data[0].name;

                var heads = [];		//头部
                var bodys = [];		//同一年份不同指标分组
                var titleName = data.title;

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
                var units = [];
                if(heads.length > 1){
                    //1.取单位
                    for ( var c = 1; c < heads.length; c++) {
                        var unit = heads[c];
                        var v = /\([^\)]+\)/g.exec(unit);
                        if(v && v[0]){
                            units.push(v[0]);
                        }
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
                    titleName : titleName,
                    series : series,
                    units : units
                };

                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }

    };


    return HighChartsCoulmnline;
});