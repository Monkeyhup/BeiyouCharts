/**
 * highcharts 单色调饼图
 *
 * Created by lmy 2016/4/10
 */
define(function(require, exports, module) {

    var common = require("./highcharts.common");

    /**
     *
     * @constructor
     */
    var HighchartsPieMonochrome = function(){
        this.option = {
            chart: {
                type: 'pie',
                backgroundColor: '#FFFFFF',
/*                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }*/
            },
            title: {
                text: "2015年，在全国972个地表水监测点中",
                style:{
                    "color" : "#333333",
                    "fontsize" : "24px",
                    "fontfamily":"黑体",
                    "font-weight":"bold"
                }
            },
            credits:{
                enabled:false
            },
            plotOptions: {
                pie: {
                    innerSize:0, //内半径
                    size:'55%', //外半径
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 45,
                    showInLegend: true,
                    dataLabels: {
                        enabled: true,
                        style:{
                            fontSize:'11px',
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor)|| 'black'
                        },
                        format:'<b>{point.name}</b>:{point.percentage:.1f}%'  //扇形标注文字的显示格式
                    },
                    //colors:"black"

                }
            },
            legend:{
                enabled:true,
                align:"center",
                itemStyle: {
                    color: '#000000',
                    fontWeight:'bold'
                },
               itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#808080'
                }
            },
            series: [{
                type: 'pie',
                data:[]
            }],
            tooltip:{
                pointFormat:'{series.name}:<b>{point.percentage:.1f}%</b>'//悬浮显示的格式
            }
        };
    };

    /**
     *
     * @type {{}}
     */
    HighchartsPieMonochrome.prototype = {
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
                    $.extend(that.option.tooltip,[
                        {
                            valueSuffix:'re.unit'
                        }
                    ]);
                    $.extend(that.option.series,[
                        {
                            name:re.seriesName,
                            data: re.seriesData
                        }
                    ]);

                    Highcharts.getOptions().plotOptions.pie.colors=(function(){
                        //获取颜色
                        var colors = [];
                        var colorLen = re.legendData.length,
                            base = Highcharts.getOptions().colors[0];
                        for(var i = 0,len=colorLen;i<len;i++){
                            colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
                        }
                        return colors;
                    }());
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
                //var xAxisData = [];
                var legendData = [];

                var seriesName = "";
                var seriesData = [];

                var unit = "";

                var regex = /\([^\)]+\)/g;
                for (var i = 0; i < data.length; i++) {
                    if (!isNaN(data[i].value)) {
                        seriesData.push({
                            name:data[i].name,
                            y:data[i].value
                        });
                        legendData.push(data[i].name);
                    }

                    //第一行为表头
                    if (i == 0) {
                        //数据指标名称
                        seriesName = data[i].value || "";

                        var v = regex.exec(seriesName);
                        if(v && v[0]){
                            unit = v[0];
                            seriesName = seriesName.split(v)[0] || "";
                        }

                    }//end if (i == 0)
                }

                var re = {
                    //xAxisData : xAxisData,
                    legendData : legendData,
                    seriesName : seriesName,
                    seriesData : seriesData,
                    unit : unit
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }

    };


    return HighchartsPieMonochrome;
});