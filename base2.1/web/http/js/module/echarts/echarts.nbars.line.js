/**
 *     echart多柱图+折线图组合
 * Created by lmy on 2017/3/15.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");


    /**
     *
     * @constructor
     */
    var EChartNbarsLine = function(){
        this.currentColors = [];



        this.option = {
            color : ['#37648B', '#FDB94E', "#ED6856",
                "#7bbfea", "#87cefa", "#da70d6",
                "#32cd32", "#6495ed", "#ff69b4",
                "#ba55d3", "#cd5c5c", "#ffa500",
                "#40e0d0", "#1e90ff", "#ff6347",
                "#7b68ee", "#00fa9a", "#ffd700",
                "#6699FF", "#ff6666", "#3cb371",
                "#b8860b", "#30e0e0"],
            tooltip: {
                show: true,
                "trigger": "axis",
                "axisPointer": {
                    "type": "shadow"
                }
            },
            "grid": {
                "borderWidth": 0,
                "containLabel": true
            },
            "legend": {
                "show": true,
                data:[''],
                "textStyle": {
                    "fontSize": 12,
                    "fontFamily": "微软雅黑",
                    "color":[],
                    "fontWeight": "bold"
                },
                /*"selectedMode": true,*/
                orient : 'vertical',
                right: '0'
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
                            "color": "#793883",
                            "fontWeight": "bold"
                        }
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#666666"
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
                    type : 'value',
                    "axisLabel": {
                        "textStyle": {
                            "fontSize": 12,
                            "fontFamily": "微软雅黑",
                            "color": "#26C0C0",
                            "fontWeight": "bold"
                        },
                        "formatter": "{value}"
                    },
                    "nameTextStyle": {
                        "fontSize": 12,
                        "fontFamily": "微软雅黑",
                        "color": "#26C0C0",
                        "fontWeight": "bold"
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#26C0C0"
                        }
                    },
                    name:""     //数据
                }
            ],
            series : [
                {
                    "name":"",
                    "type":"bar",
                    "data":[]   //数据
                },
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
    EChartNbarsLine.prototype = {
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
        getOptionFromConfig:function(config,callback) {
            var that = this;
            if (typeof config.data == "object" && config.data != null) {
                this.getDataFromData(config.data, function (re) {
                    //console.log(re);
                    goTo(re);
                    callback && callback();
                });
            } else {
                this.getDataFromConfig(config.url, function (re) {

                    goTo(re);
                    callback && callback();
                });
            }

            //
            function goTo(re) {
                if(re && re != null){
                    //获取颜色参数
                    var colors = [];
                    var colorLen = that.option.color.length;
                    for(var j=0,len=re.series.length;j<len;j++){
                        colors.push(that.option.color[j%colorLen]);
                    }
                    //保存当前colors
                    that.currentColors = $.extend([],colors);
                    that.option.colors = colors;

                    //图例
                    that.option.legend = {
                        "data" : re.legendData,
                        "selectedMode": true,
                        orient : 'vertical',
                        right: '0'
                    }

                    //标题
                    that.option.title = {
                        show :true,
                        text :'2008-2012十一旅游人数',
                        left : 'center',
                        top : '0'

                    }

                    //x轴
                    $.extend(that.option.xAxis[0],{
                        type : 'category',
                        data : re.xAxisData
                    });
                    //求y轴最大最小值
                    var allData=[];
                    for(var i=0;i<re.series.length-1;i++){
                        for(var j=0;j<re.series[i].data.length;j++){
                            allData.push(re.series[i].data[j]);
                        }
                    }
                    var yAxMin=getYaxisDataMin(allData);
                    var yAxMax=getYaxisDataMax(allData);
                    //y轴
                    that.option.yAxis = [];
                    for ( var j = 0; j < re.series.length; j++) {
                        var color = colors[j];
                        if(j==0){
                            that.option.yAxis.push({
                                type : 'value',
                                name : re.series[i].name,
                                "axisLabel": {
                                    "textStyle": {
                                        "fontSize": 12,
                                        "fontFamily": "微软雅黑",
                                        "color": color,
                                        "fontWeight": "bold"
                                    },
                                    "formatter": "{value}"
                                },
                                "min" : yAxMin,
                                "max" : null,
                                "nameTextStyle": {
                                    "fontSize": 12,
                                    "fontFamily": "微软雅黑",
                                    "color": color,
                                    "fontWeight": "bold"
                                },
                                "splitLine": {
                                    "show": false
                                },
                                "axisLine": {
                                    "lineStyle": {
                                        "color": color
                                    }
                                },
                                name:re.units[j]     //数据

                            });
                        }
                        else if(j==re.series.length-1){
                            that.option.yAxis.push({
                                type : 'value',
                                "axisLabel": {
                                    "textStyle": {
                                        "fontSize": 12,
                                        "fontFamily": "微软雅黑",
                                        "color": color,
                                        "fontWeight": "bold"
                                    },
                                    "formatter": "{value}"
                                },
                                "nameTextStyle": {
                                    "fontSize": 12,
                                    "fontFamily": "微软雅黑",
                                    "color": color,
                                    "fontWeight": "bold"
                                },
                                "splitLine": {
                                    "show": false
                                },
                                "axisLine": {
                                    "lineStyle": {
                                        "color": color
                                    }
                                },
                                name:re.units[j]     //数据

                            });
                        }else{
                            that.option.yAxis.push({
                                type : 'value',

                                "axisLabel": {
                                    "show" :false
                                },
                                "min" : yAxMin,
                                "max" : yAxMax,
                                "splitLine": {
                                    "show": false
                                },
                                "axisLine": {
                                    "show" : false,
                                    "lineStyle": {
                                        "color": color
                                    }
                                }

                            });
                        }

                    }

                    //数据
                    that.option.series = [];
                    for(var i=0; i< re.series.length;i++){
                       /* var color = that.option.colors[i];*/
                        var type = (i==re.series.length-1) ? 'line' : 'bar';

                        var unit = (re.units[i] ? re.units[i] : '');
                        that.option.series.push({
                            "name" : re.legendData[i],
                            "type" : type,
                            "data" : re.series[i].data,
                            "yAxisIndex" : (type=='bar')?0:(re.series.length-1),
                            "itemStyle" : {
                                "normal": {
                                    "barBorderWidth": 2,
                                    "barBorderColor": color,
                                    "barBorderRadius": [0,0,0,0],
                                    "label": {
                                        "show": true,
                                        "position": 'top',
                                        "textStyle": {
                                            "fontSize": 12,
                                            "fontFamily": "微软雅黑",
                                            "fontWeight": "bold"
                                        },
                                        formatter : '{c}'
                                    }
                                }
                            }
                        });
                    }
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
                        var min = data[0];
                        for(var i=1;i<data.length;i++)
                        {
                            if(max<data[i]){
                                max=data[i];
                            }
                            if(min>data[i]){
                                min=data[i];
                            }
                        }
                        if(0<max<0.5){
                            max=0.5;
                        }else if(0.5<max<1){
                            max=1;
                        }
                        a= Math.ceil(max/10+1);             //a为位数
                        if(a<3)
                        {
                            max=max-(max%10)+10;
                            return 1.1*max;
                        }else{
                            b=Math.pow(10,a-2);
                            max=max-(max%b)+b;
                        }
                        return max;
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
            if(data && data != null && data[0]){
                var data2 = data[0].name;
                var titleName=data.title;

                var heads = [];		//头部
                var noheads = [];   //无单位头部
                var bodys = [];		//同一年份不同指标分组

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
                var unit = [];
                if(heads.length > 1){
                    //1.取单位
                    for(var b= 0, c=1;c<heads.length;b++,c++){
                        var v = /\([^\)]+\)/g.exec(heads[c]);
                        if(v && v[0]){
                            unit[b] = v[0];
                        }
                    }


                    //去掉头部单位
                    for(var b=0;b<heads.length;b++){
                        ///\([^\)]+\)/g 设置为局部，防止全局事件
                        var v = /\([^\)]+\)/g.exec(heads[b]);
                        if(v && v[0]){
                            noheads[b] = heads[b].split(v)[0] || heads[b];
                        }
                    }


                    //2.取图例
                    for(var k=1;k<noheads.length;k++){
                        legendData.push(noheads[k]);
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
                    titleName:titleName,
                    series : series,
                    units : unit
                };

                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };


    return EChartNbarsLine;
});