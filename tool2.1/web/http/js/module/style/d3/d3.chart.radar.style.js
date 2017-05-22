/**
 * d3雷达图样式调整
 * Created by lmy on 2016/1/26.
 */

define(function(require, exports, module) {
        var templateHtml = require("js/module/style/d3/d3.chart.radar.html.tpl");
        var inputHtml = "<input type=\"color\" class=\"form-control\" style=\"width:45px;\" value=\"#ffffff\" />";
        var D3ChartRadarStackStyle = (function () {
            var _isInit = false;
            var _style = {};
            var _container = {};
            /**
             * 初始化数据
             * @param currentHanlder
             *            当前处理的对象（chart.echarts.js
             *            或者chart.echarts.edit.js的对象）
             * @param chartParam
             *            当为图编辑时传入的初始化参数，新建时为null
             * @param callback
             *            回调方法
             */
            var init = function (currentHanlder, chartParam, callback) {
                if (_isInit) {
                    callback && callback();
                    return
                }
                _style = {};
                _container = {};

                //添加内容
                $("#param-pane").html("").append($(templateHtml));
                //初始化样式参数时必须放在【添加内容】后面
                if (chartParam != null) {
                    //设置参数并初始化数据
                    setChartParam(chartParam);
                }

                _isInit = true;
                initEventBind(currentHanlder, callback);
            };

            /**
             * 初始化绑定事件
             * @param currentHanlder
             * @param callback
             */
            var initEventBind = function (currentHanlder, callback) {
                if (currentHanlder && currentHanlder != null) {
                    eventBind(currentHanlder, callback);
                } else {
                    //默认选择（chart.d3）
                    seajs.use("chart.d3", function (hanlder) {
                        eventBind(hanlder, callback);
                    });
                }
            };


            /**
             * 重新绑定颜色选择
             */
            var reBindColorSelect = function (chartObj, objConfig) {
                if (!chartObj || !objConfig) {
                    return;
                }

                $("#chart-path-color-container").html("");

                //添加饼的颜色
                var currentColors = $.extend([], chartObj.currentColors || []);
                var colorsLength = currentColors.length;

                //若已经修改过配色，直接显示配色的
                if (_style.colors && _style.colors.length > 0) {
                    //表示没有新增数据
                    if (_style.colors.length >= colorsLength) {
                        //修改数据长度
                        _style.colors.length = colorsLength;
                        for (var c = 0, cLen = colorsLength; c < cLen; c++) {
                            //添加新的颜色
                            $(inputHtml).attr("id", "chart-path-color-select-" + c).val(_style.colors[c])
                                .appendTo($("#chart-path-color-container"));
                        }
                    } else {
                        //有新增的数据
                        for (var d = 0, dLen = _style.colors.length; d < dLen; d++) {
                            //添加新的颜色
                            $(inputHtml).attr("id", "chart-path-color-select-" + d).val(_style.colors[d])
                                .appendTo($("#chart-path-color-container"));
                        }

                        var index = _style.colors.length;
                        for (var e = index, eLen = colorsLength; e < eLen; e++) {
                            //添加新的颜色
                            var cc = currentColors[e % colorsLength];
                            //添加新的颜色
                            $(inputHtml).attr("id", "chart-path-color-select-" + e).val(cc)
                                .appendTo($("#chart-path-color-container"));
                            //添加新的
                            _style.color.push(cc);
                        }
                    }
                } else {
                    for (var i = 0; i < colorsLength; i++) {
                        //添加新的颜色
                        $(inputHtml).attr("id", "chart-path-color-select-" + i).val(currentColors[i])
                            .appendTo($("#chart-path-color-container"));
                    }
                }//end if(_style.color && _style.color.length > 0) else


                //动态绑定饼颜色
                $("#chart-path-color-container").off("change", ">input");
                $("#chart-path-color-container").on("change", ">input", function () {

                    var colorArr = [];
                    //找到所有的颜色
                    var $inputs = $("#chart-path-color-container").find(">input");
                    $inputs.each(function (i, o) {
                        var c = $(o).val();
                        if (c && c != "") {
                            colorArr.push($(o).val());
                        }
                    });

                    objConfig["config"] = _style = $.extend(true, _style, {
                        colors: colorArr
                    });
                    chartObj.init(objConfig);
                });

            };


            /**
             * 绑定事件
             * @param hanlder
             * @param callback
             */
            var eventBind = function (hanlder, callback) {
                if (hanlder) {
                    var chartObj = hanlder.getChartObj();
                    var objConfig = hanlder.getChartConfig();
                    if (chartObj && objConfig) {
                        //修改图的高度
                        $("#chart-d3-height-range").change(function(){
                            var height = $(this).val();
                            //设置值
                            $("#chart-d3-height-text").val(height);

                            _container["height"] = height;
                            objConfig["h"] = height;
                            chartObj.init(objConfig);
                        });

                        //修改路径形状
                        $("input[name='chart-path-shape-radio']").click(function(){
                            var pathshape= $(this).val();

                                if(pathshape=="tip"){
                                    objConfig["config"] = _style = $.extend(true, _style, {
                                        roundStrokes: false
                                    });
                                }
                                if(pathshape=="circle"){
                                objConfig["config"] = true;
                            }
                            chartObj.init(objConfig);
                        });

                        //修改背景透明度
                        $("#chart-d3-opacityCircles-range").change(function(){
                            var opacity = $(this).val()/10;
                            //设置值
                            $("#chart-d3-opacityCircles-text").val(opacity);
                            objConfig["opacityCircles"] = opacity;
                            chartObj.init(objConfig);
                        });

                        //雷达圈数
                        $("#chart-d3-CircleNums-range").change(function(){
                            var circleNums = parseInt($(this).val());
                            //设置值
                            $("#chart-d3-CircleNums-text").val(circleNums);
                            objConfig["levels"] = circleNums;
                            chartObj.init(objConfig);
                        });


                        //是否显示图列
                        $("#chart-show-legend-check").change(function () {
                            var isShow = $(this).is(":checked");
                            /*if (!isShow) {
                                $("#chart-show-legend-style").css("display", "none");
                            } else {
                                $("#chart-show-legend-style").css("display", "block");
                            }*/

                            objConfig["isShowLabel"] = isShow;

                            chartObj.init(objConfig);
                        });

                        //是否显示文字
                        $("#chart-show-label-check").change(function () {
                            var isShow = $(this).is(":checked");
                            if (!isShow) {
                                $("#chart-font-size-text").css("display", "none");
                                $("#chart-font-family-radio").css("display", "none");

                             }
                            if(isShow) {
                                $("#chart-font-size-text").css("display", "block");
                             $("#chart-font-family-radio").css("display", "block");

                             }

                            objConfig["isShowText"] = isShow;

                            chartObj.init(objConfig);
                        });

                        //文字大小修改
                        $("#chart-font-size-range").change(function(){
                            var fontsize = $(this).val();
                            //设置值
                            $("#chart-font-size-text1").val(fontsize);


                            objConfig["fontsize"] = fontsize;
                            chartObj.init(objConfig);
                        });

                        //文字样式
                        $("input[name='chart-font-family-radio']").click(function(){
                            var fontfamily= $(this).val();
                            objConfig["fontfamily"]=fontfamily;
                            chartObj.init(objConfig);
                        });

                        //重新绑定颜色选择
                        reBindColorSelect(chartObj, objConfig);






                    }


                }
                callback && callback();
            };

            /**
             * 取得style
             */
            var getStyle = function () {
                return _style;
            };

            /**
             * 取得container
             */
            var getContainer = function () {
                return _container;
            };

            var setHeight = function (height) {
                if (height && height > 0) {
                    _container["height"] = height;
                }
            };


            /**
             * 设置参数（编辑时使用）
             *
             * @param chartParam
             *            设置参数
             */
            var setChartParam = function (chartParam) {
                if (chartParam && typeof chartParam == "object") {
                    if (chartParam.container) {
                        _container = $.extend(true, _container || {}, chartParam.container);
                    }

                    if (chartParam.style) {
                        _style = $.extend(true, _style || {}, chartParam.style);
                    }
                }

                //初始化控件的值
                initControlStyle();
            };

            /**
             * 初始化控件的值（编辑时使用）
             */
            var initControlStyle = function () {
                var series = _style.series;
                if (series && series[0]) {
                    var seriesStyle = $.extend(true, {}, {
                        series: [
                            {
                                "itemStyle": {
                                    "normal": {
                                        "label": {
                                            "show": true,
                                            "position": null,
                                            "textStyle": {
                                                "color": null,
                                                "fontSize": -1
                                            }
                                        },
                                        "lineStyle": {
                                            width: -1
                                        }
                                    }
                                }
                            }
                        ]
                    }, {
                        series: series
                    });


                }//end if(series && series[0])







            };

            return {
                init: init,
                getStyle: getStyle,
                getContainer: getContainer,
                setHeight: setHeight
            };
        })();



    return D3ChartRadarStackStyle;
});