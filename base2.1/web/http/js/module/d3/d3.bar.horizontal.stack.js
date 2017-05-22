/**
 * Created by lmy on 2015/12/4.
 */

define(function(require, exports, module) {
    require("base/js/module/d3/d3.bar.horizontal.stack.css");
    var BarHorizontalStack = function () {
        this.currentColors = [];
        this.config = {
            w: 700,
            h: 500,
            dataType: "",
            containerId: "#",
            isShowLabel:true,
            labelType:["circle","",""],
            xAxisPosition: "bottom",
            xAxisColor:"#000000",
            colors:["#D01D20", "#D85C14", "#DEB714", "#B7D326", "#29BB28", "#1DB7C3",
                    "#713EB7", "#6E8EA7", "#9e0142", "#f46d43", "#A4838A",
                    "#938175", "#A9A077", "#989862", "#8AAA67", "#80B08A",
                    "#78A882", "#599490", "#508983", "#5097B3", "#4F92AF", "#567DA8",
                    "#7B75A5", "#8063A5", "#8668A8", "#A85FAE"],
            url: "js/module/d3/d3.bar.horizontal.stack.text.json"
        }
    };

        BarHorizontalStack.prototype = {
            init: function (config) {
                config = config ? config : {};
                this.config = $.extend(true, this.config, config);
                var containerId = this.config.containerId;
                var container = document.getElementById(containerId ? containerId : "");
                if (container) {
                    this.config.containerId = "#" + containerId
                }
                $(containerId).html("");
                //添加配置样式
                if (config.config) {
                    this.config = $.extend(true, this.config, config.config || {});
                }
                this.excute();
            },

            excute: function () {
                var that = this;
                that.currentColors = [];

                var w = this.config.w;
                var h = this.config.h;
                var containerId = this.config.containerId;
                var dataUrl = this.config.url;
                var dataData = this.config.data;
                var colors=this.config.colors;
                var dataType = this.config.dataType;
                var isShowLabel=this.config.isShowLabel;
                var random = Math.floor(Math.random() * 1000000);
                var xAxisPosition=this.config.xAxisPosition;
                var svg = d3.select(containerId).
                    append("svg").
                    attr("class", "bar-horizontal-stack" ).
                    attr("width", w).
                    attr("height", h);


                //数据框
                var tooltip = null;
                var tools = $("div[id^='div_rect_tooptip_']");
                if (tools && tools.length > 0) {
                    tooltip = d3.select("div[id^='div_rect_tooptip_']");
                } else {
                    tooltip = d3.select("body")
                        .append("div")
                        .attr("id", "div_rect_tooptip_" + random)
                        .attr("class", "tooltip_one")
                        .style("position", "absolute")
                        .style("z-index", 100000)
                        .style("left", 0)
                        .style("top", 0)
                        .style("display", "none")
                        .style("line-height", "40px")
                        .style("color", "#fff")
                        .style("font-size", "15px")
                        .style("background", "#000")
                        .style("padding", "3px 7px")
                        .style("opacity", "0.7")
                        .style("-moz-border-radius", "7px")
                        .style("-webkit-border-radius", "7px")
                        .style("border-radius", "7px")
                        .style("text-align", "center")
                        .style("filter", "progid:DXImageTransform.Microsoft.Alpha(opacity=70)");
                }

                if(typeof dataData == "object" && dataData != null){
                    showData(dataData);
                }else{
                    d3.json(dataUrl, function(re) {
                        showData(re);
                    });
                }

                function showData(re) {
                    if (dataType && dataType != "") {
                       var dataset = re[dataType + "_data"];
                           unit = re[dataType + "_unit"];
                    } else {
                       var dataset = re["_data"];
                              unit = re["_unit"];
                    }
                    if (!re) {
                        SGIS.Log("错误提示:数据为 null!");
                        re = {};
                    }
                    //var dataset=re["data_data"];
                    var stack = d3.layout.stack()
                        .values(function(d){return d.sales;})
                        .x(function(d){ return d.year; })
                        .y(function(d){ return d.profit; });
                    var data = stack(dataset);
                    //console.log(data);
                    var padding = {left: 50, right: 100, top: 30, bottom: 30};
                    //创建X轴比例尺
                    var xRangeWidth = w - padding.left - padding.right;
                    var xScale = d3.scale.ordinal()
                        .domain(data[0].sales.map(function (d) {
                            return d.year;
                        }))
                        .rangeBands([0, xRangeWidth], 0.3);
                    //创建y轴比例尺

                    //最大利润（定义域的最大值）
                    var maxProfit = d3.max(data[data.length - 1].sales, function (d) {
                        return d.y0 + d.y;
                    });

                    //最大高度（值域的最大值）
                    var yRangeWidth = h - padding.top - padding.bottom;

                    var yScale = d3.scale.linear()
                        .domain([0, maxProfit])		//定义域
                        .range([0, yRangeWidth]);	//值域

                    //可取颜色的长度
                    var colorLen = colors.length;
                    //添加分组元素 填充颜色
                    var groups = svg.selectAll("g").data(data).enter().append("g").style("fill", function (d, i) {
                        that.currentColors.push(colors[i%colorLen]);

                        return colors[i%colorLen];
                    });

                    //添加矩形
                    var rects = groups.selectAll("rect")
                        .data(function (d) {
                            return d.sales;
                        })
                        .enter()
                        .append("rect")
                        .attr("x", function (d) {
                            return xScale(d.year);
                        })
                        .attr("y", function (d) {
                            return yRangeWidth - yScale(d.y0 + d.y);
                        })
                        .attr("width", function (d) {
                            return xScale.rangeBand();
                        })
                        .attr("height", function (d) {
                            return yScale(d.y);
                        })
                        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                        .on("mousemove", function (d) {
                            var ev = window.event;
                            var mousePos = mousePosition(ev);
                            var content = "<div>" + d.profit + "</div>";
                            tooltip.style("display", "block")
                                .style("left", (mousePos.x + 15) + "px")
                                .style("top", (mousePos.y - 15) + "px"
                            ).html(content)
                        })
                        .on("mouseout", function (d) {
                            tooltip.style("display", "none")
                                .style("left", "0")
                                .style("top", "0")
                                .text("")
                        });

                    //添加坐标轴
                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient(xAxisPosition);




                    yScale.range([yRangeWidth, 0]);

                    var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");

                    svg.append("g")
                        .attr("class", "axis")
                        .attr("transform", "translate(" + padding.left + "," + (h - padding.bottom) + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "axis")
                        .attr("transform", "translate(" + padding.left + "," + (h - padding.bottom - yRangeWidth) + ")")
                        .call(yAxis);

                    //添加分组标签
                    if(isShowLabel) {
                        var labHeight = 50;
                        var labRadius = 10;
                       // var symbol=d3.svg.symbol().size(labRadius).type("square");

                        var labelCircle = groups.append("circle")
                            .attr("cx", function (d) {
                                return w - padding.right * 0.98;
                            })
                            .attr("cy", function (d, i) {
                                return padding.top * 2 + labHeight * i;
                            })
                            .attr("r",labRadius);

                           /* .attr("x", labRadius)
                            .attr("y", labRadius);*/

                        var labelText = groups.append("text")
                            .attr("class", "show-label")
                            .attr("id", "show-label")
                            .style("display", "block")
                            .attr("x", function (d) {
                                return w - padding.right * 0.8;
                            })
                            .attr("y", function (d, i) {
                                return padding.top * 2 + labHeight * i;
                            })
                            .attr("dy", labRadius / 2)
                            .text(function (d) {
                                return d.name;
                            });
                    }
                }


                //鼠标位置事件
                function mousePosition(ev) {
                    if (ev.pageX || ev.pageY) {
                        return {
                            x: ev.pageX,
                            y: ev.pageY
                        }
                    }
                    return {
                        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                        y: ev.clientY + document.body.scrollTop - document.body.clientTop
                    }
                }


            }
        };
        return BarHorizontalStack

});

