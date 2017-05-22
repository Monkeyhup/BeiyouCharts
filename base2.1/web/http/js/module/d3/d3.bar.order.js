define(function(require, exports, module) {
	require("base/js/module/d3/d3.bar.order.css");
	var BarOrder = function() {
			this.currentColors = [];
			this.currentTextXY = [];
		
			this.config = {
				w: 960,
				h: 620,
				containerId: "#",
				url: "js/module/d3/d3.bar.order.text.json",
				dataType: "",
				colors: ["#D01D20", "#D85C14", "#DEB714", "#B7D326", "#29BB28", "#1DB7C3", "#713EB7", "#6E8EA7", "#9e0142", "#f46d43", "#A4838A", "#938175", "#A9A077", "#989862", "#8AAA67", "#80B08A", "#78A882", "#599490", "#508983", "#5097B3", "#4F92AF", "#567DA8", "#7B75A5", "#8063A5", "#8668A8", "#A85FAE"],
				textXY: [{
					x: 20,
					y: 20
				}, {
					x: 20,
					y: 20
				}],
				margin: {
					top: 20,
					right: 20,
					bottom: 150,
					left: 40
				},
				timeOut: 2000,
				yMax: 0,
				orderName: "排序",
				textRotate: 45
			}
		};
	BarOrder.prototype = {
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
			//初始化
			that.currentColors = [];
			
			var containerId = that.config.containerId;
			var dataUrl = that.config.url;
			var dataData = that.config.data;
			var dataType = that.config.dataType;
			var yMax = that.config.yMax;
			var orderName = that.config.orderName;
			var textRotate = that.config.textRotate;
			var timeOut = that.config.timeOut;
			var colors = that.config.colors;
			var width = that.config.w;
			var height = that.config.h;
			var margin = that.config.margin || {
				top: 20,
				right: 20,
				bottom: 150,
				left: 40
			};
			var textXY = that.config.textXY || [{
				x: 20,
				y: 20
			}];
			if (!timeOut || !Number(timeOut)) timeOut = 2000;
			if (isNaN(textRotate)) textRotate = 45;
			var transition;
			var sortTimeout;
			var oldData;
			var random = Math.floor(Math.random() * 1000000);
			var formatPercent = d3.format();
			var x = d3.scale.ordinal().rangeRoundBands([-15, width - margin.left - margin.right], .1, 1);
			var y = d3.scale.linear().range([height - margin.top - margin.bottom + 5, 0]);
			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(formatPercent);
			var label = d3.select(containerId).append("label").style({
				position: "absolute",
				right: "20px",
				top: "20px",
				cursor: "pointer"
			});
			label.append("input").attr("id", "order_" + random).attr("type", "checkbox").style({
				width: "20px",
				height: "20px",
				position: "absolute",
				'margin-right': "5px",
				'margin-top': "0px",
				cursor: "pointer"
			});
			label.append("span").style({
				'margin-left': "25px",
				cursor: "pointer"
			}).text(orderName);
			var svg = d3.select(containerId).style("position", "relative").append("svg").attr("class", "bar-order").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			var isOrder = false;
			
			if(typeof dataData == "object" && dataData != null){
				showData(dataData);
			}else{
				d3.json(dataUrl, function(re) {
					showData(re);
				});
			}
			
			//显示数据
			function showData(re){
				if (!re) {
					SGIS.Log("错误提示:数据源没有数据!");
					return
				}
				var data;
				var title;
				var unit;
				if (dataType && dataType != "") {
					data = re[dataType + "_data"];
					unit = re[dataType + "_unit"];
				} else {
					data = re["_data"];
					unit = re["_unit"];
				}
				if (!data) {
					SGIS.Log("错误提示:指定的参数dataType【" + dataType + "】不正确!");
					return
				}
				oldData = $.extend(true, {}, data);
				x.domain(data.map(function(d) {
					return d.letter
				}));
				y.domain([0, d3.max(data, function(d) {
					return d.frequency
				})]);
				svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")").call(xAxis);
				svg.selectAll(".x.axis text").attr("transform", "rotate(" + textRotate + ")").attr("class", function(d, i) {
					return "x_axis_text_" + i
				}).attr("x", function(d) {
					return 60
				}).attr("y", function(d) {
					return 40
				}).style("font-family", "微软雅黑").style("font-weight", "bold");
				svgTarstion();
				svg.selectAll(".x.axis").append('line').attr('class', 'xline').attr('x1', 0).attr('y1', 5).attr('x2', 795).attr('y2', 5);
				svg.selectAll('.xline').attr('stroke', "black").attr('stroke-width', "1");
				svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("id", "y_axis_text_max_" + random).attr("transform", "rotate(0)");
				svg.selectAll(".y.axis text").attr("class", function(d, i) {
					return "y_axis_text_" + i
				}).style("font-family", "微软雅黑").style("font-weight", "lighter").style("font-size", "11px").attr("x", "-7");
				if (unit && unit != "") {
					svg.select(".y.axis text[id='y_axis_text_max_" + random + "']").attr("x", "-21").attr("y", '-18').attr("dy", ".71em").attr("dx", "-1em").style("text-anchor", "start").text("(" + unit + ")")
				}
				if (yMax && yMax > 0) {
					svg.append("g").attr("class", "y axis_max").append("text").attr("transform", "rotate(0)").attr("y", '-4').attr("x", "-9").attr("dy", ".71em").attr("dx", "-3em").style("text-anchor", "start").style("font-family", "微软雅黑").style("font-weight", "lighter").style("font-size", "11px").text(yMax)
				}
				var sivbase = svg.selectAll(".bar").data(data).enter().append("g");
				var svgbase = sivbase;
				//可取颜色的长度
				var colorLen = colors.length;
				var textXYLength = textXY.length;
				var textXYValue = {
					x:20,
					y:15
				};
				
				sivbase.append("rect").attr("class", "bar").attr("fill", function(d, i) {
					//记录柱子的颜色
					that.currentColors.push(colors[i%colorLen]);
					
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
					
					return colors[i%colorLen];
				}).attr("width", x.rangeBand()).attr("x", function(d) {
					return x(d.letter)
				}).attr("y", function(d) {
					return y(d.frequency)
				}).attr("height", function(d) {
					var hh = height - margin.top - margin.bottom - y(d.frequency);
					return hh > 0 ? hh : 0
				});
				svgbase.append("text").attr("id", function(d, i) {
					return "text_id_" + i;
				}).attr("class", function(d, i) {
					return "g_" + i + " g_bar_data"
				}).text(function(d) {
					return d.frequency;
				}).attr("x", function(d) {
					//计算数字的宽度
					var w = (d.frequency.toString()).replace(/[^\x00-\xff]/g,"NB").length*6;
					var xx = x(d.letter)-w/2+20;	//x(d.letter)
					return xx;
				}).attr("y", function(d) {
					return y(d.frequency) - 4
				}).style("font-family", "微软雅黑").style("font-weight", "lighter");
				d3.select("input#order_" + random).on("change", orderClick);
				sortTimeout = setTimeout(function() {
					d3.select("input#order_" + random).property("checked", false).each(orderClick)
				}, timeOut);
	
				function orderClick() {
					if (sortTimeout) clearTimeout(sortTimeout);
					var x0 = x.domain(data.sort(this.checked ?
					function(a, b) {
						isOrder = true;
						return b.frequency - a.frequency
					} : function(a, b) {
						isOrder = false;
						return d3.ascending(a.letter, b.letter)
					}).map(function(d, i) {
						if (isOrder) {
							return d.letter
						} else {
							return oldData[i].letter
						}
					})).copy();
					transition = svg.transition().duration(750);
					var delay = function(d, i) {
							return i * 50
						};
					transition.selectAll(".bar").delay(delay).attr("x", function(d) {
						return x0(d.letter)
					});
					transition.select(".x.axis").call(xAxis).selectAll("g").delay(delay);
					changeXtext()
				}
			}

			function changeXtext() {
				transition.selectAll(".x.axis text").attr("transform", "rotate(" + textRotate + ")").attr("class", function(d, i) {
					return "x_axis_text_" + i
				}).attr("x", function(d) {
					return 60
				}).attr("y", function(d) {
					return 40
				});
				dataTarstion();
				textTarstion()
			}

			function dataTarstion() {
				transition.selectAll("text[id^='text_id_']").text(function(d) {
					return d.frequency
				}).attr("x", function(d) {
					//计算数字的宽度
					var w = (d.frequency.toString()).replace(/[^\x00-\xff]/g,"NB").length*6;
					var xx = x(d.letter)-w/2+20;	//x(d.letter)
					return xx;
				}).attr("y", function(d) {
					return y(d.frequency) - 4
				}).style("font-family", "微软雅黑").style("font-weight", "lighter")
			}

			function textTarstion() {
				var textXYLength = textXY.length;
				transition.selectAll("text[class^='x_axis_text_']").attr("x", function(d, i) {
					var value = 20;
					if (i < textXYLength && textXY[i] && Number(textXY[i].x)) {
						value = textXY[i].x;
					}
					return value;
				}).attr("y", function(d, i) {
					var value = 15;
					if (i < textXYLength && textXY[i] && Number(textXY[i].y)) {
						value = textXY[i].y;
					}
					return value;
				});
			}

			function svgTarstion() {
				svg.selectAll(".x.axis text").attr("x", function(d) {
					return 40
				}).attr("y", function(d) {
					return 40
				})
			}
		}
	};
	return BarOrder
});