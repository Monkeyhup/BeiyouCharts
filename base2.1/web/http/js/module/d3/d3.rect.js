define(function(require, exports, module) {
	var D3Rect = function() {
			this.currentColors = [];
			this.config = {
				w: 850,
				h: 750,
				containerId: "#",
				url: "js/module/d3/d3.rect.text.json",
				colors: ["#3182BD", "#6BAED6", "#9ECAE1", "#C6DBEF", "#1874CD", "#D01D20", "#1874CD", "#DEB714", "#B7D326", "#29BB28", "#22CAD5", "#1DB7C3", "#128BD4", "#12A8E5", "#713EB7", "#6E8EA7", "#7C6C93", "#9A8099", "#9F7E87", "#A4838A", "#938175", "#A9A077", "#989862", "#8AAA67", "#80B08A", "#78A882", "#599490", "#508983", "#5097B3", "#4F92AF", "#567DA8", "#7B75A5", "#8063A5", "#8668A8", "#A85FAE"],
				dataType: "",
				isShowTooltipTitle: false
			};
		};
	D3Rect.prototype = {
		init: function(config) {
			config = config ? config : {};
			this.config = $.extend(true, this.config, config);
			var containerId = this.config.containerId;
			var container = document.getElementById(containerId ? containerId : "");
			if (container) {
				this.config.containerId = "#" + containerId;
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
			var colors = that.config.colors;
			var dataType = that.config.dataType;
			var isShowTooltipTitle = that.config.isShowTooltipTitle;
			w = w - 80;
			h = h - 180;
			var x = d3.scale.linear().range([0, w]);
			var y = d3.scale.linear().range([0, h]);
			var color = d3.scale.category20c();
			var root, node;
			var random = Math.floor(Math.random() * 1000000);
			var treemap = d3.layout.treemap().round(false).size([w, h]).sticky(true).value(function(d) {
				return d.size;
			});
			var svg = d3.select(containerId).append("div").attr("id", "div_" + random).attr("class", "chart").style("width", w + "px").style("height", h + "px").append("svg:svg").attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(.5,.5)");
			
			var tooltip = null;
			var tools = $("div[id^='div_rect_tooptip_']");
			if(tools && tools.length > 0){
				tooltip = d3.select("div[id^='div_rect_tooptip_']");
			}else{
				tooltip = d3.select("body").append("div").attr("id", "div_rect_tooptip_" + random).attr("class", "tooltip_one").style("position", "absolute").style("z-index", 100000).style("left", 0).style("top", 0).style("display", "none").style("line-height", "40px").style("color", "#fff").style("font-size", "15px").style("background", "#000").style("padding", "3px 7px").style("opacity", "0.7").style("-moz-border-radius", "7px").style("-webkit-border-radius", "7px").style("border-radius", "7px").style("text-align", "center").style("filter", "progid:DXImageTransform.Microsoft.Alpha(opacity=70)");
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
				var data;
				var title;
				if (dataType && dataType != "") {
					data = re[dataType + "_data"];
					title = re[dataType + "_title"];
				} else {
					data = re["_data"];
					title = re["_title"];
				}
				if (!data) {
					SGIS.Log("错误提示:指定的参数dataType【" + dataType + "】不正确!");
					return
				}
				node = root = data;
				var nodes = treemap.nodes(root).filter(function(d) {
					return !d.children;
				});
				var cell = svg.selectAll("g").data(nodes).enter().append("svg:g").attr("class", "cell_" + random).attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")";
				}).on("click", function(d) {
					return zoom(node == d.parent ? root : d.parent);
				}).on("mouseover", function(d) {
					var ev = window.event;
					var mousePos = mousePosition(ev);
					var content = "<div>" + d.name + "</div>";
					if (isShowTooltipTitle) {
						content = "<div style='font-weight:bold;'>" + title + "</div><div>" + d.name + "</div>";
					}
					tooltip.style("display", "block").style("left", (mousePos.x + 15) + "px").style("top", (mousePos.y + 15) + "px").html(content);
				}).on("mousemove", function(d) {
					var ev = window.event;
					var mousePos = mousePosition(ev);
					var content = "<div>" + d.name + "</div>";
					if (isShowTooltipTitle) {
						content = "<div style='font-weight:bold;'>" + title + "</div><div>" + d.name + "</div>"
					}
					tooltip.style("display", "block").style("left", (mousePos.x + 15) + "px").style("top", (mousePos.y + 15) + "px").html(content)
				}).on("mouseout", function(d) {
					tooltip.style("display", "none").style("left", "0").style("top", "0").text("")
				});
				
				//初始化当前选中的颜色
				that.currentColors = [];
				
				cell.append("svg:rect").attr("class", function(d) {
					return "rect_" + random
				}).attr("width", function(d) {
					var w = d.dx - 1;
					return w > 0 ? w : 0
				}).attr("height", function(d) {
					var h = d.dy - 1;
					return h > 0 ? h : 0
				}).style("fill", function(d, i) {
					if (i < colors.length) {
						//存储颜色
						that.currentColors.push(colors[i]);
						return colors[i];
					} else {
						//存储颜色
						var c = color(d.name);
						that.currentColors.push(c);
						return c;
					}
				}).style("cursor", "pointer");
				cell.append("svg:text").attr("class", function(d) {
					return "text_" + random
				}).attr("id", function(d, i) {
					return "text_" + random + "_" + i
				}).attr("x", function(d) {
					return d.dx / 2
				}).attr("y", function(d) {
					return d.dy / 2
				}).attr("dy", ".35em").attr("text-anchor", "middle").text(function(d) {
					return d.name
				}).style("opacity", function(d) {
					d.w = this.getComputedTextLength();
					return d.dx > d.w ? 1 : 0
				});
				d3.select(containerId).on("click", function() {
					zoom(root)
				});
				d3.select("select").on("change", function() {
					treemap.value(this.value == "size" ? size : count).nodes(root);
					zoom(node)
				})
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

			function size(d) {
				return d.size
			}

			function count(d) {
				return 1
			}

			function zoom(d) {
				var kx = w / d.dx,
					ky = h / d.dy;
				x.domain([d.x, d.x + d.dx]);
				y.domain([d.y, d.y + d.dy]);
				var t = svg.selectAll("g.cell_" + random).transition().duration(d3.event.altKey ? 7500 : 750).attr("transform", function(d) {
					return "translate(" + x(d.x) + "," + y(d.y) + ")"
				});
				t.select("rect.rect_" + random).attr("width", function(d) {
					var w = kx * d.dx - 1;
					return w > 0 ? w : 0
				}).attr("height", function(d) {
					var h = ky * d.dy - 1;
					return h > 0 ? h : 0
				});
				t.select("text.text_" + random).attr("x", function(d) {
					return kx * d.dx / 2
				}).attr("y", function(d) {
					return ky * d.dy / 2
				}).style("opacity", function(d) {
					return kx * d.dx > d.w ? 1 : 0
				});
				node = d;
				d3.event.stopPropagation()
			}
		}
	};
	return D3Rect
});