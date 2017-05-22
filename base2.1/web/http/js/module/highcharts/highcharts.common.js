/**
 * highchart的公共借口
 *
 * Created by lmy on 2016/4/10
 */
define(function(seaRequire, exports, module) {

    /**
     * Highchart 包装器
     *
     * @constructor
     */
    var myHighCharts = (function(){

        /**
         * 获取图表对象
         * @param container
         *          容器
         * @returns {*}
         */
        var getChart = function(container){
            if(!container || container == ""){
                console.log("消息提示：没有指定容器ID!");
                return null;
            }
            var dom = document.getElementById(container);
            if(!dom){
                console.log("消息提示：无法找到指定容器【"+container+"】ID!");
                return null;
            }
            return dom;
        };

        return {
            getChart:getChart
        };
    })();

    /**
     * 工具类
     */
    var Util = (function(){

        /**
         * 设置容器的宽度和高度
         * @param $container
         * @param width
         * @param height
         */
        var setContainerWidAndHei = function($container,width,height){
            $container && $container.css({
                width:width,
                height:height
            });
        };

        return {
            setContainerWidAndHei:setContainerWidAndHei
        };
    })();

    /**
     * ajax请求
     */
    var Ajax = (function(){

        var getJsonData = function(url,callback){
            if(!url || url == ""){
                console.log("消息提示：未指定json数据位置！");
                callback && callback(null);
                return;
            }

            $.getJSON(url, function(data){
                if(data.UTF8Encoding === true){
                    // 压缩后的地图数据必须使用 decode 函数转换
                    callback(echarts.util.mapData.params.decode(data));
                }else{
                    callback && callback(data);
                }
            });
        };

        return {
            getJsonData:getJsonData
        };
    })();


    /**
     * 主题
     *
     */
    var theme= {
        gray: {
            colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
            chart: {
                backgroundColor: {
                    linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                    stops: [
                        [0, '#2a2a2b'],
                        [1, '#3e3e40']
                    ]
                },
                style: {
                    fontFamily: "'Unica One', sans-serif"
                },
                plotBorderColor: '#606063'
            },
            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                }
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                }
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'

                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#B0B0B3'
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                candlestick: {
                    lineColor: 'white'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                itemStyle: {
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                }
            },
            credits: {
                style: {
                    color: '#666'
                }
            },
            labels: {
                style: {
                    color: '#707073'
                }
            },

            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },

            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },

            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: '#505053',
                    stroke: '#000000',
                    style: {
                        color: '#CCC'
                    },
                    states: {
                        hover: {
                            fill: '#707073',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: '#000003',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },

            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                },
                xAxis: {
                    gridLineColor: '#505053'
                }
            },

            scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
            },

            // special colors for some of the
            legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
            background2: '#505053',
            dataLabelsColor: '#B0B0B3',
            textColor: '#C0C0C0',
            contrastTextColor: '#F0F0F3',
            maskColor: 'rgba(255,255,255,0.3)',

        }




}





    return {
        myHighCharts:myHighCharts,
        Util:Util,
        Ajax:Ajax,
        theme:theme
    };
});