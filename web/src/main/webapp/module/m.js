/**
 * Created by jinn on 2016/2/18.
 */
define(function (require, exports, module) {

    var Layer = require("layer");
    var events = require("component/app.events");
    var regionSet = require("regionset");
    var SpatialQuery = require("spatial.query");
    var Idens = require("idens");
    var defaultRegions = [],currRegions,selRegions = [], currLevel,catalogid;
    var query = require("query");
    var allData = [];

    myDataConfig = new dataConfig();
    console.log(myDataConfig.flag);
    var data;
    var map = Layer.getMap();
    var rightChart;
    var config;
    var currRegions = [];
    var currentLevel =2; //当前区划级别
    /**
     * 获取配置
     * @param callback
     */
    var getConfig = function (callback) {
        if (config) {
            callback && callback(config);
            return
        } else {
            require.async("../config", function (re) {
                config = re;
                callback && callback(re);
            });
        }
    };
    +function () {
        getConfig(function (re) {
            SGIS.UI.addLoadingBar("正在加载数据...", "#map-container");

            Layer.init(re, function () {
                map = Layer.getMap();

                regionSet.init(function () {

                    var bdwidth = $("body").width();
                    if (bdwidth < 400) {   //小于400的 地图放大
                        map.panTo(new SuperMap.LonLat(12630117, 4400000));
                        var zoom = map.getZoom();
                        map.zoomTo(zoom + 2);
                    }

                    SGIS.UI.clearLoadingBar();

                    setTimeout(function () {
                        $("#logo").removeClass("hide");
                    }, 400);

                });
                Idens.init(config);
            });
        });
    }();

    $(function () {
        //方向改变事件
        $(window).on("orientationchange", function (event) {
            //alert("方向是: " + event.orientation);
            resize();
        });

        $(window).resize(SGIS.Util.throttle(function () {
            resize();
        }, 200)).resize();


        $('.ui.dropdown').dropdown();
        //区域选择标签页
        $('#region-panel>div .item').tab();


        $('#second').change(function () {
            $('#chartTable').addClass('hidden');
            var regions = regionSet.getRegions();
            var currentLevel =regions[0].getLevel();
            console.log(regions);
            console.log(currentLevel);
            var idensName = $(this).val();
            var Id = "";
            for (var i = 0; i < matId.length; i++) {
                if (matId[i]['idens'] == idensName && $('#first').val() == matId[i]['father']) {
                    Id = matId[i]['matId'];
                }
            }

            var queryParm = {
                "catalog": "1",
                "indicatorCodes": [],
                "matmids": [Id],
                "parid": "",
                "regionLevel": currentLevel,
                "regions":[regions[0]],
                "reportType": "1",
                "sort": null,
                "timeRank": null
            };
            console.log(queryParm);

            $.ajax({
                method: "POST",
                url: "http://localhost:8080/data/macro/Data/Query/hasRanks",
                data: JSON.stringify(queryParm),
                contentType: 'application/json',
                success: function (re) {
                    queryParm.timeRank = re;
                    $.ajax({
                        method: "POST",
                        url: "http://localhost:8080/data/macro/data/queryext",
                        data: JSON.stringify(queryParm),
                        contentType: 'application/json',
                        success: function (re) {
                            console.log(re);
                            allData = re;
                            console.log(allData);
                            myDataConfig.setMatId(Id);
                            myDataConfig.setIdens(idensName);
                            myDataConfig.setData(re);
                            Idens.drawThematic(re);
                        }
                    });
                }
            });
        });

        $("#rtnBtn").click()

        $("#clo-iden").bind("click", function () {
            $("#indi-panel").addClass("hide");

            $("#v-toolbar").fadeIn();
        });


        //区域选择面板
        $(".item.loc").click(function () {
            regionSet.toggle();


        });

        //时间设置
        $("#tm-set").click(function () {
            regionSet.hide();//隐藏区划面板
            $("#indi-panel").addClass("hide");
            timeSetter();


        });


        //全屏
        $("#tool-full").click(function () {
            fullView();
        });
        var getTimeVal = function () {
            if ($(".range-slider").length > 0) {
                var tm = $(".range-slider").val();
                return tm.split(",");
            } else {
                return "";
            }
        };

        //清除
        $("#tool-clear").click(function () {
            $('#chartTable').addClass('hidden');
            clearAll();
            console.log(document.getElementById("second").selectedIndex);
        });

        $("#tool-cg").click(function () {
            if(document.getElementById("second").selectedIndex==0){
                alert("请选择指标");
            }
            else{
                allData = myDataConfig.getData();
                $('#chartTable').removeClass('hidden');
                console.log(myDataConfig.getCurrYear());
                var showId;
                switch (myDataConfig.getCurrYear()) {
                    case '2003':
                        showId = 2;
                        break;
                    case '2008':
                        showId = 2 + (allData.content[0].length - 3) / 2;
                        break;
                    case '2013':
                        showId = allData.content[0].length - 1;
                        break;
                    default:
                        showId = allData.content[0].length - 1;
                        break;
                }

                var area = [];
                var eValue = [];
                var KeyValue = [];

                for (var i = 0; i < allData.content.length; i++) {
                    area.push(allData.content[i][1]);
                    eValue.push(allData.content[i][showId]);
                    KeyValue.push({
                        'value': allData.content[i][showId],
                        'name': allData.content[i][1]
                    });
                }
                var myChart = echarts.init(document.getElementById('tableShow'));
                rightChart = myChart;
                var option = {
                    title: {
                        text: myDataConfig.getIdens(),
                        left: 'center',
                        textStyle:{
                            color:'white'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '20%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            'interval': 0,
                            'rotate': 60,
                            textStyle: {
                                color: 'white'
                            }
                        },
                        boundaryGap: true,
                        data: area
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                color: 'white'
                            }

                        }
                    },
                    dataZoom:[
                        {
                            type:'inside'
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#83bff6'},
                                            {offset: 0.5, color: '#188df0'},
                                            {offset: 1, color: '#188df0'}
                                        ]
                                    )
                                },
                                emphasis: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#2378f7'},
                                            {offset: 0.7, color: '#2378f7'},
                                            {offset: 1, color: '#83bff6'}
                                        ]
                                    )
                                }
                            },
                            name: myDataConfig.getIdens(),
                            data: eValue
                        }
                    ]
                };
                myChart.setOption(option);

                $('#typeSel').change(function () {
                    switch ($(this).val()) {
                        case 'pie':
                            var myChart = echarts.init(document.getElementById('tableShow'));
                            rightChart = myChart;
                            var option = {
                                title: {
                                    text: myDataConfig.getIdens(),
                                    x: 'center',
                                    textStyle:{
                                        color:'white'
                                    }
                                },
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                                },
                                series: [
                                    {
                                        name: myDataConfig.getIdens(),
                                        type: 'pie',
                                        radius: ['50%', '70%'],
                                        center: ['50%', '50%'],
                                        avoidLabelOverlap: false,
                                        data: KeyValue,
                                        label: {
                                            normal: {
                                                show: false,
                                                position: 'center'
                                            },
                                            emphasis: {
                                                show: true,
                                                textStyle: {
                                                    fontSize: '30',
                                                    fontWeight: 'bold'
                                                }
                                            }
                                        },
                                        itemStyle: {
                                            emphasis: {
                                                shadowBlur: 10,
                                                shadowOffsetX: 0,
                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            }
                                        }
                                    }
                                ]
                            };
                            myChart.setOption(option);
                            break;
                        case 'line':
                            var myChart = echarts.init(document.getElementById('tableShow'));
                            rightChart = myChart;
                            var option = {
                                title: {
                                    text: myDataConfig.getIdens(),
                                    left: 'center',
                                    textStyle:{
                                        color:'white'
                                    }
                                },
                                tooltip: {
                                    trigger: 'axis'
                                },
                                grid: {
                                    left: '3%',
                                    right: '3%',
                                    bottom: '20%',
                                    containLabel: true
                                },
                                dataZoom:[
                                    {
                                        type:'inside'
                                    }
                                ],
                                xAxis: {
                                    type: 'category',
                                    axisLabel: {
                                        'interval': 1,
                                        'rotate': 60,
                                        textStyle: {
                                            color: 'white'
                                        }
                                    },
                                    boundaryGap: false,
                                    data: area
                                },
                                yAxis: {
                                    type: 'value',
                                    axisLabel: {
                                        textStyle: {
                                            color: 'white'
                                        }
                                    }
                                },
                                series: [
                                    {
                                        type: 'line',
                                        itemStyle: {
                                            normal: {
                                                color: new echarts.graphic.LinearGradient(
                                                    0, 0, 0, 1,
                                                    [
                                                        {offset: 0, color: '#83bff6'},
                                                        {offset: 0.5, color: '#188df0'},
                                                        {offset: 1, color: '#188df0'}
                                                    ]
                                                )
                                            },
                                            emphasis: {
                                                color: new echarts.graphic.LinearGradient(
                                                    0, 0, 0, 1,
                                                    [
                                                        {offset: 0, color: '#2378f7'},
                                                        {offset: 0.7, color: '#2378f7'},
                                                        {offset: 1, color: '#83bff6'}
                                                    ]
                                                )
                                            }
                                        },
                                        name: myDataConfig.getIdens(),
                                        data: eValue
                                    }
                                ]
                            };
                            myChart.setOption(option);
                            break;
                        case 'bar':
                            var myChart = echarts.init(document.getElementById('tableShow'));
                            rightChart = myChart;
                            var option = {
                                title: {
                                    text: myDataConfig.getIdens(),
                                    left: 'center',
                                    textStyle:{
                                        color:'white'
                                    }
                                },
                                tooltip: {
                                    trigger: 'axis'
                                },
                                grid: {
                                    left: '3%',
                                    right: '3%',
                                    bottom: '20%',
                                    containLabel: true
                                },
                                dataZoom:[
                                    {
                                        type:'inside'
                                    }
                                ],
                                xAxis: {
                                    type: 'category',
                                    axisLabel: {
                                        'interval': 0,
                                        'rotate': 60,
                                        textStyle: {
                                            color: 'white'
                                        }
                                    },
                                    boundaryGap: true,
                                    data: area,
                                },
                                yAxis: {
                                    type: 'value',
                                    axisLabel: {
                                        textStyle: {
                                            color: 'white'
                                        }
                                    }
                                },
                                series: [
                                    {
                                        type: 'bar',
                                        itemStyle: {
                                            normal: {
                                                color: new echarts.graphic.LinearGradient(
                                                    0, 0, 0, 1,
                                                    [
                                                        {offset: 0, color: '#83bff6'},
                                                        {offset: 0.5, color: '#188df0'},
                                                        {offset: 1, color: '#188df0'}
                                                    ]
                                                )
                                            },
                                            emphasis: {
                                                color: new echarts.graphic.LinearGradient(
                                                    0, 0, 0, 1,
                                                    [
                                                        {offset: 0, color: '#2378f7'},
                                                        {offset: 0.7, color: '#2378f7'},
                                                        {offset: 1, color: '#83bff6'}
                                                    ]
                                                )
                                            }
                                        },
                                        name: myDataConfig.getIdens(),
                                        data: eValue
                                    }
                                ]
                            };
                            myChart.setOption(option);
                            break;
                    }
                });
            }

        });

        //图例toggle
        $("#tool-legend").click(function () {
            Idens.toggleLegend();
        });

        //边界图层颜色控制
        $("#tool-col").click(function () {
            layerColor();
        });

        //工具栏
        //行政区划标签控制
        $("#tool-lbregion").click(function () {
            layerLabel($(this));
        });


        //图表控制
        $("#chart-control").click(function () {
            if ($("#gc-panel").hasClass("hide")) {
                $("#gc-panel").removeClass("hide");
                $("#indi-panel").addClass("hide");

                $("#chart-control").addClass("hide");

                Grid.syncHeaderHeight();

            } else {
                $("#gc-panel").addClass("hide");
            }
        });

        //关闭图表
        $("#clo-gc").click(function () {
            $("#gc-panel").addClass("hide");
            $("#chart-control").removeClass("hide");
        });


        //关于
        //$("#about").popup({
        //    position:"top right",
        //    on:'click',
        //    exclusive:true,
        //    //content: ''
        //    html:'<div>技术支持:超图-北邮大数据中心</div>'
        //});

        //关于
        $("#about").click(function () {
            $('.ui.modal.about').modal("show");
        });

        //反馈
        $("#feedback").click(function () {
            location.href = "feedback.html";
        });

        //操作指南
        $("#puzzle").click(function () {
            $(".ui.modal.puz").modal("show");
        });

        //点击logo
        $("#logo").click(function () {
            if ($("#v-toolbar").css("display") == "none") {
                $("#v-toolbar").fadeIn();
            }
        });


    });


    /**
     * 窗口调整
     */
    var resize = function () {
        var height = $("body").height();
        var width = $("body").width();


        //gc面板的高度
        var gcHeight = $("#gc-panel").height();
        var gcWidth = $("#gc-panel").width();
        var gHeight = (gcHeight - 30 - 30) * 0.7;
        var cHeight = (gcHeight - 30 - 30) * 0.3;

        //$("#grid-container").css({"width":gcWidth,"height":gHeight});
        //$("#grid-container2").css({"width":gcWidth,"height":gHeight});

        //$("#grid-container").css({"height":gHeight});
        //$("#grid-container2").css({"height":gHeight});


        $("#chart-container").css({"width": gcWidth, "height": cHeight});

        $("#grid-container").css({"height": gHeight});
        //$("#grid-container2").css({"width":"90px","height":gHeight});
        //$("#grid-container").css({"width":(gcWidth-93)+"px","height":gHeight});
        //$("#grid-container2").css({"width":"93px","height":gHeight});


        $("#chart-container").css({"width": gcWidth, "height": cHeight});

        //Iden面板宽度

        var idenWidth = $("#indi-panel").width();
        var idenHeight = $("#indi-panel").height();
        var rWid = idenWidth - 55;
        var selHeight = idenHeight - 170;

        //var sumH = $("#search-head").height() + $(".ui.text.menu").height() + 7 + $("#selection-bread").height() + $("#btn-view").height() + 20;

        $("#sel-panel-idens").css({"width": rWid, "height": selHeight});
        $("#selection-bread").css({"width": rWid});


        $("#search-head").css({"width": (idenWidth - 60) + "px"});
        $("#input-iden").css("width", (idenWidth - 110) + "px");

        //var tw = $("#v-toolbar").height();
        //$("#v-toolbar").css("top",(height-tw)/2 + "px");
    };


    /**
     * 全屏显示
     */
    var fullView = function () {
        regionSet.hide();//隐藏区划面板

        $("#indi-panel").addClass("hide")

        $("#slider-wrap").fadeOut();

        $("#gc-panel").addClass("hide");

        Idens.hideLegend();   //图例隐藏

        $("#v-toolbar").fadeIn();


        if ($("#chart-control").attr("hasdata") == "yes") {
            $("#chart-control").removeClass("hide");
        }


    };


    /**
     * 区划标签控制
     */
    var layerLabel = function (that) {
        var i = that.find("i");
        var labelLayer = map.getLayersByName("lbregion")[0];
        if (i.hasClass("unhide")) { //关闭
            i.removeClass("unhide").addClass("hides");
            that.attr("title", "打开行政区划标签");
            SpatialQuery.setIsShowLable(false);

            labelLayer.setVisibility(false);
        } else {   //打开
            i.removeClass("hides").addClass("unhide");
            that.attr("title", "关闭行政区划标签");

            SpatialQuery.setIsShowLable(true);
            labelLayer.setVisibility(true);
        }
    }

    /**
     * 彩色图层
     */
    var layerColor = function () {
        var boundaryLayer = map.getLayersByName("bline")[0];
        if (boundaryLayer) {
            var features = boundaryLayer.features;
            var showColor = boundaryLayer.showcolor;

            //var op = features[0].style.fillOpacity;
            //if(op == "1"){
            //    boundaryLayer.showcolor = true;
            //}else{
            //    boundaryLayer.showcolor = false;
            //}

            if (showColor) {
                for (var i = 0, n = features.length; i < n; i++) {
                    features[i].style.fillOpacity = 0;
                    features[i].style.stroke = true;
                }
                boundaryLayer.showcolor = false;

                $(".reglab").css({"color": "rgb(0,0,0)"});
            } else {
                for (var i = 0, n = features.length; i < n; i++) {
                    features[i].style.fillOpacity = 1;
                    features[i].style.stroke = false;
                    features[i].style.fill = true;
                }
                boundaryLayer.showcolor = true;

                $(".reglab").css({"color": "rgb(0,0,0)"});
            }

            boundaryLayer.redraw();
        }

    };

    /**
     * 清除全部
     */
    var clearAll = function () {
        SGIS.UI.clearLoadingBar();

        Idens.clearAllThematic();  //清除专题图
        // Grid.clearAll();           //清除表格
        // Chart.clearAll();          //清除图表

        //$("#chart-control").css("display","none");


        document.getElementById("first").selectedIndex = 0;
        document.getElementById("second").length = 1;

        Idens.clearAllSel();    //重置指标状态

        $("#slider-wrap").fadeOut();

        $("#gc-panel").addClass("hide");

        $("#indi-panel").addClass("hide");

        $("#chart-control").attr("hasdata", "no");
        $("#chart-control").addClass("hide");


        var boundaryLayer = map.getLayersByName("bline")[0];
        if (boundaryLayer) {
            if (boundaryLayer.showcolor) {
                $(".reglab").css({"color": "rgb(0,0,0)"});
            } else {
                $(".reglab").css({"color": "rgb(0,0,0)"});
            }
        }


    };


    var timeSetter = function () {
        var html = '<div id="slider-wrap" style="display:none;"><input type="hidden" class="range-slider" value="2008,2015"/> </div>';
        if ($("#slider-wrap").length < 1) {
            $(html).appendTo("body");
            $('.range-slider').jRange({
                from: 1990,
                to: 2014,
                step: 1,
                scale: [1990, 2000, 2010, 2016],
                format: '%s',
                width: 200,
                showLabels: true,
                isRange: true,
                theme: "theme-blue"
            });
        }

        var bw = $("body").width();
        var ml = (bw - 200) / 2 - 10;

        $("#slider-wrap").css({
            "position": "fixed",
            "top": "70px",
            "margin-left": ml + "px"
        });

        var wrap = $("#slider-wrap");
        if (wrap.css("display") == "none") {
            wrap.fadeIn();
        } else {
            wrap.fadeOut();
        }
    };


    var init = function () {
        if (SGIS.agent == "pc") {
            $("#logo").css("height", "100px");
            $("#v-toolbar").css("top", "70px");
            $("#indi-panel").css("top", "100px");
        }
    };

    var getChart = function () {
        return rightChart;
    };

    return {
        init: init,
        getChart: getChart
    }
});
