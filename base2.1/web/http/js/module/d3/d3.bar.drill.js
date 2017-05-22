define(function(require, exports, module) {
	var BarDrill = function() {
			this.colorbar1 = ["#D01D20", "#1874CD", "#DEB714", "#B7D326", "#29BB28", "#22CAD5", "#1DB7C3", "#128BD4", "#12A8E5", "#713EB7", "#6E8EA7", "#7C6C93", "#9A8099", "#9F7E87", "#A4838A", "#938175", "#A9A077", "#989862", "#8AAA67", "#80B08A", "#78A882", "#599490", "#508983", "#5097B3", "#4F92AF", "#567DA8", "#7B75A5", "#8063A5", "#8668A8", "#A85FAE"];
			this.colorbar2 = ["#D01D20", "#1874CD", "#7C94E3", "#B7D326", "#2ACB3A", "#96E689", "#B4EEB3", "#3DD6A9", "#2AB3C7", "#EDB5AA", "#2995C2", "#3DD6AC", "#E7E492", "#CEEDAA", "#508983", "#22CAD5", "#1DB7C3", "#128BD4", "#12A8E5", "#713EB7", "#6E8EA7", "#B469FF", "#D670DA", "#D355BA", "#9D8568", "#9D8568", "#857087", "#796C87", "#EDAAD1", "#C5BBF0", "#DFD96C", "#F5D0D3"];
			this.config = {
				w: 960,
				h: 600,
				containerId: "#",
				url: "js/module/d3/d3.bar.drill.text.json",
				colorbar1: ["#D01D20", "#1874CD", "#DEB714", "#B7D326", "#29BB28", "#22CAD5", "#1DB7C3", "#128BD4", "#12A8E5", "#713EB7", "#6E8EA7", "#7C6C93", "#9A8099", "#9F7E87", "#A4838A", "#938175", "#A9A077", "#989862", "#8AAA67", "#80B08A", "#78A882", "#599490", "#508983", "#5097B3", "#4F92AF", "#567DA8", "#7B75A5", "#8063A5", "#8668A8", "#A85FAE"],
				colorbar2: ["#D01D20", "#1874CD", "#7C94E3", "#B7D326", "#2ACB3A", "#96E689", "#B4EEB3", "#3DD6A9", "#2AB3C7", "#EDB5AA", "#2995C2", "#3DD6AC", "#E7E492", "#CEEDAA", "#508983", "#22CAD5", "#1DB7C3", "#128BD4", "#12A8E5", "#713EB7", "#6E8EA7", "#B469FF", "#D670DA", "#D355BA", "#9D8568", "#9D8568", "#857087", "#796C87", "#EDAAD1", "#C5BBF0", "#DFD96C", "#F5D0D3"],
				textWidth: 400,
				textRotate:0,
				dataType: ""
			}
		};
	BarDrill.prototype = {
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
			this.excute()
		},
		excute: function() {
			var that = this;
			var containerId = that.config.containerId;
			var dataUrl = that.config.url;
			var dataData = that.config.data;
			var dataType = that.config.dataType;
			var colorbar1 = that.config.colorbar1;
			var colorbar2 = that.config.colorbar2;
			var textRotate = (that.config.textRotate && Number(that.config.textRotate)) ? that.config.textRotate : 0;
			var w = that.config.w;
			var h = that.config.h;
			var textWidth = that.config.textWidth;
			if (!textWidth) {
				textWidth = 130
			}
			if (textWidth + 805 > w - 20) {
				w = textWidth + 805 + 20;
			}
			if (!colorbar1) colorbar1 = that.colorbar1;
			if (!colorbar2) colorbar2 = that.colorbar2;
			var random = Math.floor(Math.random() * 1000000);
			var x = d3.scale.linear().range([0, 805]);
			var y = 25;
			var z = d3.scale.ordinal().range([colorbar1, colorbar2]);
			var hierarchy = d3.layout.partition().value(function(d) {
				return d.size;
			});
			var xAxis = d3.svg.axis().scale(x).orient("top");
			var svg = d3.select(containerId).append("svg:svg").attr("id", "svg_" + random).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + (textWidth + 2) + ",20)");
			
			svg.append("svg:rect").attr("class", "background_" + random).attr("width", w).attr("height", h).attr("transform", "translate(-" + (textWidth + 2) + ",0)").style("fill", "transparent").on("click", up);
			svg.append("svg:g").attr("class", "x axis");
			svg.append("svg:g").attr("class", "y axis").append("svg:line").attr("y1", "100%");
			
			
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
				if (dataType && dataType != "") {
					data = re[dataType + "_data"]
				} else {
					data = re["_data"]
				}
				var root = {};
				if (data) {
					root = data
				} else {
					SGIS.Log("错误提示:指定的参数dataType【" + dataType + "】不正确!");
					return
				}
				hierarchy.nodes(root);
				x.domain([0, root.value]).nice();
				down(root, 0);
				svg.selectAll(".x.axis").selectAll("path.domain").style("display", "none");
				
				//重置高度
				resetHeight();
			}

			//重置高度
			function resetHeight(){
				var height = $("#svg_"+random).attr("height");
				if(height < h){
					height = h;
				}else{
					height = height+50;
				}
				$("#svg_"+random).attr("height",height).css({
					height:height+"px"
				});
			};

			function setIsUpStyle(isUp) {
				$("rect.background_" + random).css({
					cursor: isUp ? "pointer" : "default"
				});
				$("rect.background_" + random).attr("data-click", isUp ? "1" : "0")
			}
			function bar(d) {
				var bar = svg.insert("svg:g", ".y.axis").attr("class", "enter").attr("transform", "translate(0,5)").selectAll("g").data(d.children).enter().append("svg:g").style("cursor", function(d) {
					var isChilden = d.children ? true : false;
					setIsUpStyle(!isChilden);
					return isChilden ? "pointer" : null
				}).on("click", down);
				bar.append("svg:text").attr("transform","rotate("+textRotate+")").attr("x", -6).attr("y", y / 2).attr("dy", ".35em").attr("text-anchor", "end").text(function(d) {
					return d.name
				});
				bar.append("svg:rect").attr("width", function(d) {
					return x(d.value)
				}).attr("height", y);
				for (var i = 0; i < bar[0].length; i++) {
					bar[0][i].childNodes[1].id = "rect_" + random + "_" + i
				}
				var newH = (bar[0].length * 30 + 30);
				$("svg#svg_" + random).attr("height", newH);
				$("svg#svg_" + random).css("height", newH + "px");
				$("rect.background_" + random).attr("height", newH);
				$("rect.background_" + random).css("height", newH + "px");
				return bar
			}
			function stack(i) {
				var x0 = 0;
				return function(d) {
					var tx = "translate(" + x0 + "," + 0 + ")";
					x0 += x(d.value);
					return tx
				}
			}
			function translateSize(d) {
				return x(d.value)
			}
			function check(d) {
				if (!d.children) return false;
				return true
			}
			function chcekIsClick() {
				return parseInt($("rect.background_" + random).attr("data-click")) == 1
			};

			function down(d, i) {
				if (!check(d)) return;
				var duration = d3.event && d3.event.altKey ? 7500 : 750;
				var delay = duration / d.children.length;
				var exit = svg.selectAll(".enter").attr("class", "exit");
				exit.selectAll("rect").filter(function(p) {
					return p === d
				}).style("fill-opacity", 1e-6);
				var enter = bar(d).attr("transform", stack(i)).style("opacity", 1);
				enter.select("text").style("fill-opacity", 1e-6);
				enter.select("rect").style("fill", z(true));
				x.domain([0, d3.max(d.children, function(d) {
					return d.value
				})]).nice();
				svg.selectAll(".x.axis").transition().duration(duration).call(xAxis);
				var enterTransition = enter.transition().duration(duration).delay(function(d, i) {
					return i * delay
				}).attr("transform", function(d, i) {
					return "translate(0," + y * i * 1.2 + ")"
				});
				enterTransition.select("text").style("fill-opacity", 1);
				var i = -1;
				enterTransition.select("rect").attr("width", function(d) {
					return translateSize(d)
				}).style("fill", function(d) {
					return z( !! d.children)[++i]
				});
				var exitTransition = exit.transition().duration(duration).style("opacity", 1e-6).remove();
				exitTransition.selectAll("rect").attr("width", function(d) {
					return x(d.value)
				});
				svg.select(".background_" + random).data([d]).transition().duration(duration * 2);
				d.index = i
			}
			function up(d) {
				if (!check(d)) return;
				if (!chcekIsClick()) {
					return
				}
				var duration = d3.event && d3.event.altKey ? 7500 : 750;
				var delay = duration / d.children.length;
				var exit = svg.selectAll(".enter").attr("class", "exit");
				var enter = bar(d.parent).attr("transform", function(d, i) {
					return "translate(0," + y * i * 1.2 + ")"
				}).style("opacity", 1e-6);
				var i = -1;
				enter.select("rect").style("fill", function(d) {
					return z( !! d.children)[++i]
				}).filter(function(p) {
					return p === d
				}).style("fill-opacity", 1e-6);
				x.domain([0, d3.max(d.parent.children, function(d) {
					return d.value
				})]).nice();
				svg.selectAll(".x.axis").transition().duration(duration * 2).call(xAxis);
				var enterTransition = enter.transition().duration(duration * 2).style("opacity", 1);
				enterTransition.select("rect").attr("width", function(d) {
					return translateSize(d)
				}).each("end", function(p) {
					if (p === d) d3.select(this).style("fill-opacity", null)
				});
				var exitTransition = exit.selectAll("g").transition().duration(duration).delay(function(d, i) {
					return i * delay
				}).attr("transform", stack(d.index));
				exitTransition.select("text").style("fill-opacity", 1e-6);
				exitTransition.select("rect").attr("width", function(d) {
					return x(d.value)
				}).style("fill", z(true));
				exit.transition().duration(duration * 2).remove();
				svg.select(".background_" + random).data([d.parent]).transition().duration(duration * 2)
			}
		}
	};
	return BarDrill
});