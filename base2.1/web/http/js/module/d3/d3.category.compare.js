define(function(require, exports, module) {
	require("base/js/module/d3/d3.category.compare.css");
	var CategoryCompare = function() {

			this.currentTextXY = [];
		
			this.pieColors = {
				compare1: "#807dba",
				compare2: "#41ab5d"
			};
			this.barColor = "#EBAC00";
			this.config = {
				w: 720,
				h: 520,
				containerId: "#",
				url: "js/module/d3/d3.category.compare.text.json",
				barColor: '#EBAC00',
				pieColors: {
					compare1: "#807dba",
					compare2: "#41ab5d"
				},
				margin: {
					top: 140,
					right: 30,
					bottom: 30,
					left: 0
				},
				textXY: [{
					x: 40,
					y: 25
				}],
				textRotate: 45,
				dataType: "",
				isShowTooltip: true,
				isShowTooltipTitle: true,
				pieR: 100
			}
		};
	CategoryCompare.prototype = {
		init: function(config) {
			config = config ? config : {};
			this.config = $.extend(true, this.config, config);
			var containerId = this.config.containerId;
			var container = document.getElementById(containerId ? containerId : "");
			if (container) {
				this.config.containerId = "#" + containerId
			}
			$(containerId).html("");
			//添加配置样式
			if(config.config){
            	this.config = $.extend(true,this.config,config.config || {});
        	}
			this.excute();
		},
		excute: function() {
			var that = this;
			var containerId = that.config.containerId;
			var dataUrl = that.config.url;
			var dataData = that.config.data;
			var barColor = that.config.barColor || that.barColor;
			var pieColors = that.config.pieColors || that.pieColors;
			var w = that.config.w;
			var h = that.config.h;
			var margin = that.config.margin || {
				top: 140,
				right: 0,
				bottom: 30,
				left: 0
			};
			var dataType = that.config.dataType;
			var isShowTooltip = that.config.isShowTooltip;
			var isShowTooltipTitle = that.config.isShowTooltipTitle;
			var myTitle = that.config.title || {
				compare1: "",
				compare2: ""
			};
			var textXY = that.config.textXY || [{
				x: 40,
				y: 25
			}];
			var pieR = that.config.pieR || 100;
			var textRotate = that.config.textRotate;
			//if (textRotate < 0) textRotate = 45;
			
			var data;
			var unit;
			var title;
			var hG;
			var pC;
			var leg;
			var tF;
			var sF;
			var random = Math.floor(Math.random() * 1000000);
			d3.select(containerId).append("div").attr("id", "div_" + random).style("position", "relative");
			
			var tooltip = null;
			var tools = $("div[id^='div_category_compare_tooptip_']");
			if(tools && tools.length > 0){
				tooltip = d3.select("div[id^='div_category_compare_tooptip_']");
			}else{
				tooltip = d3.select("body").append("div").attr("id", "div_category_compare_tooptip_" + random).attr("class", "tooltip_one").style("position", "absolute").style("z-index", 100000).style("left", 0).style("top", 0).style("display", "none").style("line-height", "40px").style("color", "#fff").style("font-size", "15px").style("background", "#000").style("padding", "3px 7px").style("opacity", "0.7").style("-moz-border-radius", "7px").style("-webkit-border-radius", "7px").style("border-radius", "7px").style("text-align", "center").style("filter", "progid:DXImageTransform.Microsoft.Alpha(opacity=70)");
			}
			
			if(typeof dataData == "object" && dataData != null){
				showData(dataData);
			}else{
				d3.json(dataUrl, function(re) {
					showData(re);
				});
			}
			
			//显示数据
			function showData(re){
				if (!re) 
					re = {};
				if (dataType && dataType != "") {
					data = re[dataType + "_data"];
					title = re[dataType + "_title"];
					unit = re[dataType + "_unit"];
					if (!myTitle.compare1 || myTitle.compare1 == "") {
						myTitle["compare1"] = re[dataType + "_compare1_title"];
						myTitle["compare2"] = re[dataType + "_compare2_title"]
					}
				} else {
					data = re["_data"];
					title = re["_title"];
					unit = re["_unit"];
					if (!myTitle.compare1 || myTitle.compare1 == "") {
						myTitle["compare1"] = re["_compare1_title"];
						myTitle["compare2"] = re["_compare2_title"]
					}
				}
				if (!data) {
					SGIS.Log("错误提示:指定的参数dataType【" + dataType + "】不正确!");
					return
				}
				data.forEach(function(d) {
					d.total = d.freq.compare1 + d.freq.compare2;
					d.total = Math.round((d.total) * 100) / 100
				});
				sF = data.map(function(d) {
					return [d.State, d.total]
				});
				tF = ['compare1', 'compare2'].map(function(d) {
					return {
						type: d,
						freq: d3.sum(data.map(function(t) {
							return t.freq[d]
						}))
					}
				});
				hG = histoGram(sF);
				pC = pieChart(tF);
				leg = legend(tF)
			}

			function histoGram(fD) {
				var hG = {};
				var hGDim = {
					t: margin.top,
					r: margin.right,
					b: margin.bottom,
					l: margin.left
				};
				hGDim.w = w - hGDim.l - hGDim.r;
				hGDim.h = h - hGDim.t - hGDim.b;
				var hGsvg = d3.select("#div_" + random).append("svg").attr("id", "svg_bar_" + random).attr("class", "category-compare-bar").attr("width", hGDim.w + hGDim.l + hGDim.r).attr("height", hGDim.h + hGDim.t + hGDim.b).append("g").attr("transform", "translate(" + hGDim.l + "," + 15 + ")");
				var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1).domain(fD.map(function(d) {
					return d[0]
				}));
				var y = d3.scale.linear().range([hGDim.h, 0]).domain([0, d3.max(fD, function(d) {
					return d[1]
				}) + 30]);
				var xAxis = d3.svg.axis().scale(x).orient("bottom");
				hGsvg.append("g").attr("class", "x axis").attr("transform", "translate(0," + hGDim.h + ")").call(xAxis);
				var bars = hGsvg.selectAll(".bar_" + random).data(fD).enter().append("g").attr("class", "bar_" + random);
				bars.append("rect").attr("class", "bar_rect_" + random).attr("x", function(d) {
					return x(d[0])
				}).attr("y", function(d) {
					return y(d[1])
				}).attr("width", x.rangeBand()).attr("height", function(d) {
					return hGDim.h - y(d[1])
				}).attr('fill', barColor).on("mouseover", barMouseover).on("mousemove", barMousemove).on("mouseout", barMouseout);
				
				var textXYLength = textXY.length;
				var textXYValue = {
					x:55,
					y:10
				};
				bars.append("text").attr("class", "bar_text_number_" + random).text(function(d,i) {
					//记录x值
					if (i < textXYLength && textXY[i]) {
						if(Number(textXY[i].x))
							textXYValue.x = textXY[i].x;
						if(Number(textXY[i].y))
							textXYValue.y = textXY[i].y;
					}
					that.currentTextXY[i] = {
						x:textXYValue.x,
						y:textXYValue.y
					};
					return d3.format(",")(d[1]);
				}).attr("x", function(d) {
					return x(d[0]) + x.rangeBand() / 2
				}).attr("y", function(d) {
					return y(d[1]) - 5
				}).attr("text-anchor", "middle");
				textTrans(hGsvg);
				hG.update = function(nD, color) {
					y.domain([0, d3.max(nD, function(d) {
						return d[1]
					})]);
					var bars = hGsvg.selectAll(".bar_" + random).data(nD);
					bars.select("rect").transition().duration(500).attr("y", function(d) {
						return y(d[1])
					}).attr("height", function(d) {
						return hGDim.h - y(d[1])
					}).attr("fill", color);
					bars.select("text").transition().duration(500).text(function(d) {
						return d3.format(",")(d[1])
					}).attr("y", function(d) {
						return y(d[1]) - 5
					})
				};
				return hG
			}

			function textTrans(hGsvg) {
				var textXYLength = textXY.length;
				hGsvg.selectAll(".x.axis text").attr("class", "name_text_" + random).attr("text-anchor", "middle").attr("transform", "rotate(" + textRotate + ")").attr("x", function(d, i) {
					var value = 20;
					if (i < textXYLength && textXY[i] && Number(textXY[i].x)) {
						value = textXY[i].x
					}
					return value;
				}).attr("y", function(d, i) {
					var value = 15;
					if (i < textXYLength && textXY[i] && Number(textXY[i].y)) {
						value = textXY[i].y
					}
					return value;
				})
			}

			function barMouseover(d) {
				var st = data.filter(function(s) {
					return s.State == d[0]
				})[0],
					nD = d3.keys(st.freq).map(function(s) {
						return {
							type: s,
							freq: st.freq[s]
						}
					});
				pC.update(nD);
				leg.update(nD);
				if (isShowTooltip) {
					var ev = window.event;
					var mousePos = mousePosition(ev);
					var content = "<div>" + d[0] + "：" + d[1];
					if (isShowTooltipTitle) {
						content = "<div style='font-weight:bold;'>" + title + "</div><div>" + d[0] + "：" + d[1]
					}
					if (unit && unit != "") {
						content += "(" + unit + ")"
					}
					content += "<div>";
					tooltip.style("display", "block").style("left", (mousePos.x + 15) + "px").style("top", (mousePos.y + 15) + "px").html(content)
				}
			}

			function barMousemove(d) {
				if (isShowTooltip) {
					var ev = window.event;
					var mousePos = mousePosition(ev);
					var content = "<div>" + d[0] + "：" + d[1];
					if (isShowTooltipTitle) {
						content = "<div style='font-weight:bold;'>" + title + "</div><div>" + d[0] + "：" + d[1]
					}
					if (unit && unit != "") {
						content += "(" + unit + ")"
					}
					content += "<div>";
					tooltip.style("display", "block").style("left", (mousePos.x + 15) + "px").style("top", (mousePos.y + 15) + "px").html(content)
				}
			}

			function barMouseout(d) {
				pC.update(tF);
				leg.update(tF);
				tooltip.style("display", "none").style("left", "0").style("top", "0").text("")
			}

			function pieChart(pD) {
				var pC = {};
				var pieDim = {
					w: 350,
					h: 200
				};
				pieDim.r = pieR;
				var width = w / 2.5;
				if (width < 2 * pieDim.r) width = 2 * pieDim.r + 10;
				var piesvg = d3.select("#div_" + random).append("svg").attr("id", "svg_pie_" + random).attr("class", "category-compare-pie").attr("width", width).attr("height", h).append("g").attr("transform", "translate(" + pieDim.r + "," + (2 * pieDim.r) + ")");
				var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);
				var pie = d3.layout.pie().sort(null).value(function(d) {
					return d.freq
				});
				piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc).each(function(d) {
					this._current = d
				}).style("fill", function(d) {
					return segColor(d.data.type)
				}).on("mouseover", pieMouseover).on("mousemove", pieMousemove).on("mouseout", pieMouseout);
				pC.update = function(nD) {
					piesvg.selectAll("path").data(pie(nD)).transition().duration(500).attrTween("d", arcTween)
				};

				function arcTween(a) {
					var i = d3.interpolate(this._current, a);
					this._current = i(0);
					return function(t) {
						return arc(i(t))
					}
				}
				return pC
			}

			function pieMouseover(d) {
				hG.update(data.map(function(v) {
					return [v.State, v.freq[d.data.type]]
				}), segColor(d.data.type));
				if (isShowTooltip) {
					var ev = window.event;
					var mousePos = mousePosition(ev);
					var content = d.value;
					content = Math.round((content) * 100) / 100;
					var t = myTitle[d.data.type];
					if (t && t != "") content = "<div>" + t + "：" + content;
					if (isShowTooltipTitle) {
						content = "<div style='font-weight:bold;'>" + title + "</div><div>" + content
					}
					if (unit && unit != "") {
						content += "(" + unit + ")"
					}
					var per = d3.format("%")(d.data.freq / d3.sum(tF.map(function(v) {
						return v.freq
					})));
					if (per && per != "") content += " " + per;
					content += "</div>";
					tooltip.style("display", "block").style("left", (mousePos.x + 15) + "px").style("top", (mousePos.y + 15) + "px").html(content)
				}
			}

			function pieMousemove(d) {
				if (isShowTooltip) {
					var ev = window.event;
					var mousePos = mousePosition(ev);
					var content = d.value;
					content = Math.round((content) * 100) / 100;
					var t = myTitle[d.data.type];
					if (t && t != "") content = "<div>" + t + "：" + content;
					if (isShowTooltipTitle) {
						content = "<div style='font-weight:bold;'>" + title + "</div><div>" + content
					}
					if (unit && unit != "") {
						content += "(" + unit + ")"
					}
					var per = d3.format("%")(d.data.freq / d3.sum(tF.map(function(v) {
						return v.freq
					})));
					if (per && per != "") content += " " + per;
					content += "</div>";
					tooltip.style("display", "block").style("left", (mousePos.x + 15) + "px").style("top", (mousePos.y + 15) + "px").html(content)
				}
			}

			function pieMouseout(d) {
				hG.update(data.map(function(v) {
					return [v.State, v.total]
				}), barColor);
				tooltip.style("display", "none").style("left", "0").style("top", "0").text("")
			}

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

			function segColor(c) {
				return {
					compare1: pieColors["compare1"],
					compare2: pieColors["compare2"]
				}[c]
			}

			function legend(lD) {
				var leg = {};
				var legend = d3.select("#div_" + random).append("table").attr('class', 'category-compare-legend');
				var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
				tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect").attr("width", '16').attr("height", '16').attr("fill", function(d) {
					return segColor(d.type)
				});
				tr.append("td").text(function(d) {
					var t = myTitle[d.type];
					if (t && t != "") return t + "：";
					return d.type + "："
				});
				tr.append("td").attr("class", 'category-compare-legend-freq').text(function(d) {
					d.freq = Math.round((d.freq) * 100) / 100;
					return d3.format(",")(d.freq)
				});
				tr.append("td").attr("class", 'category-compare-legend-unit').text(function(d) {
					return unit ? ("(" + unit + ")") : ""
				});
				tr.append("td").attr("class", 'category-compare-legend-perc').text(function(d) {
					return getLegend(d, lD)
				});
				leg.update = function(nD) {
					var l = legend.select("tbody").selectAll("tr").data(nD);
					l.select(".legendFreq").text(function(d) {
						return d3.format(",")(d.freq)
					});
					l.select(".legendPerc").text(function(d) {
						return getLegend(d, nD)
					})
				};

				function getLegend(d, aD) {
					return d3.format("%")(d.freq / d3.sum(aD.map(function(v) {
						return v.freq
					})))
				}
				return leg
			}
		}
	};
	return CategoryCompare
});