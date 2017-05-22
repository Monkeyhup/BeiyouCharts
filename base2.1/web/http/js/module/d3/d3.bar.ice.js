define(function(require, exports, module) {
	var BarIce = function() {
		this.currentColors = [];

		this.config = {
			w: 850,
			h: 480,
			containerId: "#",
			url: "js/module/d3/d3.bar.ice.text.json",
			colors: ["#EB7930", "#E3B452", "#C16062"]
		}
	};
	BarIce.prototype = {
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
			var w = this.config.w,
				h = this.config.h;
			var x = d3.scale.linear().range([0, w]);
			var y = d3.scale.linear().range([0, h]);
			var containerId = this.config.containerId;
			var dataUrl = this.config.url;
			var dataData = this.config.data;
			var colors = this.config.colors;
			if (!(colors instanceof Array) || colors.length < 1) {
				this.config.colors = ["#EB7930", "#E3B452", "#C16062"];
				colors = this.config.colors;
			}
			//保存当前的颜色
			this.currentColors = colors;

			var random = Math.floor(Math.random() * 1000000);
			var tooltip = d3.select("body").append("div")
				.attr("id","div_tooptip_" + random)
				.attr("class", "tooltip_one")
				.style("position", "absolute")
				.style("z-index", 100000)
				.style("display", "none")
				.style("left", "-100px")
				.style("top", 0)
				.style("line-height", "18px")
				.style("color", "#fff")
				.style("font-size", "12px")
				.style("background", "#000")
				.style("padding", "3px 7px")
				.style("opacity", "0.7")
				.style("-moz-border-radius", "7px")
				.style("-webkit-border-radius", "7px")
				.style("border-radius", "7px")
				.style("text-align", "left")
				.style("filter", "progid:DXImageTransform.Microsoft.Alpha(opacity=70)");


			var vis = d3.select(containerId).append("div").attr("id", "chart_ice_" + random)
				.attr("class", "chart_" + random).style("width", w + "px").style("height", h + "px")
				.append("svg:svg").attr("width", w).attr("height", h).append("svg:g");
			var partition = d3.layout.partition().value(function(d) {
				return d.size
			});

			if(typeof dataData == "object" && dataData != null){
				showData(dataData);
			}else{
				d3.json(dataUrl, function(re) {
					showData(re);
				});
			}

			//显示数据
			function showData(root){
				if (!root) {
					SGIS.Log("错误提示:数据为 null!");
					root = {};
				}
				var g = vis.selectAll("g").data(partition.nodes(root)).enter().append("svg:g").attr("transform", function(d) {
					return "translate(" + x(d.y) + "," + y(d.x) + ")"
				}).on("click", click);
				var kx = w / root.dx,
					ky = h / 1;
				var index = -1;
				g.append("svg:rect").attr("width", root.dy * kx).style("fill", function(d) {
					if (d.hasOwnProperty("children")) {
						return colors[2];
					} else {
						return colors[1];
					}
				}).attr("height", function(d) {
					return d.dx * ky
				}).attr("class", function(d) {
					return d.children ? "parent_" + random : "child_" + random
				}).attr("id", function(d) {
					index++;
					return "id_" + random + "_" + index
				}).on("mouseover", function(d) {
					var ev = window.event;
					var mousePos = mousePosition(ev);
					var value = d.name;
					var content = "<div style='font-weight:bold;padding: 8px 10px;'>" + value + "</div>";
					tooltip.style("left", (mousePos.x + 10) + "px")
						.style("top", (mousePos.y + 10) + "px")
						.style("display","block")
						.html(content);
				}).on("mousemove", function(d) {
					var ev = window.event;
					var mousePos = mousePosition(ev);
					var value = d.name;
					var content = "<div style='font-weight:bold;padding: 8px 10px;'>" + value + "</div>";
					tooltip.style("left", (mousePos.x + 10) + "px")
						.style("top", (mousePos.y + 10) + "px")
						.style("display","block")
						.html(content);
				}).on("mouseout", function(d) {
					tooltip.style("left", "-100px")
						.style("top", "0")
						.style("display","none")
						.html("");
				});

				g.selectAll("#id_" + random + "_0").style("fill", function(d) {
					return colors[0]
				});
				g.append("svg:text").attr("transform", transform).attr("dy", ".35em").style("opacity", function(d) {
					return d.dx * ky > 12 ? 1 : 0
				}).text(function(d) {
					return d.name
				});

				function mousePosition(ev) {
					if (ev.pageX || ev.pageY) {
						return {
							x : ev.pageX,
							y : ev.pageY
						};
					}
					return {
						x : ev.clientX + document.body.scrollLeft- document.body.clientLeft,
						y : ev.clientY + document.body.scrollTop - document.body.clientTop
					};
				}

				function click(d) {
					if (!d.children) {
						d = root
					}
					kx = (d.y ? w - 40 : w) / (1 - d.y);
					ky = h / d.dx;
					x.domain([d.y, 1]).range([d.y ? 40 : 0, w]);
					y.domain([d.x, d.x + d.dx]);
					var t = g.transition().duration(d3.event.altKey ? 7500 : 750).attr("transform", function(d) {
						return "translate(" + x(d.y) + "," + y(d.x) + ")"
					});
					t.select("rect").attr("width", d.dy * kx).attr("height", function(d) {
						return d.dx * ky
					});
					t.select("text").attr("transform", transform).style("opacity", function(d) {
						return d.dx * ky > 12 ? 1 : 0
					})
				}

				function transform(d) {
					return "translate(8," + d.dx * ky / 2 + ")"
				}
			}
		}
	};
	return BarIce
});