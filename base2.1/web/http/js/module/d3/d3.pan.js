define(function(require, exports, module) {
	var D3Pan = function() {
			this.config = {
				w: 960,
				h: 800,
				containerId: "#",
				url: "js/module/d3/d3.pan.text.json",
				isShowTooltipTitle: false,
				dataType: ""
			}
		};
	D3Pan.prototype = {
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
			var w = that.config.w;
			var h = that.config.h;
			var radius = Math.min(w, h) / 2;
			var x = d3.scale.linear().range([0, 2 * Math.PI]);
			var y = d3.scale.sqrt().range([0, radius]);
			var color = d3.scale.category20c();
			var dataType = that.config.dataType;
			var isShowTooltipTitle = that.config.isShowTooltipTitle;
			var random = Math.floor(Math.random() * 1000000);
			d3.select(containerId).append("div").attr("id", "div_container_" + random);
			d3.select("#div_container_" + random).append("div").attr("id", "div_" + random);
			var svg = d3.select("#div_" + random).append("svg").attr("id", "svg_" + random).attr("width", w).attr("height", h).append("g").attr("transform", "translate(" + w / 2 + "," + (h / 2 + 0) + ")");
			var tooltip = d3.select("#div_container_" + random).append("div").attr("id", "div_tooptip_" + random).attr("class", "tooltip_one").style("position", "fixed").style("z-index", 100000).style("display", "none").style("left", "-100px").style("top", 0).style("line-height", "40px").style("color", "#fff").style("font-size", "15px").style("background", "#000").style("padding", "3px 7px").style("opacity", "0.7").style("-moz-border-radius", "7px").style("-webkit-border-radius", "7px").style("border-radius", "7px").style("text-align", "center").style("filter", "progid:DXImageTransform.Microsoft.Alpha(opacity=70)");
			var partition = d3.layout.partition().sort(null).value(function(d) {
				return 1
			});
			var arc = d3.svg.arc().startAngle(function(d) {
				return Math.max(0, Math.min(2 * Math.PI, x(d.x)))
			}).endAngle(function(d) {
				return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)))
			}).innerRadius(function(d) {
				return Math.max(0, y(d.y))
			}).outerRadius(function(d) {
				return Math.max(0, y(d.y + d.dy))
			});
			var node;
			
			if(typeof dataData == "object" && dataData != null){
				showData(dataData,dataData);
			}else{
				d3.json(dataUrl, function(error,re) {
					showData(error,re);
				});
			}
			
			//显示数据
			function showData(error,re){
				var root;
				var title;
				if (dataType && dataType != "") {
					root = re[dataType + "_data"];
					title = re[dataType + "_title"]
				} else {
					root = re["_data"];
					title = re["_title"]
				}
				node = root;
				var path = svg.datum(root).selectAll("path").data(partition.nodes).enter().append("path").attr("d", arc).style("cursor", "pointer").style("stroke", "#fff").style("fill-rule", "evenodd").style("fill", function(d) {
					return color((d.children ? d : d.parent).name)
				}).on("click", click).on("mouseover", function(d) {
					var ev = window.event;
					var mousePos = mousePosition(ev);
					var content = "<div>" + d.name + "</div>";
					if (isShowTooltipTitle) {
						content = "<div style='font-weight:bold;'>" + title + "</div><div>" + d.name + "</div>"
					}
					tooltip.style("display", "block").style("left", (mousePos.x + 15) + "px").style("top", (mousePos.y + 15) + "px").html(content)
				}).on("mousemove", function(d) {
					var ev = window.event;
					var mousePos = mousePosition(ev);
					var content = "<div>" + d.name + "</div>";
					if (isShowTooltipTitle) {
						content = "<div style='font-weight:bold;'>" + title + "</div><div>" + d.name + "</div>"
					}
					tooltip.style("display", "block").style("left", (mousePos.x + 15) + "px").style("top", (mousePos.y + 15) + "px").html(content)
				}).on("mouseout", function(d) {
					tooltip.style("display", "none").style("left", "-100px").style("top", "0").text("")
				}).each(stash);
	
				function click(d) {
					node = d;
					path.transition().duration(1000).attrTween("d", arcTweenZoom(d))
				}
			}

			d3.select(self.frameElement).style("height", h + "px");

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

			function stash(d) {
				d.x0 = d.x;
				d.dx0 = d.dx
			}

			function arcTweenData(a, i) {
				var oi = d3.interpolate({
					x: a.x0,
					dx: a.dx0
				}, a);

				function tween(t) {
					var b = oi(t);
					a.x0 = b.x;
					a.dx0 = b.dx;
					return arc(b)
				}
				if (i == 0) {
					var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
					return function(t) {
						x.domain(xd(t));
						return tween(t)
					}
				} else {
					return tween
				}
			}

			function arcTweenZoom(d) {
				var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
					yd = d3.interpolate(y.domain(), [d.y, 1]),
					yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
				return function(d, i) {
					return i ?
					function(t) {
						return arc(d)
					} : function(t) {
						x.domain(xd(t));
						y.domain(yd(t)).range(yr(t));
						return arc(d)
					}
				}
			}
		}
	};
	return D3Pan
});